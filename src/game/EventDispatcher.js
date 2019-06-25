// tune MAX_EVENTS_PER_TICK for performance
const MAX_EVENTS_PER_TICK = 15;

export default class EventDispatcher {
    eventQueue = [];

    dispatch(event, payload) {
        this.eventQueue.push({
            event,
            payload
        });
    }

    flush(listeners) {
        let flushedEvents = 0;
        while(flushedEvents < MAX_EVENTS_PER_TICK && this.eventQueue.length > 0) {
            let evt = this.eventQueue.unshift();
            if(listeners[evt.event]) {
                listeners[evt.event].dispatch(evt);
            }
        }
    }
}