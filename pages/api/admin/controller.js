/** @format */

const { default: connectDB, ACTIVITY_TYPES } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const ContactForm = require('@/models/contact_form_model');
const activityLog = require('@/middlewares/activity_log');
const Users = require('@/models/user_model');

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

			const levelFilter = req.query?.member_role ? { member_role: req.query?.member_role } : {};
			const filter = { ...levelFilter };
			const results = await Users.find(filter).select('-password -_id').sort({ createdAt: -1 });
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
