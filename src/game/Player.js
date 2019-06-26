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
    energy = undefined;
    maxEnergy = undefined;
    inventory = null;
    location = null;
    underAttack = false;
    armor = 0;
    level = 0;
    name = "Unknown Warrior";

    static MAX_SPEED = 15;

    constructor(start) {
        this.inventory = new Inventory();
        this.health = 100;
        this.maxHealth = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.location = start;
        this.underAttack = false;
        this.armor = 100;
        
        this.strength = 1;
        this.stamina = 1;
        this.agility = 1;
        this.level = 1;
    }

    load() {
        let p = localStorage.getItem("player");
        if(!p) return;
        p = JSON.parse(p);
        this.health = p.health;
        this.maxHealth = p.maxHealth;
        this.energy = p.energy;
        this.maxEnergy = p.maxEnergy;
        this.underAttack = p.underAttack;
        this.armor = p.armor;

        this.strength = p.strength;
        this.stamina = p.stamina;
        this.agility = p.agility;
        this.level = p.level;
        this.name = p.name;
    }

    save() {
        localStorage.setItem("player", JSON.stringify(this));
    }

    step () {
        this.energy = Math.min(this.maxEnergy, this.energy + (this.agility * 10));
    }
}
