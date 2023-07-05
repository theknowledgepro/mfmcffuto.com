/** @format */

export const ACTIVITY_TYPES = {
	LOGIN: { title: 'LOGIN', desc: 'Signed In to Account ~~ ' },
	LOGOUT: { title: 'LOGOUT', desc: 'Signed Out from account ~~ ' },
	REQUEST_PASSWORD_RESET_TOKEN: { title: 'REQUEST_PASSWORD_RESET_TOKEN', desc: 'Requested for password reset.' },
	RESET_PASSWORD: { title: 'RESET_PASSWORD', desc: 'Changed account password successfully.' },

	CREATE_ADMIN: { title: 'CREATE_ADMIN', desc: 'Created a new admin' },
	UPDATE_ADMIN_PROFILE: { title: 'UPDATE_ADMIN_PROFILE', desc: 'Updated admin profile' },
	UPDATE_MY_PROFILE: { title: 'UPDATE_MY_PROFILE', desc: 'Updated your profile' },
	DELETE_ADMIN: { title: 'DELETE_ADMIN', desc: 'Deleted admin account' },

	UPDATE_SITE_SETTINGS: { title: 'UPDATE_SITE_SETTINGS', desc: 'Updated site settings' },
	CONFIGURE_SITE_SETTINGS: { title: 'CONFIGURE_SITE_SETTINGS', desc: 'Configured settings for this site' },

	READ_CONTACT_FORM: { title: 'READ_CONTACT_FORM', desc: 'Read contact form - ID: ' },
};

export default ACTIVITY_TYPES;
