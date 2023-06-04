/** @format */

const Activity = require('../models/activity_model');
const Users = require('../models/user_model');

const activityLog = async ({ deed, details, user_id }) => {
	const user = await Users.findById(user_id);
	if (!user?.url) return;
	const newActivity = new Activity({ deed, details, user_id, user_url: user?.url });
	await newActivity.save();
};

module.exports = activityLog;
