/** @format */

import React from 'react';

const AuthTopArea = ({ title, sitesettings }) => {
	return (
		<div className='flex flex-col items-center justify-center border-bottom-1-eee py-3'>
			<img src={sitesettings?.logoUrl} height={130} width={140} alt='logo' />
			<h2 className='text-base font-semibold mt-3'>
				{title}
			</h2>
		</div>
	);
};

export default AuthTopArea;
