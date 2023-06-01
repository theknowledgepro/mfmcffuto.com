import { GLOBALTYPES } from '../types'

const initialState = [];

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.LOADING:
            return [...state, action.payload];
        case GLOBALTYPES.FINISHEDLOADING:
            return state.filter(index => Object.keys(index)[0] !== Object.keys(action.payload)[0]);
        default:
            return state;
    }
}


export default loadingReducer
