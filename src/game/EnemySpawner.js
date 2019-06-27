import { randInt } from './randutil';
import { Enemy } from "./Enemy";
export class EnemySpawner {
    enemy = null;
    constructor() {
        this.enemy = new Enemy();
    }
    at(x, y, w = 1, h = 1) {
        this.enemy.location = {
            x: randInt(x, w - 1),
            y: randInt(y, h - 1)
        };
        return this;
    }
    level(l) {
        this.enemy.level = l;
        return this;
    }
    spawn() {
        return this.enemy;
    }
}
