import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleUp, faAngleDown, faCrosshairs, faCompass } from '@fortawesome/free-solid-svg-icons';
import { faCompass as farCompass } from '@fortawesome/free-regular-svg-icons';
import './App.css';

import _ from 'lodash';

import Game from './game/index';

import StatusPage from './components/StatusPage';
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
      game: null,
      code: "",
      page: "status",
      mapOriginX: 0,
      mapOriginY: 0,
      resetting: false
    }
  }

  componentDidMount() {
    let code = localStorage.getItem("code");
    let seed = localStorage.getItem("seed");
    let rngSeed = Math.random();
    seed = seed || (localStorage.setItem("seed", rngSeed), rngSeed);
    
    this.setState({
      code: code || "",
      seed,
      game: new Game(this, seed)
    }, () => {
      this.centerPlayer();
    });
  }

  render () {
    if(!this.state.game) {
      return null;
    }

    if(this.state.resetting) {
      return "Resetting...";
    }

    let runGame = () => {
      try {
      // quiet eslint down because we are using this deliberately and carefully
      /* eslint-disable no-new-func */
      let f = Function("return " + this.state.code);
      /* eslint-enable */

      this.state.game.run(f());

      } catch (ex) {
        console.error(ex);
      }

    }

    let stopGame = () => {
      this.state.game.stop();
    }

    let step = () => {
      /* eslint-disable no-new-func */
      try {
        this.state.game.setPlayerFunc(Function("return " + this.state.code)());
      } catch (x) {
        console.error(x);
      }

      /* eslint-enable */
      requestAnimationFrame((timestamp) => this.state.game.step(timestamp));
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
            mapOriginY: Math.min(this.state.mapOriginY+amount, this.state.game.world.map.height-16)
          })
          break;
        case "right":
          this.setState({
            mapOriginX: Math.min(this.state.mapOriginX+amount, this.state.game.world.map.width-16)
          })
          break;
        default: 
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
          default:
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

    let gameOutput = (<div className="GameOutput">
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
        <p>
          Listen for events by calling 'game.when(event)', which returns a 'When' object.
          The 'event' argument is a string representing the event to listen for.
          The 'When' object has the following functions:
          <ul>
            <li>do(callback): add 'callback' to the list of callbacks to call when the event occurs</li>
            <li>whenever(filter): add 'filter' to the list of filters.  filter must be a function, that returns truthy if the callback chain should be executed.</li>
            <li>dispatch(event): immediately run the callback chain if the predicates match, with the given event argument (object containing 'event', a string representing the event, and 'payload', an event-specific variable of any type</li>
          </ul>
          Events include:
          <ul>
            <li>enemy.appears: event triggered by an enemy appearing on the same tile as the player</li>
          </ul>
        </p>
      </Tab>
      <Tab page="status">
        <StatusPage 
          {...this.state.game.player}
        />
      </Tab>
    </Tabs>
  </div>);

  let resetGame = () => {
    this.state.game.reset();
  }

  if(this.state.game.gameOver) {
    gameOutput = <div className="GameOver">
      <div className="Label">Game Over</div>
      <div className="Control"><button className="ResetGame" onClick={resetGame}>Reset</button></div>
      </div>;
  }
    
    return (
      <div className="App">
        <div className="LeftColumn">
          <div className="MapControls">
            {
              _.map(["up","left","right","down"], (dir) => {
                return (<button 
                  key={dir}
                  onClick={() => scrollMap(dir)} 
                  className={_.capitalize(dir)}>
                    <FontAwesomeIcon icon={icons[dir]} />
                  </button>);
              }) 
            }
            <button
              onClick={this.centerPlayer.bind(this)}
              className="CenterPlayer"
            >
              <FontAwesomeIcon icon={faCrosshairs} />
            </button>
            <button
              onClick={()=>{this.setState({followPlayer:!this.state.followPlayer})}}
              className="FollowPlayer">
                <FontAwesomeIcon 
                  icon={this.state.followPlayer ? faCompass : farCompass}
                  
                  />
              </button>
          </div>
        </div>
        {gameOutput}
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
          <button onClick={resetGame}>
            Reset
          </button>
        </div>
      </div>
    );
  }

  centerPlayer() {
    let { x, y } = this.state.game.world.map.playerPos;
    let { width, height } = this.state.game.world.map;
    this.setState({
      mapOriginX: Math.min(width - 16, Math.max(x - 8, 0)),
      mapOriginY: Math.min(height - 16, Math.max(y - 8, 0))
    });
  }
}

export default App;
