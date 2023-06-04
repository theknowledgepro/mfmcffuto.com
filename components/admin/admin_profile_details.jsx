/** @format */

import React, { useEffect } from 'react';
import { MEMBER_ROLES, SITE_DATA } from '@/config';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LockPersonOutlined from '@mui/icons-material/LockPersonOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import FaceIcon from '@mui/icons-material/Face';
import Face2Icon from '@mui/icons-material/Face2';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import admin_comp_styles from './admin_components.module.css';
import { FormControl, RadioGroup, FormControlLabel, FormLabel, InputLabel, Select, MenuItem, Radio, InputAdornment, TextField } from '@mui/material';
import { GLOBALTYPES } from '@/redux/types';
import { validate } from '@/utils/validate';
import { useDispatch, useSelector } from 'react-redux';

const AdminProfileDetails = ({ adminData, setAdminData, onEdit = false, type, errors, isSubmitting, file, setFile }) => {
	const { auth } = useSelector((state) => state);
	const dispatch = useDispatch();

	const {
		firstname = '',
		secondname = '',
		lastname = '',
		username = '',
		email = '',
		gender = '',
		mobile = '',
		password = '',
		member_role = '',
		avatar = SITE_DATA.DEFAULT_MALE_AVATAR,
	} = adminData;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setAdminData({ ...adminData, [name]: value });
	};

	const handleChangeAvatar = (e) => {
		setAdminData({
			...adminData,
			avatar: file ? avatar : e.target?.value === 'Female' ? SITE_DATA.DEFAULT_FEMALE_AVATAR : SITE_DATA.DEFAULT_MALE_AVATAR,
		});
	};
	const [typePass, setTypePass] = React.useState(false);
	const handleClickShowPassword = () => setTypePass(!typePass);
	const handleMouseDownPassword = (e) => e.preventDefault();

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
			setAdminData((previousState) => {
				return { ...adminData, avatar: upload.target.result };
			});
		};
		reader.readAsDataURL(file);
		setFile(file);
	};

	// ON COMPONENT DID UNMOUNT RESTORE DEFAULT STATE
	useEffect(() => {
		return () => setAdminData(adminData);
	}, []);

	return (
		<React.Fragment>
			<TextField
				disabled={!onEdit}
				onChange={handleChangeInput}
				value={firstname}
				color='primary'
				className='col-12 col-md-5 mt-4'
				name='firstname'
				label='First Name'
				variant='outlined'
				helperText={errors.firstname}
				error={errors.firstname ? true : false}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<AccountCircleOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
						</InputAdornment>
					),
				}}
			/>
			<div className='col-12 col-md-1'></div>
			<TextField
				disabled={!onEdit}
				onChange={handleChangeInput}
				value={secondname}
				color='primary'
				className='col-12 col-md-6 mt-4'
				name='secondname'
				label='Second Name'
				variant='outlined'
				helperText={errors.secondname}
				error={errors.secondname ? true : false}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<AccountCircleOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
						</InputAdornment>
					),
				}}
			/>
			<TextField
				disabled={!onEdit}
				onChange={handleChangeInput}
				value={lastname}
				color='primary'
				className='col-12 mt-4'
				name='lastname'
				label='Surname'
				variant='outlined'
				helperText={errors.lastname}
				error={errors.lastname ? true : false}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<AccountCircleOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
						</InputAdornment>
					),
				}}
			/>
			<TextField
				disabled={!onEdit}
				onChange={handleChangeInput}
				value={mobile}
				color='primary'
				className='col-12 col-md-5 mt-4'
				name='mobile'
				type='number'
				label='Mobile number'
				variant='outlined'
				helperText={errors.mobile}
				error={errors.mobile ? true : false}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<AccountCircleOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
						</InputAdornment>
					),
				}}
			/>
			<div className='col-12 col-md-1'></div>
			<TextField
				disabled={!onEdit}
				onChange={handleChangeInput}
				value={email}
				color='primary'
				className='col-12 col-md-6 mt-4'
				name='email'
				label='Email address'
				variant='outlined'
				helperText={errors.email}
				error={errors.email ? true : false}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<EmailOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
						</InputAdornment>
					),
				}}
			/>

			{type === 'CREATEADMIN' && (
				<div className='w-full text-sm text-center mt-4'>
					Set up username and password for this admin. <br />
					It can be changed later.
				</div>
			)}
			{type === 'EDITMYPROFILE' && onEdit && (
				<div className='w-full text-sm text-center mt-4'>
					<div className='my-1'>You can change your username and password here...</div>
					<div className='color-primary'>Leave password field blank to retain old password.</div>
				</div>
			)}
			{type === 'CREATEADMIN' && (
				<React.Fragment>
					<TextField
						disabled={!onEdit}
						onChange={handleChangeInput}
						defaultValue={username}
						color='primary'
						className='col-12 col-md-6 mt-4'
						name='username'
						autoComplete='off'
						label='Account Username'
						variant='outlined'
						helperText={errors.username}
						error={errors.username ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<LockPersonOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='col-12 col-md-1'></div>
					<TextField
						disabled={!onEdit}
						onChange={handleChangeInput}
						className='col-12 col-md-5 mt-4'
						color='primary'
						name='password'
						defaultValue={''}
						label='Password'
						variant='outlined'
						autoComplete='off'
						helperText={errors.password}
						error={errors.password ? true : false}
						type={typePass ? 'text' : 'password'}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='start'>
										{typePass ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</React.Fragment>
			)}
			<FormControl
				disabled={!onEdit}
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

			<div className='flex items-center justify-center row mb-5'>
				<div className={`${admin_comp_styles.avatar_wrapper} mt-4 flex flex-col items-center justify-center col-12 col-md-5`}>
					{<img alt='Profile Photo' className={admin_comp_styles.create_admin_avatar} src={avatar} />}
					<input
						onChange={handleAvatarUpload}
						type='file'
						name='avatar'
						id={`${admin_comp_styles.avatar_input}`}
						accept='image/*'
						style={{ display: onEdit ? 'block' : 'none' }}
					/>
				</div>

				<div className='col-12 col-md-1'></div>

				{auth?.user?.member_role === MEMBER_ROLES.MASTER && (
					<FormControl disabled={!onEdit || auth?.user?.member_role !== MEMBER_ROLES.MASTER} className='mt-4 col-12 col-md-5'>
						<InputLabel error={errors.member_role ? true : false} id='member_role'>
							Admin Level <AdminPanelSettingsTwoToneIcon sx={{ ml: 1, fontSize: 22 }} />
						</InputLabel>
						<Select
							labelId='member_role'
							id='member_role'
							value={member_role}
							name='member_role'
							label='level'
							onChange={handleChangeInput}>
							<MenuItem value={MEMBER_ROLES.MANAGER}>Manager Admin</MenuItem>
							<MenuItem value={MEMBER_ROLES.MASTER}>Master Admin</MenuItem>
						</Select>
					</FormControl>
				)}
			</div>
		</React.Fragment>
	);
};

export default AdminProfileDetails;
