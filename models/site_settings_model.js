/** @format */

import { SITE_DATA } from '@/config';
import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema(
	{
		type: { type: String },
		config: { type: Object },
	},
	{ timestamps: true }
);

SiteSettingsSchema.statics.findOneOrCreate = function findOneOrCreate(condition, newDocument) {
	return new Promise((resolve, reject) => {
		return this.findOne(condition)
			.then((result) => {
				if (result) return resolve(result);
				return this.create(newDocument)
					.then((result) => {
						return resolve({ ...result, justCreated: true });
					})
					.catch((error) => {
						return reject(error);
					});
			})
			.catch((error) => {
				return reject(error);
			});
	});
};

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.SiteSettings || DB.model('SiteSettings', SiteSettingsSchema);
