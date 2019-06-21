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
    health = undefined;
    maxHealth = undefined;
    inventory = null;


    constructor() {
        this.inventory = new Inventory();
        this.health = 100;
        this.maxHealth = 100;
    }
}
