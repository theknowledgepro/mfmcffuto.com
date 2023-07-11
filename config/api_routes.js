/** @format */

module.exports = {
	// ** AUTHENTICATION ROUTES
	LOGIN: 'auth/login',
	LOGOUT: 'auth/logout',
	REQUEST_PASSWORD_RESET_TOKEN: 'auth/request-password-reset-token',
	VERIFY_PASSWORD_RESET_TOKEN: 'auth/verify-password-reset-token',
	PASSWORD_RESET: 'auth/reset-account-password',

	// ** ADMIN PANEL ACTIONS ROUTES
	CREATE_ADMIN: 'admin/raw/create-admin',
	EDIT_ADMIN: 'admin/raw/edit-admin',
	DELETE_ADMIN: 'admin/delete-admin',

	// ** BLOGS ACTIONS ROUTES
	MANAGE_BLOG_TAGS: 'admin/raw/blogtag',
	MANAGE_BLOG_CATEGORIES: 'admin/raw/blogcategory',
	MANAGE_BLOGS: 'admin/raw/blog',
	MANAGE_BLOG_AUTHORS: `admin/raw/blogauthors`,
	MANAGE_BLOGS_SETTINGS: `admin/blog-settings`,
	GET_BLOG_CONTENT: 'admin/blog-content',

	// DAYS OF WORSHIP ACTION ROUTES
	MANAGE_DAYS_OF_WORSHIP: 'admin/raw/worshipevent',

	GET_ALL_ADMINS: 'admin/all-admins',
	GET_ACTIVITY_LOGS: 'admin/activity-logs',

	GET_CONTACT_FORM: `admin/get-contact-form-submissions`,
	MARK_CONTACT_FORM_AS_READ: `admin/mark-contact-form-read`,

	// ** MANAGE PAGE SEO
	MANAGE_PAGE_SEO: 'admin/seo-settings',
};
