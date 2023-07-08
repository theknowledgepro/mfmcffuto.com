/** @format */

import { AdminLayout } from '@/components';
import { APP_ROUTES, MEMBER_ROLES, SITE_DATA } from '@/config';
import React from 'react';
import { Typography } from '@mui/material';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';

const Dashboard = ({ userAuth }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	return (
		<AdminLayout
			metatags={{ meta_title: `Manage Admins | ${SITE_DATA.NAME}` }}
			pageIcon={<FlutterDashIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Admin Dashboard'}>
			Admin Dashbaord... Development in progress...
		</AdminLayout>
	);
};

export async function getServerSideProps({ req, res }) {
	// ** REDIRECT TO LOGIN IF COOKIE NOT EXIST
	const verifyUserAuth = await AuthController.generateAccessToken(req, res);
	if (verifyUserAuth?.redirect) return verifyUserAuth;

	// ** REDIRECT TO 404 PAGE IF NOT ADMIN
	if (verifyUserAuth?.user?.member_role !== MEMBER_ROLES.MASTER && verifyUserAuth?.user?.member_role !== MEMBER_ROLES.MANAGER)
		return {
			redirect: { destination: APP_ROUTES.NOT_FOUND, permanent: false },
		};

	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
		},
	};
}

export default Dashboard;
