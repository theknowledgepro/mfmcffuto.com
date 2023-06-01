import { Toast } from '@/components';
import { GLOBALTYPES } from '@/redux/types';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const PersistLayout = ({ children }) => {
    const { auth, toast, redirect } = useSelector(state => state)
    const router = useRouter();
    const dispatch = useDispatch()

    // ** REDIRECT USER ON AUTH.TOKEN CHANGE && IF URL IN REDIRECT STORE EXISTS
    useEffect(() => {
        if (auth.token && redirect?.url) {
            router.push(redirect.url)
            dispatch({ type: GLOBALTYPES.REDIRECT, payload: null })
        }
    }, [auth.token, redirect?.url])

    return (
        <React.Fragment>
            {(toast.success || toast.info || toast.error || toast.warning) && <Toast />}
            {children}
        </React.Fragment>
    )
}

export default PersistLayout