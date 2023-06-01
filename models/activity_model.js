/** @format */

const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
	{
		deed: { type: String, trim: true, required: true },
		details: { type: String, trim: true, default: '' },
		user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
		user_url: { type: String, trim: true, required: true },
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb('greenexperientials');

module.exports = DB.models.ActivityLog || DB.model('ActivityLog', activitySchema);
