/** @format */

import React from 'react';
import NoData from '@/assets/no-data.png';
import Image from 'next/image';

const NoDataFound = ({ sorryText, hideLaterText, renderAction }) => {
	return (
		<div className='py-5 d-flex flex-column align-items-center justify-content-center w-100 h-100'>
			<Image src={NoData} className='mt-4 w-100 h-100' style={{ maxWidth: '700px', maxHeight: '450px' }} />
			<div className='fw-bold fs-5 text-center mt-5 mb-4 w-100 color-primary'>{sorryText}</div>
			{!hideLaterText && <div className='text-center text-secondary fs-7'>Please check in again at a later time...</div>}
			{renderAction}
		</div>
	);
};

export default NoDataFound;
