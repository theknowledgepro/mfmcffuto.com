/** @format */
export const SITE_DATA = {
	URL: 'http://localhost:3000',
	NAME: 'MFMCF FUTO',
	OFFICIAL_NAME: 'MFMCF FUTO',
	MONGODB_DB_NAME: 'mfmcffuto',
	THEME_COLOR: '#a63590',
	TYPE: 'ADMIN_AUTH_ONLY', // ADMIN_AND_USER_AUTH || ADMIN_AUTH_ONLY ... TYPPE OF PROJECT STACK...
	DEFAULT_MALE_AVATAR: 'https://res.cloudinary.com/dhdckmdzz/image/upload/v1683274544/avatars/male-avatar_x1ieml.jpg',
	DEFAULT_FEMALE_AVATAR: '',
	DEVELOPER_URL: '',
};

export const MEMBER_ROLES = {
	USER: 'USER',
	MASTER: 'MASTER',
	MANAGER: 'MANAGER',
};

export const ADMIN_PANEL_ACTIONS = {
	CREATE_ADMIN: 'CREATE_ADMIN',
};

export const APP_ROUTES = {
	NOT_FOUND: '404',
	HOME: '/',
	CONTACT_US: '/contact-us',
	ABOUT_US: '/about-us',
	SERVICES: '/services',
	TERMS: '#',

	// ** ADMIN PANEL ROUTES
	ADMIN_DASHBOARD: '/admin',
	ADMIN_PROFILE: '/admin/my-profile',

	// ** USER AUTHENTICATED ROUTES
	DASHBOARD: '/dashboard',

	// ** AUTHENTICATION ROUTES (FOR USE IN PROJECTS WITH BOTH ADMIN AND USER AUTH)
	LOGIN: SITE_DATA.TYPE === 'ADMIN_AND_USER_AUTH' ? '/login' : '/admin/login',
	FORGOT_PASSWORD: SITE_DATA.TYPE === 'ADMIN_AND_USER_AUTH' ? '/forgot-password' : '/admin/forgot-password',
	PASSWORD_RESET: SITE_DATA.TYPE === 'ADMIN_AND_USER_AUTH' ? '/reset-password' : '/admin/reset-password',
};

export const LOADING = {
	// ** AUTHENTICATION LOADING
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	REQUEST_PASSWORD_RESET_TOKEN: 'REQUEST_PASSWORD_RESET_TOKEN',
	VERIFY_PASSWORD_RESET_TOKEN: 'VERIFY_PASSWORD_RESET_TOKEN',
	PASSWORD_RESET: 'PASSWORD_RESET',

	// ** ADMIN PANEL ACTIONS LOADING
	CREATE_ADMIN: 'CREATE_ADMIN',
	EDIT_ADMIN_DETAILS: 'EDIT_ADMIN_DETAILS',
};

export const API_ROUTES = {
	// ** AUTHENTICATION ROUTES
	LOGIN: 'auth/login',
	LOGOUT: 'auth/logout',
	REQUEST_PASSWORD_RESET_TOKEN: 'auth/request-password-reset-token',
	VERIFY_PASSWORD_RESET_TOKEN: 'auth/verify-password-reset-token',
	PASSWORD_RESET: 'auth/reset-account-password',

	// ** ADMIN PANEL ACTIONS ROUTES
	CREATE_ADMIN: 'admin/raw/create-admin',
	EDIT_ADMIN_DETAILS: 'admin/raw/edit-admin',
};
