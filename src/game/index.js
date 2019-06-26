import { When } from "./When";
import { Player } from "./Player";

import _ from 'lodash';

import { perlin, randInt, generateEnemyName } from './randutil';

import {
    generate2d
} from './arrayutil';

import {
    Vector2
} from '../bettermath/index';

import EventDispatcher from './EventDispatcher';

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
    enemy = null;

    constructor(seed, x, y) {
        this.height = seed;
        this.x = x;
        this.y = y;
        let terrain = WATER;
        if(seed > -0.6) {
            terrain = GRASS;
        } if (seed > 0.8) {
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
    
    addEnemy(enemy) {
        this.enemy = enemy;
    }
}

class Map {
    tiles = [];
    playerPos = {x:0, y:0};
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
        this.playerPos = {x,y};
        this.playerTile = this.tiles[x][y];
        return this.tiles[x][y];
    }

    addEnemies(enemies) {
        _.each(enemies, (enemy) => {
            this.tiles[enemy.location.x][enemy.location.y].addEnemy(enemy);
        })
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
        this.playerTile = this.tiles[newX][newY];
    }
}

class Enemy {
    location = {
        x: 0,
        y: 0
    }
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

    damage(amount = 0) {
        this.health -= amount;
        if(this.health <= 0) {
            this.health = 0;
        }
    }

    attack(player) {
        let baseDamage = randInt(5,50);
        let damage = Math.max(0, (this.level * baseDamage) - (player.armor * 0.15));
        
        console.log(`Enemy ${this.name} did ${damage} damage to player!`);

        player.health = Math.max(player.health - damage, 0);
        if(player.health <= 0) {
            return true;
        } else {
            return false;
        }
    }
    
    static fromJSON(json) {
        return new Enemy(json.location.x, json.location.y, json.health, json.maxHealth, json.level, json.name);
    }
}

class World {
    map = null;
    enemies = [];
    constructor(seed) {
        this.map = new Map(seed);
        let e = localStorage.getItem("enemies");
        if(e) {
            this.enemies = _.map(JSON.parse(e), (enemy) => Enemy.fromJSON(enemy));
        } else {
            this.enemies = this.spawnEnemies();
        }
        this.map.addEnemies(this.enemies);
    }

    spawnEnemies() {
        let en = [];
        _.each(_.range(randInt(5,15)), () => {
            en.push(new Enemy(randInt(0, this.map.width-1),randInt(0,this.map.height-1)));
        });
        return en;
    }

    save() {
        localStorage.setItem("playerPos", JSON.stringify(this.map.playerPos));
        localStorage.setItem("enemies", JSON.stringify(this.enemies));
    }
}

let listeners = {};

const ATTACK_ENERGY = 15;

class Game {
    player = null;
    map = null;
    running = false;
    gameOver = false;
    eventDispatcher = null;

    publicApi = {
        movePlayer: (x, y) => {
            if(_.isInteger(x) && _.isInteger(y)) {
                let v = new Vector2(x, y);
                console.log(`Player trying to move at a rate of ${v.magnitude}`, v);
                if(v.magnitude > Player.MAX_SPEED) {
                    v = v.normalize().magnify(Player.MAX_SPEED).floor();
                    console.log(`Moving player ${v.magnitude} instead`);
                }
                this.world.map.movePlayer(v.x, v.y);
                this.player.location = this.world.map.tiles[this.world.map.playerPos.x][this.world.map.playerPos.y];
                this.player.underAttack = (this.player.location.enemy !== null);
                return true;
            } else {
                return false;
            }
        },
        swingWeapon: () => {
            if(this.player.energy >= ATTACK_ENERGY) {
                if(this.player.location.enemy !== null) {
                    this.player.location.enemy.takeDamage(this.player.swingWeapon());
                }
                this.player.energy = Math.max(0, this.player.energy - ATTACK_ENERGY);
            }
        },
        when: (evt) => {
            return this.when(evt);
        }
    }

    constructor(seed) {
        this.world = new World(seed);
        let playerPos = localStorage.getItem("playerPos");
        if(playerPos) {
            playerPos = JSON.parse(playerPos);
        } else {
            playerPos = {
                x: this.world.map.width / 2,
                y: this.world.map.height / 2
            };
        }
        let start = this.world.map.addPlayer(playerPos.x, playerPos.y);
        this.player = new Player(start);
        this.player.underAttack = (this.world.map.playerTile.enemy !== null);

        this.eventDispatcher = new EventDispatcher();
    }

    when(evt) {
        return listeners[evt] || (listeners[evt] = new When(evt));
    }

    save() {
        this.world.save();
    }

    stepCombat() {
        this.gameOver = this.world.map.playerTile.enemy.attack(this.player);
    }

    step(timestamp) {
        listeners = {};

        try {
            this.playerFunc(this.publicApi, timestamp);
        } catch (x) {
            console.error(x);
        }
        this.appComponent.setState({
            game: this
        });

        if(this.world.map.playerTile.enemy !== null) {
            if(!this.player.underAttack) {
                this.eventDispatcher.dispatch("enemy.appears", this.player.location.enemy);
            }
            this.player.underAttack = true;
            this.stepCombat();
        }

        if(this.appComponent.state.followPlayer) {
            this.appComponent.centerPlayer();
        }

        this.player.step();

        this.eventDispatcher.flush(listeners);

        this.save();

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
}



export default new Game();