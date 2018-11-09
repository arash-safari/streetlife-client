import React, {Component,cloneElement} from 'react';
import PropTypes from 'prop-types';
import {Paper} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root:{
        width:60,
        height:60,
        position:"absolute",
    }
});
const iconButtonStyle ={fontSize:46,position:"relative",top:5,left:7,};

class TravelModeButton extends Component {
    render() {
        const {classes} = this.props;
        const children = this.props.children;
        return (
            <Paper classes={{root:classes.root}} elevation={5}
                   onClick={this.props.onClick} style={{bottom:this.props.bottom,
                left:this.props.left,
                backgroundColor:this.props.backgroundColor,}}>
                {React.Children.map(children, (child, index) => {
                    return cloneElement(child, {
                        key: index.toString(),
                        style: iconButtonStyle
                    })
                })}
            </Paper>
        );
    }
}

TravelModeButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TravelModeButton);
