/** @format */

import { AdminLayout } from '@/components';
import { API_ROUTES, APP_ROUTES, MEMBER_ROLES, SITE_DATA } from '@/config';
import React from 'react';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';
import AdminController from '@/pages/api/admin/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import { Avatar, Divider, Paper, Box, TextField, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Moment from 'react-moment';
import { BsDot } from 'react-icons/bs';
import styles from './admin_styles.module.css';
import handleDataSort from '@/utils/handle_data_sort';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

const ActivityLogs = ({ userAuth, activityLogs }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });

	// ** PAGE DATA STORE
	const [logs, setLogs] = React.useState(activityLogs);

	// ** ACCOUNTS SORT FUNCTIONALITY
	const { sortSelect, handleSort, sortLoading, sortLoadingError } = handleDataSort({
		userAuth,
		dispatch,
		defaultSelectOption: 'ALL ACCOUNTS',
		setDataStore: setLogs,
		setSortArgs: (event) => (event.target.value === 'ALL ACCOUNTS' ? '' : event.target.value),
		fetchUrl: API_ROUTES.GET_ACTIVITY_LOGS,
		prefetchEvent: () => router.push(APP_ROUTES.ACTIVITY_LOGS),
		queryParam: 'account',
	});

	const backgroundColor = (deed) => {
		return 'bg-white';
	};

	return (
		<AdminLayout
			metatags={{ meta_title: `Activity Logs | ${SITE_DATA.NAME}` }}
			pageIcon={<WebStoriesIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Activity Logs'}>
			<div className='w-full grid xss:grid-cols-1 md:grid-cols-2 p-0 m-0 items-start relative'>
				<Paper className={`col-span-1 p-3 rounded-[5px] border md:fixed md:right-[20px] md:top[35%] mb-3`}>
					<div className='font-medium-custom mb-4 w-full'>Sort By</div>
					<Box sx={{ minWidth: 120, minHeight: 20, mt: { xs: 3, sm: 3, md: 0 } }}>
						<FormControl fullWidth size='small'>
							<InputLabel id='admin-level-select'>Account</InputLabel>
							<Select labelId='admin-level-select' value={sortSelect} label='Sort By' onChange={handleSort}>
								<MenuItem value={MEMBER_ROLES.MASTER}>Master Admins</MenuItem>
								<MenuItem value={MEMBER_ROLES.MANAGER}>Manager Admins</MenuItem>
								<MenuItem value={'ALL ADMINS'}>All Admins</MenuItem>
								<MenuItem value={MEMBER_ROLES.USER}>Users Accounts</MenuItem>
								<MenuItem value={'ALL ACCOUNTS'}>All Accounts</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box sx={{ minWidth: 120, minHeight: 20, mt: { xs: 3, sm: 3, md: 3 } }}>
						<TextField className='w-full' label='Account Identifiers' size='small' variant='outlined' />
						<div className='w-full mt-2 color-primary text-[13px]'>
							Enter user's email address, mobile number or names to filter results.
						</div>
					</Box>
				</Paper>
				<div className='col-span-1 h-full flex flex-col items-center justify-center rounded-[5px] p-2'>
					{sortLoading && <CircularProgress style={{ color: 'var(--color-primary)', height: '50px', width: '50px' }} />}

					{!sortLoading &&
						logs.map((log, i) => (
							<div key={i} className='w-full my-3 flex'>
								<Avatar src={log?.user_id?.avatar} className='my-auto mr-2' />
								<div className={`${backgroundColor(log?.deed)} shadow-sm rounded-[8px] text-center px-2 py-2`}>
									<div className='text-[16px]'>{log.details}</div>
									<Divider className='bg-gray-500 my-1' />
									<div className='px-2 flex flex-wrap font-medium-custom w-full justify-between'>
										<div className='my-auto text-[15px] mr-2 text-gray-400'>
											{userAuth?.user?.url === log?.user_id?.url && 'You'}
											{userAuth?.user?.url !== log?.user_id?.url &&
												`${log?.user_id?.lastname ? log?.user_id?.lastname : ''} ${
													log?.user_id?.firstname ? log?.user_id?.firstname : ''
												} ${log?.user_id?.secondname ? log?.user_id?.secondname : ''}`}
										</div>
										<div className='flex'>
											<div className='my-auto text-[14px] text-gray-400'>
												<Moment className='text-[14px]' format='ddd'>
													{log.createdAt}
												</Moment>{' '}
												-{' '}
												<Moment className='text-[14px]' format='LT'>
													{log.createdAt}
												</Moment>
											</div>
											<div className='mx-1 my-auto'>
												<BsDot />
											</div>
											<div className='my-auto text-[14px] text-gray-400'>
												<Moment className='text-[14px]' format='DD'>
													{log.createdAt}
												</Moment>
												/
												<Moment className='text-[14px]' format='MM'>
													{log.createdAt}
												</Moment>
												/
												<Moment className='text-[14px]' format='YY'>
													{log.createdAt}
												</Moment>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					{!sortLoading && logs.length === 0 && <div>No Data Found!</div>}
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
