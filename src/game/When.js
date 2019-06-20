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
        return this;
    }
    whenever(predicate) {
        this.predicates.push(predicate);
        return this;
    }
}
