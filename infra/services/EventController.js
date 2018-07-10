const events = require('events');
const eventEmitter = new events.EventEmitter();

let controller = {
    getEmitter: function(){
        return eventEmitter;
    }
}
module.exports = controller;