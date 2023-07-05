/** @format */

import { MEMBER_ROLES, SITE_DATA } from '@/config';
const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
	{
		deed: { type: String, trim: true, required: true },
		details: { type: String, trim: true, default: '' },
		user_id: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		user_url: { type: String, trim: true, required: true },
		account_type: { type: String, trim: true, required: true, default: MEMBER_ROLES.USER },
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.ActivityLog || DB.model('ActivityLog', activitySchema);
