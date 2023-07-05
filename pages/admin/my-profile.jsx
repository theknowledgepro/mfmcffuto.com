/** @format */

import { AdminLayout, AdminProfileDetails } from '@/components';
import { APP_ROUTES, LOADING, MEMBER_ROLES, SITE_DATA } from '@/config';
import React, { useState } from 'react';
import AuthController from '../api/auth/controller';
import { DispatchUserAuth } from '@/utils/misc_functions';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { FaUserEdit } from 'react-icons/fa';
import { editAdminData } from '@/redux/actions/auth_action';
import { validate } from '@/utils/validate';
import CircularProgress from '@mui/material/CircularProgress';
import { isLoading } from '@/utils/get_loading_state';

const MyProfile = ({ userAuth }) => {
	const { auth, loading: loadingStore } = useSelector((state) => state);
	const dispatch = useDispatch();

	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });

	const [adminData, setAdminData] = useState(userAuth?.user);
	const [editDetails, setEditDetails] = React.useState(null);
	const handleToggleEditDetails = () => {
		editDetails && setAdminData(userAuth?.user);
		setEditDetails(!editDetails);
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	const [errors, setErrors] = useState({});
	const [file, setFile] = useState(null);
	const handleSaveChanges = async () => {
		const { firstname, secondname, lastname, username, email, password, gender, mobile, member_role, avatar } = adminData;

		setErrors({
			firstname: !firstname && 'Please enter your firstname.',
			secondname: !secondname && 'Please enter your secondname.',
			lastname: !lastname && 'Please enter your surname.',
			username: validate.username({ username }).errMsg,
			email: validate.email({ email }).errMsg,
			password:
				(!password && 'Please set a default password for this admin.') || (password.length < 8 && 'Password must be at least 8 characters'),
			gender: !gender && 'Please enter your gender.',
			mobile: !mobile && 'Please enter your mobile.',
			member_role: !member_role && 'Please select your admin level.',
		});
		if (
			!firstname ||
			!secondname ||
			!lastname ||
			!username ||
			username.replace(/ /g, '').length < 5 ||
			validate.containsSpecialChars({ string: username }).errMsg ||
			validate.email({ email }).errMsg ||
			!password ||
			password.length < 8 ||
			!gender ||
			!mobile ||
			!member_role
		)
			return;
		if (isLoading(LOADING.EDIT_ADMIN, loadingStore)) return;
		const res = await dispatch(
			editAdminData({ auth, adminData: { ...adminData, adminId: userAuth?.user?._id, avatar: file }, sameAsLoggedInUser: true })
		);
		if (res?.status === 200) setEditDetails(!editDetails);
	};

	return (
		<AdminLayout
			SeoData={{ meta_title: `My Profile | ${SITE_DATA.NAME}` }}
			pageIcon={<AccountCircleOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={`My Profile - ${
				auth?.user?.member_role?.charAt(0)?.toUpperCase() + auth?.user?.member_role?.substring(1).toLowerCase() + ' Admin'
			}`}>
			<div className='w-full row'>
				<AdminProfileDetails
					adminData={adminData}
					setAdminData={setAdminData}
					onEdit={editDetails}
					errors={errors}
					isSubmitting={isLoading(LOADING.EDIT_ADMIN, loadingStore)}
					setFile={setFile}
					type={'EDITMYPROFILE'}
				/>
			</div>

			<div className='w-full flex-center'>
				{!isLoading(LOADING.EDIT_ADMIN, loadingStore) && (
					<Button onClick={handleToggleEditDetails} variant='outlined' className='text-decor-none mr-5'>
						<FaUserEdit fontSize='22px' style={{ marginRight: '5px' }} /> {!editDetails ? 'Edit My Profile' : 'Cancel'}
					</Button>
				)}

				{editDetails && adminData !== userAuth?.user && (
					<React.Fragment>
						{isLoading(LOADING.EDIT_ADMIN, loadingStore) && (
							<CircularProgress style={{ color: SITE_DATA.THEME_COLOR, height: '50px', width: '50px', margin: 'auto' }} />
						)}

						{!isLoading(LOADING.EDIT_ADMIN, loadingStore) && (
							<Button onClick={handleSaveChanges} className='btn-site text-white text-decor-none'>
								<FaUserEdit fontSize='22px' style={{ marginRight: '5px' }} /> Save Changes
							</Button>
						)}
					</React.Fragment>
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

	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
		},
	};
}

export default MyProfile;
