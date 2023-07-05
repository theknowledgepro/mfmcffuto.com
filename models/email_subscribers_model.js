/** @format */

import { SITE_DATA } from '@/config';
const mongoose = require('mongoose');

const emailSubscribersSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		ip_address: {
			type: String,
			trim: true,
		},
		country: {
			type: String,
			trim: true,
		},
		state: {
			type: String,
			trim: true,
		},
		city: {
			type: String,
			trim: true,
		},
		address: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.EmailSubscribers || DB.model('EmailSubscribers', emailSubscribersSchema);
