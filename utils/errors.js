import { GLOBALTYPES } from "../redux/types";

export const handleClientAPIRequestErrors = ({ err, dispatch, loadingData = {}, returnData }) => {
    dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData })
    console.log(err);
    if (returnData) {
        dispatch({ type: GLOBALTYPES.TOAST, payload: { info: err?.response?.data?.message || err?.response?.data?.error?.message, title: false } });
        return err.response;
    } else if (err.response?.status === 400) { 
        return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: err?.response?.data?.message || err?.response?.data?.error?.message, title: err?.response?.data?.title } })
    } else if (err.response?.status === 401) {
        // ** RETURNED ON ERROR FROM THE AUTH MIDDLEWARE ON SERVER SIDE FOR AUTH ROUTES NEEDING ACCESS_TOKEN
        return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: err?.response?.data?.message || err?.response?.data?.error?.message, title: false } })
    } else if (err.code === 'ERR_NETWORK') {
        return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Please check your internet connection.', title: 'Network Disconnected!' } })
    } else {
        return console.log(err);
    }
}