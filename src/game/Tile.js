import { WATER, GRASS, ROCK, Town, Forest } from "./MapObject";
export class Tile {
    player = false;
    enemy = null;
    constructor(seed, x, y) {
        this.height = seed;
        this.x = x;
        this.y = y;
        let terrain = WATER;
        if (seed > -0.6) {
            terrain = GRASS;
        }
        if (seed > 0.8) {
            terrain = ROCK;
        }
        this.objects = [];
        switch (Math.floor(seed * 100) % 10) {
            case 1:
                if (terrain !== WATER) {
                    this.objects.push(new Town());
                }
                break;
            case 2:
                if (terrain === GRASS) {
                    this.objects.push(new Forest());
                }
                break;
            default:
                break;
        }
        this.terrain = terrain;
    }
    addEnemy(enemy) {
        this.enemy = enemy;
    }
    removeEnemy() {
        this.enemy = null;
    }
}
