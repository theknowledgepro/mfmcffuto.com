/** @format */

const { default: connectDB, ACTIVITY_TYPES } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const bcrypt = require('bcrypt');
const Users = require('@/models/user_model');
const activityLog = require('@/middlewares/activity_log');
const validate = require('@/middlewares/validate');
const { deleteFileFromCloudStorage, uploadFileToCloudStorage } = require('@/middlewares/file_manager');
const { v4: uuidv4 } = require('uuid');
const CheckAdminRestriction = require('@/middlewares/check_admin_restriction');
const { ADMIN_PANEL_ACTIONS, MEMBER_ROLES } = require('@/config');

const RawReqController = {
	createAdmin: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_ADMIN, adminId: req?.user?._id });
			if (isRestricted) return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			await connectDB();

			const { firstname, secondname, lastname, username, email, password, gender, mobile, member_role } = req.body;

			if (validate.email({ email }).isInValid) return responseLogic({ req, res, status: 400, data: { message: 'Invalid email address!' } });
			if (validate.containsSpecialChars({ string: username }).errMsg)
				return responseLogic({ req, res, status: 400, data: { message: 'Username must not contain special characters!' } });

			let newUsername = username.toLowerCase().replace(/ /g, '');

			const user = await Users.findOne({ username: newUsername });
			if (user) return responseLogic({ req, res, status: 400, data: { message: 'This Username already exist!' } });

			const emailExists = await Users.findOne({ email });
			if (emailExists) return responseLogic({ req, res, status: 400, data: { message: 'This Email is already used' } });

			// ** AFTER ALL VALIDATIONS, STORE AVATAR TO CLOUD STORAGE
			let avatar;
			if (req.files.avatar) {
				const { fileUrl } = await uploadFileToCloudStorage({
					filePath: req.files.avatar.filepath,
					folder: process.env.CLOUDINARY_AVATAR_UPLOAD_FOLDER,
				});
				avatar = fileUrl;
			}
			const passwordHash = await bcrypt.hash(password, 12);
			const newAdmin = new Users({
				url: uuidv4(),
				firstname,
				secondname,
				lastname,
				username: newUsername,
				email,
				password: passwordHash,
				gender,
				mobile,
				member_role,
				avatar,
			});
			await newAdmin.save();

			// ** RECORD IN ACTIVITY_LOG DATABASE
			await activityLog({
				deed: ACTIVITY_TYPES.CREATED_ADMIN.title,
				details: `${ACTIVITY_TYPES.CREATED_ADMIN.desc} - ${newAdmin.lastname} ${newAdmin.firstname}`,
				user_id: req?.user?._id,
				res,
			});
			return responseLogic({
				req,
				res,
				status: 200,
				data: { message: 'Admin created successfully!', newAdmin: { ...newAdmin._doc, password: '' } },
			});
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
};
module.exports = RawReqController;
