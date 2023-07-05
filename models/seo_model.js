/** @format */

import { SITE_DATA } from '@/config';
const mongoose = require('mongoose');

const seoSchema = mongoose.Schema(
	{
		page_slug: { type: String, trim: true, required: true },
		meta_description: { type: String, trim: true, required: true },
		meta_keywords: { type: String, trim: true, required: true },
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.SEO || DB.model('SEO', seoSchema);
