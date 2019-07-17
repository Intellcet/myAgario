function PartyManager(options) {
    options = options ? options : {};
    const io = options.io;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const mediator = options.mediator;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const db = options.db;

    async function isPartyLeader(idParty, idMember) {
        return !!(await db.isPartyLeader(idParty, idMember));
    }

    function refreshPartyList(userFrom) {
        if (userFrom) {
            const users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
            for (let user of users) {
                if (user.party && user.party.find(elem => { return elem.id === userFrom.idDB; })) {
                    io.to(user.id).emit(SOCKET_EVENTS.GET_PARTY_USERS, { users: userFrom.party });
                }
            }
        }
    }

    io.on('connection', socket => {
        console.log(`User connected to the party manager ${socket.id}`);
        let users;

        socket.on(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, async idTO => {
           users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
           const userFrom = users.find(user => { return user.id === socket.id; });
           const userTo = users.find(user => { return user.idDB === idTO; });
           const isUserLeader = await db.isUserLeader(userFrom.idDB);
           if (userTo && (isUserLeader || !userFrom.party)) {
               if (!userTo.party) {
                   io.to(userTo.id).emit(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, { nick: userFrom.nick, id: socket.id });
                   socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, { answer: 200 });
               } else {
                   socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, { answer: 100 });
               }
           } else {
               socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, { answer: (!userTo) ? 0 : 10 });
           }
        });

        socket.on(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, async data => {
            if (data.answer === 200) { //согласился
                if (data.id) {
                    users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
                    const userFrom = users.find(user => { return user.id === data.id });
                    const userTo = users.find(user => { return user.id === socket.id });
                    if (userFrom) { //пользователь, от которого исходил запрос, еще в сети
                        if (!userTo.party) { //еще свободен
                            await db.createParty(userFrom.idDB);
                            const party = await db.getPartyByIdLeader(userFrom.idDB);
                            const fillParty = await db.addMemberToParty(party.id, userTo.idDB);
                            socket.emit(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY, fillParty);
                            io.to(userFrom.id).emit(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY_LEADER, { answer: 200 });
                            refreshPartyList(userFrom);
                        } else { //уже присоеднился к другой группе
                            io.to(userFrom.id).emit(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY_LEADER, { answer: 100 });
                        }
                    } else { //пользователь, от которого исходил запрос, вышел
                        socket.emit(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY, { answer: 100 });
                    }
                }
            } else { //отказался
                io.to(data.id).emit(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY_LEADER, { answer: 0 });
            }
        });

        socket.on(SOCKET_EVENTS.GET_PARTY_USERS, async token => {
            if (token) {
                const user = await db.getUserByToken(token);
                const us = users.find(elem => { return elem.token === token; });
                if (user && us) {
                    us.party = await db.getUserParty(user.id);
                    socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, { users: us.party });
                }
            }
        });

        socket.on(SOCKET_EVENTS.LEAVE_FROM_PARTY, async token => {
            if (token) {
                const user = await db.getUserByToken(token);
                const us = users.find(elem => { return elem.token === token; });
                if (user && us.party) {
                    const partyId = await db.getPartyId(user.id);
                    const isLeader = await isPartyLeader(partyId.id, user.id);
                    if (!isLeader) { // he's not a party leader
                        await db.leaveFromParty(partyId.id, us.idDB);
                        for (let player of users) {
                            if (player.party && player.party.find(elem => {
                                return elem.id === user.id
                            })) {
                                io.to(player.id).emit(SOCKET_EVENTS.USER_LEFT);
                            }
                        }
                        us.party = null;
                        socket.emit(SOCKET_EVENTS.LEAVE_FROM_PARTY);
                    } else {
                        for (let player of users) {
                            if (player.party && player.party.find(elem => {
                                return elem.id === user.id
                            })) {
                                await db.leaveFromParty(partyId.id, player.idDB);
                                player.party = null;
                                io.to(player.id).emit(SOCKET_EVENTS.LEADER_LEFT);
                                io.to(player.id).emit(SOCKET_EVENTS.LEAVE_FROM_PARTY);
                            }
                        }
                        await db.simpleDeleteParty(partyId.id);
                    }
                }
            }
        });

    });


}

module.exports = PartyManager;