import { GLOBALTYPES } from '../types'

const initialState = {
    token: '',
    user: {}
}



const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}


export default authReducer