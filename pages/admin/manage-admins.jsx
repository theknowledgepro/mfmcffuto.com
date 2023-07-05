/** @format */

import React, { useEffect, useState } from 'react';
import { AdminLayout, AdminDataCard, CreateAdminModal } from '@/components';
import { API_ROUTES, APP_ROUTES, MEMBER_ROLES, SITE_DATA } from '@/config';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import { DispatchUserAuth } from '@/utils/misc_functions';
import handleDataSort from '@/utils/handle_data_sort';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { useDispatch } from 'react-redux';
import AdminController from '@/pages/api/admin/controller';
import AuthController from '@/pages/api/auth/controller';

const Dashboard = ({ userAuth, allAdmins }) => {
	const dispatch = useDispatch();
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });

	// ** PAGE DATA STORE
	const [admins, setAdmins] = useState(allAdmins);

	// ** ADMIN SORT FUNCTIONALITY
	const { sortSelect, handleSort, sortLoading, sortLoadingError } = handleDataSort({
		userAuth,
		dispatch,
		defaultSelectOption: 'ALL',
		setDataStore: setAdmins,
		setSortArgs: (event) => (event.target.value === 'ALL' ? '' : event.target.value),
		fetchUrl: API_ROUTES.GET_ALL_ADMINS,
		queryParam: 'member_role',
	});

	return (
		<AdminLayout
			metatags={{ meta_title: `Manage Admins | ${SITE_DATA.NAME}` }}
			pageIcon={<AdminPanelSettingsTwoToneIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Manage Admins'}>
			<Box
				sx={{
					display: 'flex',
					alignItems: { md: 'center' },
					flexFlow: { xs: 'column', sm: 'column', md: 'row' },
					mb: 3,
					width: '100%',
					justifyContent: 'space-between',
				}}>
				<Box sx={{ display: 'flex' }}>
					<CreateAdminModal adminsStore={admins} setAdminsStore={setAdmins}>
						<Button className='text-decor-none btn-site' variant='contained'>
							<PersonAdd fontSize='small' sx={{ mr: '5px' }} /> Create New Admin
						</Button>
					</CreateAdminModal>
				</Box>
				<Box sx={{ minWidth: 120, minHeight: 20, mt: { xs: 3, sm: 3, md: 0 } }}>
					<FormControl fullWidth size='small'>
						<InputLabel id='admin-level-select'>Sort By</InputLabel>
						<Select labelId='admin-level-select' value={sortSelect} label='Sort By' onChange={handleSort}>
							<MenuItem value={MEMBER_ROLES.MASTER}>Master Admins</MenuItem>
							<MenuItem value={MEMBER_ROLES.MANAGER}>Manager Admins</MenuItem>
							<MenuItem value={'ALL'}>All Admins</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</Box>

			<div className='w-full row'>
				{admins.map((admin, i) => (
					<AdminDataCard adminsStore={admins} setAdminsStore={setAdmins} admin={admin} key={i} />
				))}
				{admins.length === 0 && sortSelect !== 'ALL' && (
					<div className='text-gray-600 md:text-2xl my-5 flex flex-col items-center justify-center w-full'>
						No Admins found for this Admin Level
					</div>
				)}
			</div>

			<div className='flex flex-col items-center justify-center w-full mt-5 mb-3'>
				{sortLoading && <CircularProgress style={{ color: 'var(--color-primary)', height: '40px', width: '40px' }} />}
				{sortLoadingError && (
					<div style={{ lineHeight: '1.5rem' }} className='text-gray-500 text-center text-sm mt-3'>
						Ooops! There was a problem sorting admins. <br /> Please check your internet connection!
					</div>
				)}
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
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.MANAGE_ADMINS, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET PAGE DATA
	const allAdmins = await AdminController.getAllAdmins(req, res, true);
	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			allAdmins: allAdmins?.data?.results ? allAdmins?.data?.results : [],
		},
	};
}

export default Dashboard;
