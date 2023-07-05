/** @format */

const { SITE_DATA } = require('@/config');
const mongoose = require('mongoose');

const BlogCommentsSchema = mongoose.Schema(
	{
		uniqueID: { type: Number, required: true, unique: true },
		content: { type: String, trim: true, required: true },
		published: { type: Boolean, required: true, default: false },
		user: { type: mongoose.Types.ObjectId, ref: 'User' },
        blog: { type: mongoose.Types.ObjectId, ref: 'Blogs', required: true },
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.BlogComments || DB.model('BlogComments', BlogCommentsSchema);
