/** @format */

module.exports = {
	NOT_FOUND: '/404',
	HOME: '/',
	CONTACT_US: '/contact-us',
	ABOUT_US: '/about-us',
	SERVICES: '/services',
	TERMS: '#',
	// ** BLOGS ROUTES
	BLOGS: `/blogs`,
	BLOGS_CATEGORIES: `/blogs/categories`,
	BLOGS_TAGS: `/blogs/tags`,
	FEATURED_BLOGS: `/blogs/featured`,

	// ** ADMIN PANEL ROUTES
	ADMIN_DASHBOARD: '/admin',
	ADMIN_PROFILE: '/admin/my-profile',
	PAGES_CUSTOMIZATION: '/admin/pages',
	MANAGE_BLOG_TAGS: `/admin/manage-blogs/tags`,
	MANAGE_BLOG_CATEGORIES: `/admin/manage-blogs/categories`,
	MANAGE_BLOGS: `/admin/manage-blogs`,
	MANAGE_BLOG_AUTHORS: `/admin/manage-blogs/authors`,
	MANAGE_BLOGS_SETTINGS: `/admin/manage-blogs/settings`,
	CONTACT_FORM_SUBMISSIONS: '/admin/contact-form-submissions',
	MANAGE_ADMINS: '/admin/manage-admins',
	SITE_SETTINGS: '/admin/site-settings',
	ACTIVITY_LOGS: '/admin/activity-logs',

	// ** AUTHENTICATION ROUTES
	LOGIN: '/admin/login',
	FORGOT_PASSWORD: '/admin/forgot-password',
	PASSWORD_RESET: '/admin/reset-password',
};
