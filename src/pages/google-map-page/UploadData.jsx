import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {addNewLocation} from "../../actions/LocationAction";
import {withStyles} from "@material-ui/core/styles/index";
import {Button, LinearProgress, Card, CardActions, CardMedia,Snackbar,IconButton} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Clear';
import {connect} from "react-redux";
import {href} from "../../const";

const styles = theme => ({
    closeIcon: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    button: {
        position: 'absolute',
        bottom: 0,
        height: 60,
        width: "100%",
    },
    card: {
        position: "relative",
        top: 40,
        width: "calc(100% - 16px)",
        height: "300px",
        margin: 8,
        textAlign: "center"
    },
    addIcon: {
        top: "40%",
        right:"40%",
        position:"absolute",
    }, media: {
        width: "100%",
        height: "300px",
    }, progress: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 0,
        margin: 0,
        zIndex: 1000,
    }, hiddenFile: {
        position:"absolute",
        top: -100,
    }
});

class UploadData extends Component {

    state={
        image:"",
        componentType:"image",
        progressVisibility:"hidden",
        progressValue:0,
        fileName:"",
        openSnackbar:false,
    };

    addClick = () => {
        const that = this;
        document.getElementById("file-input").click();
        document.querySelector('#file-input')
            .addEventListener('change', function(e) {
            const file = this.files[0];
            that.setState({image:window.URL.createObjectURL(file)});
            const fd = new FormData();
            fd.append("file", file);
            const xhr = new XMLHttpRequest();
            xhr.open('POST',
                href+'containers/files/upload',
                true);
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    that.setState({progressVisibility:"visible",
                        progressValue:percentComplete});
                }
            };
            xhr.onload = function() {
                if (this.status === 200) {
                    const resp = JSON.parse(this.response);
                    console.log(resp);
                    const fileName = resp.result.files.file[0].name;
                    that.setState({fileName:fileName});
                    that.setState({componentType:that.isImage(fileName)?"image":"video"});
                }
            };
            xhr.send(fd);
        }, false);
    };
    handleSubmit = (event)=>{
        event.preventDefault();
    };
    handleSave = ()=>{
        console.log(this.props.initNewLocation);
        if(this.state.fileName!==""||this.state.fileName!==undefined)
        this.props.addNewLocation({
            type:this.state.componentType,
            fileName:this.state.fileName,
            lat:this.props.initNewLocation.lat,
            lng:this.props.initNewLocation.lng},this.props.onCloseDrawer,this.handleFetchProblem);
    };
    getExtension = (filename)=> {
        const parts = filename.split('.');
        return parts[parts.length - 1];
    };
    isImage=(filename)=>{
        const ext = this.getExtension(filename);
        switch(ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
            case 'JPG':
            case 'PNG':
            case 'BMP':
            case 'GIF':
                return true;
            default:
                return false;
        }
    };
    handleFetchProblem = ()=>{
        this.setState({openSnackbar:true});
    };
    handleCloseSnakeBar = ()=>{
        this.setState({openSnackbar:false});
    };
    render(){
        const {classes} = this.props;
        return (
            <React.Fragment>
                <CloseIcon className={classes.closeIcon} onClick={this.props.onCloseDrawer}/>
                <Card className={classes.card}>
                    <CardActions>
                        <CardMedia
                            component={this.state.componentType}
                            className={classes.media}
                            image={this.state.image}
                            title="Contemplative Reptile"
                        >
                            <div className={classes.hiddenFile}>
                                <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                                    <input name="upload" type="file" id="file-input" accept="video/*,image/*" />
                                    <input type="submit" id="file-submit"/>
                                </form>
                            </div>

                        </CardMedia>
                        <Button variant="fab" mini color="primary"
                                className={classes.addIcon} onClick={this.addClick}>
                            <AddIcon/>
                        </Button>
                        {this.state.fileName===""?<p style={{position:"absolute",top:"55%",right:"30%", width:"40%"}}>"select an image"</p>:<p/>}
                        <LinearProgress variant="determinate" color="primary"
                                        value={this.state.progressValue} className={classes.progress}
                                        style={{visibility :this.state.progressVisibility,
                                        }}/>
                    </CardActions>

                </Card>
                <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSave}>
                    save
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical:"top", horizontal:"center" }}
                    open={this.state.openSnackbar}
                    onClose={this.handleCloseSnakeBar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">there is a problem with sending data</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleCloseSnakeBar}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </React.Fragment>
        );
    }
}

UploadData.propTypes = {
    classes: PropTypes.object.isRequired,
    addNewLocation: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
    initNewLocation: state.locations.init,
});

export default connect(mapStateToProps,{addNewLocation})(withStyles(styles)(UploadData));
