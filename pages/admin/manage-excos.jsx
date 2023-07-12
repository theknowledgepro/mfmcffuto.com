/** @format */

import { AdminLayout, MuiModal } from '@/components';
import { API_ROUTES, CLOUD_ASSET_BASEURL, ACADEMIC_SESSIONS, S3FOLDERS, APP_ROUTES, ASSETS, MEMBER_ROLES, SITE_DATA } from '@/config';
import React, { useState } from 'react';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';
import AdminController from '@/pages/api/admin/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import {
	IconButton,
	Avatar,
	Paper,
	Box,
	Button,
	TextField,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	InputAdornment,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
} from '@mui/material';
import { BsDot } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import comp_styles from '@/components/components.module.css';
import { GLOBALTYPES } from '@/redux/types';
import { validate } from '@/utils/validate';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { deleteDataAPI, postFormDataAPI } from '@/utils/api_client_side';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import FaceIcon from '@mui/icons-material/Face';
import Face2Icon from '@mui/icons-material/Face2';
import FacebookOutlined from '@mui/icons-material/FacebookOutlined';
import Instagram from '@mui/icons-material/Instagram';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Telegram from '@mui/icons-material/Telegram';
import Twitter from '@mui/icons-material/Twitter';
import WhatsApp from '@mui/icons-material/WhatsApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import admin_comp_styles from '@/components/admin/admin_components.module.css';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';

