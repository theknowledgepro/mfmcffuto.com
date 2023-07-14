/** @format */

import { AdminLayout, MuiModal } from '@/components';
import { API_ROUTES, CLOUD_ASSET_BASEURL, APP_ROUTES, LIMITS, MEMBER_ROLES, SITE_DATA } from '@/config';
import React, { useState } from 'react';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';
import AdminController from '@/pages/api/admin/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import ChurchOutlinedIcon from '@mui/icons-material/ChurchOutlined';
import { Box, Button, TextField, CircularProgress, FormControl, InputLabel, MenuItem, Select, Switch, InputAdornment } from '@mui/material';
import { BsDot } from 'react-icons/bs';
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
import { deleteDataAPI, patchFormDataAPI, postFormDataAPI } from '@/utils/api_client_side';

const CreateWorhipEvent = ({ allWorshipDays, session, worshipDay, isEdit }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);

	// console.log({ worshipDay });
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const initialState = worshipDay
		? { ...worshipDay, thumbnail: `${CLOUD_ASSET_BASEURL}/${worshipDay?.thumbnail?.trim()}` }
		: { title: '', description: '', quote: '', quote_author: '', thumbnail: '', day: days[0], venue: '', time: '', published: true };
	const [worshipData, setWorshipData] = useState(initialState);
	const { title, description, quote, quote_author, thumbnail, day, venue, time, published } = worshipData;
	const [file, setFile] = useState(null);
	const handleChangeInput = (e) => {
		const { name, value, checked } = e.target;
		setWorshipData({ ...worshipData, [name]: name === 'published' ? checked : value });
	};

	const handleThumbnailUpload = (event) => {
		const reader = new FileReader();
		const file = event?.target?.files[0];
		const fileType = file?.type?.split('/')[1];
		if (!file) return;
		if (isSubmitting)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Unable to upload file! 🥴<br/>Submission in progress...', title: false } });
		if (validate.file({ fileType, types: ['png', 'jpg', 'jpeg'] }).errMsg)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'File format is Incorrect!' } });

		reader.onload = (upload) => {
			setWorshipData((previousState) => {
				return { ...worshipData, thumbnail: upload.target.result };
			});
		};
		reader.readAsDataURL(file);
		setFile(file);
	};
	const handleCloseModal = () => {
		setOpenModal(false);
		setFile(null);
	};

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const handleCreateWorship = async () => {
		setErrors({
			title: !title && 'This field is required.',
			description: !description && 'This field is required.',
			quote: !quote && 'This field is required.',
			quote_author: !quote_author && 'This field is required.',
			day: !day && 'This field is required.',
			venue: !venue && 'This field is required.',
			time: !time && 'This field is required.',
		});
		if (!title || !description || !quote || !quote_author || !day || !venue || !time) return;
		if (allWorshipDays.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Worship Day with this Title already exists!` } });
		if (!file) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please attach a thumbnail for this worship day!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(
				API_ROUTES.MANAGE_DAYS_OF_WORSHIP,
				{
					...worshipData,
					thumbnail: file,
				},
				session?.token
			);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setWorshipData(initialState);
				router.push(APP_ROUTES.MANAGE_DAYS_OF_WORSHIP);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};
	const handleUpdateWorship = async () => {
		setErrors({
			title: !title && 'This field is required.',
			description: !description && 'This field is required.',
			quote: !quote && 'This field is required.',
			quote_author: !quote_author && 'This field is required.',
			day: !day && 'This field is required.',
			venue: !venue && 'This field is required.',
			time: !time && 'This field is required.',
		});
		if (!title || !description || !quote || !quote_author || !day || !venue || !time) return;
		if (allWorshipDays.filter((index) => index._id !== worshipDay?._id)?.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Worship Day with this Title already exists!` } });
		if (!file && !thumbnail) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please attach a thumbnail for this worship day!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await patchFormDataAPI(
				API_ROUTES.MANAGE_DAYS_OF_WORSHIP,
				{
					...worshipData,
					thumbnail: file ? file : thumbnail,
				},
				session?.token
			);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setWorshipData({ ...worshipData, ...res?.data?.updatedWorshipData });
				router.push(APP_ROUTES.MANAGE_DAYS_OF_WORSHIP);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};
	return (
		<MuiModal
			openModal={openModal}
			setOpenModal={setOpenModal}
			modalSize={'sm'}
			modalTitle={
				<div className='w-full flex items-center justify-start font-medium-custom text-[18px]'>
					{isEdit && <EditIcon fontSize='small' sx={{ mr: '5px' }} />}
					{!isEdit && <ChurchOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />}
					{isEdit ? `${worshipDay?.title}` : 'Add Day of Worship'}
				</div>
			}
			modalBody={
				<div className='w-full'>
					<TextField
						onChange={handleChangeInput}
						value={title}
						color='primary'
						className='w-full mt-6'
						name='title'
						placeholder='e.g Bible Study'
						label='Worship Day Title'
						variant='outlined'
						helperText={errors.title}
						error={errors.title ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<ChurchOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={description}
						color='primary'
						className='w-full mt-6'
						name='description'
						label='Worship Day Description'
						placeholder='Please give an edifying content...'
						variant='standard'
						inputProps={{ maxLength: LIMITS.WORSHIP_DAY_DESCRIPTION_LIMIT }}
						multiline
						helperText={errors.description}
						error={errors.description ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<ChurchOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary text-[13px]'>
						{description?.length} / {LIMITS.WORSHIP_DAY_DESCRIPTION_LIMIT} characters allowed.
					</div>
					<TextField
						onChange={handleChangeInput}
						value={quote}
						color='primary'
						className='w-full mt-6'
						name='quote'
						label='Worship Day Quote'
						placeholder='Please give an edifying content...'
						variant='standard'
						inputProps={{ maxLength: LIMITS.WORSHIP_DAY_QUOTE_LIMIT }}
						multiline
						helperText={errors.quote}
						error={errors.quote ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<ChurchOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary text-[13px]'>
						{quote?.length} / {LIMITS.WORSHIP_DAY_QUOTE_LIMIT} characters allowed.
					</div>
					<TextField
						onChange={handleChangeInput}
						value={quote_author}
						color='primary'
						className='w-full mt-6'
						name='quote_author'
						label='Quote Author'
						placeholder='e.g Ps. 119:105'
						variant='standard'
						helperText={errors.quote_author}
						error={errors.quote_author ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<ChurchOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<Box sx={{ minWidth: 120, minHeight: 20, my: '15px' }}>
						<FormControl fullWidth size='small'>
							<InputLabel id='admin-level-select'>Day</InputLabel>
							<Select name='day' labelId='admin-level-select' value={day} label='Sort By' onChange={handleChangeInput}>
								{days.map((day, index) => (
									<MenuItem key={index} value={day}>
										{day}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
					<TextField
						onChange={handleChangeInput}
						value={time}
						color='primary'
						className='w-full mt-6'
						name='time'
						placeholder='e.g 6:30pm'
						label='Worship Day Time'
						variant='outlined'
						helperText={errors.time}
						error={errors.time ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<ChurchOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={venue}
						color='primary'
						className='w-full mt-6'
						name='venue'
						placeholder='e.g SAAT Auditorium'
						label='Worship Day Venue'
						variant='outlined'
						helperText={errors.venue}
						error={errors.venue ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<ChurchOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className={`${comp_styles.img_input} rounded-[5px] mild-shadow mt-4 flex flex-col items-center justify-center`}>
						{thumbnail && (
							<img
								alt='Select Worhip Day Graphics'
								style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '300px' }}
								className='img-thumbnail'
								src={thumbnail}
							/>
						)}
						{!thumbnail && <div className='font-medium-custom color-primary'>Click to Upload Worhip Day Graphics</div>}
						<input onChange={handleThumbnailUpload} type='file' name='thumbnail' id={`${comp_styles.avatar_input}`} accept='image/*' />
					</div>
					<div className='my-4 w-full'>
						<div className='flex'>
							<BsDot className='color-primary text-[40px] my-auto' />
							<span className='my-auto'>Worship Day Status</span>
						</div>
						<div className='flex'>
							<Switch checked={Boolean(published)} onChange={handleChangeInput} name='published' />
							<span className={`${published ? 'color-primary' : 'text-gray-500'} font-medium-custom my-auto`}>
								{published ? 'Published' : 'Hidden'}
							</span>
						</div>
					</div>
				</div>
			}
			modalActions={
				!isEdit ? (
					<React.Fragment>
						{!isSubmitting && (
							<React.Fragment>
								<Button onClick={handleCreateWorship} className='w-full normal-case btn-site' variant='contained'>
									<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add Day of Worship
								</Button>
								<Button onClick={handleCloseModal} className='normal-case' color='white' variant='contained'>
									<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
								</Button>
							</React.Fragment>
						)}
						{isSubmitting && (
							<CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />
						)}
					</React.Fragment>
				) : (
					<React.Fragment>
						{!isSubmitting && (
							<React.Fragment>
								<Button onClick={handleUpdateWorship} className='w-full normal-case btn-site' variant='contained'>
									<EditIcon fontSize='small' sx={{ mr: '5px' }} /> Update Day of Worship
								</Button>
								<Button onClick={handleCloseModal} className='normal-case' color='white' variant='contained'>
									<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
								</Button>
							</React.Fragment>
						)}
						{isSubmitting && (
							<CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />
						)}
					</React.Fragment>
				)
			}>
			<Button className='normal-case btn-site mx-auto' variant='contained'>
				<ChurchOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />
				{isEdit ? 'Edit Day of Worship' : ' Add Day of Worship'}
			</Button>
		</MuiModal>
	);
};

const DeleteWorhipEvent = ({ session, worshipDay }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleDeleteWorshipEvent = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await deleteDataAPI(`${API_ROUTES.MANAGE_DAYS_OF_WORSHIP}?worshipDay=${worshipDay?._id}`, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setOpenModal(false);
				router.push(APP_ROUTES.MANAGE_DAYS_OF_WORSHIP);
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};
	return (
		<MuiModal
			openModal={openModal}
			setOpenModal={setOpenModal}
			closeOnOverlayClick={true}
			modalSize={'xs'}
			disableDefaultFullScreen={true}
			modalTitle={
				<div className='w-full text-[16px] font-medium-custom flex items-center justify-between'>
					<div>
						Delete <span className='color-primary'>{worshipDay?.title}?</span>
					</div>
				</div>
			}
			modalBody={
				<div className='w-full text-center'>
					<div>Are you sure you want to delete this Worship Day?</div>
					<div>It will be permanently deleted.</div>
				</div>
			}
			modalActions={
				<React.Fragment>
					{!isSubmitting && (
						<React.Fragment>
							<Button
								onClick={handleDeleteWorshipEvent}
								className='w-full normal-case bg-red-600 text-white'
								color='danger'
								variant='contained'>
								<DeleteIcon fontSize='small' sx={{ mr: '5px' }} /> Delete
							</Button>
							<Button onClick={() => setOpenModal(false)} className='w-full btn-site normal-case' variant='contained'>
								<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
							</Button>
						</React.Fragment>
					)}
					{isSubmitting && <CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />}
				</React.Fragment>
			}>
			<Button variant='contained' className='bg-red-600 text-white' sx={{ ml: 1 }}>
				<DeleteIcon />
			</Button>
		</MuiModal>
	);
};

const DaysOfWorship = ({ userAuth, worshipDays }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	const session = useSelector((state) => state.auth);

	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const sortByDay = (array, sortArray) => {
		return [...array].sort((a, b) => sortArray.indexOf(a.day) - sortArray.indexOf(b.day));
	};
	return (
		<AdminLayout
			metatags={{ meta_title: `Days Of Worship | ${SITE_DATA.NAME}` }}
			pageIcon={<ChurchOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Days Of Worship'}>
			<CreateWorhipEvent allWorshipDays={worshipDays} session={session} />
			<div className='w-full grid xss:grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
				{sortByDay(worshipDays, days).map((event, index) => (
					<div className='col-span-1 md:px-1 py-3' key={index}>
						<WorshipEvent cardWrapperClassName='w-full' event={event} />
						<div className='flex items-center justify-center gap-2'>
							<CreateWorhipEvent allWorshipDays={worshipDays} session={session} worshipDay={event} isEdit={true} />
							<DeleteWorhipEvent session={session} worshipDay={event} />
						</div>
					</div>
				))}
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

	// REDIRECT TO DASHBOARD PAGE IF ADMIN IS RESTRICTED TO VIEW THIS PAGE
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.MANAGE_DAYS_OF_WORSHIP, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET PAGE DATA
	const worshipDays = await AdminController.getAllWorshipDays(req, res, true);
	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			worshipDays: worshipDays?.data?.length ? worshipDays?.data : [],
		},
	};
}

export default DaysOfWorship;
