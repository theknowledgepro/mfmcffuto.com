/** @format */

import { AuthLayout, AuthTopArea } from '@/components';
import { APP_ROUTES, SITE_DATA, LOADING } from '@/config';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LockPersonOutlined from '@mui/icons-material/LockPersonOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import React, { useEffect } from 'react';
import lgn_styse from './admin_styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/actions/auth_action';
import { isLoading } from '@/utils/get_loading_state';
import { GLOBALTYPES } from '@/redux/types';
import WebController from '@/pages/api/controller';
import AuthController from '@/pages/api/auth/controller';

const Login = ({ metatags, redirectProps, siteite }) => {
	const { loading: loadingStore, redirect } = useSelector((state) => state);
	const dispatch = useDispatch();

	// ** PUSH 'redirectProps' TO REDIRECT STORE FOR AUTO NAVIGATION ON USER LOGIN SUCCESS ** SEE '/_persistlayout.js' and 'README.md' FOR IMPLEMENTATION AND CLARITY...
	useEffect(() => {
		if (!redirectProps) return;
		Object.keys(redirectProps).includes('redirectUrl') &&
			dispatch({
				type: GLOBALTYPES.REDIRECT,
				payload: { url: redirectProps?.redirectUrl.trim() },
			});
		Object.keys(redirectProps).includes('redirectUrl') &&
			dispatch({
				type: GLOBALTYPES.TOAST,
				payload: {
					info: 'Please login to continue!',
					title: 'Hey there!',
				},
			});
	}, [redirectProps]);

	const [userData, setUserData] = React.useState({ username: '', password: '' });
	const { username, password } = userData;
	const [typePass, setTypePass] = React.useState(false);

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleClickShowPassword = () => setTypePass(!typePass);
	const handleMouseDownPassword = (e) => e.preventDefault();

	const [errors, setErrors] = React.useState({});

	const handleSubmit = () => {
		setErrors({
			username: (!username && 'Please enter your username.') || (username.replace(/ /g, '').length < 5 && 'Username is incomplete.'),
			password: !password && 'Please enter your password.',
		});
		if (errors.username || errors.password || !username || !password) return;
		if (isLoading(LOADING.LOGIN, loadingStore)) return;
		dispatch(login({ redirect: redirect?.url, username, password }));
	};

	return (
		<AuthLayout metatags={{ ...metatags, meta_title: `Admin Login | ${SITE_DATA.NAME}` }}>
			<section className={`${lgn_styse.parent} row`}>
				<div className='px-2 pt-5 pb-2 col-12 flex flex-col items-center justify-center'>
					<div className={`card card-primary ${lgn_styse.auth_box}`}>
						<AuthTopArea siteite={siteite} title={'Admin Login'} />

						<div className={lgn_styse.auth_form_field}>
							<div className='flex place-items-end w-full mt-4'>
								<AccountCircleOutlined sx={{ color: SITE_DATA.THEME_COLOR, mr: 1, my: 0.5 }} />
								<TextField
									onChange={handleChangeInput}
									defaultValue={username}
									color='primary'
									className='w-full'
									name='username'
									label='Username'
									variant='standard'
									helperText={errors.username}
									error={errors.username ? true : false}
								/>
							</div>

							<div className={`flex place-items-end w-full}`}>
								<LockPersonOutlined sx={{ color: SITE_DATA.THEME_COLOR, mr: 1, my: 0.5 }} />
								<TextField
									onChange={handleChangeInput}
									defaultValue={password}
									className='mt-3 w-full'
									color='primary'
									name='password'
									label='Password'
									variant='standard'
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
							</div>
							<div className={lgn_styse.forgot_pass}>
								<Link href={APP_ROUTES.FORGOT_PASSWORD} className={lgn_styse.forgot_pass_link}>
									Forgot Password?
								</Link>
							</div>

							<Button variant='outlined' onClick={handleSubmit} color='primary' className={`${lgn_styse.auth_btn} btn-animated mt-5`}>
								{isLoading(LOADING.LOGIN, loadingStore) && (
									<CircularProgress style={{ color: 'white', height: '20px', width: '20px', marginRight: '5px' }} />
								)}
								{!isLoading(LOADING.LOGIN, loadingStore) && 'Sign In!'}
							</Button>

							<div className='mt-2 mb-3 w-full flex items-center justify-center'>
								<Link href={APP_ROUTES.HOME} className={lgn_styse.home_link}>
									Back to Home
								</Link>
							</div>
						</div>
					</div>
					<div className='text-center text-sm text-gray-500 font-semibold'>
						&copy; {new Date().getFullYear()} {SITE_DATA.OFFICIAL_NAME}
					</div>
				</div>
			</section>
		</AuthLayout>
	);
};

export async function getServerSideProps({ req, res, query }) {
	// ** REDIRECT TO DEFAULT HOME IF COOKIE EXISTS
	const verifyUserAuth = await AuthController.generateAccessToken(req, res);
	if (verifyUserAuth?.user && verifyUserAuth?.access_token) {
		return {
			redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false },
		};
	}
	//** GET SITE ite
	const settings = await WebController.getSiteSettings(req, res, true);

	return {
		props: {
			metatags: {},
			redirectProps: query,
			sitesettings: settings,
		},
	};
}

export default Login;