const DeleteExcoGroup = ({ session, allGroups, setAllGroups, group, isNew }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleDeleteWorshipEvent = async () => {
		if (isNew) {
			setAllGroups(allGroups.filter((index) => !Object.keys(index).length === 0));
			setOpenModal(false);
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
			return;
		}
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await deleteDataAPI(`${API_ROUTES.MANAGE_EXCOS}?group=${group?.name}`, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setOpenModal(false);
				router.push(APP_ROUTES.MANAGE_EXCOS);
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
					{!isNew && (
						<div>
							Delete <span className='color-primary'>{group?.name}?</span>
						</div>
					)}
					{isNew && 'Remove New Executives Group?'}
				</div>
			}
			modalBody={
				<div className='w-full text-center'>
					<div>Are you sure you want to delete this Executive Group?</div>
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

const ExcoData = ({ session, exco, allExcos, isNew, handleUpdateExco }) => {
	const dispatch = useDispatch();
	const [openModal, setOpenModal] = useState(false);

	const initialState = exco
		? { ...exco, avatar: exco?.avatar ? `${CLOUD_ASSET_BASEURL}/${exco?.avatar?.trim()}` : ASSETS.MALE_AVATAR.src }
		: {
				firstname: '',
				secondname: '',
				lastname: '',
				email: '',
				mobile: '',
				avatar: ASSETS.MALE_AVATAR.src,
				gender: '',
				about: '',
				social_handles: {},
				hobbies: [],
				skills: [],
				department: '',
				office: '',
				uniqueID: allExcos.length + 1,
				...exco,
		  };
	const [excoData, setExcoData] = useState(initialState);
	const {
		firstname = '',
		secondname = '',
		lastname = '',
		email = '',
		mobile = '',
		avatar = '',
		gender = '',
		about = '',
		social_handles = {},
		hobbies = [],
		skills = [],
		department = '',
		office = '',
		uniqueID = exco?.uniqueID ?? allExcos.length + 1,
	} = excoData;
	const [file, setFile] = useState(null);

	// ** EXCO HOBBIES
	const [excoHobbies, setExcoHobbies] = useState(excoData?.hobbies?.length ? excoData?.hobbies : ['']);
	const handleHobbyTextInput = (index, event) => {
		let data = [...excoHobbies];
		data[index] = event.target.value;
		setExcoHobbies(data);
	};
	const handleAddExcoHobby = () => setExcoHobbies([...excoHobbies, '']);
	const handleRemoveExcoHobby = (index) => {
		let data = [...excoHobbies];
		data.splice(index, 1);
		setExcoHobbies(data);
	};

	// ** EXCO SKILLS AND TALENTS
	const [excoSkills, setExcoSkills] = useState(excoData?.skills?.length ? excoData?.skills : ['']);
	const handleSkillsTextInput = (index, event) => {
		let data = [...excoSkills];
		data[index] = event.target.value;
		setExcoSkills(data);
	};
	const handleAddExcoSkills = () => setExcoSkills([...excoSkills, '']);
	const handleRemoveExcoSkills = (index) => {
		let data = [...excoSkills];
		data.splice(index, 1);
		setExcoSkills(data);
	};

	const handleChangeInput = (e) => {
		const { name, value, checked } = e.target;
		setExcoData({ ...excoData, [name]: value });
	};
	const handleChangeAvatar = (e) => {
		setExcoData({
			...excoData,
			avatar: file ? avatar : e.target?.value === 'Female' ? ASSETS.FEMALE_AVATAR.src : ASSETS.MALE_AVATAR.src,
		});
	};

	const [errors, setErrors] = useState({});
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
			setExcoData((previousState) => {
				return { ...excoData, avatar: upload.target.result };
			});
		};
		reader.readAsDataURL(file);
		setFile(file);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setFile(null);
		setExcoData(initialState);
	};

	const handleAddExco = async () => {
		setErrors({
			firstname: !firstname && 'This field is required.',
			secondname: !secondname && 'This field is required.',
			lastname: !lastname && 'This field is required.',
			email: !email && 'This field is required.',
			mobile: !mobile && 'This field is required.',
			gender: !gender && 'This field is required.',
			about: !about && 'This field is required.',
			department: !department && 'This field is required.',
			office: !office && 'This field is required.',
		});
		if (!firstname || !secondname || !lastname || !email || !mobile || !gender || !about || !department || !office) return;
		if (
			allExcos
				.filter((index) => index?.uniqueID !== exco?.uniqueID)
				.find((index) => index?.firstname === firstname && index?.secondname === secondname && index?.lastname === lastname)
		)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `An exco with these names alredy exist!` } });
		if (allExcos.filter((index) => index?.uniqueID !== exco?.uniqueID).find((index) => index?.email === email))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `This email is already used for an exco!` } });

		if (!file) {
			handleUpdateExco({ exco: excoData });
			handleCloseModal();
			return;
		}
		// ** UPLOAD EXCO AVATAR IF FILE UPLOADED...
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(
				API_ROUTES.UPLOAD_FILE,
				{ file: file, fileFolder: S3FOLDERS.EXCOS_AVATARS, fileToDelete: exco?.avatar ? exco?.avatar : undefined },
				session?.token
			);
			if (res?.status === 200) {
				setIsSubmitting(false);
				// console.log({ avatar: res.data.fileName });
				handleUpdateExco({ exco: { ...excoData, avatar: res.data.fileName } });
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
					{<SupervisorAccountOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />}
					{isNew
						? `Add New Executive`
						: `${excoData?.lastname ? excoData?.lastname : ''} ${excoData?.firstname ? excoData?.firstname : ''} ${
								excoData?.secondname ? excoData?.secondname : ''
						  }`}
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
						label="Exco's Bio"
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
					<TextField
						onChange={handleChangeInput}
						value={department}
						color='primary'
						className='w-full mt-8'
						name='department'
						label='Department Of Study'
						variant='outlined'
						helperText={errors.department}
						error={errors.department ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={office}
						color='primary'
						className='w-full mt-8'
						name='office'
						label='Office Of Service'
						variant='outlined'
						helperText={errors.office}
						error={errors.office ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<SupervisorAccountOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className={`${admin_comp_styles.avatar_wrapper} mt-4 flex flex-col items-center justify-center col-12 col-md-5`}>
						<div className='w-full text-center font-medium-custom mb-6 color-primary'>Upload Exco's Official Photo</div>
						{<img alt='Profile Photo' className={admin_comp_styles.create_admin_avatar} src={avatar} />}
						<input onChange={handleAvatarUpload} type='file' name='avatar' id={`${admin_comp_styles.avatar_input}`} accept='image/*' />
					</div>

					<div className='w-full mt-6'>
						{excoSkills.length > 0 && (
							<div className='w-full text-center font-medium-custom mt-6 color-primary'>Exco's Skills and Talents</div>
						)}
						{excoSkills.map((text, index) => (
							<div key={index} className='w-full flex items-center justify-center'>
								<TextField
									onChange={(e) => handleSkillsTextInput(index, e)}
									value={excoSkills[index]}
									color='primary'
									className='w-full mt-4'
									size='small'
									label={`Skill / Talent ${index + 1}`}
									variant='outlined'
									multiline
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<EngineeringOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
											</InputAdornment>
										),
									}}
								/>
								<IconButton className='mt-3 ms-2' onClick={() => handleRemoveExcoSkills(index)}>
									<CancelIcon />
								</IconButton>
							</div>
						))}
						<Button className='py-1 normal-case mt-4 btn-site text-white btn-animated' onClick={handleAddExcoSkills}>
							<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add Skill /Talent
						</Button>
					</div>

					<div className='w-full mt-6'>
						{excoHobbies.length > 0 && <div className='w-full text-center font-medium-custom mt-6 color-primary'>Exco's Hobbies</div>}
						{excoHobbies.map((text, index) => (
							<div key={index} className='w-full flex items-center justify-center'>
								<TextField
									onChange={(e) => handleHobbyTextInput(index, e)}
									value={excoHobbies[index]}
									color='primary'
									className='w-full mt-4'
									size='small'
									label={`Hobby ${index + 1}`}
									variant='outlined'
									multiline
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<FavoriteBorderOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
											</InputAdornment>
										),
									}}
								/>
								<IconButton className='mt-3 ms-2' onClick={() => handleRemoveExcoHobby(index)}>
									<CancelIcon />
								</IconButton>
							</div>
						))}
						<Button className='py-1 normal-case mt-4 btn-site text-white btn-animated' onClick={handleAddExcoHobby}>
							<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add Skill /Talent
						</Button>
					</div>

					<div className='w-full mt-6'>
						<div className='w-full text-center font-medium-custom mt-6 color-primary'>Exco's Social Media Handles</div>
						<div className='line-height-1b mb-5 text-center text-[13px] text-red-500'>
							Please ensure these social media handles are free of improper or <i className='line-height-1b text-[13px]'>defiling</i>{' '}
							content
							<span className='line-height-1b text-red-700'>!</span>
						</div>
						<TextField
							onChange={(e) =>
								setExcoData({ ...excoData, social_handles: { ...excoData?.social_handles, linkedInUrl: e.target.value } })
							}
							value={excoData?.social_handles?.linkedInUrl}
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
								setExcoData({ ...excoData, social_handles: { ...excoData?.social_handles, twitterUrl: e.target.value } })
							}
							value={excoData?.social_handles?.twitterUrl}
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
								setExcoData({ ...excoData, social_handles: { ...excoData?.social_handles, facebookUrl: e.target.value } })
							}
							value={excoData?.social_handles?.facebookUrl}
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
								setExcoData({ ...excoData, social_handles: { ...excoData?.social_handles, telegramUrl: e.target.value } })
							}
							value={excoData?.social_handles?.telegramUrl}
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
								setExcoData({ ...excoData, social_handles: { ...excoData?.social_handles, instagramUrl: e.target.value } })
							}
							value={excoData?.social_handles?.instagramUrl}
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
								setExcoData({ ...excoData, social_handles: { ...excoData?.social_handles, whatsappUrl: e.target.value } })
							}
							value={excoData?.social_handles?.whatsappUrl}
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
				<React.Fragment>
					{!isSubmitting && (
						<React.Fragment>
							<Button onClick={handleAddExco} className='w-full normal-case btn-site' variant='contained'>
								<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add Exco
							</Button>
							<Button onClick={handleCloseModal} className='normal-case' color='white' variant='contained'>
								<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
							</Button>
						</React.Fragment>
					)}
					{isSubmitting && <CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />}
				</React.Fragment>
			}>
			{!isNew && (
				<div className='flex cursor-pointer my-4 border-b border-zinc-300 pb-2 items-center justify-start w-full'>
					<Avatar src={`${CLOUD_ASSET_BASEURL}/${exco?.avatar?.trim()}`} className='border mr-2 my-auto' />
					<div className='flex flex-col'>
						<div className='line-height-1b text-[14px] font-medium-custom'>
							{`${exco?.lastname ? exco?.lastname : ''} ${exco?.firstname ? exco?.firstname : ''} ${
								exco?.secondname ? exco?.secondname : ''
							}`}
						</div>
						<div className='line-height-1b text-gray-400 text-start text-[13px]'>{exco?.office}</div>
					</div>
				</div>
			)}
			{isNew && (
				<Button size='small' className='normal-case mt-5 btn-site w-[max-content]' variant='contained'>
					<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add New Executive
				</Button>
			)}
		</MuiModal>
	);
};

