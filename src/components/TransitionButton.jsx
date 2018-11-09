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
const transitionButtonStyle ={fontSize:28,position:"relative",top:10,left:16,};
class TransitionButton extends Component {
    render() {
        const children = this.props.children;
        const {classes} = this.props;
        return (
            <Paper classes={{root:classes.root}} elevation={5}
                   onClick={this.props.onClick} style={{bottom:this.props.bottom,
                left:this.props.left,
                backgroundColor:this.props.backgroundColor,}}>
                {React.Children.map(children, (child, index) => {
                    return cloneElement(child, {
                        key: index.toString(),
                        style: transitionButtonStyle
                    })
                })}
                <div style={{position:"absolute",bottom:5,left:5,}}>
                <span style={{fontSize:14}}>{this.props.origin} . <span
                    style={{fontSize:14,position:"relative",top:-3.5,}}>__
                </span> . {this.props.destination}</span>
                </div>
            </Paper>
        );
    }
}

TransitionButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransitionButton);
