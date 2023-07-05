/** @format */

import { AdminLayout } from '@/components';
import { ACTIVITY_TYPES, APP_ROUTES, MEMBER_ROLES, SITE_DATA } from '@/config';
import React from 'react';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';
import AdminController from '@/pages/api/admin/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import { Avatar, Divider, Paper } from '@mui/material';
import Moment from 'react-moment';
import { BsDot } from 'react-icons/bs';

const ActivityLogs = ({ userAuth, activityLogs }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	console.log({ activityLogs });
	return (
		<AdminLayout
			metatags={{ meta_title: `Activity Logs | ${SITE_DATA.NAME}` }}
			pageIcon={<WebStoriesIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Activity Logs'}>
			<div className='w-full row flex xs:flex-col items-start relative'>
				<Paper className='col-md-4 p-3 rounded-sm border xs:mb-5 md:fixed md:top-50 md:right-10'>actions</Paper>
				<div className='col-md-6 rounded-sm p-2'>
					{activityLogs.map((activity, i) => (
						<div key={i} className={`${activity.deed === ACTIVITY_TYPES.LOGIN.title && 'bg-green-300'} border mild-shadow rounded-md my-3 px-2 pt-1`}>
							<div className='w-full text-center py-2'>{activity.details}</div>
							<Divider />
							<div className='w-full flex py-1'>
								<Avatar src={activity?.user_id?.avatar} className='my-auto mr-2 w-8 h-8' />
								<div className='flex flex-wrap w-full justify-between'>
									<div className='my-auto text-sm text-gray-600'>
										{activity?.user_id?.lastname} {activity?.user_id?.firstname} {activity?.user_id?.secondname}
									</div>
									<div className='flex'>
										<div className='my-auto fs-12 text-gray-500'>
											<Moment format='ddd'>{activity.createdAt}</Moment> - <Moment format='LT'>{activity.createdAt}</Moment>
										</div>
										<div className='mx-1 my-auto'>
											<BsDot />
										</div>
										<div className='my-auto fs-12 text-gray-500'>
											<Moment format='DD'>{activity.createdAt}</Moment>/<Moment format='MM'>{activity.createdAt}</Moment>/
											<Moment format='YY'>{activity.createdAt}</Moment>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
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

	// ** REDIRECT TO DASHBOARD PAGE IF NOT MASTER ADMIN
	if (verifyUserAuth?.user?.member_role !== MEMBER_ROLES.MASTER)
		return {
			redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false },
		};

	// REDIRECT TO DASHBOARD PAGE IF ADMIN IS RESTRICTED TO VIEW THIS PAGE
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.ACTIVITY_LOGS, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET PAGE DATA
	const activityLogs = await AdminController.getAllActivityLogs(req, res, true);
	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			activityLogs: activityLogs?.data?.results ? activityLogs?.data?.results : [],
		},
	};
}

export default ActivityLogs;
