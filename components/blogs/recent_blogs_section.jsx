/** @format */

import React from 'react';
import { BlogCard } from '..';
import styles from '@/components/components.module.css';
import Grid from '@mui/material/Grid';
import { CUSTOM_UI_TYPES } from '@/config';

const RecentBlogsSection = ({ recentBlogs = [], blogsettings }) => {
	return (
		<section className='w-100 py-3 mb-5'>
			<h1 className={styles.section_title}>Stay Updated!</h1>
			<h2 className={styles.section_sub_title}>View Our Most Recent Posts</h2>

			<Grid spacing={0} columns={{ xs: 12, sm: 8, md: 12 }} container={true} className='w-100 d-flex align-items-center justify-content-center'>
				{recentBlogs.map((blog, index) => (
					<BlogCard
						responsiveSizes={{ xs: 12, sm: 4, md: 4 }}
						responsiveHeight={{
							xs:
								!blogsettings?.blog_preview_card_custom_display ||
								blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
									? '238px'
									: '420px',
							sm:
								!blogsettings?.blog_preview_card_custom_display ||
								blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
									? '268px'
									: '420px',
						}}
						blog={blog}
						size={'LARGE'}
						blogsettings={blogsettings}
						key={index}
					/>
				))}
			</Grid>
		</section>
	);
};

export default RecentBlogsSection;
