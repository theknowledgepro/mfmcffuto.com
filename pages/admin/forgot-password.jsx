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
import { loading } from '@/utils/misc_functions';
import Link from 'next/link';
import { validate } from '@/utils/validate';
import AuthController from '../api/auth/controller';
import WebController from '../api/controller';

const ForgotPassword = ({ seoData, settings }) => {
	const { loading: loadingStore } = useSelector((state) => state);
	const dispatch = useDispatch();

	const [userData, setUserData] = useState({ email: '' });
	const { email } = userData;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const [errors, setErrors] = useState({});
	const [isSent, setIsSent] = useState(false);
	const handleSubmit = async () => {
		setErrors({ email: validate.email({ email }).errMsg });
		if (validate.email({ email }).errMsg) return;
		if (loading(loadingStore, LOADING.REQUEST_PASSWORD_RESET_MAIL)) return;
		// const res = await dispatch(requestPasswordResetEmail({ email }));
		// if (res?.status === 200) {
		//     setIsSent(true)
		// }
	};

	return (
		<AuthLayout SeoData={{ ...seoData, meta_title: `Forgot Password | ${SITE_DATA.NAME}` }}>
			<section className={`${lgn_styse.parent} row`}>
				<div className='px-2 pt-5 pb-2 col-12 flex-centered-column'>
					<div className={`card card-primary ${lgn_styse.auth_box}`}>
						<AuthTopArea settings={settings} title={'Forgot Password?'} />

						<div className={lgn_styse.auth_form_field}>
							{!isSent && (
								<React.Fragment>
									<div className='flex-end w-100'>
										<EmailOutlined sx={{ color: SITE_DATA.THEME_COLOR, mr: 1, my: 0.5 }} />
										<TextField
											onChange={handleChangeInput}
											value={email}
											type={'email'}
											color='primary'
											className='mt-3 w-100'
											name='email'
											label='Email Address'
											variant='standard'
											helperText={errors.email}
											error={errors.email ? true : false}
										/>
									</div>
									<div className='text-muted mt-3 small'>
										Kindly provide your email address to receive password reset instructions.
									</div>

									<Button
										variant='outlined'
										onClick={handleSubmit}
										color='primary'
										className={`${lgn_styse.auth_btn} btn-animated mt-5`}>
										{loading(loadingStore, LOADING.REQUEST_PASSWORD_RESET_MAIL) && (
											<CircularProgress style={{ color: 'white', height: '20px', width: '20px', marginRight: '5px' }} />
										)}
										{!loading(loadingStore, LOADING.REQUEST_PASSWORD_RESET_MAIL) && 'Request for Password Reset!'}
									</Button>
								</React.Fragment>
							)}

							<div className='mt-2 mb-3 w-100 flex-centered-row'>
								<Link href={APP_ROUTES.LOGIN} className={lgn_styse.home_link}>
									{' '}
									Back to Login{' '}
								</Link>
							</div>
						</div>
					</div>
					<div className='text-center text-muted fs-14'>&copy; 2023 {SITE_DATA.OFFICIAL_NAME}</div>
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
	const settings = await WebController.getSiteSettings(req, res);

	return {
		props: {
			settings: settings,
			seoData: {},
		},
	};
}
export default ForgotPassword;
