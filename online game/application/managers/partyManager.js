function PartyManager(options) {
    options = options ? options : {};
    const io = options.io;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const mediator = options.mediator;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const db = options.db;

    io.on('connection', socket => {
        console.log(`User connected to the party manager ${socket.id}`);
        let users;

        socket.on(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, idTO => {
           users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
           const userFrom = users.find(user => { return user.id === socket.id; });
           const userTo = users.find(user => { return user.idDB === idTO; });
           if (userTo) {
               if (userTo.party.length === 0) {
                   io.to(userTo.id).emit(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, { nick: userFrom.nick, id: socket.id });
                   socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, { answer: 200 });
               } else {
                   socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, { answer: 100 });
               }
           } else {
               socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, { answer: 0 });
           }
        });

        socket.on(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, async data => {
            if (data.answer === 200) { //согласился
                if (data.id) {
                    users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
                    const userFrom = users.find(user => { return user.id === data.id });
                    const userTo = users.find(user => { return user.id === socket.id });
                    if (userFrom) { //пользователь, от которого исходил запрос, еще в сети
                        if (userTo.party.length === 0) { //еще свободен
                            const party = await db.createParty(userFrom.idDB);
                            if (party) {
                                const prt = await db.getPartyByIdLeader(userFrom.idDB);
                                const fillParty = await db.addMemberToParty(prt.id, userTo.id);
                                socket.emit(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY, fillParty);
                                io.to(userFrom.id).emit(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY_LEADER, { answer: 200 });
                            }
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
        })

    });


}

module.exports = PartyManager;