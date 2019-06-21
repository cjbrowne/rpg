import React, { Component } from 'react';
import './App.css';

import _ from 'lodash';

import game from './game/';

import MapDisplay from './components/MapDisplay';

import AceEditor from 'react-ace';
import { Tabs, Tab } from './components/Tabs';

require('brace/theme/dracula');
require('brace/mode/javascript');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game,
      code: "",
      page: "status"
    }
  }

  componentDidMount() {
    let code = localStorage.getItem("code");
    if(code) {
      this.setState({
        code
      });
    }
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
    
    return (
      <div className="App">
        <div className="GameOutput">
          <MapDisplay
            tiles={this.state.game.world.map.tiles}
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
        />
        <div className="Controls">
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
