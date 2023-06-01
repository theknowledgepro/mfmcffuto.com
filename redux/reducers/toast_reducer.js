import { GLOBALTYPES } from '../types'

const initialState = {}

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.TOAST:
            return action.payload;
        default:
            return state;
    }
}


export default toastReducer
