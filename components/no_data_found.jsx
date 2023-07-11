/** @format */

import React from 'react';
import NoData from '@/assets/no-data.png';
import Image from 'next/image';

const NoDataFound = ({ sorryText, hideLaterText, renderAction }) => {
	return (
		<div className='py-5 flex flex-col items-center justify-center w-full h-full'>
			<Image src={NoData} className='mt-4 w-full h-full' style={{ maxWidth: '700px', maxHeight: '450px' }} />
			<div className='font-medium-custom fs-5 text-center mt-5 mb-4 w-full color-primary'>{sorryText}</div>
			{!hideLaterText && <div className='text-center text-gray-500 text-[16px]'>Please check in again at a later time...</div>}
			{renderAction}
		</div>
	);
};

export default NoDataFound;
