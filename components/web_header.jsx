/** @format */

import React, { useRef } from 'react';
import { ImageTag, SocialIcons } from '@/components';
import { ChangeClassNameAtPosition, HideShowNavbarOnScroll } from '@/utils/use_scroll';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import MenuIcon from '@mui/icons-material/Menu';

const WebHeader = ({ sitesettings }) => {
	const preHeaderRef = useRef(null);
	const sideBarRef = useRef(null);
	const mobileHeaderRef = useRef(null);

	ChangeClassNameAtPosition({ targetRef: preHeaderRef, position: 45, className: 'translateY-100' });
	HideShowNavbarOnScroll({ targetRef: mobileHeaderRef, className: 'translateY-100', startPosition: 500 });

	const handleOpenSideNav = () => {
		mobileHeaderRef?.current?.classList.toggle('hide-modile-header');
		sideBarRef?.current?.classList.toggle('hide-side-nav');
	};

	const defaultURL = sitesettings && Object?.keys(sitesettings)?.length > 0 ? 'https://' : undefined;
	return (
		<div className={`fixed top-0 left-0 right-0 w-[100vw] h-[max-content] p-0 m-0`}>
			<div
				ref={preHeaderRef}
				className='w-full p-2 xs:hidden md:flex items-center justify-between bg-inherit transition-all ease-out duration-300'>
				<div className='px-2 w-full flex'></div>
				<div className='px-2 flex'>
					<SocialIcons
						sitesettings={{ ...sitesettings, facebookUrl: '', instagramUrl: '', telegramUrl: '', whatsAppUrl: 'ddddd', youTubeUrl: '' }}
						defaultURL={defaultURL}
					/>
				</div>
			</div>
			<div
				ref={mobileHeaderRef}
				className='w-full bg-[var(--color-primary)] xs:flex md:hidden items-center justify-between p-2 transition-all ease-out duration-300'>
				<ImageTag src={''} style={{ width: '50px', height: '50px' }} alt='logo' />
				<IconButton onClick={handleOpenSideNav}>
					<MenuIcon className='text-white text-[28px]' />
				</IconButton>
			</div>
			<div
				ref={sideBarRef}
				className='fixed top-0 left-0 bg-[var(--app-bg)] border w-[94vw] h-[100vh] xs:flex md:hidden flex-col p-2 hide-side-nav transition-all ease-out duration-300'>
				<IconButton className='absolute top-[10px] right-[10px]' onClick={handleOpenSideNav}>
					<CancelIcon className='text-[var(--color-primary)] text-[28px]' />
				</IconButton>
				<ImageTag src={''} style={{ width: '50px', height: '50px', margin: '0 auto' }} alt='logo' />
				<div className='flex flex-col items-start justify-start p-2'></div>
			</div>
		</div>
	);
};

export default WebHeader;
