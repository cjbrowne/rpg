import { When } from "./When";
import { Player } from "./Player";

import _ from 'lodash';

import {
    Vector2
} from '../bettermath/index';

import EventDispatcher from './EventDispatcher';
import { World } from "./World";
import { EnemySpawner } from "./EnemySpawner";

let listeners = {};

const ATTACK_ENERGY = 15;

class Game {
    player = null;
    map = null;
    running = false;
    eventDispatcher = null;

    publicApi = {
        movePlayer: (x, y) => {
            if(_.isNumber(x) && _.isNumber(y)) {
                let v = new Vector2(x, y);
                if(v.magnitude > Player.MAX_SPEED) {
                    v = v.normalize()
                        .magnify(Player.MAX_SPEED)
                        .floor();
                }
                this.world.map.movePlayer(v.x, v.y);
                this.player.location = this.world.map.tiles[this.world.map.playerPos.x][this.world.map.playerPos.y];
                return true;
            } else {
                return false;
            }
        },
        swingWeapon: () => {
            if(this.player.energy >= ATTACK_ENERGY) {
                if(this.player.location.enemy !== null) {
                    this.player.location.enemy.damage(this.player.swingWeapon());
                    if(this.player.location.enemy.isDead) {
                        this.player.reward(this.player.location.enemy);
                    }
                }
                this.player.energy = Math.max(0, this.player.energy - ATTACK_ENERGY);
            }
        },
        when: (evt) => {
            return this.when(evt);
        },
        setName: (name) => {
            this.player.name = name;
        }
    };

    get gameOver() {
        return this.player.health <= 0;
    }

    constructor(appComponent, seed) {
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
        this.player.load();
        this.player.location = this.world.map.tiles[playerPos.x][playerPos.y];

        this.eventDispatcher = new EventDispatcher();
        this.appComponent = appComponent;
    }

    when(evt) {
        return listeners[evt] || (listeners[evt] = new When(evt));
    }

    save() {
        this.player.save();
        this.world.save();
    }

    reset() {
        this.appComponent.setState({
            resetting: true
        }, () => {
            _.map(["playerPos", "player", "enemies"], localStorage.removeItem.bind(localStorage));

            let seed = localStorage.getItem("seed");
    
            this.world = new World(seed);
            let playerPos = {
                x: this.world.map.width / 2,
                y: this.world.map.height / 2
            };
            let start = this.world.map.addPlayer(playerPos.x, playerPos.y);
            this.player = new Player(start);
            this.player.location = this.world.map.tiles[playerPos.x][playerPos.y];
    
            this.save();
    
            this.appComponent.setState({
                game: this,
                resetting: false
            });
        });
    }

    stepCombat() {
        this.world.map.playerTile.enemy.attack(this.player);
    }

    decorateApi() {
        this.publicApi = _.merge(this.publicApi, {
            underAttack: this.player.underAttack
        });
    }

    setPlayerFunc(playerFunc) {
        this.playerFunc = playerFunc;
    }

    stepEnemies() {
        this.world.enemies = _.map(this.world.enemies, (e) => {
            if(e.isDead) {
                // todo: spawn near previous enemy
                let newEnemy = new EnemySpawner().at(0, 0, this.world.map.width, this.world.map.height).spawn();
                this.world.map.tiles[e.location.x][e.location.y].enemy = null;
                this.world.map.tiles[newEnemy.location.x][newEnemy.location.y].enemy = newEnemy;
                return newEnemy;
            }
            this.world.map.moveEnemy(e, (0.5 - Math.random()) * 2, (0.5 - Math.random()) * 2);
            return e;
        });
    }

    step(timestamp) {
        listeners = {};

        this.decorateApi();

        try {
            this.playerFunc(this.publicApi, timestamp);
        } catch (x) {
            console.error(x);
        }
        

        if(this.world.map.playerTile.enemy !== null) {
            if(!this.player.underAttack) {
                this.eventDispatcher.dispatch("enemy.appears", this.player.location.enemy);
            }
            this.stepCombat();
        }

        if(this.appComponent.state.followPlayer) {
            this.appComponent.centerPlayer();
        }

        this.player.step();

        this.eventDispatcher.flush(listeners);


        this.stepEnemies();

        this.appComponent.setState({
            game: this
        });
        this.save();

        if(this.running && !this.gameOver) {
            requestAnimationFrame((timestamp) => this.step(timestamp));
        }
    }

    run(playerFunc) {
        this.playerFunc = playerFunc;
        if(!this.running) {
            this.running = true;
            requestAnimationFrame((timestamp) => this.step(timestamp));
        }
    }

    stop() {
        this.running = false;
    }
}



export default Game;