/** @format */

import React, { useEffect, useState } from 'react';
import UseMediaQuery from '@/utils/use_media_query';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AdminProfileDetails } from '..';
import { isLoading } from '@/utils/get_loading_state';
import { editAdminData } from '@/redux/actions/auth_action';
import { LOADING } from '@/config';
import { validate } from '@/utils/validate';
import CircularProgress from '@mui/material/CircularProgress';
import { FaUserEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';

const EditAdminModal = ({ children, admin }) => {
	const { auth, loading: loadingStore } = useSelector((state) => state);
	const dispatch = useDispatch();
	const router = useRouter();
	const { isMatchWidth } = UseMediaQuery({ vw: '500px' });

	const [Open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [adminData, setAdminData] = useState(admin);

	const [errors, setErrors] = useState({});
	const [file, setFile] = useState(null);
	const handleEditAdmin = async () => {
		const { firstname, secondname, lastname, email, gender, mobile, member_role, avatar } = adminData;

		setErrors({
			firstname: !firstname && "Please enter admin's firstname.",
			secondname: !secondname && "Please enter admin's secondname.",
			lastname: !lastname && "Please enter admin's surname.",
			email: validate.email({ email }).errMsg,
			gender: !gender && "Please enter admin's gender.",
			mobile: !mobile && "Please enter admin's mobile.",
			member_role: !member_role && "Please enter admin's level.",
		});
		if (!firstname || !secondname || !lastname || validate.email({ email }).errMsg || !gender || !mobile || !member_role) return;
		if (isLoading(LOADING.EDIT_ADMIN_DETAILS, loadingStore)) return;
		const res = await dispatch(editAdminData({ auth, adminData: { ...adminData, adminId: admin._id }, avatarFile: file }));
		if (res?.status === 200) {
			handleClose();
			router.push(window.location.href);
		}
	};

	// ON COMPONENT DID UNMOUNT RESTORE DEFAULT STATE
	useEffect(() => {
		return () => {
			setAdminData(admin);
			setErrors({});
			setFile(null);
		};
	}, []);

	return (
		<React.Fragment>
			{children && <span onClick={handleOpen}>{children}</span>}
			<Dialog fullScreen={isMatchWidth} open={Open} onClose={handleClose}>
				<DialogTitle className='flex items-center'>
					<FaUserEdit fontSize='22px' style={{ marginRight: '5px' }} />
					<span>Edit Admin Profile</span>
				</DialogTitle>

				<DialogContent className='w-full row' dividers>
					<AdminProfileDetails
						adminData={adminData}
						setAdminData={setAdminData}
						type='EDITADMIN'
						onEdit={true}
						errors={errors}
						isSubmitting={isLoading(LOADING.EDIT_ADMIN_DETAILS, loadingStore)}
						setFile={setFile}
					/>
				</DialogContent>

				<DialogActions className='w-full flex items-center justify-center'>
					<Button onClick={handleEditAdmin} className='w-full text-decor-none btn-site' variant='contained'>
						{!isLoading(LOADING.EDIT_ADMIN_DETAILS, loadingStore) && (
							<React.Fragment>
								<FaUserEdit fontSize='22px' style={{ marginRight: '5px' }} /> Edit Admin Profile
							</React.Fragment>
						)}
						{isLoading(LOADING.EDIT_ADMIN_DETAILS, loadingStore) && (
							<CircularProgress style={{ color: 'white', height: '20px', width: '20px', marginRight: '5px' }} />
						)}
					</Button>

					{!isLoading(LOADING.EDIT_ADMIN_DETAILS, loadingStore) && (
						<Button onClick={handleClose} className='text-decor-none'>
							Cancel
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};

export default EditAdminModal;
