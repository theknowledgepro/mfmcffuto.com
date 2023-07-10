/** @format */

import React from 'react';
import { APP_ROUTES, ASSETS, SITE_DATA } from '@/config';
import Link from 'next/link';
import styles from '@/components/components.module.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, TextField } from '@mui/material';
import { ImageTag, SocialIcons } from '@/components';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const WebFooter = ({ sitesettings }) => {
	const footerSections = [
		{
			subject: 'Explore!',
			children: [
				{ title: 'Home', href: APP_ROUTES.HOME },
				{ title: 'Academics', href: APP_ROUTES.ACADEMICS },
				{ title: 'Articles & Blogs', href: APP_ROUTES.BLOGS },
				{ title: 'Featured Articles!', href: APP_ROUTES.FEATURED_BLOGS },
				{ title: 'Article Categories', href: APP_ROUTES.BLOGS_CATEGORIES },
				{ title: 'Article Tags', href: APP_ROUTES.BLOGS_TAGS },
				{ title: 'About Us', href: APP_ROUTES.ABOUT_US },
				{ title: 'Our Excos', href: APP_ROUTES.EXCOS },
				{ title: 'Our Gallery', href: APP_ROUTES.GALLERY },
				{ title: 'Sermons', href: APP_ROUTES.SERMONS },
				{ title: 'Give Tithes & Offerings', href: APP_ROUTES.TITHES_OFFERINGS },
				{ title: 'Contact Us', href: APP_ROUTES.CONTACT_US },
			],
		},
		{
			subject: 'Groups in the Fellowship',
			children: [
				{ title: 'Bible Study Group', href: `${APP_ROUTES.FELLOWSHIP_GROUPS}/` },
				{ title: 'Evangelism Group', href: `${APP_ROUTES.FELLOWSHIP_GROUPS}/` },
			],
		},
	];
	const defaultURL = sitesettings && Object?.keys(sitesettings)?.length > 0 ? 'https://' : undefined;

	return (
		<footer className='bg-[var(--color-primary)] xss:px-3 base:px-5 md:px-20'>
			<div className='w-full py-4 border-solid border-b border-zinc-300'>
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
			<div className='w-full py-4 grid xs:grid-cols-1 base:grid-cols-2 md:grid-cols-4 md:gap-4'>
				<div className='sm:px-2 py-2'>
					<div className={styles.footer_nav_subject}>Fellowship With Us @</div>
					<div className={`flex items-center text-white}`}>
						<FaMapMarkerAlt className='mr-2 text-white' />
						<div className='text-white' dangerouslySetInnerHTML={{ __html: sitesettings?.head_office }}></div>
					</div>
					<div className={`mt-2 flex text-white`}>
						<FaPhoneAlt className='mr-2 my-auto' />
						<div
							className='text-white flex-wrap'
							dangerouslySetInnerHTML={{
								__html: `${sitesettings?.phone1 ? sitesettings?.phone1 : ''}${sitesettings?.phone2 ? ', &nbsp;' : ''}`,
							}}></div>
						{sitesettings?.phone2 && (
							<div className='text-white flex-wrap' dangerouslySetInnerHTML={{ __html: sitesettings?.phone2 }}></div>
						)}
					</div>
					<div className={`mt-2 flex text-white`}>
						<FaEnvelope className='mr-2 my-auto' />
						<Link
							href={`mailto:${sitesettings?.contact_us_email}`}
							className='text-none text-white flex-wrap'
							style={{ letterSpacing: '0px' }}>
							{sitesettings?.contact_us_email}
						</Link>
					</div>
				</div>
				{footerSections.map((section, i) => (
					<div className='sm:px-2 py-2' key={i}>
						<div className={styles.footer_nav_subject}>{section?.subject}</div>
						{section.children.map((nav, i) => (
							<div
								className='text-[15px] w-full text-white flex items-center justify-start my-3 duration-300 cursor-pointer hover:translate-x-3'
								key={i}>
								<ArrowForwardIcon className='xss:text-sm md:text-base mr-1' />
								<Link className='text-[16px]' href={nav?.href ?? ''}>
									{nav?.title}
								</Link>
							</div>
						))}
					</div>
				))}
				<div className='sm:px-2 py-2'>
					<div className={styles.footer_nav_subject}>Subscribe To Newsletter!</div>
					<TextField
						name='email'
						placeholder='email@example.com'
						color='white'
						className='mb-4 w-full'
						inputProps={{ type: 'email', className: 'text-white' }}
					/>
					<Button
						sx={{ '&:hover': { background: '#fff', color: 'var(--color-primary)' } }}
						className='w-full rounded-md normal-case text-lg bg-white text-[var(--color-primary)] font-bold btn-animated'>
						Subscribe!
					</Button>
				</div>
			</div>
			<div className='w-full border-solid border-t border-zinc-300 py-4 text-center text-white xs:text-sm md:text-base'>
				© {new Date().getFullYear()} {SITE_DATA.NAME} All Rights Reserved.
			</div>
		</footer>
	);
};

export default WebFooter;
