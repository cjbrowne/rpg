import _ from 'lodash';
import { randInt } from './randutil';
import { Enemy } from "./Enemy";
import { EnemySpawner } from "./EnemySpawner";
import { Map } from "./Map";
export class World {
    map = null;
    enemies = [];
    constructor(seed) {
        this.map = new Map(seed);
        let e = localStorage.getItem("enemies");
        if (e) {
            this.enemies = _.map(JSON.parse(e), (enemy) => Enemy.fromJSON(enemy));
        }
        else {
            this.enemies = this.spawnEnemies();
        }
        this.map.addEnemies(this.enemies);
    }
    spawnEnemies() {
        let en = [];
        _.each(_.range(randInt(50, 150)), () => {
            en.push(new EnemySpawner().at(0, 0, this.map.width, this.map.height).spawn());
        });
        return en;
    }
    save() {
        localStorage.setItem("playerPos", JSON.stringify(this.map.playerPos));
        localStorage.setItem("enemies", JSON.stringify(this.enemies));
    }
}
