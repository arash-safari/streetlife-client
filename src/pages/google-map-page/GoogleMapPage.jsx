/* eslint-disable no-undef */
import React, {Component} from "react"
import {compose, lifecycle, withProps} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps"
import {stytledMapType} from '../../const'
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';
import CloseIcon from '@material-ui/icons/Clear';
import {Button, Drawer, Snackbar, IconButton} from '@material-ui/core';
import {grey, blue} from '@material-ui/core/colors';
import UploadData from './UploadData';
import {connect} from "react-redux";
import {initNewLocation, fetchAllLocation, getGeoLocation, sortDistance} from "../../actions/LocationAction";
import {InfoWindow} from "react-google-maps";
import {CardActions, CardMedia, Card} from "@material-ui/core";
import {href} from "../../const";
import NavigationSelector from "./NavigationSelector";

const addColor = grey[500];
const selectColor = blue[300];
let DirectionsService;

const styles = theme => ({
    fab: {
        position: 'absolute',
        bottom: '45%',
        right: theme.spacing.unit * 2,
    },
    navFab: {
        position: 'absolute',
        bottom: 'calc( 45% + 70px )',
        right: theme.spacing.unit * 2,
    },
    add: {
        color: addColor,
    },
    nav: {
        color: addColor,
    }
    , card: {
        width: 150,
        height: 150
    }, media: {
        width: 150,
        height: 300
    }
});


class GoogleMapPage extends Component {

    state = {
        isMarkerShown: false,
        drawer: false,
        openSnackbar: false,
        openInfoWindow: -1,
        myPos: {},
        navigateSelected: false,
        directions: [null, null, null, null, null]
    };

    handleMapClick = (event) => {
        if (this.state.openSnackbar) {
            this.props.initNewLocation({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            })
            this.setState({openSnackbar: false, drawer: true});
        }
    };

    handleLocationError = (browserHasGeolocation) => {
        // browserHasGeolocation ?
        //     'Error: The Geolocation service failed.' :
        //     'Error: Your browser doesn\'t support geolocation.';
    };

    handleCloseSnakeBar = () => {
        this.setState({openSnackbar: false})
    };

    handleAddFabClicked = () => {
        this.setState({openSnackbar: true})
    };

    handleMarkerClick = (index) => () => {
        this.setState({openInfoWindow: index})
    };

    onCloseDrawer = () => this.setState({'drawer': false});

    handleNavFabClicked = event => {
        event.stopPropagation();
        if (this.state.navigateSelected === false) {
            this.props.getGeoLocation(this.handleLocationError);
            this.setState({navigateSelected: true});
            if (this.props.myLoc.lat >= 0) {
                this.props.sortDistance();
            }
        } else {
            this.setState({navigateSelected: false});
        }
    };
    componentWillMount() {
        this.props.fetchAllLocation();
        this.props.getGeoLocation(this.handleLocationError);
    }

