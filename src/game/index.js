import { When } from "./When";
import { Player } from "./Player";

// import _ from 'lodash';

import { perlin } from './randutil';

import {
    generate2d
} from './arrayutil';

class MapObject {
    logo = "unknown.png";
    name = "map object";
}

class Forest extends MapObject {
    logo = "forest.png";
    name = "forest";
}

class Town extends MapObject {
    logo = "town.png";
    name = "town";
}

const WATER = Symbol('WATER');
const GRASS = Symbol('GRASS');
const ROCK = Symbol('ROCK');

class Tile {
    player = false;

    constructor(seed, x, y) {
        this.height = seed;
        this.x = x;
        this.y = y;
        let terrain = WATER;
        if(seed < 0.2) {
            terrain = GRASS;
        } else if (seed < 0.5) {
            terrain = ROCK;
        }

        this.objects = [];

        switch(Math.floor(seed * 100) % 10) {
            case 1:
                if(terrain !== WATER) {
                    this.objects.push(new Town());
                }
                break;
            case 2:
                if(terrain === GRASS) {
                    this.objects.push(new Forest());
                }
                break;
            default:
                break;
        }

        this.terrain = terrain;
    }
}

class Map {
    tiles = [];
    playerPos = {x:0, y:0};
    width = 0;
    height = 0;

    constructor(seed = -1, width = 16, height = 16) {
        this.tiles = generate2d(width, height, (x, y) => {
            let n = perlin(x, y);

            return new Tile(n, x, y);
        });
        this.width = width;
        this.height = height;
    }

    addPlayer(x, y) {
        this.tiles[this.playerPos.x][this.playerPos.y].player = false;
        this.tiles[x][y].player = true;
        this.playerPos = {x,y};
    }

    movePlayer(x, y) {
        let oldX = this.playerPos.x;
        let oldY = this.playerPos.y;
        let newX, newY;
        
        if(oldX + x >= this.width) {
            newX = this.width - 1;
        } else {
            newX = Math.max(0, oldX + x);
        }

        if(oldY + y >= this.height) {
            newY = this.height - 1;
        } else {
            newY = Math.max(0, oldY + y);
        }

        this.tiles[oldX][oldY].player = false;
        this.tiles[newX][newY].player = true;

        this.playerPos = {
            x: newX,
            y: newY
        };
    }
}

class World {
    map = null;
    constructor() {
        this.map = new Map();
    }
}

let listeners = {};

class Game {
    player = null;
    map = null;
    running = false;

    publicApi = {
        movePlayer: (x, y) => {
            this.movePlayer(x, y);
        }
    }

    constructor() {
        this.player = new Player();
        this.world = new World();
        this.world.map.addPlayer(this.world.map.width / 2, this.world.map.height / 2);
    }

    when(evt) {
        let w = new When(evt);
        listeners[evt] = listeners[evt] || [];
        listeners[evt].push(w);
        return w;
    }

    step(timestamp) {
        try {
            this.playerFunc(this.publicApi, timestamp);
        } catch (x) {
            console.error(x);
        }
        this.appComponent.setState({
            game: this
        });
        if(this.running) {
            requestAnimationFrame((timestamp) => this.step(timestamp));
        }
    }

    run(appComponent, playerFunc) {
        this.playerFunc = playerFunc;
        this.appComponent = appComponent;
        if(!this.running) {
            this.running = true;
            requestAnimationFrame((timestamp) => this.step(timestamp));
        }
    }

    stop() {
        this.running = false;
    }

    movePlayer(x, y) {
        this.world.map.movePlayer(x, y);
    }
}



export default new Game();