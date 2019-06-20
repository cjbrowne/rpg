import React, { Component } from 'react';

import './Map.css';
import _ from 'lodash';

class Tile extends Component {
    render() {
        let terrainClass = this.props.terrain.description;

        return (
            <div className={"MapTile " + terrainClass}>
                {_.map(this.props.objects, (obj, idx) => {
                    return <img src={obj.logo} key={idx} alt={obj.name} />;
                })}
                {
                    this.props.player &&
                        (<img src="player.png" alt="player" /> ||
                        null)
                }
            </div>
        )
    }
}

export default class MapDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="Map"
            style={{
                gridTemplateColumns: _.repeat("auto ", this.props.tiles.length),
                width: (this.props.tiles.length * 16) + "px"
            }}>
                {_.map(this.props.tiles, (tileRow) => {
                    return _.map(tileRow, (tile) => { 
                        return (<Tile 
                            key={tile.x+tile.y}
                            terrain={tile.terrain}
                            objects={tile.objects}
                            player={tile.player}
                            />);
                    });
                })}
            </div>
        );
    }
}