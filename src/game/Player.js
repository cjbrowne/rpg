import _ from 'lodash';

class InventorySlot {
    quantity = 0;
    item = null;

    constructor(item, quantity) {
        this.quantity = quantity;
        this.item = item;
    }
}

class Inventory {
    slots = {};

    constructor(slotCount = 10) {
        _.each(_.range(slotCount), (x) => {
            this.slots[x] = new InventorySlot(null, 0);
        });
    }
}

export class Player {
    constructor() {
        this.inventory = new Inventory();
    }
}
