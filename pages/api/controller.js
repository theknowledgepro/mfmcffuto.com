/** @format */

const { default: connectDB } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const ContactForm = require('@/models/contact_form_model');
const validate = require('@/middlewares/validate');
const SiteSettings = require('@/models/site_settings_model');

class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	paginating() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 20;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

const WebController = {
	addContactFormSubmissions: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			const { name, email, phone, details } = req.body;
			if (validate.email({ email }).isInValid) return responseLogic({ req, res, status: 400, data: { message: 'Invalid email address!' } });

			// ** GENERATE UNIQUE ID
			let uniqueID;
			const entries = await ContactForm.find({}).sort({ createdAt: -1 });
			if (entries.length) {
				const lastEntry = entries[0];
				uniqueID = parseInt(lastEntry.uniqueID) + 1;
			} else {
				uniqueID = '0001';
			}

			// ** VERIFY FOR DUPLICATE ENTRIES
			const sameExists = await ContactForm.find({ name, email, phone, details: details.trim() });
			if (sameExists.length > 0)
				return responseLogic({ req, res, status: 400, data: { message: "We've received your request!", title: 'Thank you!' } });

			// ** CREATE NEW RECORD
			const newContact = await new ContactForm({ uniqueID, name, email, phone, details });
			await newContact.save();

			return responseLogic({ req, res, status: 200, data: { message: 'We will get back to you shortly!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	getSiteSettings: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const settings = await SiteSettings.findOne({ type: 'Site-Settings' });
			return JSON.parse(JSON.stringify(settings?.config));
		} catch (err) {
			return {};
		}
	},
};

module.exports = WebController;
