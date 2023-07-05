/** @format */

const { default: connectDB } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const ContactForm = require('@/models/contact_form_model');
const activityLog = require('@/middlewares/activity_log');
const ActivityLogs = require('@/models/activity_model');
const Users = require('@/models/user_model');
const { MEMBER_ROLES, ADMIN_PANEL_ACTIONS, ACTIVITY_TYPES } = require('@/config');
const CheckAdminRestriction = require('@/middlewares/check_admin_restriction');

class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	paginating() {
		const page = this.queryString?.page * 1 || 1;
		const limit = this.queryString?.limit * 1 || 40;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

const AdminController = {
	// ** MANAGE ADMINS CONTROLLER
	getAllAdmins: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ SSG: SSG, req, res, status: 401, data: { message: 'You are not authorized to view this data!' } });

			const levelFilter = req.query?.member_role ? { member_role: req.query?.member_role } : {};
			const filter = { ...levelFilter };
			const results = await Users.find(filter).select('-password -_id').sort({ createdAt: -1 });
			return responseLogic({ SSG: SSG, req, res, status: 200, data: { results } });
		} catch (err) {
			return responseLogic({ SSG: SSG, res, catchError: err });
		}
	},
	deleteAdmin: async (req, res) => {
		try {
			if (req.method !== 'DELETE') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ SSG: SSG, req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.DELETE_ADMIN, adminId: req?.user?._id });
			if (isRestricted) return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			if (req?.user?.url === req?.query?.admin)
				return responseLogic({ SSG: SSG, req, res, status: 401, data: { message: 'You cannot delete your account!' } });

			const user = await Users.findOneAndDelete({ url: req?.query?.admin });

			// ** RECORD IN ACTIVITY_LOG DATABASE
			await activityLog({
				deed: ACTIVITY_TYPES.DELETE_ADMIN.title,
				details: `${ACTIVITY_TYPES.DELETE_ADMIN.desc} - ${user?.lastname} ${user?.firstname}`,
				user_id: req?.user?._id,
			});
			return responseLogic({ req, res, status: 200, data: { message: 'Admin deleted successfully!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	// ** ACTIVITY LOGS CONTROLLER
	getAllActivityLogs: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to view this data!' } });

			const dateRangeFilter = req.query?.dateRange ? { dateRange: req.query?.dateRange } : {};
			const filter = { ...dateRangeFilter };

			const features = new APIfeatures(ActivityLogs.find(filter), req.query).paginating();
			const results = await features.query
				.find({})
				.populate({
					path: 'user_id',
					select: 'firstname secondname lastname member_role url avatar',
					model: Users,
				})
				.sort({ createdAt: -1 });
			return responseLogic({ SSG: SSG, req, res, status: 200, data: { results } });
		} catch (err) {
			return responseLogic({ SSG: SSG, res, catchError: err });
		}
	},
	// ** CONTACT FORM SUBMISSIONS CONTROLLERS
	// getContactFormSubmissions: async (req, res, SSG = false) => {
	// 	try {
	// 		if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
	// 		await connectDB();

	// 		const filter = req.query?.read ? { read: req.query.read } : {};
	// 		const features = new APIfeatures(ContactForm.find(filter), req.query).paginating();
	// 		const submissions = await features.query.sort({ createdAt: -1 });

	// 		const allSubmissions = await ContactForm.find({});

	// 		return responseLogic({
	// 			SSG: SSG,
	// 			req,
	// 			res,
	// 			status: 200,
	// 			data: {
	// 				submissions,
	// 				unRead: allSubmissions.filter((index) => index.read === false).length,
	// 				read: allSubmissions.filter((index) => index.read === true).length,
	// 			},
	// 		});
	// 	} catch (err) {
	// 		return responseLogic({ SSG: SSG, res, catchError: err });
	// 	}
	// },

	// markContactFormAsRead: async (req, res) => {
	// 	try {
	// 		if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
	// 		await connectDB();

	// 		const { contact } = req.body;
	// 		const updated = await ContactForm.findByIdAndUpdate(contact, { read: true }, { new: true });
	// 		await activityLog({
	// 			deed: ACTIVITY_TYPES.READ_CONTACT_FORM.title,
	// 			details: `${ACTIVITY_TYPES.READ_CONTACT_FORM.desc} ${updated.uniqueID}`,
	// 			user_id: req.user._id,
	// 			res,
	// 		});

	// 		const allSubmissions = await ContactForm.find({});

	// 		return responseLogic({
	// 			req,
	// 			res,
	// 			status: 200,
	// 			data: {
	// 				updatedAt: updated.updatedAt,
	// 				unRead: allSubmissions.filter((index) => index.read === false).length,
	// 				read: allSubmissions.filter((index) => index.read === true).length,
	// 			},
	// 		});
	// 	} catch (err) {
	// 		return responseLogic({ res, catchError: err });
	// 	}
	// },

	// ** ACTIVITY LOGS CONTROLLER
	// getAllActivityLogs: async (req, res, SSG = false) => {
	// 	try {
	// 		if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
	// 		await connectDB();

	// 		const userFilter = req.query?.user ? { user_url: req.query?.user } : {};
	// 		const typeFilter = req.query?.type ? { type: req.query?.type } : {};
	// 		const dateFilter = req.query?.date ? { createdAt: req.query?.date } : {};
	// 		const filter = { ...userFilter, ...typeFilter, ...dateFilter };

	// 		const logs = await ActivityLogs.find(filter).sort({ createdAt: -1 });

	// 		return responseLogic({ SSG: SSG, req, res, status: 200, data: { logs } });
	// 	} catch (err) {
	// 		return responseLogic({ SSG: SSG, res, catchError: err });
	// 	}
	// },
};

module.exports = AdminController;
