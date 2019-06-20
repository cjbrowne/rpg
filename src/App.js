import React, { Component } from 'react';
import './App.css';

import game from './game/';

import MapDisplay from './components/MapDisplay';

import AceEditor from 'react-ace';

require('brace/theme/dracula');
require('brace/mode/javascript');


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game,
      code: ""
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
    }
    
    return (
      <div className="App">
        <MapDisplay
          tiles={this.state.game.world.map.tiles}
        />
        <AceEditor 
          mode="javascript"
          theme="dracula"
          className="Editor"
          width=""
          height=""
          onChange={updateCode}
          value={this.state.code}
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
