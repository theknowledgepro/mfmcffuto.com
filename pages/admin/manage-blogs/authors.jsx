/** @format */

import React, { useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { AdminLayout, MuiXDataGridTable, MuiModal, SocialIcons } from '@/components';
import { MEMBER_ROLES, API_ROUTES, APP_ROUTES, SITE_DATA, ASSETS } from '@/config';
import { Box, Button, CircularProgress, InputAdornment, Avatar, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDataAPI, patchFormDataAPI, postFormDataAPI } from '@/utils/api_client_side';
import { useRouter } from 'next/router';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { GLOBALTYPES } from '@/redux/types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AuthController from '@/pages/api/auth/controller';
import AdminController from '@/pages/api/admin/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import { DispatchUserAuth } from '@/utils/misc_functions';
import { BsDot } from 'react-icons/bs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import FaceIcon from '@mui/icons-material/Face';
import Face2Icon from '@mui/icons-material/Face2';
import admin_comp_styles from '@/components/admin/admin_components.module.css';
import { validate } from '@/utils/validate';
import FacebookOutlined from '@mui/icons-material/FacebookOutlined';
import Instagram from '@mui/icons-material/Instagram';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Telegram from '@mui/icons-material/Telegram';
import Twitter from '@mui/icons-material/Twitter';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Moment from 'react-moment';
import Link from 'next/link';

const CreateAuthorFunctionality = ({ isEdit, author, allAuthors, session }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);

	const initialState = {
		firstname: '',
		secondname: '',
		lastname: '',
		email: '',
		mobile: '',
		avatar: SITE_DATA.DEFAULT_MALE_AVATAR.src,
		gender: '',
		member_role: MEMBER_ROLES.AUTHOR,
		about: '',
		social_handles: { facebookUrl: '', OutlinedUrl: '', whatsappUrl: '', linkedInUrl: '', twitterUrl: '', telegramUrl: '' },
		...author,
	};
	const [authorData, setAuthorData] = useState(initialState);
	const { firstname, secondname, lastname, email, mobile, avatar, gender, about, social_handles } = authorData;
	const [file, setFile] = useState(null);

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setAuthorData({ ...authorData, [name]: value });
	};

	const handleChangeAvatar = (e) => {
		setAuthorData({
			...authorData,
			avatar: file ? avatar : e.target?.value === 'Female' ? ASSETS.FEMALE_AVATAR.src : ASSETS.MALE_AVATAR.src,
		});
	};

	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleAvatarUpload = (event) => {
		const reader = new FileReader();
		const file = event?.target?.files[0];
		const fileType = file?.type?.split('/')[1];
		if (!file) return;
		if (isSubmitting)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Unable to upload file! 🥴<br/>Submission in progress...', title: false } });
		if (validate.file({ fileType, types: ['png', 'jpg', 'jpeg'] }).errMsg)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'File format is Incorrect!' } });

		reader.onload = (upload) => {
			setAuthorData((previousState) => {
				return { ...authorData, avatar: upload.target.result };
			});
		};
		reader.readAsDataURL(file);
		setFile(file);
	};

	const [errors, setErrors] = useState({});
	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleAddAuthor = async () => {
		setErrors({
			firstname: !firstname && 'This field is required.',
			secondname: !secondname && 'This field is required.',
			lastname: !lastname && 'This field is required.',
			email: !email && 'This field is required.',
			mobile: !mobile && 'This field is required.',
			gender: !gender && 'This field is required.',
			about: !about && 'This field is required.',
		});
		if (!firstname || !secondname || !lastname || !email || !mobile || !gender || !about) return;
		if (
			allAuthors
				.filter((index) => index?.url !== author?.url)
				.find((index) => index?.firstname === firstname && index?.secondname === secondname && index?.lastname === lastname)
		)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `An author with these names alredy exist!` } });
		if (allAuthors.filter((index) => index?.url !== author?.url).find((index) => index?.email === email))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `This email is already used for an author!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(API_ROUTES.MANAGE_BLOG_AUTHORS, { ...authorData, avatar: file ? file : '' }, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setAuthorData(initialState);
				router.push(APP_ROUTES.MANAGE_BLOG_AUTHORS);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	const handleEditAuthor = async () => {
		setErrors({
			firstname: !firstname && 'This field is required.',
			secondname: !secondname && 'This field is required.',
			lastname: !lastname && 'This field is required.',
			email: !email && 'This field is required.',
			mobile: !mobile && 'This field is required.',
			gender: !gender && 'This field is required.',
			about: !about && 'This field is required.',
		});
		if (!firstname || !secondname || !lastname || !email || !mobile || !gender || !about) return;
		if (
			allAuthors
				.filter((index) => index?.url !== author?.url)
				.find((index) => index?.firstname === firstname && index?.secondname === secondname && index?.lastname === lastname)
		)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `An author with these names alredy exist!` } });
		if (allAuthors.filter((index) => index?.url !== author?.url).find((index) => index?.email === email))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `This email is already used for an author!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await patchFormDataAPI(API_ROUTES.MANAGE_BLOG_AUTHORS, { ...authorData, avatar: file ? file : '' }, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setAuthorData({ ...authorData, ...res?.data?.updatedAuthorData });
				router.push(APP_ROUTES.MANAGE_BLOG_AUTHORS);
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
			modalTitle={
				<div className='w-full flex items-center justify-between'>
					<Button className='text-decor-none btn-site' variant='contained'>
						{isEdit && <EditIcon fontSize='small' sx={{ mr: '5px' }} />}
						{!isEdit && <AccountCircleOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />}
						{isEdit ? `${author?.fullname}` : 'Add Article Author'}
					</Button>
				</div>
			}
			modalBody={
				<div className='w-full'>
					<TextField
						onChange={handleChangeInput}
						value={firstname}
						color='primary'
						className='w-full mt-8'
						name='firstname'
						label='Firstname'
						variant='outlined'
						helperText={errors.firstname}
						error={errors.firstname ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<AccountCircleOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={secondname}
						color='primary'
						className='w-full mt-8'
						name='secondname'
						label='Middlename'
						variant='outlined'
						helperText={errors.secondname}
						error={errors.secondname ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<AccountCircleOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={lastname}
						color='primary'
						className='w-full mt-8'
						name='lastname'
						label='Surname'
						variant='outlined'
						helperText={errors.lastname}
						error={errors.lastname ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<AccountCircleOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={email}
						color='primary'
						className='w-full mt-8'
						name='email'
						label='Email Address'
						variant='standard'
						helperText={errors.email}
						error={errors.email ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<EmailOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						color='primary'
						className='w-full mt-8'
						name='mobile'
						label='Phone'
						variant='standard'
						helperText={errors.mobile}
						error={errors.mobile ? true : false}
						sx={{
							'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
								WebkitAppearance: 'none',
								margin: 0,
							},
							'input[type=number]': {
								MozAppearance: 'textfield',
							},
						}}
						defaultValue={mobile}
						inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', type: 'number' }}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<CallOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={about}
						color='primary'
						className='w-full mt-8'
						name='about'
						label="Author's Bio"
						variant='standard'
						helperText={errors.about}
						error={errors.about ? true : false}
						multiline
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<AccountCircleOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<FormControl
						error={errors.gender ? true : false}
						className='flex flex-col items-center justify-center my-5'
						sx={{ width: '100%', mt: '10px', padding: '0 2px' }}>
						<FormLabel id='gender' className='mt-2 mb-4' sx={{ fontWeight: '600', display: 'flex' }}>
							<FaceIcon sx={{ mr: 1, fontSize: 22, color: gender === 'Male' ? SITE_DATA.THEME_COLOR : '#0009' }} /> Gender{' '}
							<Face2Icon sx={{ ml: 1, fontSize: 20, color: gender === 'Female' ? SITE_DATA.THEME_COLOR : '#0009' }} />
						</FormLabel>
						<RadioGroup
							className='flex-centered-row'
							row
							aria-labelledby='gender'
							name='gender'
							value={gender}
							color='secondary'
							onChange={(e) => {
								handleChangeAvatar(e);
								handleChangeInput(e);
							}}>
							<FormControlLabel value='Male' control={<Radio />} label='Male' />
							<FormControlLabel value='Female' control={<Radio />} label='Female' />
						</RadioGroup>
					</FormControl>
					<div className={`${admin_comp_styles.avatar_wrapper} mt-4 flex flex-col items-center justify-center col-12 col-md-5`}>
						<div className='w-full text-center font-medium-custom mb-6 color-primary'>Upload Author's Profile Photo</div>
						{<img alt='Profile Photo' className={admin_comp_styles.create_admin_avatar} src={avatar} />}
						<input onChange={handleAvatarUpload} type='file' name='avatar' id={`${admin_comp_styles.avatar_input}`} accept='image/*' />
					</div>

					<div className='w-full mt-6'>
						<div className='w-full text-center font-medium-custom mt-6 color-primary'>Author's Social Media Handles</div>
						<div className='line-height-1b mb-5 text-center text-[13px] text-red-500'>
							Please ensure these social media handles are free of improper or <i className='line-height-1b text-[13px]'>defiling</i> content<span className='text-red-700'>!</span>
						</div>
						<TextField
							onChange={(e) =>
								setAuthorData({ ...authorData, social_handles: { ...authorData?.social_handles, linkedInUrl: e.target.value } })
							}
							value={authorData?.social_handles?.linkedInUrl}
							placeholder='Please enter the full link address with https://'
							color='primary'
							className='w-full'
							label='Linked URL'
							variant='standard'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<LinkedIn sx={{ color: SITE_DATA.THEME_COLOR }} />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							onChange={(e) =>
								setAuthorData({ ...authorData, social_handles: { ...authorData?.social_handles, twitterUrl: e.target.value } })
							}
							value={authorData?.social_handles?.twitterUrl}
							color='primary'
							className='w-full mt-6'
							placeholder='Please enter the full link address with https://'
							label='Twitter URL'
							variant='standard'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Twitter sx={{ color: SITE_DATA.THEME_COLOR }} />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							onChange={(e) =>
								setAuthorData({ ...authorData, social_handles: { ...authorData?.social_handles, facebookUrl: e.target.value } })
							}
							value={authorData?.social_handles?.facebookUrl}
							color='primary'
							className='w-full mt-6'
							placeholder='Please enter the full link address with https://'
							label='Facebook URL'
							variant='standard'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start' className='flex aitems-center justify-center'>
										<FacebookOutlined style={{ color: SITE_DATA.THEME_COLOR }} />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							onChange={(e) =>
								setAuthorData({ ...authorData, social_handles: { ...authorData?.social_handles, telegramUrl: e.target.value } })
							}
							value={authorData?.social_handles?.telegramUrl}
							color='primary'
							className='w-full mt-6'
							placeholder='Please enter the full link address with https://'
							label='Telegram URL'
							variant='standard'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start' className='flex aitems-center justify-center'>
										<Telegram style={{ color: SITE_DATA.THEME_COLOR }} />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							onChange={(e) =>
								setAuthorData({ ...authorData, social_handles: { ...authorData?.social_handles, instagramUrl: e.target.value } })
							}
							value={authorData?.social_handles?.instagramUrl}
							color='primary'
							className='w-full mt-6'
							placeholder='Please enter the full link address with https://'
							label='Instagram URL'
							variant='standard'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start' className='flex aitems-center justify-center'>
										<Instagram style={{ color: SITE_DATA.THEME_COLOR }} />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							onChange={(e) =>
								setAuthorData({ ...authorData, social_handles: { ...authorData?.social_handles, whatsappUrl: e.target.value } })
							}
							value={authorData?.social_handles?.whatsappUrl}
							color='primary'
							className='w-full mt-6'
							placeholder='e.g +2347041960963'
							label='WhatsApp Contact'
							variant='standard'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start' className='flex aitems-center justify-center'>
										<WhatsApp style={{ color: SITE_DATA.THEME_COLOR }} />
									</InputAdornment>
								),
							}}
						/>
					</div>
				</div>
			}
			modalActions={
				!isEdit ? (
					<React.Fragment>
						{!isSubmitting && (
							<React.Fragment>
								<Button onClick={handleAddAuthor} className='w-full text-decor-none btn-site' variant='contained'>
									<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add Article Author
								</Button>
								<Button onClick={handleCloseModal} className='text-decor-none' color='white' variant='contained'>
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
								<Button onClick={handleEditAuthor} className='w-full text-decor-none btn-site' variant='contained'>
									<EditIcon fontSize='small' sx={{ mr: '5px' }} /> Update Article Author
								</Button>
								<Button onClick={handleCloseModal} className='text-decor-none' color='white' variant='contained'>
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
			{isEdit && (
				<Button className='text-decor-none btn-site' variant='contained'>
					<EditIcon />
				</Button>
			)}
			{!isEdit && (
				<Button className='text-decor-none btn-site' variant='contained'>
					<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add Article Author
				</Button>
			)}
		</MuiModal>
	);
};

const ViewAuthorDetailsModal = ({ session, author, allAuthors }) => {
	const [openModal, setOpenModal] = useState(false);

	const RenderTitle = ({ title }) => {
		return (
			<div className='flex mt-4' style={{ marginLeft: '-10px' }}>
				<BsDot className='color-primary text-[40px] my-auto' />
				<span className='my-auto font-medium-custom'>{title}</span>
			</div>
		);
	};

	return (
		<MuiModal
			openModal={openModal}
			setOpenModal={setOpenModal}
			closeOnOverlayClick={true}
			modalTitle={
				<div className='w-full flex items-center justify-between'>
					<Button className='text-decor-none btn-site' variant='contained'>
						<AccountCircleOutlinedIcon fontSize='small' sx={{ mr: '5px' }} /> {author?.fullname}
					</Button>
				</div>
			}
			modalBody={
				<React.Fragment>
					<div className='flex p-2 items-center justify-center mt-3 flex-col'>
						<div
							className='border border-zinc-300 mb-2 flex flex-col items-center justify-center rounded-[10px] p-2'
							style={{ width: '250px' }}>
							<Avatar src={author?.avatar} sx={{ width: '100px', height: '100px' }} alt={author?.firstname} className={`mild-shadow`} />
							<div className='mt-2 fs-8 text-center'>{`${author?.lastname ? author?.lastname : ''} ${
								author?.firstname ? author?.firstname : ''
							} ${author?.secondname ? author?.secondname : ''}`}</div>
							<div className='mt-1 text-[12px] color-primary font-medium-custom text-center'>
								{author?.member_role === MEMBER_ROLES.AUTHOR && 'Article Author'}
							</div>
							<div className='mt-1 text-[12px] text-gray-400 text-center'>
								Author Added On:
								<div className='rounded-[10px] w-full px-2'>
									<Moment className='text-[14px]' format='LT'>
										{author?.createdAt}
									</Moment>{' '}
									-{' '}
									<Moment className='text-[14px]' format='ddd'>
										{author?.createdAt}
									</Moment>
									,
									<span className='ms-1'>
										<Moment className='text-[14px]' format='DD'>
											{author?.createdAt}
										</Moment>
										/
										<Moment className='text-[14px]' format='MM'>
											{author?.createdAt}
										</Moment>
										/
										<Moment className='text-[14px]' format='YY'>
											{author?.createdAt}
										</Moment>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Firstname' />
						<div className='border-b border-zinc-300 w-full p-2'>{author?.firstname}</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Middlename' />
						<div className='border-b border-zinc-300 w-full p-2'>{author?.secondname}</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Surname' />
						<div className='border-b border-zinc-300 w-full p-2'>{author?.lastname}</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Gender' />
						<div className='border-b border-zinc-300 w-full p-2'>{author?.gender}</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Email Address' />
						<div className='border-b border-zinc-300 w-full p-2'>
							<Link href={`mailto:${author?.email}`} className='color-primary'>
								{author?.email}
							</Link>
						</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Mobile Number' />
						<div className='border-b border-zinc-300 w-full p-2'>
							<Link href={`tel:${author?.mobile}`} className='color-primary'>
								{author?.mobile}
							</Link>
						</div>
					</div>
					<div className='flex mt-3 flex-col'>
						<RenderTitle title="Author's Bio" />
						<div className='border-b border-zinc-300 w-full p-2'>{author?.about}</div>
					</div>
					<div className='flex mt-3 flex-col'>
						<RenderTitle title="Author's Social Media Handles" />
						<div className='border-b border-zinc-300 w-full p-2'>
							<SocialIcons sitesettings={{ ...author?.social_handles }} defaultURL={'https://'} />
						</div>
					</div>

					<div className='border-top border-zinc-300 pt-3 flex mt-3 flex-col'>
						<RenderTitle title='Last Updated' />
						<div className='w-full p-2'>
							<Moment className='text-[14px]' format='LT'>
								{author?.updatedAt}
							</Moment>{' '}
							-{' '}
							<Moment className='text-[14px]' format='ddd'>
								{author?.updatedAt}
							</Moment>
							,
							<span className='ms-1'>
								<Moment className='text-[14px]' format='DD'>
									{author?.updatedAt}
								</Moment>
								/
								<Moment className='text-[14px]' format='MM'>
									{author?.updatedAt}
								</Moment>
								/
								<Moment className='text-[14px]' format='YY'>
									{author?.updatedAt}
								</Moment>
							</span>
						</div>
					</div>

					{author?.articles?.length === 0 && (
						<div className='flex flex-col mt-3'>
							<RenderTitle title='No Blogs Associated with this Author' />
						</div>
					)}
					{author?.articles?.length > 0 && (
						<div className='flex flex-col mt-3'>
							<RenderTitle title='Blogs Associated with this Author' />
							<div className='border-b border-zinc-300 w-full p-2'>
								{author?.articles?.map((blog, i) => (
									<BlogThumb key={i} blog={blog} isAdminPanelView={true} isLast={i === author?.articles?.length - 1} />
								))}
							</div>
						</div>
					)}
				</React.Fragment>
			}
			modalActions={
				<React.Fragment>
					<CreateAuthorFunctionality isEdit={true} allAuthors={allAuthors} session={session} author={author} />
					<Button onClick={() => setOpenModal(false)} className='text-decor-none ml-2' color='white' variant='contained'>
						<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Close
					</Button>
				</React.Fragment>
			}>
			<div className='w-full flex items-center justify-left'>
				<Avatar src={author?.avatar} alt={author?.firstname} className={``} />
				<span className='ml-2 my-auto cursor-pointer'>{author?.fullname}</span>
			</div>
		</MuiModal>
	);
};

const DeleteAuthorModal = ({ session, author }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleDeleteAuthor = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await deleteDataAPI(`${API_ROUTES.MANAGE_BLOG_AUTHORS}?author=${author?.url}`, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setOpenModal(false);
				router.push(APP_ROUTES.MANAGE_BLOG_AUTHORS);
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
				<div className='w-full fs-6 font-medium-custom flex items-center justify-between'>
					<div>
						Delete <span className='color-primary'>{author?.fullname}?</span>
					</div>
				</div>
			}
			modalBody={
				<div className='w-full text-center'>
					<div>Are you sure you want to delete this author?</div>
					<div className='text-red-500'>All Articles written by this author will also be deleted permanently!</div>
				</div>
			}
			modalActions={
				<React.Fragment>
					{!isSubmitting && (
						<React.Fragment>
							<Button
								onClick={handleDeleteAuthor}
								className='w-full text-decor-none bg-red-600 text-white'
								color='danger'
								variant='contained'>
								<DeleteIcon fontSize='small' sx={{ mr: '5px' }} /> Delete
							</Button>
							<Button onClick={() => setOpenModal(false)} className='w-full btn-site text-decor-none' variant='contained'>
								<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
							</Button>
						</React.Fragment>
					)}
					{isSubmitting && <CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />}
				</React.Fragment>
			}>
			<Button variant='contained' color='danger' sx={{ ml: 1 }} size='small'>
				<DeleteIcon />
			</Button>
		</MuiModal>
	);
};

const BlogAuthors = ({ authors, userAuth }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	const session = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const router = useRouter();

	const columns = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'fullname',
			headerName: 'Names',
			width: 350,
			renderCell: (params) => {
				return <ViewAuthorDetailsModal session={session} author={params?.row} allAuthors={authors} />;
			},
		},
		{ field: 'articleCount', headerName: 'No. of Articles & Blogs', type: 'number', align: 'center', width: 200 },
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 200,
			renderCell: (params) => {
				return (
					<React.Fragment>
						<CreateAuthorFunctionality isEdit={true} allAuthors={authors} session={session} author={params?.row} />
						<DeleteAuthorModal key={params?.row?.id} session={session} author={params?.row} />
					</React.Fragment>
				);
			},
		},
	];

	const rows = authors?.map((author, index) => {
		return {
			id: index + 1,
			url: author?.url,
			fullname: `${author?.lastname?.charAt(0)?.toUpperCase()}${author?.lastname?.slice(1, undefined)?.toLowerCase()} ${author?.firstname
				?.charAt(0)
				?.toUpperCase()}${author?.firstname?.slice(1, undefined)?.toLowerCase()} ${author?.secondname}`,
			firstname: author?.firstname,
			secondname: author?.secondname,
			lastname: author?.lastname,
			email: author?.email,
			mobile: author?.mobile,
			avatar: author?.avatar,
			gender: author?.gender,
			member_role: author?.member_role,
			about: author?.about,
			social_handles: author?.social_handles,
			articles: author?.articles,
			articleCount: author?.articles?.length,
			updatedAt: author?.updatedAt,
			createdAt: author?.createdAt,
		};
	});

	return (
		<AdminLayout
			metatags={{ meta_title: `Article Authors | ${SITE_DATA.OFFICIAL_NAME}` }}
			pageIcon={<AccountCircleOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Article Authors'}>
			<Box
				sx={{
					display: 'flex',
					alignItems: { md: 'center' },
					flexFlow: { xs: 'column', sm: 'column', md: 'row' },
					mb: 3,
					width: '100%',
					justifyContent: 'space-between',
				}}>
				<div className='mt-3'>
					<CreateAuthorFunctionality allAuthors={authors} session={session} />
				</div>
			</Box>{' '}
			<MuiXDataGridTable columns={columns} rows={rows} checkboxSelection />
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
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.MANAGE_BLOG_AUTHORS, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET BLOG AUTHORS
	const blogAuthors = await AdminController.getBlogAuthors(req, res, true);

	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			authors: blogAuthors?.length ? blogAuthors : [],
		},
	};
}

export default BlogAuthors;
