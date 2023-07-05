/** @format */

import React from 'react';
import comp_styles from './components.module.css';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { API_ROUTES, SITE_DATA } from '@/config';
import Link from 'next/link';
import { SvgIcons } from './icons';
import { postDataAPI } from '@/utils/api_client_side';
import { GLOBALTYPES } from '@/redux/types';
import { useDispatch } from 'react-redux';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { validate } from '@/utils/validate';
import Image from 'next/image';
import headerLogo from '@/assets/logo.png';

const ContactUsForm = ({ hideLogo, SiteSettings }) => {
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
	const defaultURL = 'https://';

	return (
		<section className='px-1 w-100 d-flex flex-column align-items-center justify-content-center mb-5'>
			<h2 className={comp_styles.section_title}>Get In Touch With Us</h2>

			<div className='text-center w-100 text-dark mb-2'>We would love to hear from you. Feel free to reach out to us!</div>
			<div className='text-center w-100 mb-4'>Reach out to Us via email at <Link href={`mailto:${SiteSettings?.contact_us_email}`} className='color-primary fw-bold'>{SiteSettings?.contact_us_email}</Link></div>

			<div className={`row w-100 ${comp_styles.contact_form_wrapper}`}>
				<div className={`${comp_styles.contact_form_header} border-bottom pb-2`}>
					<h2 className={comp_styles.title}>
						Contact <span className='color-primary'>Us!</span>
					</h2>

					<div className={`${comp_styles.social_icons}`}>
						{SiteSettings?.facebookUrl !== defaultURL && SiteSettings && (
							<Link target='_blank' href={SiteSettings?.facebookUrl} className={`${comp_styles.icon} facebook`}>
								<SvgIcons.FaFacebookF />
							</Link>
						)}
						{SiteSettings?.instagramUrl !== defaultURL && SiteSettings && (
							<Link target='_blank' href={SiteSettings?.instagramUrl} className={`${comp_styles.icon} instagram`}>
								<SvgIcons.FaInstagram />
							</Link>
						)}
						{SiteSettings?.telegramUrl !== defaultURL && SiteSettings && (
							<Link target='_blank' href={SiteSettings?.telegramUrl} className={`${comp_styles.icon} telegram`}>
								<SvgIcons.FaTelegramPlane />
							</Link>
						)}
						{SiteSettings?.whatsAppUrl && (
							<Link
								target='_blank'
								href={`https://wa.me/${SiteSettings?.whatsAppUrl}?text=Hello,%20Eunikings,%20My%20name%20is%20"`}
								className={`${comp_styles.icon} whatsapp`}>
								<SvgIcons.FaWhatsapp />
							</Link>
						)}
						{SiteSettings?.youTubeUrl !== defaultURL && SiteSettings && (
							<Link target='_blank' href={SiteSettings?.youTubeUrl} className={`${comp_styles.icon} youtube`}>
								<SvgIcons.FaYoutube />
							</Link>
						)}
					</div>
				</div>
				<div className={`${hideLogo ? 'col-12' : 'col-md-8'} ${comp_styles.contact_form}`}>
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
					<Button onClick={handleSubmit} variant='contained' className={`w-100 mt-2 text-none fs-15 text-bold btn-animated text-white`}>
						{loading && <CircularProgress style={{ color: 'white', height: '20px', width: '20px', marginRight: '5px' }} />}
						{!loading && 'Submit'}
					</Button>
				</div>
				{!hideLogo && (
					<div className='m-auto border-end col-md-4 h-100 d-flex align-items-center justify-content-center'>
						<Image alt='logo' className={`${comp_styles.contact_form_logo} m-auto`} src={headerLogo} />
					</div>
				)}
			</div>
		</section>
	);
};

export default ContactUsForm;
