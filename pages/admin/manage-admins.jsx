/** @format */

import { AdminLayout } from '@/components';
import { APP_ROUTES, MEMBER_ROLES, SITE_DATA } from '@/config';
import React from 'react';
import { Typography } from '@mui/material';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';

const Dashboard = ({ userAuth }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	return (
		<AdminLayout SeoData={{ meta_title: `Admin Dashboard | ${SITE_DATA.NAME}` }}>
			<Typography
				sx={{ fontWeight: '700', mt: 2, mb: 3, fontSize: { xs: '20px', sm: '22px', md: '30px' }, alignItems: 'center', display: 'flex' }}
				className='color-primary'>
				<FlutterDashIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />
				Admin Dashboard
			</Typography>
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

	// REDIRECT TO DASHBOARD IF ADMIN IS RESTRICTED TO VIEW THIS PAGE
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.DASHBOARD, adminId: verifyUserAuth?.user?._id });
	console.log({ isRestricted });
	// if (isRestricted) return { redirect: { destination: APP_ROUTES.DASHBOARD, permanent: false } };

	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
		},
	};
}

export default Dashboard;
