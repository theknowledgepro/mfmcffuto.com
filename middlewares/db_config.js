/** @format */

export const ACTIVITY_TYPES = {
	LOGIN: { title: 'LOGIN', desc: 'Signed In with device ~~ ' },
	LOGOUT: { title: 'LOGOUT', desc: 'Signed Out from account ~~ ' },

	UPDATED_MY_PROFILE: { title: 'UPDATED_MY_PROFILE', desc: 'Updated your profile' },
	UPDATED_ADMIN_PROFILE: { title: 'UPDATED_ADMIN_PROFILE', desc: 'Updated admin profile' },
	CREATED_ADMIN: { title: 'CREATED_ADMIN', desc: 'Created a new admin' },

	UPDATED_SITE_SETTINGS: { title: 'UPDATED_SITE_SETTINGS', desc: 'Updated site settings' },
	CONFIGURED_SITE_SETTINGS: { title: 'CONFIGURED_SITE_SETTINGS', desc: 'Configured settings for this site' },

	READ_CONTACT_FORM: { title: 'READ_CONTACT_FORM', desc: 'Read contact form - ID: ' },
};

/**
 * Source :
 * https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js
 *
 * @format
 */

import mongoose from 'mongoose';
const MONGODB_URI = process.env.PROD_ENV === 'production' ? process.env.DATABASE_URL : process.env.DEV_DATABASE_URL;

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
	try {
		if (cached.conn) return cached.conn;

		if (!cached.promise) {
			const opts = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			};

			cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
				return mongoose;
			});
		}
		cached.conn = await cached.promise;
		console.log(`MongoDB Connected: ${cached?.conn?.connection?.host}`);
		return cached.conn;
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
};

export default connectDB;
