/** @format */
export const SITE_DATA = {
	URL: 'http://localhost:3000',
	NAME: 'MFMCF FUTO',
	OFFICIAL_NAME: 'MFMCF FUTO',
	THEME_COLOR: '#a63590',
	TYPE:'ADMIN_AUTH_ONLY', // ADMIN_AND_USER_AUTH || ADMIN_AUTH_ONLY ... TYPPE OF PROJECT STACK...
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
	HOME: '/',
	CONTACT_US: '/contact-us',
	ABOUT_US: '/about-us',
	SERVICES: '/services',
	TERMS: '#',

	// ** ADMIN PANEL ROUTES
	ADMIN_DASHBOARD: '/admin',
	ADMIN_PROFILE: '/admin/my-profile',

	// ** ADMIN AUTHENTICATION ROUTES
	ADMIN_LOGIN: '/admin/login',
	ADMIN_FORGOT_PASSWORD: '/admin/forgot-password',
	ADMIN_PASSWORD_RESET: '/admin/reset-password',
};

export const LOADING = {
	// ** AUTHENTICATION LOADING
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',

	// ** ADMIN PANEL ACTIONS LOADING
	CREATE_ADMIN: 'CREATE_ADMIN',
	EDIT_ADMIN_DETAILS: 'EDIT_ADMIN_DETAILS',
};

export const API_ROUTES = {
	// ** AUTHENTICATION ROUTES
	LOGIN: 'login',
	LOGOUT: 'logout',

	// ** ADMIN PANEL ACTIONS ROUTES
	CREATE_ADMIN: 'admin/raw/create-admin',
	EDIT_ADMIN_DETAILS: 'admin/raw/edit-admin',
};
