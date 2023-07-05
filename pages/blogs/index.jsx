/** @format */

import { WebLayout, CategoriesSection, RecentBlogsSection, BlogCard, BlogSectionCommonFooter } from '@/components';
import { APP_ROUTES, SITE_DATA } from '@/config';
import React from 'react';
import styles from '@/pages/pages_styles.module.css';
import Grid from '@mui/material/Grid';
import WebController from '@/pages/api/controller';

const BlogsIntroPage = ({ metatags, settings, blogsettings, categories, featuredBlogs, recentBlogs }) => {
	return (
		<WebLayout headerOriginalBgColor={true} metatags={metatags} sitesettings={settings}>
			<div className={`${styles.page_padding} ${styles.page_top_margin} `}>
				<div id='#recently-featured' className='rounded-sm mb-5'>
					<Grid spacing={0.5} columns={{ xs: 12, sm: 8, md: 12 }} container={true} className=''>
						{featuredBlogs?.slice(0, 1).map((blog, i) => (
							<BlogCard
								blogType={'FEATURED'}
								responsiveSizes={{ xs: 12, sm: 4, md: 6 }}
								responsiveHeight={{ xs: '250px', sm: '410px' }}
								blog={blog}
								size={'LARGE'}
								blogsettings={blogsettings}
								key={i}
							/>
						))}
						<Grid spacing={0.5} xs={12} sm={4} md={6} columns={{ xs: 12, sm: 8, md: 12 }} container={true} item={true}>
							{featuredBlogs?.slice(1, undefined).map((blog, i) => (
								<BlogCard
									blogType={'FEATURED'}
									responsiveSizes={{ xs: 6, sm: 4, md: 6 }}
									responsiveHeight={{ xs: '172px', sm: '202px' }}
									blog={blog}
									size={'SMALL'}
									blogsettings={blogsettings}
									key={i}
								/>
							))}
						</Grid>
					</Grid>
				</div>
				<CategoriesSection blogsettings={blogsettings} categories={categories} />
				<RecentBlogsSection blogsettings={blogsettings} recentBlogs={recentBlogs} />
				<BlogSectionCommonFooter />
			</div>
		</WebLayout>
	);
};

export async function getServerSideProps({ req, res, query }) {
	// ** PASS PARAMS TO REQ OBJECT FOR FILTERS AND FETCH LIMITS IN SERVER SIDE REQUESTS
	req.query = query;

	// ** GET SITE SETTINGS
	const siteSettings = await WebController.getSiteSettings(req, res, true);

	// ** GET PAGE SEO DATA
	req.query.pageSlug = APP_ROUTES.BLOGS;
	const seoData = await WebController.getPageSEO(req, res, true);

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);

	// ** RECENT BLOGS
	req.query.limit = 6;
	const recentBlogs = await WebController.getBlogsWithPopulatedFields(req, res, true);

	// ** FEATURED BLOGS
	req.query.limit = 5;
	req.query.featured = true;
	const featuredBlogs = await WebController.getBlogsWithPopulatedFields(req, res, true);

	// ** BLOGS CATEGORIES
	req.query.limit = 6;
	const allCategories = await WebController.getBlogCategories(req, res, true);

	return {
		props: {
			metatags: JSON.parse(
				JSON.stringify({
					og_title: `Blogs | ${SITE_DATA.OFFICIAL_NAME}`,
					og_description: seoData?.meta_description,
					og_url: APP_ROUTES.BLOGS,
					og_image: siteSettings?.logo_url,

					twitter_title: `Blogs | ${SITE_DATA.OFFICIAL_NAME}`,
					twitter_description: seoData?.meta_description,
					twitter_card: 'summary_large_image',
					twitter_image: siteSettings?.logo_url,
					twitter_site: siteSettings?.org_twitter_username,

					meta_title: `Blogs | ${SITE_DATA.OFFICIAL_NAME}`,
					...seoData,
				})
			),
			settings: siteSettings,
			blogsettings: blogSettings,
			recentBlogs: recentBlogs?.length ? recentBlogs : [],
			featuredBlogs: featuredBlogs?.length ? featuredBlogs : recentBlogs?.length ? recentBlogs.slice(0, 5) : [],
			categories: allCategories?.length ? allCategories : [],
		},
	};
}

export default BlogsIntroPage;
