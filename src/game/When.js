import _ from 'lodash';

export class When {
    callbacks = [];
    predicates = [];
    id = -1;
    constructor(evt) {
        this.evt = evt;
        this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }
    
    do(cb) {
        this.callbacks.push(cb);
        console.log("added a callback", this.callbacks.length);
        return this;
    }

    whenever(predicate) {
        this.predicates.push(predicate);
        return this;
    }

    dispatch(event) {
        if(event.event === this.evt) {
            if(_.every(this.predicates, (p) => p())) {
                _.each(this.callbacks, (cb) => {
                    cb(event.payload);
                });
            }
        }
    }
}
