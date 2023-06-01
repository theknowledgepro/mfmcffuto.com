/** @format */

import { APP_ROUTES, SITE_DATA } from '@/config';
import Link from 'next/link';
import React from 'react';
import comp_styles from './components.module.css';
import { SvgIcons } from './icons';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const Footer = ({ sitesettings }) => {
	const router = useRouter();
	const { pathname } = router;
	const defaultURL = Object.keys(sitesettings).length > 0 ? 'https://' : undefined;

	return (
		<footer className={comp_styles.footer}>
			<div className={comp_styles.footer_waves}>
				<div className={comp_styles.footer_wave} id={comp_styles.wave1}></div>
				<div className={comp_styles.footer_wave} id={comp_styles.wave2}></div>
				<div className={comp_styles.footer_wave} id={comp_styles.wave3}></div>
				<div className={comp_styles.footer_wave} id={comp_styles.wave4}></div>
			</div>
			<div className={comp_styles.footer_top}>
				<div className='flex items-center'>
					<div className={comp_styles.logo_sec}>
						<img alt='logo' className={comp_styles.logo} src={sitesettings?.logoUrl} />
					</div>
					<span className={comp_styles.site_name}>{SITE_DATA.OFFICIAL_NAME}</span>
				</div>
				{(sitesettings?.facebookUrl !== defaultURL ||
					sitesettings?.instagramUrl !== defaultURL ||
					sitesettings?.telegramUrl !== defaultURL ||
					sitesettings?.youTubeUrl !== defaultURL ||
					sitesettings?.whatsAppUrl) && <div className={comp_styles.connect}>Connect with us @</div>}

				<div className={`${comp_styles.social_icons}`}>
					{sitesettings?.facebookUrl !== defaultURL && (
						<Link target='_blank' href={sitesettings?.facebookUrl} className={`${comp_styles.icon} facebook`}>
							<SvgIcons.FaFacebookF />
						</Link>
					)}
					{sitesettings?.instagramUrl !== defaultURL && (
						<Link target='_blank' href={sitesettings?.instagramUrl} className={`${comp_styles.icon} instagram`}>
							<SvgIcons.FaInstagram />
						</Link>
					)}
					{sitesettings?.telegramUrl !== defaultURL && (
						<Link target='_blank' href={sitesettings?.telegramUrl} className={`${comp_styles.icon} telegram`}>
							<SvgIcons.FaTelegramPlane />
						</Link>
					)}
					{sitesettings?.whatsAppUrl && (
						<Link
							target='_blank'
							href={`https://wa.me/${sitesettings?.whatsAppUrl}?text=Hello,%20${SITE_DATA.OFFICIAL_NAME},%20My%20name%20is%20"`}
							className={`${comp_styles.icon} whatsapp`}>
							<SvgIcons.FaWhatsapp />
						</Link>
					)}
					{sitesettings?.youTubeUrl !== defaultURL && (
						<Link target='_blank' href={sitesettings?.youTubeUrl} className={`${comp_styles.icon} youtube`}>
							<SvgIcons.FaYoutube />
						</Link>
					)}
				</div>
			</div>
			<div className={`row ${comp_styles.footer_mid}`}>
				<div className={`col-sm-6 col-md-6 col-lg-3 ${comp_styles.footer_box}`}>
					<div className={comp_styles.footer_box_title}>Our Head Office</div>
					<div className={comp_styles.footer_navbox_wrapper}>
						<div className={`${comp_styles.address} flex-center text-white}`}>
							<FaMapMarkerAlt className='mr-3 text-white' />
							<pre className='text-white' dangerouslySetInnerHTML={{ __html: sitesettings?.head_office }}></pre>
						</div>
						<div className={`${comp_styles.address} mt-2 flex text-white`}>
							<FaPhoneAlt className='mr-3 my-auto' />
							<div
								className='text-white flex-wrap'
								dangerouslySetInnerHTML={{ __html: `${sitesettings?.phone1}${sitesettings?.phone2 && ', &nbsp;'}` }}></div>
							{sitesettings?.phone2 && (
								<div className='text-white flex-wrap' dangerouslySetInnerHTML={{ __html: sitesettings?.phone2 }}></div>
							)}
						</div>
						<div className={`${comp_styles.address} mt-2 flex text-white`}>
							<FaEnvelope className='mr-3 my-auto' />
							<Link href={`mailto:${sitesettings?.email}`} className='text-none text-white flex-wrap' style={{ letterSpacing: '0px' }}>
								{sitesettings?.email}
							</Link>
						</div>
					</div>
				</div>
				<div className={`col-sm-6 col-md-6 col-lg-3 ${comp_styles.footer_box}`}>
					<div className={comp_styles.footer_box_title}>Quick Links</div>
					<div className={comp_styles.footer_navbox_wrapper}>
						<Link href={APP_ROUTES.HOME} className={`${pathname === APP_ROUTES.HOME && 'active'} ${comp_styles.footer_link}`}>
							<span className='font-bold mr-2'>&#x3e;</span>Home
						</Link>
						<Link href={APP_ROUTES.SERVICES} className={`${pathname === APP_ROUTES.SERVICES && 'active'} ${comp_styles.footer_link}`}>
							<span className='font-bold mr-2'>&#x3e;</span>Our Services
						</Link>
						<Link href={APP_ROUTES.ABOUT_US} className={`${pathname === APP_ROUTES.ABOUT_US && 'active'} ${comp_styles.footer_link}`}>
							<span className='font-bold mr-2'>&#x3e;</span> About Us
						</Link>
						<Link href={APP_ROUTES.CONTACT_US} className={`${pathname === APP_ROUTES.CONTACT_US && 'active'} ${comp_styles.footer_link}`}>
							<span className='font-bold mr-2'>&#x3e;</span>Contact Us
						</Link>
					</div>
				</div>
				<div className={`col-sm-6 col-md-6 col-lg-3 ${comp_styles.footer_box}`}>
					<div className={comp_styles.footer_box_title}>Other Links</div>
					<div className={comp_styles.footer_navbox_wrapper}>
						<Link href={APP_ROUTES.TERMS} className={`${pathname === APP_ROUTES.TERMS && 'active'} ${comp_styles.footer_link}`}>
							<span className='font-bold mr-2'>&#x3e;</span>Terms of Service
						</Link>
					</div>
				</div>
				<div className={`col-sm-6 col-md-6 col-lg-3 ${comp_styles.footer_box}`}>
					<div className={comp_styles.footer_box_title}>Subscribe to Our Newsletter</div>
					<div className={comp_styles.footer_navbox_wrapper}>
						<input type='email' name='email' placeholder='Enter your email address' className={comp_styles.subscribe} />
						<span className='text-gray-400 text-sm text-center mt-2'>Don't worry, we don't spam.</span>
						<Button variant='contained' className={`w-full mt-2 text-decor-none font-bold btn-animated text-white`}>
							Subscribe
						</Button>
					</div>
				</div>
			</div>
			<div className={comp_styles.footer_bottom}>
				&copy; {new Date().getFullYear()} {SITE_DATA.OFFICIAL_NAME}
			</div>
		</footer>
	);
};

export default Footer;
