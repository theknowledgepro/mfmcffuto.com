/** @format */

import React, { useRef } from 'react';
import { ImageTag, SocialIcons } from '@/components';
import { ChangeClassNameAtPosition, HideShowNavbarOnScroll } from '@/utils/use_scroll';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { ASSETS } from '@/config';
import {
	Box,
	IconButton,
	List,
	ListItem,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import Link from 'next/link';
import { getAbsoluteUrl } from '@/utils/get_absolute_url';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/components/components.module.css';

const RenderNavigation = ({ nav }) => {
	return (
		<Link className='text-decor-none' href={nav.href !== undefined ? nav.href : ''} style={{ color: 'inherit', width: '100%' }}>
			<ListItem
				disablePadding
				className='rounded-sm bg-[var(--mobile-header-bg)]'
				sx={{
					display: 'block',
					background: getAbsoluteUrl() === nav.href && 'var(--navbar-side-hover-bg)',
					color: getAbsoluteUrl() === nav.href ? 'var(--navbar-side-hover-color)' : '#000',
					'&:hover': { background: 'var(--navbar-side-hover-bg)' },
				}}>
				<ListItemButton sx={{ minHeight: 48, justifyContent: 'initial', px: 1.5, fontFamily: 'inherit' }}>
					<ListItemIcon sx={{ minWidth: 0, mr: 1, ml: 'auto', justifyContent: 'center', color: '#000' }}>{nav.icon}</ListItemIcon>
					<ListItemText
						primary={<span style={{ fontFamily: 'var(--font-family)' }}>{nav.name}</span>}
						className='text-[15px]'
						sx={{ opacity: 1 }}
					/>
				</ListItemButton>
			</ListItem>
		</Link>
	);
};

const RenderDropdownNav = ({ nav }) => {
	return (
		<div className='w-full'>
			<Accordion disableGutters elevation={0} expanded={nav.children.find((index) => index.href === getAbsoluteUrl())}>
				<AccordionSummary
					className='rounded-sm bg-[var(--mobile-header-bg)]'
					sx={{
						padding: '0px auto',
						borderRadius: '0px',
						display: 'flex',
						background: nav.children.find((index) => index.href === getAbsoluteUrl()) && 'var(--navbar-side-hover-bg)',
						color: getAbsoluteUrl() === nav.href ? 'var(--navbar-side-hover-color)' : '#000',
					}}
					expandIcon={<ExpandMoreIcon />}>
					<Box sx={{ minWidth: 0, ml: -0.5, mr: 1, justifyContent: 'center' }}>{nav.icon}</Box>
					<Box sx={{ opacity: 1, width: 'auto' }} className='text-[16px]'>
						{nav.name}
					</Box>
				</AccordionSummary>

				<AccordionDetails sx={{ padding: '0 0', width: '100%', border: 'none', borderRadius: '0px', borderRight: '1px solid #eee' }}>
					{nav.children.map((child, index) => (
						<RenderNavigation nav={child} key={index} />
					))}
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

const WebHeader = ({ sitesettings }) => {
	const preHeaderRef = useRef(null);
	const pcHeaderRef = useRef(null);
	const sideBarRef = useRef(null);
	const mobileHeaderRef = useRef(null);
	const mobileHeaderRefNavIcon = useRef(null);

	ChangeClassNameAtPosition({ targetRef: preHeaderRef, position: 45, className: 'translateY-100' });
	ChangeClassNameAtPosition({ targetRef: pcHeaderRef, position: 45, className: 'header-original' });
	ChangeClassNameAtPosition({ targetRef: mobileHeaderRef, position: 200, className: 'mobile-header-shadow' });
	ChangeClassNameAtPosition({ targetRef: mobileHeaderRef, position: 200, className: 'mobile-header-bg-original' });
	ChangeClassNameAtPosition({ targetRef: mobileHeaderRefNavIcon, position: 200, className: 'text-white' });
	// HideShowNavbarOnScroll({ targetRef: mobileHeaderRef, className: 'translateY-100', startPosition: 500 });
	// HideShowNavbarOnScroll({ targetRef: pcHeaderRef, className: 'translateY-100', startPosition: 500 });

	const handleOpenSideNav = () => {
		mobileHeaderRef?.current?.classList.toggle('hide-modile-header');
		sideBarRef?.current?.classList.toggle('hide-side-nav');
		document.body.classList.toggle('body-sticky');
	};

	const defaultURL = sitesettings && Object?.keys(sitesettings)?.length > 0 ? 'https://' : undefined;

	const NavItems = [
		{ name: 'Home', href: '', icon: '' },
		{ name: 'About Us', href: '', icon: '' },
		{ name: 'Academics', href: '', icon: '' },
		{
			name: 'Articles & Blogs',
			href: '',
			icon: '',
			children: [
				{ name: 'Explore Articles & Blogs', href: '', icon: '' },
				{ name: 'Featured Articles!', href: '', icon: '' },
				{ name: 'Browse By Categories', href: '', icon: '' },
				{ name: 'Browse By Tags', href: '', icon: '' },
			],
		},
		{ name: 'Fellowship Groups', href: '', icon: '', children: [{ name: 'Bible Study Group', href: '', icon: '' }] },
		{ name: 'Our Excos', href: '', icon: '' },
		{ name: 'Gallery', href: '', icon: '' },
		{ name: 'Sermons', href: '', icon: '' },
		{ name: 'Tithes & Offerings', href: '', icon: '' },
		{ name: 'Contact Us', href: '', icon: '' },
	];

	return (
		<div className={`z-[1000] fixed top-0 left-0 right-0 w-[100vw] h-[max-content] p-0 m-0`}>
			<div
				ref={preHeaderRef}
				className='w-full p-2 hidden md:flex items-center justify-between bg-inherit transition-all ease-out duration-300'>
				<div className='px-2 w-full flex'></div>
				<div className='pr-5 flex'>
					<SocialIcons
						sitesettings={{ ...sitesettings, facebookUrl: '', instagramUrl: '', telegramUrl: '', whatsAppUrl: 'ddddd', youTubeUrl: '' }}
						defaultURL={defaultURL}
					/>
				</div>
			</div>
			<div
				ref={pcHeaderRef}
				className='hidden border-b border-t py-2 sm:pr-[30px] sm:pl-[25px] md:pr-[50px] md:pl-[30px] md:flex justify-between items-center transition-all ease-out duration-300'>
				<ImageTag
					src={sitesettings?.logoUrl ? sitesettings?.logoUrl : ASSETS.LOGO}
					style={{ width: '50px', height: '50px' }}
					className='bg-white p-[3px] rounded-[50%]'
					alt='logo'
				/>
				<div className='flex items-center justify-center'>
					{NavItems.map((nav, i) => (
						<div className='mx-2' key={i}>
							<Link href={nav?.href ?? ''} className=''>
								{nav.name}
							</Link>
						</div>
					))}
				</div>
			</div>
			<div
				ref={mobileHeaderRef}
				className='w-full flex md:hidden items-center justify-between p-2 border-b border-zinc-300 transition-all ease-out duration-300'>
				<ImageTag
					src={sitesettings?.logoUrl ? sitesettings?.logoUrl : ASSETS.LOGO}
					style={{ width: '50px', height: '50px' }}
					className='bg-white p-[3px] rounded-[50%]'
					alt='logo'
				/>
				<IconButton onClick={handleOpenSideNav}>
					<MenuIcon ref={mobileHeaderRefNavIcon} className='text-[28px] text-[var(--color-primary)]' />
				</IconButton>
			</div>
			<div
				ref={sideBarRef}
				className='fixed overflow-hidden top-0 left-0 bg-[var(--mobile-header-bg)] border-r border-gray-200 shadow-md w-[100vw] h-[100vh] xs:flex md:hidden flex-col p-2 hide-side-nav transition-all ease-out duration-300'>
				<IconButton className='absolute top-[15px] right-[10px]' onClick={handleOpenSideNav}>
					<CancelIcon className='text-[var(--color-primary)] text-[28px]' />
				</IconButton>
				<ImageTag
					src={sitesettings?.logoUrl ? sitesettings?.logoUrl : ASSETS.LOGO}
					style={{ width: '110px', height: '110px' }}
					className='border border-gray-100 bg-white btn-animated rounded-[50%] mt-[20px] mx-auto mb-2 p-2 shadow-lg'
					alt='logo'
				/>
				<div className='w-full text-center font-bold text-[var(--color-primary)]'>FUTO CHAPTER</div>
				<div className='text-center mb-2 text-[12px] text-gray-700' style={{ fontFamily: 'cursive' }}>
					...where champions are gathered!
				</div>
				<List className={`flex flex-col items-start justify-start overflow-y-auto overflow-x-hidden mb-[100px] pb-[70px]`}>
					{NavItems.map((nav, index) => (
						<React.Fragment key={index}>
							{nav.children && <RenderDropdownNav nav={nav} />}
							{!nav.children && <RenderNavigation nav={nav} />}
						</React.Fragment>
					))}
				</List>
				<div className='fixed bottom-0 left-0 w-full border-t border-[var(--color-primary)] bg-[var(--color-primary)]'>
					<div className='py-3 relative w-full h-full flex items-center justify-center flex-col'>
						<div className={styles.footer_wave} id={styles.wave1}></div>
						<div className={styles.footer_wave} id={styles.wave2}></div>
						<div className={styles.footer_wave} id={styles.wave3}></div>
						<div className={styles.footer_wave} id={styles.wave4}></div>
						<div className='w-full text-center text-white text-[12px] mb-2'>Connect with Us @</div>
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
				</div>
			</div>
		</div>
	);
};

export default WebHeader;