const ExcoGroup = ({ session, allGroups, setAllGroups, group, isNew, isNewAlert }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const initialState = group?.name
		? {
				...group,
				uniqueID: allGroups.length + 1,
				group_picture: group?.group_picture ? `${CLOUD_ASSET_BASEURL}/${group?.group_picture?.trim()}` : '',
		  }
		: {
				name: '',
				name_anchor_scripture: '',
				purpose: '',
				purpose_anchor_scripture: '',
				excos: [],
				academic_session: '',
				assumption_date: '',
				resignation_date: '',
				group_picture: '',
				current: false,
				uniqueID: allGroups.length + 1,
				...group,
		  };

	console.log({ group });

	const [groupData, setGroupData] = useState(initialState);
	const [file, setFile] = useState(null);
	const {
		name = '',
		name_anchor_scripture = '',
		purpose = '',
		purpose_anchor_scripture = '',
		excos = [],
		academic_session = ACADEMIC_SESSIONS[0],
		assumption_date = '',
		resignation_date = '',
		group_picture = '',
		current = false,
	} = groupData;

	const handleChangeInput = (e) => {
		const { name, value, checked } = e.target;
		setGroupData({ ...groupData, [name]: name === 'current' ? checked : value });
	};

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleUpdateExco = ({ exco }) => {
		console.log({ exco });
		const newExco = exco;
		setGroupData({
			...groupData,
			excos: excos.find((index) => index?.uniqueID === newExco?.uniqueID)
				? excos.map((exco, index) => {
						if (exco?.uniqueID === newExco?.uniqueID) return newExco;
						return exco;
				  })
				: [...excos, newExco],
		});
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
			setGroupData((previousState) => {
				return { ...groupData, group_picture: upload.target.result };
			});
		};
		reader.readAsDataURL(file);
		setFile(file);
	};
	const handleUpdate = async () => {
		setErrors({
			name: !name && 'This field is required.',
			name_anchor_scripture: !name_anchor_scripture && 'This field is required.',
			purpose: !purpose && 'This field is required.',
			purpose_anchor_scripture: !purpose_anchor_scripture && 'This field is required.',
			academic_session: !academic_session && 'This field is required.',
			assumption_date: !assumption_date && 'This field is required.',
		});
		if (!name || !name_anchor_scripture || !purpose || !purpose_anchor_scripture || !academic_session || !assumption_date) return;
		if (groupData?._id && allGroups.filter((index) => index?._id !== groupData?._id).find((index) => index?.name === name))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `An exco group with this name alredy exist!` } });

		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(
				API_ROUTES.MANAGE_EXCOS,
				{ ...groupData, isNew, group_picture: file ? file : group_picture },
				session?.token
			);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				router.push(APP_ROUTES.MANAGE_EXCOS);
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	return (
		<Paper className='mx-auto max-w-[600px] p-2 my-5'>
			{isNewAlert && (
				<div className='text-red-600 border-b border-zinc-300 w-full text-center font-medium-custom text-[17px] p-2'>
					Please fill up the details below to create new Executives Group!
				</div>
			)}

			<div className='w-full'>
				<TextField
					onChange={handleChangeInput}
					value={name}
					color='primary'
					className='w-full mt-8'
					name='name'
					label='Executives Ordained Name'
					variant='outlined'
					helperText={errors.name}
					error={errors.name ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SupervisorAccountOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					onChange={handleChangeInput}
					value={name_anchor_scripture}
					color='primary'
					className='w-full mt-8'
					name='name_anchor_scripture'
					label='Executives Ordained Name Anchor Scripture'
					variant='outlined'
					helperText={errors.name_anchor_scripture}
					error={errors.name_anchor_scripture ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					onChange={handleChangeInput}
					value={purpose}
					color='primary'
					className='w-full mt-8'
					name='purpose'
					label='Executives Mission Statement'
					variant='standard'
					helperText={errors.purpose}
					error={errors.purpose ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SupervisorAccountOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					onChange={handleChangeInput}
					value={purpose_anchor_scripture}
					color='primary'
					className='w-full mt-8'
					name='purpose_anchor_scripture'
					label='Executives Mission Statement Anchor Scripture'
					variant='outlined'
					helperText={errors.purpose_anchor_scripture}
					error={errors.purpose_anchor_scripture ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<Box sx={{ minWidth: 120, minHeight: 20, mt: '40px', mb: '30px' }}>
					<FormControl fullWidth size='small'>
						<InputLabel id='admin-level-select'>Academic Session</InputLabel>
						<Select
							error={errors.academic_session ? true : false}
							label='Academic Session'
							value={academic_session}
							name='academic_session'
							onChange={handleChangeInput}>
							{ACADEMIC_SESSIONS.map((acad_session, index) => (
								<MenuItem key={index} value={acad_session}>
									{acad_session}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

				<div className='my-5 w-full'>
					<div className='flex'>
						<BsDot className='color-primary text-[40px] my-auto' />
						<span className='my-auto'>Set As Current Executives</span>
					</div>
					<div className='flex'>
						<Switch checked={Boolean(current)} onChange={handleChangeInput} name='current' />
						<span className={`${current ? 'color-primary' : 'text-gray-500'} font-medium-custom my-auto`}>
							{current ? 'Current Executives' : 'Previous Executives'}
						</span>
					</div>
				</div>

				<TextField
					onChange={handleChangeInput}
					value={assumption_date}
					color='primary'
					className='w-full mt-8'
					name='assumption_date'
					label='Assumed Office On'
					variant='outlined'
					inputProps={{ type: 'date' }}
					helperText={errors.assumption_date}
					error={errors.assumption_date ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<AccessTimeOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				{!current && (
					<TextField
						onChange={handleChangeInput}
						value={resignation_date}
						color='primary'
						className='w-full mt-8'
						name='resignation_date'
						label='Resigned From Office On'
						variant='outlined'
						inputProps={{ type: 'date' }}
						helperText={errors.resignation_date}
						error={errors.resignation_date ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<AccessTimeOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
				)}

				<div className='my-5 w-full'>
					<div className='text-center border-b border-zinc-300 color-primary font-medium-custom'>Executives Who Served In This Group</div>
					{excos.map((exco, index) => (
						<ExcoData session={session} allExcos={excos} key={index} exco={exco} handleUpdateExco={handleUpdateExco} />
					))}
					<ExcoData session={session} allExcos={excos} isNew={true} exco={{}} handleUpdateExco={handleUpdateExco} />
				</div>

				<div className={`${comp_styles.img_input} rounded-[5px] mild-shadow mt-4 flex flex-col items-center justify-center`}>
					{group_picture && (
						<img
							alt='Select Executive Group Photo'
							style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '300px' }}
							src={group_picture}
						/>
					)}
					{!group_picture && <div className='font-medium-custom color-primary'>Click to Upload Executive Group Photo</div>}
					<input onChange={handleThumbnailUpload} type='file' id={`${comp_styles.avatar_input}`} accept='image/*' />
				</div>
			</div>
			<div className='flex items-center justify-center my-4'>
				{isSubmitting && <CircularProgress style={{ color: SITE_DATA.THEME_COLOR, height: '50px', width: '50px' }} />}
				{!isSubmitting && (
					<React.Fragment>
						<Button onClick={handleUpdate} variant='contained' className='font-medium-custom normal-case btn-site'>
							<SupervisorAccountOutlinedIcon sx={{ fontSize: '22px', my: 'auto', mr: 1 }} /> Update Group
						</Button>
						<DeleteExcoGroup allGroups={allGroups} setAllGroups={setAllGroups} session={session} isNew={isNew} group={group} />
					</React.Fragment>
				)}
			</div>
		</Paper>
	);
};

const ManageExcos = ({ userAuth, excosGroups }) => {
	// ** DISPATCH USER AUTH
	const dispatch = useDispatch();
	DispatchUserAuth({ userAuth });
	const session = useSelector((state) => state.auth);

	const [excosGroupsList, setExcosGroupsList] = useState(excosGroups);
	const [newAlreadyExistsAlert, setNewAlreadyExistsAlert] = useState(false);
	const handleAddNewExcosGroup = () => {
		setNewAlreadyExistsAlert(false);
		if (excosGroupsList.find((index) => Object.keys(index)?.length === 0)) {
			setNewAlreadyExistsAlert(true);
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'A new exco group has been created for you!', title: false } });
		}
		setExcosGroupsList([{}, ...excosGroupsList]);
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};
	return (
		<AdminLayout
			metatags={{ meta_title: `Manage Excos | ${SITE_DATA.NAME}` }}
			pageIcon={<SupervisorAccountOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Manage Excos'}>
			<Button onClick={handleAddNewExcosGroup} className='normal-case btn-site w-[max-content]' variant='contained'>
				<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add Executives Group
			</Button>

			{excosGroupsList?.map((group, index) => (
				<ExcoGroup
					allGroups={excosGroupsList}
					setAllGroups={setExcosGroupsList}
					isNewAlert={Object.keys(group)?.length === 0 && newAlreadyExistsAlert}
					isNew={Object.keys(group)?.length === 0}
					key={index}
					session={session}
					group={group}
				/>
			))}
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
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.MANAGE_EXCOS, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET PAGE DATA
	const excosGroups = await AdminController.getFellowshipExcos(req, res, true);

	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			excosGroups: excosGroups?.data?.length ? excosGroups?.data : [],
		},
	};
}

export default ManageExcos;
