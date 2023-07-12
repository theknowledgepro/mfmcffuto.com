/** @format */

import { WebLayout, TypeWriterWebBanner, BlogCard, NoDataFound, WebBanner, BlogSectionCommonFooter } from '@/components';
import React from 'react';
import styles from '@/pages/pages_styles.module.css';
import comp_styles from '@/components/components.module.css';
import { APP_ROUTES, CUSTOM_UI_TYPES, SITE_DATA } from '@/config';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import WebController from '@/pages/api/controller';
import Link from 'next/link';
import { Button } from '@mui/material';
import { CustomizeAppBackground } from '@/utils/customize_bg';

const Category = ({ metatags, settings, blogsettings, category }) => {
	const sections = [
		{ title: 'Articles & Blogs', href: APP_ROUTES.BLOGS },
		{ title: 'Browse By Categories', href: APP_ROUTES.BLOGS_CATEGORIES },
		`${category?.published ? category?.title : 'Not Found!'}`,
	];
	CustomizeAppBackground({ color: 'var(--bg-fair-one)' });

	return (
		<WebLayout headerOriginalTextColor={true} metatags={metatags} sitesettings={settings}>
			{!category?.published && (
				<React.Fragment>
					<WebBanner
						sections={sections}
						sectionDescription={
							<div>
								<span className='fs-1'>Ooops!</span> <br />
								Something Broke!
								<br />
								<br />
								We could not find the category you requested!
							</div>
						}
					/>
					<NoDataFound
						hideLaterText
						renderAction={
							<Link href={APP_ROUTES.BLOGS_CATEGORIES}>
								<Button className='btn-site btn-animated text-white text-decor-none px-5 fw-bold'>Explore Browse Categories</Button>
							</Link>
						}
						sorryText='Ooops! We could not find this Blog Category!'
					/>
				</React.Fragment>
			)}
			{category?.published && (
				<React.Fragment>
					<TypeWriterWebBanner stringsArray={category?.type_writer_strings} sections={sections} />
					<div className={`${styles.page_padding} w-full mt-5`}>
						<Grid columns={{ xs: 12, sm: 12, md: 12 }} container={true} className='pb-4 flex md:flex-row'>
							<Grid xs={12} sm={12} md={9.5} item={true} className='pb-5 flex flex-col xss:order-2 md:order-1'>
								{category?.blogs?.length === 0 && (
									<NoDataFound sorryText='Ooops! We could not find any blog for this category at this time!' />
								)}
								<Grid spacing={0} columns={{ xs: 12, sm: 8, md: 12 }} container={true} className=''>
									{category?.blogs?.map((blog, index) => (
										<BlogCard
											responsiveSizes={{ xs: 12, sm: 4, md: 6 }}
											responsiveHeight={{
												xs:
													!blogsettings?.blog_preview_card_custom_display ||
													blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
														? '238px'
														: '480px',
												sm:
													!blogsettings?.blog_preview_card_custom_display ||
													blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
														? '268px'
														: '480px',
											}}
											blog={blog}
											size={'LARGE'}
											blogsettings={blogsettings}
											key={index}
										/>
									))}
								</Grid>
							</Grid>
							<Grid xs={12} sm={12} md={2.5} item={true} className={`${styles.sticky_card_from_md_up} xss:order-1 md:order-2 mb-4 overflow-hidden p-2`}>
								<Divider className='bg-primary my-2 w-full' />
								<div className={`${comp_styles.category_title} ${styles.blog_data_title} ms-2 mb-4 pb-3`}>{category?.title}</div>

								{category?.blogs?.length > 0 && (
									<div className='mt-4 w-full fs-9 text-secondary'>
										{category?.blogs?.length} published article{category?.blogs?.length > 1 ? 's' : ''} in this category.
									</div>
								)}

								<div className='w-full mt-2'>
									<blockquote>{category?.description}</blockquote>
								</div>
								<Divider className='bg-primary mt-3 w-full' />
							</Grid>
						</Grid>
					</div>
				</React.Fragment>
			)}
			<BlogSectionCommonFooter />
		</WebLayout>
	);
};

export async function getServerSideProps({ req, res, query }) {
	req.query = query;

	// ** GET SITE SETTINGS
	const siteSettings = await WebController.getSiteSettings(req, res, true);

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);

	// ** GET CATEGORY DATA
	let category = await WebController.getCategoryDataPage(req, res, true);
	category = category ? (category?.published ? category : { published: category?.published }) : {};
	return {
		props: {
			metatags: JSON.parse(
				JSON.stringify({
					og_title: `${category?.title ? category?.title : 'Not Found!'} | ${SITE_DATA.OFFICIAL_NAME}`,
					og_description: category?.meta_description,
					og_url: `${APP_ROUTES.BLOGS_CATEGORIES}/${query?.category}`,
					og_image: category?.thumbnail,

					twitter_title: `${category?.title ? category?.title : 'Not Found!'} | ${SITE_DATA.OFFICIAL_NAME}`,
					twitter_description: category?.meta_description,
					twitter_card: 'summary_large_image',
					twitter_image: category?.thumbnail,
					twitter_site: siteSettings?.org_twitter_username,

					meta_title: `${category?.title ? category?.title : 'Not Found!'} | ${SITE_DATA.OFFICIAL_NAME}`,
					meta_description: category?.meta_description,
					meta_keywords: category?.meta_keywords,
				})
			),
			settings: siteSettings,
			blogsettings: blogSettings,
			category: category,
		},
	};
}

export default Category;
