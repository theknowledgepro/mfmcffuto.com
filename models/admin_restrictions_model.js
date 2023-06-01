/** @format */

const mongoose = require('mongoose');

const adminsRestrictionsModel = mongoose.Schema(
	{
		page: { type: String }, // ** ADMIN PANEL PAGE TO WHICH ADMINS IN THE ARRAY ARE RESTRICTED TO
		action: { type: String }, // ** ADMIN PANEL ACTIONS WHICH ADMINS IN THE ARRAY ARE RESTRICTED TO
		admins: [{ type: mongoose.Types.ObjectId, ref: 'Admins' }], // ** ARRAY OF ADMINS WITH RESTRICTIONS
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb('greenexperientials');

module.exports = DB.models.AdminsRestriction || DB.model('AdminsRestriction', adminsRestrictionsModel);
