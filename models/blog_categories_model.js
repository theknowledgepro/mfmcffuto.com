/** @format */

const { SITE_DATA } = require('@/config');
const mongoose = require('mongoose');

const BlogCategoriesSchema = mongoose.Schema(
	{
		uniqueID: { type: Number, required: true, unique: true },
		title: { type: String, trim: true, required: true, unique: true },
		description: { type: String, trim: true, required: true },
		slug: { type: String, trim: true, required: true, unique: true },
		thumbnail: { type: String, trim: true },
		meta_description: { type: String, trim: true, required: true },
		meta_keywords: { type: String, trim: true, required: true },
		published: { type: Boolean, required: true, default: false },
		author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		type_writer_strings: { type: Array, required: true, default: ['This text is to be edited...', 'Welcome to Xonict!'] },
		blogs: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Blogs',
			},
		],
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.BlogCategories || DB.model('BlogCategories', BlogCategoriesSchema);
