/** @format */

import React from 'react';

const FellowshipGroupsPreview = () => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`font-semibold text-[30px] text-center w-full line-height-2 my-[10px]`}>
				<span className='text-[var(--color-primary)] text-[30px] mx-1'>Groups in the Fellowship</span>
			</h2>
			<i className='text-center text-[14px] w-full text-gray-600 mb-2'>
				Do not be drunken with wine wherein is excess but be filled with the Spirit... -{' '}
				<i className='font-medium-custom text-[var(--color-primary)]'>Eph. 5:18</i>
			</i>
		</section>
	);
};

export default FellowshipGroupsPreview;
