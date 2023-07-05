/** @format */

import { WebLayout, WebSectionBreadCrumb, BlogCard, BlogSectionCommonFooter, NoDataFound } from '@/components';
import React from 'react';
import styles from '@/pages/pages_styles.module.css';
import comp_styles from '@/components/components.module.css';
import { APP_ROUTES, CUSTOM_UI_TYPES, SITE_DATA } from '@/config';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import WebController from '@/pages/api/controller';

const RenderTagsBlock = ({ tag, blogsettings }) => {
	if (tag?.blogs?.length === 0) return;
	return (
		<div id={`${tag?.slug}`} className='pt-5'>
			<div className={`${comp_styles.category_title} ${styles.blog_data_title} ms-2 mb-4`}>
				<span className='color-primary'>#</span> {tag?.title}
			</div>
			<Grid spacing={0} columns={{ xs: 12, sm: 8, md: 12 }} container={true} className=''>
				{tag?.blogs?.map((blog, index) => (
					<BlogCard
						responsiveSizes={{ xs: 12, sm: 4, md: 6 }}
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
		</div>
	);
};

const RenderTagsLink = ({ tag }) => {
	if (tag?.blogs?.length === 0) return;
	return (
		<div className='w-100 py-2'>
			<Link className={`${comp_styles.category_title} text-decor-none text-dark pb-1`} href={`#${tag?.slug}`}>
				<span className='color-primary'>#</span> {tag?.title}
			</Link>
		</div>
	);
};

const BlogTags = ({ metatags, settings, blogsettings, tags }) => {
	const sections = [{ title: 'Articles & Blogs', href: APP_ROUTES.BLOGS_TAGS }, `Browse By Tags`];
	return (
		<WebLayout headerOriginalBgColor={true} metatags={metatags} sitesettings={settings}>
			<div className={`${styles.page_padding} ${styles.page_top_margin} `}>
				<div className='w-100 px-2 pt-2'>
					<WebSectionBreadCrumb sections={sections} />
				</div>
				{tags?.length === 0 && <NoDataFound sorryText='Ooops! We could not find any blog tags at this time!' />}
				{tags?.length > 0 && (
					<Grid columns={{ xs: 12, sm: 12, md: 12 }} container={true} className='pb-4 d-flex flex-column-reverse flex-md-row'>
						<Grid xs={12} sm={12} md={9.5} item={true} className='pb-5 d-flex flex-column'>
							{tags?.map((tag, index) => (
								<RenderTagsBlock key={index} tag={tag} blogsettings={blogsettings} />
							))}
						</Grid>
						<Grid xs={12} sm={12} md={2.5} item={true} className={`${styles.sticky_card_from_md_up} overflow-hidden p-2`}>
							<Divider className='bg-primary my-2 w-100' />
							<div className='w-100 h-100'>
								{tags?.map((tag, index) => (
									<RenderTagsLink key={index} tag={tag} />
								))}
							</div>
							<Divider className='bg-primary mt-3 w-100' />
						</Grid>
					</Grid>
				)}
				<BlogSectionCommonFooter />
			</div>
		</WebLayout>
	);
};

export async function getServerSideProps({ req, res, query }) {
	req.query = query;

	// ** GET SITE SETTINGS
	const siteSettings = await WebController.getSiteSettings(req, res, true);

	// ** GET PAGE SEO DATA
	req.query.pageSlug = APP_ROUTES.BLOGS_TAGS;
	const seoData = await WebController.getPageSEO(req, res, true);

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);

	// ** GET ALL BLOG TAGS
	req.query.select = '-_id -uniqueID -description -author -published -updatedAt -__v';
	const allTags = await WebController.getAllBlogTagsPage(req, res, true);

	return {
		props: {
			metatags: JSON.parse(
				JSON.stringify({
					og_title: `Blog Tags | ${SITE_DATA.OFFICIAL_NAME}`,
					og_description: seoData?.meta_description,
					og_url: APP_ROUTES.BLOGS_TAGS,
					og_image: siteSettings?.logo_url,

					twitter_title: `Blog Tags | ${SITE_DATA.OFFICIAL_NAME}`,
					twitter_description: seoData?.meta_description,
					twitter_card: 'summary_large_image',
					twitter_image: siteSettings?.logo_url,
					twitter_site: siteSettings?.org_twitter_username,

					meta_title: `Blog Tags | ${SITE_DATA.OFFICIAL_NAME}`,
					...seoData,
				})
			),
			settings: siteSettings,
			blogsettings: blogSettings,
			tags: allTags?.length ? allTags : [],
		},
	};
}

export default BlogTags;
