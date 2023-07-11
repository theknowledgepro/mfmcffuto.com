/** @format */

import React from 'react';

const SermonsPreviewSection = () => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`line-height-2 font-semibold text-[30px] text-center w-full my-[10px]`}>
				Download<span className='text-[var(--color-primary)] text-[30px] mx-1'> Sermons!</span>
			</h2>
			<i className='text-[14px] text-center w-full text-gray-600 mb-2'>
				Do not be drunken with wine wherein is excess but be filled with the Spirit... -{' '}
				<i className='font-medium-custom text-[var(--color-primary)]'>Eph. 5:18</i>
			</i>
		</section>
	);
};

export default SermonsPreviewSection;
