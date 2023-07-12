/** @format */

import { AdminLayout, ControlledAccordion, ImageTag, MuiModal } from '@/components';
import { API_ROUTES, CLOUD_ASSET_BASEURL, APP_ROUTES, LIMITS, MEMBER_ROLES, SITE_DATA } from '@/config';
import React, { useState } from 'react';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';
import AdminController from '@/pages/api/admin/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import CottageTwoToneIcon from '@mui/icons-material/CottageTwoTone';
import {
	IconButton,
	Divider,
	Paper,
	Box,
	Button,
	TextField,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	InputAdornment,
} from '@mui/material';
import Moment from 'react-moment';
import { BsDot } from 'react-icons/bs';
import handleDataSort from '@/utils/handle_data_sort';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { WorshipEvent } from '@/components/worship_days';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import comp_styles from '@/components/components.module.css';
import { GLOBALTYPES } from '@/redux/types';
import { validate } from '@/utils/validate';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { patchFormDataAPI, postFormDataAPI } from '@/utils/api_client_side';
import NewspaperSharpIcon from '@mui/icons-material/NewspaperSharp';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';

const ManageExcos = ({ userAuth, homePageSettings, currentExcos }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	const session = useSelector((state) => state.auth);

	return (
		<AdminLayout
			metatags={{ meta_title: `Manage Excos | ${SITE_DATA.NAME}` }}
			pageIcon={<SupervisorAccountOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Manage Excos'}>
			
		</AdminLayout>
	);
};

export async function getServerSideProps({ req, res }) {
	// ** REDIRECT TO LOGIN IF COOKIE NOT EXIST
	const verifyUserAuth = await AuthController.generateAccessToken(req, res);
	if (verifyUserAuth?.redirect) return verifyUserAuth;

	// ** ASSIGN USER TO REQ OBJECT
	req.user = verifyUserAuth?.user;

	// ** REDIRECT TO 404 PAGE IF NOT ADMIN
	if (verifyUserAuth?.user?.member_role !== MEMBER_ROLES.MASTER && verifyUserAuth?.user?.member_role !== MEMBER_ROLES.MANAGER)
		return {
			redirect: { destination: APP_ROUTES.NOT_FOUND, permanent: false },
		};

	// REDIRECT TO DASHBOARD PAGE IF ADMIN IS RESTRICTED TO VIEW THIS PAGE
	const isRestricted = await CheckAdminRestriction({ page: `${APP_ROUTES.PAGES_CUSTOMIZATION}/home`, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET PAGE DATA
	req.page_settings = 'Home-Page-Settings';
	const homePageSettings = await AdminController.getPageSettings(req, res, true);

	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			homePageSettings: homePageSettings?.data?.pageSettings,
		},
	};
}

export default ManageExcos;
