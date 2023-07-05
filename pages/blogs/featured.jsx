/** @format */

import { WebLayout, WebBanner, BlogCard, NoDataFound, BlogSectionCommonFooter } from '@/components';
import React from 'react';
import styles from '@/pages/pages_styles.module.css';
import comp_styles from '@/components/components.module.css';
import { APP_ROUTES, SITE_DATA } from '@/config';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import WebController from '@/pages/api/controller';
import { Button } from '@mui/material';
import Link from 'next/link';

const FeaturedBlogs = ({ metatags, settings, blogsettings, featuredBlogs }) => {
	const sections = [{ title: 'Articles & Blogs', href: APP_ROUTES.BLOGS }, 'Featured Blogs'];

	return (
		<WebLayout headerOriginalTextColor={true} metatags={metatags} sitesettings={settings}>
			<WebBanner sectionTitle='Featured Blogs' sectionDescription='Find featured articles for your taste!' sections={sections} />
			<div className={`${styles.page_padding} w-100`}>
				<Grid columns={{ xs: 12, sm: 12, md: 12 }} container={true} className='pb-4 d-flex flex-column-reverse flex-md-row'>
					<Grid xs={12} sm={12} md={9.5} item={true} className='pb-5 d-flex flex-column'>
						{featuredBlogs?.length === 0 && (
							<NoDataFound
								renderAction={
									<Link href={APP_ROUTES.BLOGS}>
										<Button className='mt-4 btn-site btn-animated text-white text-decor-none px-5 fw-bold'>Explore Blogs</Button>
									</Link>
								}
								sorryText='No Featured Blogs at this time!'
							/>
						)}
						<Grid spacing={2} columns={{ xs: 12, sm: 8, md: 12 }} container={true} className=''>
							{featuredBlogs?.map((blog, index) => (
								<BlogCard
									responsiveSizes={{ xs: 12, sm: 4, md: 6 }}
									responsiveHeight={{ xs: '238px', sm: '268px' }}
									blog={blog}
									size={'LARGE'}
									blogsettings={blogsettings}
									key={index}
								/>
							))}
						</Grid>
					</Grid>
					<Grid xs={12} sm={12} md={2.5} item={true} className={`${styles.sticky_card_from_md_up} overflow-hidden p-2`}>
						<Divider className='bg-primary my-2 w-100' />
						<div className={`${comp_styles.category_title} ${styles.blog_data_title} ms-2 mb-4`}>Featured Blogs</div>

						<Divider className='bg-primary mt-3 w-100' />
					</Grid>
				</Grid>
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
	req.query.pageSlug = APP_ROUTES.FEATURED_BLOGS;
	const seoData = await WebController.getPageSEO(req, res, true);

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);

	// ** FEATURED BLOGS
	req.query.limit = 5;
	req.query.featured = true;
	const featuredBlogs = await WebController.getBlogsWithPopulatedFields(req, res, true);
	return {
		props: {
			metatags: JSON.parse(
				JSON.stringify({
					og_title: `Featured Blogs | ${SITE_DATA.OFFICIAL_NAME}`,
					og_description: seoData?.meta_description,
					og_url: APP_ROUTES.BLOGS,
					og_image: siteSettings?.logo_url,

					twitter_title: `Featured Blogs | ${SITE_DATA.OFFICIAL_NAME}`,
					twitter_description: seoData?.meta_description,
					twitter_card: 'summary_large_image',
					twitter_image: siteSettings?.logo_url,
					twitter_site: siteSettings?.org_twitter_username,

					meta_title: `Featured Blogs | ${SITE_DATA.OFFICIAL_NAME}`,
					...seoData,
				})
			),
			settings: siteSettings,
			blogsettings: blogSettings,
			featuredBlogs: featuredBlogs?.length ? featuredBlogs : [],
		},
	};
}

export default FeaturedBlogs;
