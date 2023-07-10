/** @format */

import React from 'react';
import comp_styles from './components.module.css';
import Link from 'next/link';
import { SvgIcons } from './icons';
import { SITE_DATA } from '@/config';

const SocialIcons = ({ sitesettings, defaultURL }) => {
	return (
		<div className={`${comp_styles.social_icons}`}>
			{sitesettings?.facebookUrl && sitesettings?.facebookUrl !== defaultURL && (
				<Link target='_blank' href={sitesettings?.facebookUrl ?? ''} className={`${comp_styles.icon} facebook`}>
					<SvgIcons.FaFacebookF />
				</Link>
			)}
			{sitesettings?.instagramUrl && sitesettings?.instagramUrl !== defaultURL && (
				<Link target='_blank' href={sitesettings?.instagramUrl ?? ''} className={`${comp_styles.icon} instagram`}>
					<SvgIcons.FaInstagram />
				</Link>
			)}
			{sitesettings?.telegramUrl && sitesettings?.telegramUrl !== defaultURL && (
				<Link target='_blank' href={sitesettings?.telegramUrl ?? ''} className={`${comp_styles.icon} telegram`}>
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
			{sitesettings?.youTubeUrl && sitesettings?.youTubeUrl !== defaultURL && (
				<Link target='_blank' href={sitesettings?.youTubeUrl ?? ''} className={`${comp_styles.icon} youtube`}>
					<SvgIcons.FaYoutube />
				</Link>
			)}
		</div>
	);
};

export default SocialIcons;
