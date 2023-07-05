/** @format */

const { SITE_DATA } = require('@/config');
const mongoose = require('mongoose');

const BlogsSchema = mongoose.Schema(
	{
		uniqueID: { type: Number, required: true, unique: true },
		title: { type: String, trim: true, required: true, unique: true },
		body: { type: String, trim: true, required: true },
		slug: { type: String, trim: true, required: true, unique: true },
		summary: { type: String, trim: true, required: true },
		thumbnail: { type: String, trim: true },
		meta_description: { type: String, trim: true, required: true },
		meta_keywords: { type: String, trim: true, required: true },
		published: { type: Boolean, required: true, default: false },
		featured: { type: Boolean, default: false },
		author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		views: [{ type: Number }],
		tags: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'BlogTags',
			},
		],
		categories: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'BlogCategories',
			},
		],
		comments: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'BlogComments',
			},
		],
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.Blogs || DB.model('Blogs', BlogsSchema);
