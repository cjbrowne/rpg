import React, { Component } from 'react';

import _ from 'lodash';

import './Tab.css';

export class Tab extends Component {
    render() {
        return this.props.children || null;
    }
}

export class Tabs extends Component {
    render() {
        return (
            <div className={["TabContainer", this.props.className].join(" ")}>
                <div className="TabSelector">
                    {_.map(this.props.children, (child) => {
                        if(child.type === Tab) {

                            return (<button 
                                key={child.props.page} 
                                onClick={() => this.props.onTabChange(child.props.page)} 
                                className={["TabButton",this.props.page===child.props.page?"Active":""].join(" ")}
                            >
                                {child.props.page}
                            </button>);
                        }
                    })}
                </div>
                <div className="CurrentTab">
                    {
                        _.find(this.props.children, (child) => {
                            if(child.type === Tab) {
                                return this.props.page == child.props.page;
                            }
                        }) || null
                    }
                </div>
            </div>
        )
        
        
        
    }
}
