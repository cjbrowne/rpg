import React, { Component } from 'react';

import './Map.css';
import _ from 'lodash';

import { crop } from '../game/arrayutil';

class Tile extends Component {
    render() {
        let terrainClass = this.props.terrain.description;

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
            </div>
        )
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
                gridTemplateColumns: _.repeat("auto ", displayedTiles.length),
                width: (displayedTiles.length * 16) + "px"
            }}>
                {_.map(displayedTiles, (tileRow) => {
                    return _.map(tileRow, (tile) => { 
                        return (<Tile 
                            style={{
                                gridColumn: tile.x + 1,
                                gridRow: tile.y + 1
                            }}
                            key={tile.x+tile.y}
                            terrain={tile.terrain}
                            objects={tile.objects}
                            player={tile.player}
                            x={tile.x}
                            y={tile.y}
                            />);
                    });
                })}
            </div>
        );
    }
}