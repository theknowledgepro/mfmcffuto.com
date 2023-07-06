
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

	GET_ALL_ADMINS: 'admin/get-all-admins',

	GET_CONTACT_FORM: `admin/get-contact-form-submissions`,
	MARK_CONTACT_FORM_AS_READ: `admin/mark-contact-form-read`,
};

