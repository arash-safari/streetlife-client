import React, {Component,cloneElement} from 'react';
import PropTypes from 'prop-types';
import {Paper,Divider} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root:{
        width:60,
        height:60,
        position:"absolute",
    }
});
const iconButtonStyle ={fontSize:46,position:"relative",top:5,left:7,};

class DistanceButton extends Component {
    render() {
        const {classes} = this.props;
        const children = this.props.children;
        return (
            <Paper classes={{root:classes.root}} elevation={5}
                   onClick={this.props.onClick} style={{bottom:this.props.bottom,
                left:this.props.left,
                marginTop:5,
                }}>
                <p style={{height:20,padding:0,margin:"5px 0px 2px 5px"}}>{this.props.distance}</p>
                <Divider style={{border:"0.5px solid #000",width:"95%",margin:"2%"}}/>
                <p style={{height:20,padding:0,margin:"2px auto"}}>{this.props.duration}</p>
            </Paper>
        );
    }
}

DistanceButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DistanceButton);
