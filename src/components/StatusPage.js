import React, { Component } from "react";

import _ from 'lodash';

import './StatusPage.scss';

const BAR_WIDTH = 200;

export default class StatusPage extends Component {

  render() {
      return (
          <div className="StatusPage">
              <div className="Stats">
                  <div className="NamePlate">
                      <div className="Stat Label">{this.props.name}</div>
                      <div className="Stat Value Level">{this.props.level}</div>
                  </div>
                  <div className="Stat Label">Strength</div>
                  <div className="Stat Value">{this.props.strength}</div>
                  <div className="Stat Label">Stamina</div>
                  <div className="Stat Value">{this.props.stamina}</div>
                  <div className="Stat Label">Agility</div>
                  <div className="Stat Value">{this.props.agility}</div>
              </div>
              <div className="Dynamics">
                  <div className="Health Bar" style={{
                      width: ((this.props.health / this.props.maxHealth) * BAR_WIDTH) + "px"
                  }}>
                      {this.props.health}/{this.props.maxHealth}
                  </div>
                  <div className="Energy Bar" style={{
                      width: ((this.props.energy / this.props.maxEnergy) * BAR_WIDTH) + "px"
                  }}>
                      {this.props.energy}/{this.props.maxEnergy}
                  </div>
                  <div className="XP Bar" style={{
                      width: ((this.props.xp / this.props.nextLevelXp) * BAR_WIDTH) + "px"
                  }}>
                      {this.props.xp}/{this.props.nextLevelXp}
                  </div>
              </div>
              <div className="Context">
                  <div className="Location">
                      Location: ({this.props.location.x},{this.props.location.y})<br />
                      Terrain: {this.props.location.terrain.description}<br />
                      Surroundings: {_.map(this.props.location.objects, "name").join(" ") || "Open space"}
                  </div>
                  <div className="Combat">
                      {this.props.underAttack ? <div className="AttackWarning">Under Attack!!!</div> : null}
                  </div>
              </div>
          </div>);
  }

}