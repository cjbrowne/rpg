import React, { Component } from 'react';

import './Map.css';
import _ from 'lodash';

import { crop } from '../game/arrayutil';

class Tile extends Component {
    render() {
        let terrainClass = this.props.terrain.description;
        let maybeEnemy = null;

        if(this.props.enemy) {
            maybeEnemy = `Enemy: ${this.props.enemy.health}/${this.props.enemy.maxHealth}`;
        }

        return (
            <div className={"MapTile " + terrainClass} style={this.props.style}>
                {
                    this.props.player &&
                        (<img src="player.png" alt="player" /> ||
                        null)
                }
                {_.map(this.props.objects, (obj, idx) => {
                    return <img src={obj.logo} key={idx} alt={obj.name} />;
                })}
                {maybeEnemy}
            </div>
        );
    }
}

export default class MapDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let allTiles = this.props.tiles;

        let displayedTiles = crop(allTiles, this.props.originX, this.props.originY);

        return (
            <div className="Map"
            style={{
                gridTemplateColumns: "8px " + _.repeat("auto ", displayedTiles.length),
                gridTemplateRows: "8px " + _.repeat("auto ", displayedTiles[0].length),
                width: ((displayedTiles.length * 16) + 8) + "px",
                height: ((displayedTiles.length * 16) + 8) + "px"
            }}>
                <div className="Gutter Origin"></div>
                {_.map(_.range(this.props.originX, this.props.originX + 16), (x) => {
                    return <div className="Gutter X" style={{
                        gridRow: 1,
                        gridColumn: (x + 2)
                    }}>{x}</div>
                })}
                {_.map(_.range(this.props.originY, this.props.originY + 16), (y) => {
                    return <div className="Gutter Y" style={{
                        gridRow: (y + 2),
                        gridColumn: 1 
                    }}>{y}</div>;
                })}
                {_.map(displayedTiles, (tileRow) => {
                    return _.map(tileRow, (tile) => { 
                        return (<Tile 
                            style={{
                                gridColumn: tile.x + 2,
                                gridRow: tile.y + 2
                            }}
                            key={tile.x+tile.y}
                            terrain={tile.terrain}
                            objects={tile.objects}
                            player={tile.player}
                            enemy={tile.enemy}
                            x={tile.x}
                            y={tile.y}
                            />);
                    });
                })}
            </div>
        );
    }
}