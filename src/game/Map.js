import _ from 'lodash';
import { perlin } from './randutil';
import { generate2d } from './arrayutil';
import { Tile } from "./Tile";
export class Map {
    tiles = [];
    playerPos = { x: 0, y: 0 };
    width = 0;
    height = 0;
    playerTile = null;
    constructor(seed = -1, width = 256, height = 256) {
        this.tiles = generate2d(width, height, (x, y) => {
            let n = perlin(seed, x, y);
            return new Tile(n, x, y);
        });
        this.width = width;
        this.height = height;
    }
    addPlayer(x, y) {
        this.tiles[this.playerPos.x][this.playerPos.y].player = false;
        this.tiles[x][y].player = true;
        this.playerPos = { x, y };
        this.playerTile = this.tiles[x][y];
        return this.tiles[x][y];
    }
    addEnemies(enemies) {
        _.each(enemies, (enemy) => {
            this.tiles[enemy.location.x][enemy.location.y].addEnemy(enemy);
        });
    }
    movePlayer(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        let oldX = this.playerPos.x;
        let oldY = this.playerPos.y;
        let newX, newY;
        if (oldX + x >= this.width) {
            newX = this.width - 1;
        }
        else {
            newX = Math.max(0, oldX + x);
        }
        if (oldY + y >= this.height) {
            newY = this.height - 1;
        }
        else {
            newY = Math.max(0, oldY + y);
        }
        this.tiles[oldX][oldY].player = false;
        this.tiles[newX][newY].player = true;
        this.playerPos = {
            x: newX,
            y: newY
        };
        this.playerTile = this.tiles[newX][newY];
    }
    moveEnemy(e, dX, dY) {
        let { x, y } = e.location;
        let newX = Math.round(Math.min(this.width - 1, Math.max(0, x + dX)));
        let newY = Math.round(Math.min(this.height - 1, Math.max(0, y + dY)));
        // remove first, then add, in case the enemy didn't move
        this.tiles[x][y].removeEnemy();
        this.tiles[newX][newY].addEnemy(e);
        e.location.x = newX;
        e.location.y = newY;
    }
}
