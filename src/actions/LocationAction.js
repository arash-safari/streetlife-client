import {INIT_LOCATION, ADD_LOCATION, FETCH_ALL_LOCATIONS,
    GET_LOCATION, SORT_DISTANCE, TRAVEL_MODE} from "./types";
import {href} from "../const";
export const initNewLocation = (data) => {
    return dispatch => {
        dispatch({type: INIT_LOCATION, payload: data})
    }
};
export const addNewLocation = (data,funcOk,funcNotOk) => {
    return dispatch => {
        fetch(href+'locations', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if(res.ok)
                    return res.json()
                else throw new Error('Network response was not ok.');})
            .then(data => dispatch({type: ADD_LOCATION, payload: data}))
            .then(funcOk())
            .catch(function(error) {
            console.log('There has been a problem with fetch operation: ',
                error.message);
            funcNotOk();
        });
    }
};
export const fetchAllLocation = () => {
    return dispatch => {
        fetch(href+'locations')
            .then(res => res.json())
            .then(data => dispatch({type: FETCH_ALL_LOCATIONS, payload: data}));
    }
};
export const getGeoLocation = (handleLocationError)=>{
    return dispatch => {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                return dispatch({type: GET_LOCATION, payload:{
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }});
            }, function() {
                handleLocationError(true);
                return dispatch({type: GET_LOCATION, payload:{}});
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false);
            return dispatch({type: GET_LOCATION, payload:{}});
        }
    };
};

export const sortDistance = ()=>{
    return dispatch => {
        return dispatch({type: SORT_DISTANCE});
    }
};

export const changeTravelMode = (index,mode)=>{
    return dispatch => {
        return dispatch({type: TRAVEL_MODE,index:index,payload:mode});
    }
};
