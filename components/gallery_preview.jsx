/** @format */

import React from 'react';

const GalleryPreviewSection = () => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`font-semibold text-[30px] text-center w-full my-[10px]`}>
				Our <span className='text-[var(--color-primary)] text-[30px] mx-1'>Gallery</span>
			</h2>
		</section>
	);
};

export default GalleryPreviewSection;
