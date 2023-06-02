/** @format */

const AdminRestrictions = require('../models/admin_restrictions_model');

const CheckAdminRestriction = async ({ page, action, adminId }) => {
	const adminMatch = { $elemMatch: { $eq: adminId } };
	const filter = page ? { page: page, admins: adminMatch } : action ? { action: action, admins: adminMatch } : {};
	const result = await AdminRestrictions.findOne(filter);

	console.log({ restrictionResult: result });

	if (result) return true;
	return false;
};

module.exports = CheckAdminRestriction;
