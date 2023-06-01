/** @format */

import { API_ROUTES, APP_ROUTES, LOADING } from '@/config';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { GLOBALTYPES } from '../types';
import { postDataAPI, postFormDataAPI } from '@/utils/api_client_side';
import memberRoleDefaultHome from '@/utils/member_role_default_home';

const loginUser =
	({ redirect, access_token, user, toast, loadingData }) =>
	async (dispatch) => {
		dispatch({ type: GLOBALTYPES.AUTH, payload: { token: access_token, user } });

		// ** DISPATCH A REDIRECT IF NONE EXISTED FROM PAGE URL QUERY
		// ** THIS WILL CAUSE THE HOOK IN THE _persist_layout FILE TO RUN...
		!redirect && dispatch({ type: GLOBALTYPES.REDIRECT, payload: { url: memberRoleDefaultHome({ member_role: user?.member_role }) } });

		dispatch({ type: GLOBALTYPES.TOAST, payload: { success: toast } });
		dispatch({ type: GLOBALTYPES.FINISHEDLOADING, payload: loadingData });
	};

export const createAdmin =
	({ auth, newAdminData, avatarFile, loadingData = { [LOADING.CREATE_ADMIN]: true } }) =>
	async (dispatch) => {
		try {
			dispatch({ type: GLOBALTYPES.LOADING, payload: loadingData });

			const res = await postFormDataAPI(API_ROUTES.CREATE_ADMIN, { ...newAdminData, avatar: avatarFile }, auth?.token);

			return res;
		} catch (err) {
			return handleClientAPIRequestErrors({ err, dispatch, loadingData, returnData: true });
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
