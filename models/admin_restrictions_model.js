/** @format */

const mongoose = require('mongoose');
const { SITE_DATA } = require('@/config');

const adminsRestrictionsModel = new mongoose.Schema(
	{
		page: { type: String }, // ** ADMIN PANEL PAGE TO WHICH ADMINS IN THE ARRAY ARE RESTRICTED TO
		action: { type: String }, // ** ADMIN PANEL ACTIONS WHICH ADMINS IN THE ARRAY ARE RESTRICTED TO
		admins: [{ type: mongoose.Types.ObjectId, ref: 'User' }], // ** ARRAY OF ADMINS WITH RESTRICTIONS
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.AdminsRestriction || DB.model('AdminsRestriction', adminsRestrictionsModel);
