/** @format */

import { MEMBER_ROLES } from '@/config';
import mongoose from 'mongoose';
const { v4: uuidv4 } = require('uuid');
const { SITE_DATA } = require('@/config');

const UserSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			trim: true,
			unique: true,
			required: true,
			default: uuidv4(),
		},
		firstname: {
			type: String,
			trim: true,
			default: '',
		},
		secondname: {
			type: String,
			trim: true,
			default: '',
		},
		lastname: {
			type: String,
			trim: true,
			default: '',
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		mobile: {
			type: String,
			default: '',
		},
		avatar: {
			type: String,
			default: process.env.DEFAULT_AVATAR,
		},
		gender: {
			type: String,
			default: 'Male',
		},
		about: {
			type: String,
		},
		social_handles: { type: Object },
		articles: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Blogs',
			},
		],
		member_role: {
			type: String,
			default: MEMBER_ROLES.AUTHOR,
		},
		username: {
			type: String,
			trim: true,
			unique: true,
			required: false,
		},
		password: {
			type: String,
			required: false,
		},
		restrictions: {
			// ** FOR ADMINS ONLY
			// ** AN ARRAY OF ADMIN PANEL ACTIONS THIS ADMIN IS RESTRICTED TO.
			// ** USED TO DETERMINE IF ELEMENTS WILL BE RENDERED IN FRONTEND
			type: Array,
			required: false,
		},
		otp_secret: {
			type: String,
			required: false,
		},
		last_login: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.User || DB.model('User', UserSchema);
