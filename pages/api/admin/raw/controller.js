/** @format */

const { default: connectDB } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const bcrypt = require('bcrypt');
const Users = require('@/models/user_model');
const activityLog = require('@/middlewares/activity_log');
const validate = require('@/middlewares/validate');
const { deleteFileFromCloudStorage, uploadFileToCloudStorage } = require('@/middlewares/file_manager');
const { v4: uuidv4 } = require('uuid');
const CheckAdminRestriction = require('@/middlewares/check_admin_restriction');
const { ADMIN_PANEL_ACTIONS, MEMBER_ROLES, ACTIVITY_TYPES } = require('@/config');

const RawReqController = {
	createAdmin: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_ADMIN, adminId: req?.user?._id });
			if (isRestricted) return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const { firstname, secondname, lastname, username, email, password, gender, mobile, member_role } = req.body;

			if (validate.email({ email }).isInValid) return responseLogic({ req, res, status: 400, data: { message: 'Invalid email address!' } });
			if (validate.containsSpecialChars({ string: username }).errMsg)
				return responseLogic({ req, res, status: 400, data: { message: 'Username must not contain special characters!' } });

			let newUsername = username.toLowerCase().replace(/ /g, '');

			const user = await Users.findOne({ username: newUsername });
			if (user) return responseLogic({ req, res, status: 400, data: { message: 'This Username already exist!' } });

			const emailExists = await Users.findOne({ email });
			if (emailExists) return responseLogic({ req, res, status: 400, data: { message: 'This Email is already used!' } });

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
				deed: ACTIVITY_TYPES.CREATE_ADMIN.title,
				details: `${ACTIVITY_TYPES.CREATE_ADMIN.desc} - ${newAdmin.lastname} ${newAdmin.firstname}`,
				user_id: req?.user?._id,
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
	editAdmin: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.EDIT_ADMIN, adminId: req?.user?._id });
			if (isRestricted) return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const { adminUrl, firstname, secondname, lastname, username, email, password, gender, mobile, member_role, sameAsLoggedInUser } =
				req.body;

			if (validate.email({ email }).isInValid) return responseLogic({ req, res, status: 400, data: { message: 'Invalid email address!' } });
			if (validate.containsSpecialChars({ string: username }).errMsg)
				return responseLogic({ req, res, status: 400, data: { message: 'Username must not contain special characters!' } });

			let newUsername = username.toLowerCase().replace(/ /g, '');

			const user = await Users.findOne({ username: newUsername });
			if (user && adminUrl.toString() !== user.url.toString())
				return responseLogic({ req, res, status: 400, data: { message: 'This Username already exist!' } });

			const emailExists = await Users.findOne({ email });
			if (emailExists && adminUrl.toString() !== emailExists.url.toString())
				return responseLogic({ req, res, status: 400, data: { message: 'This Email is already used!' } });

			let passwordHash;
			if (password) passwordHash = await bcrypt.hash(password, 12);

			// ** AFTER ALL VALIDATIONS, STORE AVATAR TO CLOUD STORAGE
			let avatar;
			if (req.files.avatar) {
				const { fileUrl } = await uploadFileToCloudStorage({
					filePath: req.files.avatar[0].path,
					folder: process.env.CLOUDINARY_AVATAR_UPLOAD_FOLDER,
				});
				avatar = fileUrl;
			}

			const editedAdmin = await Users.findOneAndUpdate(
				{ url: adminUrl },
				{ firstname, secondname, lastname, username: newUsername, email, password: passwordHash, gender, mobile, member_role, avatar },
				{ new: false } // ** SET TO FALSE SO THAT THE OLD URL CAN BE USED TO DELETE AVATAR FROM STORAGE BELOW...
			);

			// ** DELETE THE OLD AVATAR FROM CLOUDINARY STORE IF AND ONLY IF AN AVATAR FILE WAS SENT...
			if (req.files.avatar && editedAdmin.avatar.toString() !== process.env.DEFAULT_AVATAR.toString())
				deleteFileFromCloudStorage({ publicId: editedAdmin.avatar_public_id });

			// ** RECORD IN ACTIVITY_LOG DATABASE
			await activityLog({
				deed: sameAsLoggedInUser ? ACTIVITY_TYPES.UPDATE_MY_PROFILE.title : ACTIVITY_TYPES.UPDATE_ADMIN_PROFILE.title,
				details: sameAsLoggedInUser
					? ACTIVITY_TYPES.UPDATE_MY_PROFILE.desc
					: `${ACTIVITY_TYPES.UPDATE_ADMIN_PROFILE.desc} - ${lastname} ${firstname}`,
				user_id: req?.user?._id,
			});

			const adminData = await Users.findOne({ url: adminUrl }).select('-password');
			return responseLogic({
				req,
				res,
				status: 200,
				data: {
					message: `${sameAsLoggedInUser ? 'Your profile was updated successfully!' : 'Admin profile updated successfully!'}`,
					adminData,
				},
			});
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
};
module.exports = RawReqController;
