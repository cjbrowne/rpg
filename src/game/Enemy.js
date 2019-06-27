import { randInt, generateEnemyName } from './randutil';
export class Enemy {
    location = {
        x: 0,
        y: 0
    };
    health = 0;
    maxHealth = 0;
    level = 0;
    name = "";
    constructor(x = 0, y = 0, health = 100, maxHealth = 100, level = 1, name) {
        this.location.x = x;
        this.location.y = y;
        this.health = health;
        this.maxHealth = maxHealth;
        this.level = level;
        this.name = name || generateEnemyName();
    }
    get isDead() {
        return this.health <= 0;
    }
    damage(amount = 0) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
        }
    }
    attack(player) {
        if (this.isDead)
            return;
        let baseDamage = randInt(5, 50);
        let damage = Math.max(0, (this.level * baseDamage) - (player.armor * 0.15));
        console.log(`Enemy ${this.name} did ${damage} damage to player!`);
        player.health = Math.max(player.health - damage, 0);
        if (player.health <= 0) {
            return true;
        }
        else {
            return false;
        }
    }
    static fromJSON(json) {
        return new Enemy(json.location.x, json.location.y, json.health, json.maxHealth, json.level, json.name);
    }
}
