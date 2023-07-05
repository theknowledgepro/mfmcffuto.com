/** @format */

import React, { useEffect, useState } from 'react';
import UseMediaQuery from '@/utils/use_media_query';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { useDispatch, useSelector } from 'react-redux';
import { AdminProfileDetails } from '..';
import { isLoading } from '@/utils/get_loading_state';
import { createAdmin } from '@/redux/actions/auth_action';
import { LOADING } from '@/config';
import { validate } from '@/utils/validate';
import CircularProgress from '@mui/material/CircularProgress';
import { GLOBALTYPES } from '@/redux/types';

const CreateAdminModal = ({ openModal, setOpenModal, children, adminsStore, setAdminsStore }) => {
	const { auth, loading: loadingStore } = useSelector((state) => state);
	const dispatch = useDispatch();
	const { isMatchWidth } = UseMediaQuery({ vw: '500px' });

	const [Open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpenModal && setOpenModal(false);
		setOpen(false);
	};

	useEffect(() => {
		if (openModal) handleOpen();
		if (!openModal) handleClose();
	}, [openModal]);

	const [newAdminData, setNewAdminData] = useState({});

	const [errors, setErrors] = useState({});
	const [file, setFile] = useState(null);
	const handleCreateAdmin = async () => {
		const { firstname, secondname, lastname, username, email, password, gender, mobile, member_role, avatar } = newAdminData;

		setErrors({
			firstname: !firstname && "Please enter admin's firstname.",
			secondname: !secondname && "Please enter admin's secondname.",
			lastname: !lastname && "Please enter admin's surname.",
			username: !username
				? 'Please set a default username for this admin.'
				: (username.replace(/ /g, '').length < 5 && 'Username should be minimum of 5 characters.') ||
				  validate.containsSpecialChars({ string: username }).errMsg,
			email: !email ? "Please enter admin's email address." : validate.email({ email }).errMsg,
			password:
				(!password && 'Please set a default password for this admin.') || (password.length < 8 && 'Password must be at least 8 characters'),
			gender: !gender && "Please enter admin's gender.",
			mobile: !mobile && "Please enter admin's mobile.",
			member_role: !member_role && "Please enter admin's level.",
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
		if (isLoading(LOADING.CREATE_ADMIN, loadingStore)) return;
		const res = await dispatch(createAdmin({ auth, newAdminData: { ...newAdminData, avatar: file } }));
		if (res?.status === 200) {
			handleClose();
			setNewAdminData({});
			setAdminsStore && setAdminsStore([res?.data?.newAdmin, ...adminsStore]);
		}
	};

	return (
		<React.Fragment>
			{children && <span onClick={handleOpen}>{children}</span>}
			<Dialog fullScreen={isMatchWidth} open={Open} onClose={handleClose}>
				<DialogTitle className='flex items-center justify-left w-full'>
					<PersonAdd fontSize='small' sx={{ mr: '3px' }} />
					<span className='fs-16 text-bold'>Create New Admin</span>
				</DialogTitle>

				<DialogContent className='w-full row' dividers>
					<AdminProfileDetails
						adminData={newAdminData}
						setAdminData={setNewAdminData}
						type='CREATEADMIN'
						onEdit={true}
						errors={errors}
						isSubmitting={isLoading(LOADING.CREATE_ADMIN, loadingStore)}
						file={file}
						setFile={setFile}
					/>
				</DialogContent>

				<DialogActions className='w-full flex justify-between items-center'>
					<Button onClick={handleCreateAdmin} className='btn-site w-full mr-2 text-decor-none' variant='contained'>
						{!isLoading(LOADING.CREATE_ADMIN, loadingStore) && (
							<React.Fragment>
								<PersonAdd fontSize='small' sx={{ mr: '5px' }} /> Create New Admin
							</React.Fragment>
						)}
						{isLoading(LOADING.CREATE_ADMIN, loadingStore) && (
							<CircularProgress style={{ color: 'white', height: '20px', width: '20px', marginRight: '5px' }} />
						)}
					</Button>

					{!isLoading(LOADING.CREATE_ADMIN, loadingStore) && (
						<Button onClick={handleClose} className='ml-2 text-decor-none'>
							Cancel
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};

export default CreateAdminModal;
