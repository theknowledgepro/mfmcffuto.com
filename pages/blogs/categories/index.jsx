/** @format */

import { WebLayout, TypeWriterWebBanner, CategoriesSection, RecentlyPublishedArticles, BlogSectionCommonFooter } from '@/components';
import React from 'react';
import styles from '@/pages/pages_styles.module.css';
import { APP_ROUTES, SITE_DATA } from '@/config';
import WebController from '@/pages/api/controller';
import { CustomizeAppBackground } from '@/utils/customize_bg';

const BlogCategories = ({ metatags, settings, blogsettings, categories, recentBlogs }) => {
	const sections = [{ title: 'Articles & Blogs', href: APP_ROUTES.BLOGS }, `Browse By Categories`];
	CustomizeAppBackground({ color: 'var(--bg-fair-one)' });
	return (
		<WebLayout headerOriginalTextColor={true} metatags={metatags} sitesettings={settings}>
			<TypeWriterWebBanner stringsArray={blogsettings?.categories_section_typewriter} sections={sections} />
			<div className={`${styles.page_padding} `}>
				<CategoriesSection isCategoryPage blogsettings={blogsettings} categories={categories} />
				<RecentlyPublishedArticles blogsettings={blogsettings} articles={recentBlogs} />
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
	req.query.pageSlug = APP_ROUTES.BLOGS_CATEGORIES;
	const seoData = await WebController.getPageSEO(req, res, true);

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);

	// ** RECENT BLOGS
	req.query.limit = 6;
	const recentBlogs = await WebController.getBlogsWithPopulatedFields(req, res, true);

	// ** BLOGS CATEGORIES
	req.query.limit = 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
	const allCategories = await WebController.getBlogCategories(req, res, true);

	return {
		props: {
			metatags: JSON.parse(
				JSON.stringify({
					og_title: `Blog Categories | ${SITE_DATA.OFFICIAL_NAME}`,
					og_description: seoData?.meta_description,
					og_url: APP_ROUTES.BLOGS_CATEGORIES,
					og_image: siteSettings?.logo_url,

					twitter_title: `Blog Categories | ${SITE_DATA.OFFICIAL_NAME}`,
					twitter_description: seoData?.meta_description,
					twitter_card: 'summary_large_image',
					twitter_image: siteSettings?.logo_url,
					twitter_site: siteSettings?.org_twitter_username,

					meta_title: `Blog Categories | ${SITE_DATA.OFFICIAL_NAME}`,
					meta_description: seoData?.meta_description,
					meta_keywords: seoData?.meta_keywords,
				})
			),
			settings: siteSettings,
			blogsettings: blogSettings,
			categories: allCategories?.length ? allCategories : [],
			recentBlogs: recentBlogs?.length ? recentBlogs : [],
		},
	};
}

export default BlogCategories;
