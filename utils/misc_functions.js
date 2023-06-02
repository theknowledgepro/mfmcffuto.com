import { useDispatch } from "react-redux";
import { useEffect } from 'react'
import { GLOBALTYPES } from "@/redux/types";

// ** USED TO DISPATCH 'userAuth' TO REDUX 'auth' STATE
export const DispatchUserAuth = ({ userAuth }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        userAuth && dispatch({ type: GLOBALTYPES.AUTH, payload: { token: userAuth.access_token, user: userAuth.user } });
    }, [userAuth ? userAuth : null])
}

// ** USED TO POPULATE PAGE STATE WITH DATA FROM SSR ON PAGE MOUNT
export const PopulateStateOnPageMount = ({ data, state, setState, stateType }) => {
    useEffect(() => {
        if (!stateType) return;
        stateType === 'ARRAY' && setState([...data])
        stateType === 'JSON' && setState({ ...data })
        stateType === 'BOOLEAN' && setState(data)
    }, [data ? data : null])
}

export const updateData = (dataArray, data, index) => {
    const newItems = dataArray.map(item => {
        if (data[index] === item[index]) {
            return { ...item, ...data}
        }
        return item;
    });
    return newItems;
}

