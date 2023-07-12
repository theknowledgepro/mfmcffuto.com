/** @format */

import mongoose from 'mongoose';
const { SITE_DATA } = require('@/config');

const ExcosSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		name_anchor_scripture: { type: String, required: true },
		purpose: { type: String, required: true },
		purpose_anchor_scripture: { type: String, required: true },
		excos: { type: Array, required: true, default: [] },
		academic_session: { type: String, required: true },
		assumption_date: { type: String },
		resignation_date: { type: String },
		current: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

const DB = mongoose.connection.useDb(SITE_DATA.MONGODB_DB_NAME);

module.exports = DB.models.FellowshipExcos || DB.model('FellowshipExcos', ExcosSchema);
