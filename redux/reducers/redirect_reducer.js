import { GLOBALTYPES } from '../types'

const initialState = null

const redirectReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.REDIRECT:
            return action.payload;
        default:
            return state;
    }
}


export default redirectReducer
