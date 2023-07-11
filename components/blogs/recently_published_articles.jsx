/** @format */

import React from 'react';
import { BlogCard, SeeMoreLink } from '..';
import styles from '@/components/components.module.css';
import Grid from '@mui/material/Grid';
import { CUSTOM_UI_TYPES, APP_ROUTES } from '@/config';

const RecentlyPublishedArticles = ({ articles, blogsettings }) => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`font-semibold text-[30px] text-center w-full my-[10px]`}>
				Recently <span className='text-[var(--color-primary)] text-[30px] mx-1'>Published Articles</span>
			</h2>
			<div className='text-center w-full text-gray-600 mb-2'>Stay spiritually healthy with our soul-lifting & edifying articles!</div>
			<Grid spacing={0} columns={{ xs: 12, sm: 8, md: 12 }} container={true} className='w-full mt-6 flex items-center justify-center'>
				{articles.map((blog, index) => (
					<BlogCard
						responsiveSizes={{ xs: 12, sm: 4, md: 4 }}
						responsiveHeight={{
							xs:
								!blogsettings?.blog_preview_card_custom_display ||
								blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
									? '238px'
									: '430px',
							sm:
								!blogsettings?.blog_preview_card_custom_display ||
								blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
									? '268px'
									: '430px',
						}}
						blog={blog}
						size={'LARGE'}
						blogsettings={blogsettings}
						key={index}
					/>
				))}
			</Grid>
			<SeeMoreLink href={APP_ROUTES.BLOGS} actionText={'Explore More Articles!'} />
		</section>
	);
};

export default RecentlyPublishedArticles;
