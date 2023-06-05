/** @format */

import { AuthLayout, AuthTopArea } from '@/components';
import { APP_ROUTES, LOADING, SITE_DATA } from '@/config';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import lgn_styse from './admin_styles.module.css';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LockPersonOutlined from '@mui/icons-material/LockPersonOutlined';
import Link from 'next/link';
import { validate } from '@/utils/validate';
import { isLoading } from '@/utils/get_loading_state';
import OtpInput from 'react18-input-otp';
import WebController from '@/pages/api/controller';
import AuthController from '@/pages/api/auth/controller';
import { requestPasswordResetToken, verifyPasswordResetToken, passwordReset } from '@/redux/actions/auth_action';
import { GLOBALTYPES } from '@/redux/types';
import { IconButton, InputAdornment } from '@mui/material';

const ForgotPassword = ({ metatags, settings }) => {
	const { loading: loadingStore } = useSelector((state) => state);
	const dispatch = useDispatch();

	const [userData, setUserData] = useState({ email: '', OTPValue: '', password: '', confirmPassword: '' });
	const { email, OTPValue, password, confirmPassword } = userData;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};
	const [typePass, setTypePass] = React.useState(false);
	const handleClickShowPassword = () => setTypePass(!typePass);
	const handleMouseDownPassword = (e) => e.preventDefault();

	const [errors, setErrors] = useState({});
	const [isSent, setIsSent] = useState(false);
	const [isVerified, setIsVerified] = useState(false);

	const handleRequestOTPToken = async () => {
		setErrors({ email: validate.email({ email }).errMsg });
		if (validate.email({ email }).errMsg) return;
		if (isLoading(LOADING.REQUEST_PASSWORD_RESET_TOKEN, loadingStore)) return;
		const res = await dispatch(requestPasswordResetToken({ email }));
		if (res?.status === 200) setIsSent(true);
	};

	const handleVerifyOTPToken = async () => {
		if (userData?.OTPValue.toString().length !== 4)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Please provide the OTP value to continue!' } });
		if (isLoading(LOADING.VERIFY_PASSWORD_RESET_TOKEN, loadingStore)) return;
		const res = await dispatch(verifyPasswordResetToken({ email, OTPValue }));
		if (res?.status === 200) setIsVerified(true);
	};

	const handleResetPassword = async () => {
		setErrors({
			password: validate.password({ password }).errMsg,
			confirmPassword: validate.confirmpassword({ password, cpassword: confirmPassword }).errMsg,
		});
		if (!password || !confirmPassword) return;
		if (password !== confirmPassword)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Password and Confirm Password do not match!' } });

		if (isLoading(LOADING.PASSWORD_RESET, loadingStore)) return;
		await dispatch(passwordReset({ email, OTPValue, password, confirmPassword }));
	};

	return (
		<AuthLayout metatags={{ ...metatags, meta_title: `Forgot Password | ${SITE_DATA.NAME}` }}>
			<section className={`${lgn_styse.parent} row`}>
				<div className='px-2 pt-5 pb-2 col-12 flex flex-col items-center justify-center'>
					<div className={`card card-primary ${lgn_styse.auth_box}`}>
						<AuthTopArea
							settings={settings}
							title={
								!isSent
									? 'Forgot Password?'
									: !isVerified && isSent
									? 'Please Enter OTP Below...'
									: isVerified
									? 'Enter a new password for your account.'
									: ''
							}
						/>

						<div className={lgn_styse.auth_form_field}>
							{!isSent && (
								<React.Fragment>
									<div className='flex items-center justify-end w-full'>
										<TextField
											onChange={handleChangeInput}
											value={email}
											type={'email'}
											color='primary'
											className='mt-3 w-full my-auto pt-3'
											name='email'
											label='Email Address'
											variant='standard'
											helperText={errors.email}
											placeholder='you@example.com'
											error={errors.email ? true : false}
											InputProps={{
												startAdornment: (
													<InputAdornment position='start'>
														<EmailOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
													</InputAdornment>
												),
											}}
										/>
									</div>
									<div className='text-gray-600 text-center mt-8 mb-3 text-sm'>
										Kindly provide your email address to receive password reset instructions.
									</div>

									<Button
										variant='outlined'
										onClick={handleRequestOTPToken}
										color='primary'
										className={`${lgn_styse.auth_btn} btn-animated mt-5`}>
										{isLoading(LOADING.REQUEST_PASSWORD_RESET_TOKEN, loadingStore) && (
											<CircularProgress style={{ color: 'white', height: '20px', width: '20px' }} />
										)}
										{!isLoading(LOADING.REQUEST_PASSWORD_RESET_TOKEN, loadingStore) && 'Request for Password Reset!'}
									</Button>
								</React.Fragment>
							)}
							{!isVerified && isSent && (
								<div className='mb-5'>
									<OtpInput
										isInputNum={true}
										isInputSecure={typePass}
										numInputs={4}
										value={userData?.OTPValue}
										onChange={(otp) => setUserData({ ...userData, OTPValue: otp })}
										separator={<span className='font-semibold color-primary'>-</span>}
										containerStyle={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
										inputStyle={{
											width: '40px',
											height: '50px',
											outline: 'none',
											border: '1px solid var(--color-primary)',
											margin: '0 5px',
											borderRadius: '5px',
											color: '#000',
										}}
										focusStyle={{ boxShadow: '0px 0px 10px var(--color-primary)' }}
									/>
									<Button
										variant='outlined'
										onClick={handleVerifyOTPToken}
										color='primary'
										className={`${lgn_styse.auth_btn} btn-animated mt-5`}>
										{isLoading(LOADING.VERIFY_PASSWORD_RESET_TOKEN, loadingStore) && (
											<CircularProgress style={{ color: 'white', height: '20px', width: '20px' }} />
										)}
										{!isLoading(LOADING.VERIFY_PASSWORD_RESET_TOKEN, loadingStore) && 'Verify OTP'}
									</Button>
								</div>
							)}
							{isVerified && (
								<React.Fragment>
									<TextField
										onChange={handleChangeInput}
										disabled={true}
										value={email}
										type={'email'}
										color='primary'
										className='mt-3 w-full my-auto pt-3'
										name='email'
										label='Email Address'
										variant='standard'
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
									<TextField
										onChange={handleChangeInput}
										defaultValue={password}
										className='mt-3 w-full my-auto pt-3'
										color='primary'
										name='password'
										label='Password'
										variant='standard'
										helperText={errors.password}
										placeholder='New Password'
										error={errors.password ? true : false}
										type={typePass ? 'text' : 'password'}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<LockPersonOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='start'>
														{typePass ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
									<TextField
										onChange={handleChangeInput}
										defaultValue={confirmPassword}
										className='mt-3 w-full my-auto pt-3'
										color='primary'
										name='confirmPassword'
										label='Confirm Password'
										variant='standard'
										helperText={errors.confirmPassword}
										placeholder='Confirm New Password'
										error={errors.confirmPassword ? true : false}
										type={typePass ? 'text' : 'password'}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<LockPersonOutlined sx={{ color: SITE_DATA.THEME_COLOR }} />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='start'>
														{typePass ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
									<Button
										variant='outlined'
										onClick={handleResetPassword}
										color='primary'
										className={`${lgn_styse.auth_btn} btn-animated mt-5`}>
										{isLoading(LOADING.PASSWORD_RESET, loadingStore) && (
											<CircularProgress style={{ color: 'white', height: '20px', width: '20px' }} />
										)}
										{!isLoading(LOADING.PASSWORD_RESET, loadingStore) && 'Reset Account Password!'}
									</Button>
								</React.Fragment>
							)}

							<div className='mt-2 mb-3 w-full text-center'>
								<Link href={APP_ROUTES.LOGIN} className={lgn_styse.home_link}>
									Back to Login
								</Link>
							</div>
						</div>
					</div>
					<div className='text-center text-gray-500 text-sm font-semibold'>
						&copy; {new Date().getFullYear()} {SITE_DATA.OFFICIAL_NAME}
					</div>
				</div>
			</section>
		</AuthLayout>
	);
};

export async function getServerSideProps({ req, res }) {
	// ** REDIRECT TO DEFAULT HOME IF COOKIE EXISTS
	const verifyUserAuth = await AuthController.generateAccessToken(req, res);
	if (verifyUserAuth?.user && verifyUserAuth?.access_token) {
		return {
			redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false },
		};
	}
	// ** GET SITE SETTINGS
	const settings = await WebController.getSiteSettings(req, res, true);

	return {
		props: {
			settings: settings,
			metatags: {},
		},
	};
}
export default ForgotPassword;
