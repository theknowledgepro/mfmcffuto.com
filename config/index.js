/** @format */
/** @format */
const API_ROUTES = require('./api_routes');
const APP_ROUTES = require('./app_routes');
const LOADING = require('./loading_types');
const ACTIVITY_TYPES = require('./activity_types');
const ADMIN_PANEL_ACTIONS = require('./admin_panel_actions');
const MEMBER_ROLES = require('./member_roles');
const LIMITS = require('./limits');
const CUSTOM_UI_TYPES = require('./ui_display_types');
const ASSETS = require('./assets');
const S3FOLDERS = require('./s3_folders');

export const SITE_DATA = {
	URL: 'http://localhost:3000',
	NAME: 'MFMCF FUTO',
	OFFICIAL_NAME: 'MFMCF FUTO',
	MONGODB_DB_NAME: 'mfmcffuto',
	BUSINESS_EMAIL_HANDLE: '@mfmcffuto.com',
	THEME_COLOR: '#a63590',
	DEFAULT_MALE_AVATAR: 'https://dbis5km5hrwi4.cloudfront.net/avatars/male-avatar_x1ieml.jpg',
	DEFAULT_FEMALE_AVATAR: '',
	DEVELOPER_URL: '',
	DEVELOPER_NAME: 'Chidera Promise A.',
};

const CLOUD_ASSET_BASEURL = 'https://dbis5km5hrwi4.cloudfront.net';

module.exports = {
	API_ROUTES,
	APP_ROUTES,
	LOADING,
	ACTIVITY_TYPES,
	ADMIN_PANEL_ACTIONS,
	MEMBER_ROLES,
	LIMITS,
	SITE_DATA,
	CLOUD_ASSET_BASEURL,
	CUSTOM_UI_TYPES,
	ASSETS,
	S3FOLDERS,
};
