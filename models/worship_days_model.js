/** @format */

import { MEMBER_ROLES, SITE_DATA } from '@/config';
const mongoose = require('mongoose');

const worshipDaySchema = mongoose.Schema(
	{
		title: { type: String, trim: true, required: true },
		description: { type: String, trim: true, required: true },
		quote: { type: String, trim: true, required: true },
		quote_author: { type: String, trim: true, required: true },
		thumbnail: { type: String, trim: true, required: true },
		day: { type: String, trim: true, required: true },
		venue: { type: String, trim: true, required: true },
		time: { type: String, trim: true, required: true },
		published: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.WorshipDay || DB.model('WorshipDay', worshipDaySchema);
