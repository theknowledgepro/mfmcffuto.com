/** @format */

import React from 'react';

const RecentlyPublishedArticles = () => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`font-semibold text-[30px] text-center w-full my-[10px]`}>
				Recently <span className='text-[var(--color-primary)] text-[30px] mx-1'>Published Articles</span>
			</h2>
			<div className='text-center w-full text-gray-600 mb-2'>Stay spiritually healthy with our soul-lifting & edifying articles!</div>
		</section>
	);
};

export default RecentlyPublishedArticles;
