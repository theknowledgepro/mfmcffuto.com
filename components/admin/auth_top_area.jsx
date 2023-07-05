/** @format */

import React from 'react';
import Divider from '@mui/material/Divider';

const AuthTopArea = ({ title, sitesettings }) => {
	return (
		<div className='px-2'>
			<div className='flex flex-col items-center justify-center py-3'>
				<img src={sitesettings?.logoUrl} height={130} width={140} alt='logo' />
				<h2 className='text-base font-semibold mt-3'>{title}</h2>
			</div>
			<Divider className='bg-primary mb-3 w-full' />
		</div>
	);
};

export default AuthTopArea;
