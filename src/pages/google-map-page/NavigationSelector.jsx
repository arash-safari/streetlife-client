import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import TransitionButton from "../../components/TransitionButton";
import {blue} from "@material-ui/core/colors";
import TravelModeButton from "../../components/TravelModeButton";
import {changeTravelMode} from "../../actions/LocationAction";
import {connect} from "react-redux";
import DistanceButton from "../../components/DistanceButton";


const icons = [<DirectionsBikeIcon/>, <DirectionsWalkIcon/>, <DirectionsCarIcon/>,];
const transitions = [{origin: 0, destination: 1}, {origin: 1, destination: 2},
    {origin: 2, destination: 3}, {origin: 3, destination: 4}, {origin: 4, destination: 5},];

class NavigationSelector extends Component {

    state = {
        transitionsSelected: -1,
        transitionIcons: [-1, -1, -1, -1, -1]
    };

    render() {
        return (
            <div style={this.props.style}>
                <div id="iconList" style={{
                    visibility: (this.state.transitionsSelected >= 0)
                        ? "visible" : "hidden"
                }}>
                    {icons.map((icon, index) => (
                        <TravelModeButton left={70 * index + 30}
                                          key={index}
                                          onClick={this.handleLittleButtonClicked(index)}
                                          bottom={170}>
                            {icon}
                        </TravelModeButton>
                    ))}
                </div>
                <div id="transitionList" style={{
                    visibility: (this.props.visibility)
                        ? "visible" : "hidden"
                }}>
                    {transitions.map((transition, index) => (
                        <TransitionButton origin={transition.origin}
                                          left={70 * index}
                                          bottom={100}
                                          key={index}
                                          onClick={this.handleTransitionClicked(index)}
                                          backgroundColor={
                                              this.state.transitionsSelected === index ?
                                                  blue[300] : "#FFF"}
                                          destination={transition.destination}>
                            {(this.state.transitionIcons[index] >= 0) ? icons[this.state.transitionIcons[index]] :
                                <div></div>}
                        </TransitionButton>))}
                </div>
                <div id="distanceList">
                    {this.props.directions.map((direction, index) => {
                        if(direction!==null)
                        return (<DistanceButton
                            left={70 * index }
                            bottom={30}
                            distance={direction.routes[0].legs[0].distance.text}
                            duration={direction.routes[0].legs[0].duration.text}
                            key={index}/>
                        );
                        return null;})

                    }
                </div>
            </div>
        );
    }

    handleTransitionClicked = (index) => () => {
        if (this.state.transitionsSelected !== index)
            this.setState({transitionsSelected: index,})
        else
            this.setState({transitionsSelected: -1,})
    };

    handleLittleButtonClicked = (index) => () => {
        const transitionIcons = this.state.transitionIcons;
        transitionIcons[this.state.transitionsSelected] = index;
        this.setState({transitionIcons: transitionIcons, transitionsSelected: -1,})
        this.props.changeTravelMode(this.state.transitionsSelected, index);
        this.props.onChangeTravelMode(this.state.transitionsSelected, index);
    }
}

NavigationSelector.propTypes = {
    changeTravelMode: PropTypes.func.isRequired,
};

export default connect(null, {changeTravelMode})(NavigationSelector);
