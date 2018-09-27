function ChatManager(options) {
    options = (options instanceof Object) ? options : {};
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const io = options.io;
    const mediator = options.mediator;
    const db = options.db;

    io.on('connection', socket => {
       console.log(`User connected to the Chat Manager ${socket.id}`);

       socket.on(SOCKET_EVENTS.SEND_MESSAGE, data => {
           if (data.token) {
               const users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
               const user = users.find(elem => {return elem.id === socket.id});
               if (user) {
                   switch (data.indicate) {
                       case "global":
                           io.local.emit(SOCKET_EVENTS.SEND_MESSAGE, { nickname: user.nick, message: data.message, indicate: data.indicate });
                       break;
                       case "party":
                           if (user.party && user.party.length !== 0) {
                               for (let comrade of user.party) {
                                   let us = users.find(elem => { return elem.idDB === comrade.id; });
                                   io.to(us.id).emit(SOCKET_EVENTS.SEND_MESSAGE, { nickname: user.nick, message: data.message, indicate: data.indicate });
                               }
                           }
                       break;
                   }
               }
           }
       });


    });


}

module.exports = ChatManager;