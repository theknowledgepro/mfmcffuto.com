/** @format */

import React from 'react';

const GiveTithesAndOfferingsPreviewSection = () => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`font-semibold text-[30px] text-center w-full my-[10px]`}>
				<span className='text-[var(--color-primary)] text-[30px] mx-1'>Offerings & Tithes!</span>
			</h2>
			<i className='text-center w-full text-gray-600 mb-2'>
				Honor the LORD with the firstfruits of your substance... - <i className='font-medium-custom text-[var(--color-primary)]'>Prov. 3:8</i>
			</i>
		</section>
	);
};

export default GiveTithesAndOfferingsPreviewSection;
