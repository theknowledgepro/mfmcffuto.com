/** @format */

import { APP_ROUTES } from '@/config';
import { ChangeClassNameAtPosition } from '@/utils/use_scroll';
import React, { useRef } from 'react';
import comp_styles from './components.module.css';
import { FaEnvelope, FaPhoneAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { SvgIcons } from './icons';
import { useRouter } from 'next/router';

const RenderSocialIcons = ({ sitesettings }) => {
	const defaultURL = Object.keys(sitesettings).length > 0 ? 'https://' : undefined;
	return (
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
					href={`https://wa.me/${sitesettings?.whatsAppUrl}?text=Hello,%20Eunikings,%20My%20name%20is%20"`}
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
	);
};

const HeaderNavbar = ({ sitesettings }) => {
	const router = useRouter();
	const { pathname } = router;
	const preHeaderRef = useRef(null);
	const headerRef = useRef(null);
	const navbarRef = useRef(null);

	ChangeClassNameAtPosition({ targetRef: preHeaderRef, position: 45, className: 'translateY-100' });
	ChangeClassNameAtPosition({ targetRef: headerRef, position: 45, className: 'header-original' });
	// HideShowNavbarOnScroll({ targetRef: headerRef, className: 'translateY-100', startPosition: 500 });

	const openNavbar = () => {
		navbarRef.current.classList.add('translateY-none');
		document.body.classList.add('body-sticky');
	};

	const closeNavbar = () => {
		navbarRef.current.classList.remove('translateY-none');
		document.body.classList.remove('body-sticky');
	};

	return (
		<section className={comp_styles.header_wrapper}>
			<div ref={preHeaderRef} className={comp_styles.pre_header}>
				<div className='flex h-full'>
					<div className='flex items-center justify-center h-full flex-col border-right-1-ff6 border-left-1-ff6'>
						<div className='flex my-auto px-3'>
							<FaPhoneAlt className='mr-3 my-auto color-primary' />
							<span className='text-white flex-wrap'>{sitesettings?.phone1}</span>
						</div>
					</div>

					<div className='flex items-center justify-center h-full flex-col  border-right-1-ff6'>
						<div className='flex my-auto px-3'>
							<FaEnvelope className='mr-3 my-auto color-primary' />
							<Link href={`mailto:${sitesettings?.email}`} className='text-none text-white flex-wrap' style={{ letterSpacing: '0px' }}>
								{sitesettings?.email}
							</Link>
						</div>
					</div>
				</div>

				<RenderSocialIcons sitesettings={sitesettings} />
			</div>
			<header ref={headerRef} className={comp_styles.header}>
				<img alt='logo' src={sitesettings?.logoUrl} className={comp_styles.site_logo} />

				<div ref={navbarRef} className={`${comp_styles.header_nav}`}>
					<div onClick={closeNavbar} className={comp_styles.header_close}>
						<FaTimes />
					</div>
					<img alt='logo' className={`${comp_styles.logo_wrapper} mb-4`} src={sitesettings?.logoUrl} />
					<Link
						onClick={closeNavbar}
						href={APP_ROUTES.HOME}
						className={`${pathname === APP_ROUTES.HOME && 'active'} ${comp_styles.header_link}`}>
						Home
					</Link>
					<Link
						onClick={closeNavbar}
						href={APP_ROUTES.ABOUT_US}
						className={`${pathname === APP_ROUTES.ABOUT_US && 'active'} ${comp_styles.header_link}`}>
						About
					</Link>
					<Link
						onClick={closeNavbar}
						href={APP_ROUTES.SERVICES}
						className={`${pathname === APP_ROUTES.SERVICES && 'active'} ${comp_styles.header_link}`}>
						Services
					</Link>

					<Link
						onClick={closeNavbar}
						href={APP_ROUTES.CONTACT_US}
						className={`${pathname === APP_ROUTES.CONTACT_US && 'active'} ${comp_styles.header_link}`}>
						Contact Us
					</Link>
					<div className={comp_styles.responsive_only}>
						<div className={comp_styles.header_footer_wrapper}>
							<div className={comp_styles.header_footer}>
								<div className={comp_styles.header_footer_text}>Connect with us @</div>
								<div className={comp_styles.header_footer_waves}>
									<div className={comp_styles.header_footer_wave} id={comp_styles.wave1}></div>
									<div className={comp_styles.header_footer_wave} id={comp_styles.wave2}></div>
									<div className={comp_styles.header_footer_wave} id={comp_styles.wave3}></div>
									<div className={comp_styles.header_footer_wave} id={comp_styles.wave4}></div>
								</div>
								<RenderSocialIcons sitesettings={sitesettings} />
								<div className={`${comp_styles.header_footer_text} italic text-sm mt-3`}>...where champions are gathered!</div>
							</div>
						</div>
					</div>
				</div>

				<div onClick={openNavbar} className={comp_styles.header_open}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</header>
		</section>
	);
};

export default HeaderNavbar;
