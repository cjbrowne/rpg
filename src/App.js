import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleUp, faAngleDown, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import './App.css';

import _ from 'lodash';

import game from './game/';

import MapDisplay from './components/MapDisplay';

import AceEditor from 'react-ace';
import { Tabs, Tab } from './components/Tabs';

require('brace/theme/dracula');
require('brace/mode/javascript');

let keyboardInputSetup = false;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game,
      code: "",
      page: "status",
      mapOriginX: 0,
      mapOriginY: 0
    }
  }

  componentDidMount() {
    let code = localStorage.getItem("code");
    let seed = localStorage.getItem("seed");
    let rngSeed = Math.random();
      this.setState({
        code: code || "",
        seed: seed || (localStorage.setItem("seed", rngSeed), rngSeed)
      });
  }

  render () {
    let runGame = () => {
      try {
      // quiet eslint down because we are using this deliberately and carefully
      /* eslint-disable no-new-func */
      let f = Function("return " + this.state.code);
      /* eslint-enable */

      game.run(this, f());

      } catch (ex) {
        console.error(ex);
      }

    }

    let stopGame = () => {
      game.stop();
    }

    let step = () => {
      /* eslint-disable no-new-func */
      try {
        game.playerFunc = Function("return " + this.state.code)();
      } catch (x) {
        console.error(x);
      }
      game.appComponent = this;

      /* eslint-enable */
      requestAnimationFrame((timestamp) => game.step(timestamp));
    }

    let updateCode = (code) => {
      this.setState({
        code
      });
      localStorage.setItem("code", code);
    }

    let updateSeed = (evt) => {
      let seed = evt.target.value;
      localStorage.setItem("seed", seed);
      this.setState({
        seed
      });
    }

    let scrollMap = (direction, amount = 1) => {
      amount = Math.abs(amount);
      switch(direction) {
        case "up":
          this.setState({
            mapOriginY: Math.max(0, this.state.mapOriginY-amount)
          })
          break;
        case "left":
          this.setState({
            mapOriginX: Math.max(0, this.state.mapOriginX-amount)
          })
          break;
        case "down":
          this.setState({
            mapOriginY: Math.min(this.state.mapOriginY+amount, this.state.game.world.map.height-17)
          })
          break;
        case "right":
          this.setState({
            mapOriginX: Math.min(this.state.mapOriginX+amount, this.state.game.world.map.width-17)
          })
          break;
      }
    };

    if(!keyboardInputSetup) {

      window.addEventListener("keydown", (ev) => {
        switch(ev.key) {
          case "ArrowDown":
            scrollMap("down");
            break;
          case "ArrowUp":
            scrollMap("up");
            break;
          case "ArrowLeft":
            scrollMap("left");
            break;
            case "ArrowRight":
            scrollMap("right");
            break;
        }
      });

      keyboardInputSetup = true;
    }    

    let icons = {
      "up": faAngleUp,
      "left": faAngleLeft,
      "right": faAngleRight,
      "down": faAngleDown
    }

    let centerPlayer = () => {
      this.setState({
        mapOriginX: this.state.game.world.map.playerPos.x - 8,
        mapOriginY: this.state.game.world.map.playerPos.y - 8
      })
    }
    
    return (
      <div className="App">
        <div className="LeftColumn">
          <div className="MapControls">
            {
              _.map(["up","left","right","down"], (dir) => {
                return (<button 
                  onClick={() => scrollMap(dir)} 
                  className={_.capitalize(dir)}>
                    <FontAwesomeIcon icon={icons[dir]} />
                  </button>);
              }) 
            }
            <button
              onClick={centerPlayer}
              className="CenterPlayer"
            >
              <FontAwesomeIcon icon={faCrosshairs} />
            </button>
          </div>
        </div>
        <div className="GameOutput">
          <MapDisplay
            tiles={this.state.game.world.map.tiles}
            originX={this.state.mapOriginX}
            originY={this.state.mapOriginY}
          />
          <Tabs
            page={this.state.page}
            onTabChange={page => this.setState({page})}
          >
            <Tab page="instructions">
              <p>
              Your code must evaluate to a function or lambda which will be called every
              step (every frame) with two arguments.  The first argument is 'game', which
              we will get onto in a moment.  The second argument is 'timestamp', which is
              simply a high-resolution timer measuring milliseconds with a sub-millisecond
              resolution (i.e floating point millisecond timer).
              </p>
              <p>
                The 'game' argument contains an API for controlling the player as well as
                getting information about the environment.  The API is not currently well
                documented.  If you want to contribute API documentation, please see the git
                repo at <a href="https://github.com/cjbrowne/rpg">GitHub</a> and pitch in!
              </p>
            </Tab>
            <Tab page="status">
              <div className="StatusPage">
                <div className="HealthBar">
                  Health: {this.state.game.player.health}/{this.state.game.player.maxHealth}
                </div>
                <div className="Location">
                  Location: ({this.state.game.world.map.playerPos.x},{this.state.game.world.map.playerPos.y})<br/>
                  Terrain: {this.state.game.player.location.terrain.description}<br/>
                  Surroundings: {_.map(this.state.game.player.location.objects, "name").join(" ") || "Open space"}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
        <AceEditor 
          mode="javascript"
          theme="dracula"
          className="Editor"
          width=""
          height=""
          onChange={updateCode}
          value={this.state.code}
          highlightActiveLine={false}
          editorProps={{
            $blockScrolling: Infinity
          }}
        />
        <div className="Controls">
          <label htmlFor="seed">Seed:</label>
          <input 
            type="number" 
            value={this.state.seed || 0}
            onChange={updateSeed} 
            />
          <button onClick={runGame}>
            Run
          </button>
          <button onClick={stopGame}>
            Stop
          </button>
          <button onClick={step}>
            Step
          </button>
        </div>
      </div>
    );
  }
}

export default App;
