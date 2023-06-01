const { APP_ROUTES, MEMBER_ROLES } = require('@/config');

const memberRoleDefaultHome = ({ member_role }) => {
	if (!member_role) return APP_ROUTES.NEWSFEED;
	switch (member_role) {
		case MEMBER_ROLES.MANAGER:
			return APP_ROUTES.ADMIN_DASHBOARD;
		case MEMBER_ROLES.MASTER:
			return APP_ROUTES.ADMIN_DASHBOARD;
		case MEMBER_ROLES.USER:
			return APP_ROUTES.USER_DASHBOARD;
		default:
			return APP_ROUTES.USER_DASHBOARD;
	}
};

module.exports = memberRoleDefaultHome;
