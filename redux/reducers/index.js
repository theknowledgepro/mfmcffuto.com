import { combineReducers } from 'redux';
import auth from './auth_reducer'
import loading from './loading_reducer'
import redirect from './redirect_reducer'
import toast from './toast_reducer'

export default combineReducers({
    auth,
    loading,
    toast,
    redirect,
})