    render() {
        const {classes} = this.props;
        const centerLocation = (this.props.myLoc.lat >= 0)
            ? this.props.myLoc
            : {lat: 25.2048, lng: 55.2708};
        const MyMapComponent = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?" +
                "key=AIzaSyDOcXYwgkcNFMCG-JPx-wqmkiNPSDJGioU&" +
                "v=3.exp&libraries=geometry,drawing,places",
                loadingElement: <div style={{height: `100%`}}/>,
                containerElement: <div style={{height: `100vh`}}/>,
                mapElement: <div style={{height: `100%`}}/>,
            }),
            withScriptjs,
            withGoogleMap,
            lifecycle({
                componentDidMount() {
                    DirectionsService = new google.maps.DirectionsService();
                }
            })
        )((props) =>
            <GoogleMap
                defaultZoom={13}
                center={centerLocation}
                defaultOptions={{
                    styles: stytledMapType,
                    zoomControl: false,
                    scaleControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                }}
                onClick={this.handleMapClick}
            >
                {(this.props.myLoc.lat < 0 || this.state.navigateSelected === false) ?
                    this.props.allLocations.map((location, index) => {
                        return (<Marker key={index}
                                        icon={{
                                            url: './blueMarker.svg',
                                            scaledSize: new google.maps.Size(60, 60),
                                            origin: new google.maps.Point(0, 0),
                                            anchor: new google.maps.Point(24, 48),
                                            labelOrigin: new google.maps.Point(30, 25),
                                        }}
                                        position={{lat: location.lat, lng: location.lng}}
                                        onClick={this.handleMarkerClick(index)}>
                            {(this.state.openInfoWindow === index) &&
                            <InfoWindow onCloseClick={() => {
                                this.setState({openInfoWindow: false})
                            }}>
                                {this.getInfoWindowsContent()}
                            </InfoWindow>}
                        </Marker>);
                    }) : this.props.allLocations.map((location, index) => {
                        if (index < 5)
                            return (
                                <React.Fragment>
                                    <Marker key={index}
                                            position={{lat: location.lat, lng: location.lng}}
                                            icon={{
                                                url: './blueMarker.svg',
                                                scaledSize: new google.maps.Size(60, 60),
                                                origin: new google.maps.Point(0, 0),
                                                anchor: new google.maps.Point(24, 48),
                                                labelOrigin: new google.maps.Point(30, 25),
                                            }}
                                            label={{
                                                text: (index + 1) + "",
                                                color: "#1E88E5",
                                                fontSize: "16px",
                                                fontWeight: "bold"
                                            }}
                                            onClick={this.handleMarkerClick(index)}>
                                        {(this.state.openInfoWindow === index) &&
                                        <InfoWindow onCloseClick={() => {
                                            this.setState({openInfoWindow: false})
                                        }}>
                                            {this.getInfoWindowsContent()}
                                        </InfoWindow>}
                                    </Marker>
                                    {this.state.directions[index] !== null &&
                                    <DirectionsRenderer
                                        directions={this.state.directions[index]}
                                        options={{suppressMarkers: true, preserveViewport: true}}/>}
                                </React.Fragment>);
                        return <div/>;
                    })}
                <Marker key={"origin"}
                        icon={{
                            url: './redMarker.svg',
                            scaledSize: new google.maps.Size(60, 60),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(24, 48),
                            labelOrigin: new google.maps.Point(31, 25),
                        }}
                        label={{
                            text: "0",
                            color: "#EE3840",
                            fontSize: "16px",
                            fontWeight: "bold"
                        }}
                        position={{lat: this.props.myLoc.lat, lng: this.props.myLoc.lng}}
                />
            </GoogleMap>
        );
        return (
            <React.Fragment>
                <MyMapComponent/>
                <Button variant="fab" color="secondary" aria-label="Add"
                        className={classes.navFab}
                        onClick={this.handleNavFabClicked}>
                    <NavigationIcon className={classes.nav} fontSize="large"
                                    style={{color: this.state.navigateSelected ? selectColor : addColor}}/>
                </Button>
                <Button variant="fab" color="secondary" aria-label="Add"
                        className={classes.fab}
                        onClick={this.handleAddFabClicked}>
                    <AddIcon className={classes.add} fontSize="large"/>
                </Button>
                <Drawer
                    anchor="bottom"
                    open={this.state.drawer}
                    onClose={this.onCloseDrawer}
                >
                    <div
                        style={{height: "100vh", width: "100vw"}}
                    >
                        <UploadData onCloseDrawer={this.onCloseDrawer}/>
                    </div>
                </Drawer>
                <Snackbar
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    open={this.state.openSnackbar}
                    onClose={this.handleCloseSnakeBar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">select a place</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleCloseSnakeBar}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />
                <NavigationSelector style={{position: "absolute", bottom: 10, left: 10}}
                                    onChangeTravelMode={this.directionService}
                                    directions = {this.state.directions}
                                    visibility={this.state.navigateSelected}>

                </NavigationSelector>
            </React.Fragment>
        )
    }

    getInfoWindowsContent = () => {
        const {classes} = this.props;
        const src = href + "containers/files/download/" +
            this.props.allLocations[this.state.openInfoWindow].fileName;
        if (this.props.allLocations[this.state.openInfoWindow].type === "image") {
            return (<Card className={classes.card}>
                <CardActions>
                    <CardMedia
                        className={classes.media}
                        image={src}
                        title="street life"
                    >
                    </CardMedia>
                </CardActions>
            </Card>);
        }
        return (<video id="my-video" className="video-js"
                       controls preload="auto" width="150" height="150">
            <source src={src} type='video/mp4'/>
        </video>);
    };

    getInfoWindowsPosition = () => {
        return ({lat: 25.2048, lng: 55.2708});
    }

    directionService = (index,travelMode) => {
        const getTravelMode = (m) => {
            switch (m) {
                case 2:
                    return google.maps.TravelMode.DRIVING;
                case 1:
                    return google.maps.TravelMode.WALKING;
                case 0:
                    return google.maps.TravelMode.BICYCLING;
                default:
                    return null;
            }
        };
        const directions = this.state.directions;
        let origin;
        if(index===0){
            origin = this.props.myLoc;
        }else{
            origin = this.props.allLocations[index-1];
        }
        DirectionsService.route({
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(this.props.allLocations[index].lat,
                this.props.allLocations[index].lng),
            travelMode: getTravelMode(travelMode),
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directions[index] = result;
                console.log(result.routes[0].legs[0].distance.text);
                console.log(result.routes[0].legs[0].duration.text);
                this.setState({
                    directions: directions,
                });
            } else {
                if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
                    console.error("directions for a region in which " +
                        "that direction type is not available");
                }else{
                    console.error(`error fetching directions ${result}`);
                }
            }
        });
    }
}

GoogleMapPage.propTypes = {
    classes: PropTypes.object.isRequired,
    initNewLocation: PropTypes.func.isRequired,
    fetchAllLocation: PropTypes.func.isRequired,
    getGeoLocation: PropTypes.func.isRequired,
    sortDistance: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    allLocations: state.locations.all,
    myLoc: state.locations.myLoc,
    travelModes: state.locations.travelModes,
});

export default connect(mapStateToProps,
    {initNewLocation, fetchAllLocation, getGeoLocation, sortDistance})(withStyles(styles)(GoogleMapPage));
