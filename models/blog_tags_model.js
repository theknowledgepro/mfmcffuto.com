/** @format */

const { SITE_DATA } = require('@/config');
const mongoose = require('mongoose');

const BlogTagsSchema = mongoose.Schema(
	{
		uniqueID: { type: Number, required: true, unique: true },
		title: { type: String, trim: true, required: true, unique: true },
		description: { type: String, trim: true, required: true },
		slug: { type: String, trim: true, required: true, unique: true },
		published: { type: Boolean, required: true, default: false },
		author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
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

module.exports = DB.models.BlogTags || DB.model('BlogTags', BlogTagsSchema);
