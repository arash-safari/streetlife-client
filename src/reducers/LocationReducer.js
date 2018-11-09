import {INIT_LOCATION,
    ADD_LOCATION,
    FETCH_ALL_LOCATIONS,
    GET_LOCATION,
    SORT_DISTANCE,
    TRAVEL_MODE,
    } from "../actions/types";
import {sortByDistance} from "../LocationUtils";
import update from 'immutability-helper';

const initialState = {
    myLoc:{lat:-1,lng:-1},
    init:{},
    all:[],
    travelModes:[null,null,null,null,null]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case INIT_LOCATION:
            return {...state,init:action.payload};
        case ADD_LOCATION:
            return {...state,all: state.all.concat(action.payload)};
        case FETCH_ALL_LOCATIONS:
            return {...state,all:action.payload};
        case GET_LOCATION:
            return {...state,myLoc:action.payload};
        case SORT_DISTANCE:
            return {...state,all: sortByDistance(state.myLoc,state.all)};
        case TRAVEL_MODE:
            return update(state, {
                travelModes:{[action.index]: {$set: action.payload}}
            });
        default:
            return state;
    }
}
