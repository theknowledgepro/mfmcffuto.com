/** @format */

import React from 'react';
import comp_styles from './components.module.css';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { API_ROUTES, ASSETS } from '@/config';
import Link from 'next/link';
import { postDataAPI } from '@/utils/api_client_side';
import { GLOBALTYPES } from '@/redux/types';
import { useDispatch } from 'react-redux';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { validate } from '@/utils/validate';
import { SocialIcons, ImageTag } from '.';

const ContactUsForm = ({ hideLogo, sitesettings }) => {
	const dispatch = useDispatch();
	const [data, setData] = useState({ name: '', email: '', phone: '', details: '' });
	const { name, email, phone, details } = data;
	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value });
	};

	// ** SUBMIT FORM
	const [loading, setLoading] = useState(false);
	const handleSubmit = async () => {
		if (validate.email({ email }).errMsg) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Please enter a valid email address!' } });
		if (!data.name || !data.email || !data.details)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Please fill in all required details!' } });
		if (loading) return;
		setLoading(true);

		try {
			const res = await postDataAPI(API_ROUTES.CONTACT_FORM_SUBMIT, data);
			res?.data?.status === 200 && setLoading(false);
			dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res.data.message, title: 'Submitted successfully!' } });
		} catch (err) {
			handleClientAPIRequestErrors({ err, dispatch, loadingData: {} });
			setLoading(false);
		}
	};
	const defaultURL = sitesettings && Object?.keys(sitesettings)?.length > 0 ? 'https://' : undefined;

	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2
				style={{ fontFamily: 'var(--font-family-medium)' }}
				className={`font-semibold text-[30px] text-[var(--color-primary)] text-center w-full my-[20px]`}>
				Get In Touch With Us
			</h2>
			<div className='text-center w-full text-gray-600 mb-2'>We would love to hear from you. Feel free to reach out to us!</div>
			<div className='text-center w-full mb-4'>
				Reach out to Us via email at{' '}
				<Link href={`mailto:${sitesettings?.contact_us_email}`} className='color-primary fw-bold'>
					{sitesettings?.contact_us_email}
				</Link>
			</div>

			<div className={`w-full ${comp_styles.contact_form_wrapper}`}>
				<div className={`${comp_styles.contact_form_header} border-b border-zinc-300 pb-2`}>
					<h2 className={comp_styles.title}>
						Contact <span className='color-primary'>Us!</span>
					</h2>

					<SocialIcons
						sitesettings={{
							...sitesettings,
							facebookUrl: '',
							instagramUrl: '',
							telegramUrl: '',
							whatsAppUrl: 'ddddd',
							youTubeUrl: '',
						}}
						defaultURL={defaultURL}
					/>
				</div>
				<div className='w-full grid xss:grid-cols-1 md:grid-cols-12 '>
					<div className={`xss:col-span-1 md:col-span-8 ${comp_styles.contact_form}`}>
						<label htmlFor='nameenter'>Your name</label>
						<input id='nameenter' type='text' name='name' onChange={handleChangeInput} value={name} placeholder='Tell us your name' />

						<label htmlFor='emailenter'>Email Address</label>
						<input
							id='emailenter'
							type='email'
							name='email'
							onChange={handleChangeInput}
							value={email}
							placeholder='Enter your email address'
						/>

						<label htmlFor='numberenter'>
							Phone number <span className='text-muted'>(Optional)</span>
						</label>
						<input
							id='numberenter'
							type='number'
							name='phone'
							onChange={handleChangeInput}
							value={phone}
							placeholder='Enter your mobile number'
						/>

						<label htmlFor='detailsenter'>Details</label>
						<textarea onChange={handleChangeInput} value={details} name='details' id='detailsenter'></textarea>
						<Button
							onClick={handleSubmit}
							variant='contained'
							sx={{ '&:hover': { background: 'var(--color-primary)', color: '#fff' } }}
							className='font-medium-custom w-full rounded-md normal-case text-lg bg-[var(--color-primary)] text-white font-bold btn-animated'>
							{loading && <CircularProgress style={{ color: 'white', height: '20px', width: '20px', marginRight: '5px' }} />}
							{!loading && 'Submit'}
						</Button>
					</div>
					{!hideLogo && (
						<div className='m-auto xss:col-span-1 md:col-span-4 h-full flex items-center justify-center'>
							<ImageTag
								alt='logo'
								className={`${comp_styles.contact_form_logo} m-auto`}
								src={sitesettings?.logoUrl ? sitesettings?.logoUrl : ASSETS?.LOGO}
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default ContactUsForm;
