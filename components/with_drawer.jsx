/** @format */

import React, { useState } from 'react';
import styles from './components.module.css';
import { Avatar, IconButton } from '@mui/material';
import { SocialIcons } from '.';
import CancelIcon from '@mui/icons-material/CancelOutlined';

const WithDrawer = ({ main, sitesettings, useWidth }) => {
	const defaultURL = sitesettings && Object?.keys(sitesettings)?.length > 0 ? 'https://' : undefined;
	const [openNav, setOpenNav] = useState(false);

	const handleToggleNavbar = () => {
		setOpenNav(!openNav);
		const header = document.getElementById('site-header-bar');
		const drawer = document.getElementById('site-side-bar');
		header.classList.remove('translateY-100');
		header.classList.add('translateY-none');
		return drawer.classList.remove('site-side-bar-open');
	};

	return (
		<div className='w-100 h-100 d-flex'>
			<div id='site-side-bar' className={`${styles.with_drawer_container}`} style={{ '--use-width': useWidth ?? '250px' }}>
				<div className={styles.with_drawer_user_acct}>
					<div className='d-flex w-100 rounded-1 p-2'>
						
						<IconButton onClick={handleToggleNavbar} sx={{ position: 'absolute', top: '5px', right: '2px' }}>
							<CancelIcon />
						</IconButton>
					</div>
				</div>
				<div className={styles.with_drawer_bottom}>
					<div className='w-100 text-center fw-medium fs-8 mb-2'>Connect with Us @</div>
					<SocialIcons
						sitesettings={{ ...sitesettings, facebookUrl: '', instagramUrl: '', telegramUrl: '', whatsAppUrl: 'ddddd', youTubeUrl: '' }}
						defaultURL={defaultURL}
					/>
				</div>
			</div>
			<div className={`${styles.with_drawer_main}`} style={{ '--use-width': useWidth ?? '250px' }}>{main}</div>
		</div>
	);
};

export default WithDrawer;
