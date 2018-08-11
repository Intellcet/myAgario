function Mediator(options) {
    options = (options instanceof Object) ? options : {};
    const EVENTS = {};

    this.subscribe = (name, _func) => {
        if (name && _func instanceof Function){
            if (!EVENTS[name]){
                EVENTS[name]= [];
            }
            EVENTS[name].push(_func);
        }
    };

    this.call = (name, data) => {
        if(EVENTS[name] && EVENTS[name].length) {
            const func = EVENTS[name].find((event) => { return (event instanceof Function) ? event : function () {}});
            return func(data);
        }
    };

    function init() {
        if(options.MEDIATOR_EVENTS instanceof Object){
            for (let key in options.MEDIATOR_EVENTS){
                EVENTS[options.MEDIATOR_EVENTS[key]] = [];
            }
        }
    }
    init();


}

module.exports = Mediator;