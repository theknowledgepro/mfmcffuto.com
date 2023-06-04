/** @format */

import { API_ROUTES, APP_ROUTES, LOADING, MEMBER_ROLES } from '@/config';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { GLOBALTYPES } from '../types';
import { postDataAPI, postFormDataAPI } from '@/utils/api_client_side';

const loginUser =
	({ redirect, access_token, user, toast, loadingData }) =>
	async (dispatch) => {
		dispatch({ type: GLOBALTYPES.AUTH, payload: { token: access_token, user } });

		// ** DISPATCH A REDIRECT IF NONE EXISTED FROM PAGE URL QUERY
		// ** THIS WILL CAUSE THE HOOK IN THE _persist_layout FILE TO RUN...
		!redirect &&
			dispatch({
				type: GLOBALTYPES.REDIRECT,
				payload: {
					url:
						user.member_role === MEMBER_ROLES.MASTER || user.member_role === MEMBER_ROLES.MANAGER
							? APP_ROUTES.ADMIN_DASHBOARD
							: APP_ROUTES.DASHBOARD,
				},
			});

		dispatch({ type: GLOBALTYPES.TOAST, payload: { success: toast } });
		dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData });
	};

export const createAdmin =
	({ auth, newAdminData, avatarFile, loadingData = { [LOADING.CREATE_ADMIN]: true } }) =>
	async (dispatch) => {
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });

			const res = await postFormDataAPI(API_ROUTES.CREATE_ADMIN, { ...newAdminData, avatar: avatarFile }, auth?.token);
			if (res.status === 200) dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData });
			return res;
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData, returnData: true });
		}
	};

export const editAdminData =
	({ auth, newAdminData, avatarFile, loadingData = { [LOADING.CREATE_ADMIN]: true } }) =>
	async (dispatch) => {
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });

			const res = await postFormDataAPI(API_ROUTES.CREATE_ADMIN, { ...newAdminData, avatar: avatarFile }, auth?.token);
			if (res.status === 200) dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData });
			return res;
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData, returnData: true });
		}
	};

export const login =
	({ redirect, username, password, loadingData = { [LOADING.LOGIN]: true } }) =>
	async (dispatch) => {
		if (!username || !password) return;
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });
			const res = await postDataAPI(API_ROUTES.LOGIN, { username, password });
			return dispatch(loginUser({ redirect, access_token: res.data.access_token, user: res.data.user, toast: res.data.message, loadingData }));
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData });
		}
	};

export const logout =
	({ loadingData = { [LOADING.LOGOUT]: true } }) =>
	async (dispatch) => {
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });

			const res = await postDataAPI(API_ROUTES.LOGOUT);
			dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res.data.message } });
			dispatch({ type: GLOBALTYPES.AUTH, payload: {} });
			window.location.href = APP_ROUTES.HOME;
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData });
		}
	};

export const requestPasswordResetToken =
	({ email, loadingData = { [LOADING.REQUEST_PASSWORD_RESET_TOKEN]: true } }) =>
	async (dispatch) => {
		if (!email) return;
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });
			const res = await postDataAPI(API_ROUTES.REQUEST_PASSWORD_RESET_TOKEN, { email });
			if (res.status === 200) dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData });
			dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
			return res;
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData, returnData: true });
		}
	};

export const verifyPasswordResetToken =
	({ email, OTPValue, loadingData = { [LOADING.VERIFY_PASSWORD_RESET_TOKEN]: true } }) =>
	async (dispatch) => {
		if (!email || !OTPValue) return;
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });
			const res = await postDataAPI(API_ROUTES.VERIFY_PASSWORD_RESET_TOKEN, { email, OTPValue });
			if (res.status === 200) dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData });
			dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
			return res;
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData, returnData: true });
		}
	};

export const passwordReset =
	({ email, OTPValue, password, confirmPassword, loadingData = { [LOADING.PASSWORD_RESET]: true } }) =>
	async (dispatch) => {
		if (!email || !OTPValue || !password || !confirmPassword) return;
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });
			const res = await postDataAPI(API_ROUTES.PASSWORD_RESET, { email, OTPValue, password, confirmPassword });
			if (res.status === 200) dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData });
			dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
			window.location.href = APP_ROUTES.LOGIN;
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData });
		}
	};
