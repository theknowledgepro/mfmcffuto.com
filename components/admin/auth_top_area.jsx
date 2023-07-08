/** @format */

import React from 'react';
import Divider from '@mui/material/Divider';
import ImageTag from '../image_tag';
import { ASSETS } from '@/config';

const AuthTopArea = ({ title, sitesettings }) => {
	return (
		<div className='px-2'>
			<div className='flex flex-col items-center justify-center py-3'>
				<ImageTag src={sitesettings?.logoUrl ? sitesettings?.logoUrl : ASSETS.LOGO} style={{ width: '140px', height: '140px' }} alt='logo' />
				<h2 className='text-base font-semibold mt-3'>{title}</h2>
			</div>
			<Divider className='bg-primary mb-3 w-full' />
		</div>
	);
};

export default AuthTopArea;
