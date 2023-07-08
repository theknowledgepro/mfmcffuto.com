/** @format */

const { default: connectDB } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const bcrypt = require('bcrypt');
const Users = require('@/models/user_model');
const BlogTags = require('@/models/blog_tags_model');
const BlogCategories = require('@/models/blog_categories_model');
const Blogs = require('@/models/blog_model');
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
	manageBlogTags: async (req, res) => {
		try {
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER && req.user?.member_role !== MEMBER_ROLES.MANAGER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			// ** CREATE TAG
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_BLOG_TAG, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { title, description, slug, published } = req.body;
				const generatedSlug = slug ? slug.split(' ').join('-').toLowerCase() : title.split(' ').join('-').toLowerCase();
				const newTitle = title?.charAt(0)?.toUpperCase() + title?.substring(1);

				// ** GENERATE UNIQUE ID
				let uniqueID;
				const entries = await BlogTags.find({}).sort({ createdAt: -1 });
				if (entries?.length) {
					const lastEntry = entries[0];
					uniqueID = parseInt(lastEntry.uniqueID) + 1;
				} else uniqueID = 1;

				// ** CREATE NEW RECORD
				const newTag = await new BlogTags({
					uniqueID,
					title: newTitle,
					description,
					slug: generatedSlug,
					published,
					author: req?.user?._id,
				});
				await newTag.save();

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.CREATE_BLOG_TAG.title,
					details: `${ACTIVITY_TYPES.CREATE_BLOG_TAG.desc} - ${newTitle} with ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});

				return responseLogic({ req, res, status: 200, data: { message: 'Tag Created Successfully!' } });
			}
			// ** EDIT TAG
			if (req.method === 'PATCH') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.EDIT_BLOG_TAG, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { uniqueID, title, description, slug, published } = req.body;
				const generatedSlug = slug ? slug.split(' ').join('-').toLowerCase() : title.split(' ').join('-').toLowerCase();
				const newTitle = title?.charAt(0)?.toUpperCase() + title?.substring(1);
				const updatedTagData = await BlogTags.findOneAndUpdate(
					{ uniqueID },
					{ title: newTitle, description, slug: generatedSlug, published },
					{ new: true }
				);
				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_BLOG_TAG.title,
					details: `${ACTIVITY_TYPES.UPDATE_BLOG_TAG.desc} - ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Tag Updated Successfully!', updatedTagData } });
			}
			// ** DELETE TAG
			if (req.method === 'DELETE') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.DELETE_BLOG_TAG, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { tag } = req?.query;
				const tagData = await BlogTags.findOneAndDelete({ uniqueID: tag });

				// ** DELETE TAG FROM BLOGS ASSOCIATED WITH THIS TAG
				await Blogs.updateMany({ tags: tagData?._id }, { $pull: { tags: tagData?._id } });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.DELETE_BLOG_TAG.title,
					details: `${ACTIVITY_TYPES.DELETE_BLOG_TAG.desc} - ${tagData?.title} with ID: ${tagData?.uniqueID}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Tag Deleted Successfully!' } });
			}

			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	manageBlogCategories: async (req, res) => {
		try {
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER && req.user?.member_role !== MEMBER_ROLES.MANAGER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			// ** CREATE CATEGORY
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_BLOG_CATEGORY, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

				// ** UPLOAD CATEGORY THUMBNAIL
				const { filePublicId } = await uploadFileToCloudStorage({ file: req.files?.thumbnail });

				const { title, description, slug, type_writer_strings, meta_description, meta_keywords, published } = req.body;
				const generatedSlug = slug ? slug.split(' ').join('-').toLowerCase() : title.split(' ').join('-').toLowerCase();
				const newTitle = title?.trim()?.charAt(0)?.toUpperCase() + title?.substring(1);

				// ** GENERATE UNIQUE ID
				let uniqueID;
				const entries = await BlogCategories.find({}).sort({ createdAt: -1 });
				if (entries?.length) {
					const lastEntry = entries[0];
					uniqueID = parseInt(lastEntry.uniqueID) + 1;
				} else uniqueID = 1;

				// ** CREATE NEW RECORD
				const newCategory = await new BlogCategories({
					uniqueID,
					title: newTitle,
					description,
					thumbnail: filePublicId,
					slug: generatedSlug,
					published,
					meta_description,
					meta_keywords,
					type_writer_strings,
					author: req?.user?._id,
				});
				await newCategory.save();

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.CREATE_BLOG_CATEGORY.title,
					details: `${ACTIVITY_TYPES.CREATE_BLOG_CATEGORY.desc} - ${title} with ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Category Created Successfully!' } });
			}
			// ** EDIT CATEGORY
			if (req.method === 'PATCH') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.EDIT_BLOG_CATEGORY, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { uniqueID, title, description, slug, type_writer_strings, meta_description, meta_keywords, published } = req.body;

				const generatedSlug = slug ? slug.split(' ').join('-').toLowerCase() : title.split(' ').join('-').toLowerCase();
				const newTitle = title?.charAt(0)?.toUpperCase() + title?.substring(1);

				// ** UPLOAD CATEGORY THUMBNAIL
				const { filePublicId } = await uploadFileToCloudStorage({ file: req.files?.thumbnail });

				// ** RECORD IN DB
				const categoryData = await BlogCategories.findOneAndUpdate(
					{ uniqueID },
					{
						title: newTitle,
						thumbnail: filePublicId ? filePublicId : undefined,
						description,
						slug: generatedSlug,
						meta_description,
						meta_keywords,
						published,
						type_writer_strings,
					},
					{ new: false }
				);
				// ** DELETE THE FORMER CATEGORY THUMBNAIL IF AND ONLY IF A FILE WAS SENT
				if (req.files?.thumbnail) deleteFileFromCloudStorage({ publicId: categoryData?.thumbnail });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_BLOG_CATEGORY.title,
					details: `${ACTIVITY_TYPES.UPDATE_BLOG_CATEGORY.desc} - ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});

				// ** RETURN FEEDBACK UPDATE
				const updatedCategoryData = await BlogCategories.findOne({ uniqueID });
				return responseLogic({ req, res, status: 200, data: { message: 'Category Updated Successfully!', updatedCategoryData } });
			}
			// ** DELETE CATEGORY
			if (req.method === 'DELETE') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.DELETE_BLOG_CATEGORY, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { category } = req?.query;
				const categoryData = await BlogCategories.findOneAndDelete({ uniqueID: category });

				// ** DELETE CATEGORY FROM BLOGS ASSOCIATED WITH THIS CATEGORY
				await Blogs.updateMany({ categories: categoryData?._id }, { $pull: { categories: categoryData?._id } });

				// ** DELETE CATEGORY FILE FROM CLOUD STORAGE
				deleteFileFromCloudStorage({ publicId: categoryData?.thumbnail });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.DELETE_BLOG_CATEGORY.title,
					details: `${ACTIVITY_TYPES.DELETE_BLOG_CATEGORY.desc} - ${categoryData?.title} with ID: ${categoryData?.uniqueID}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Category Deleted Successfully!' } });
			}

			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	manageBlogs: async (req, res) => {
		try {
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER && req.user?.member_role !== MEMBER_ROLES.MANAGER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			// ** CREATE BLOG
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_BLOG, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

				// ** UPLOAD BLOG THUMBNAIL
				const { filePublicId } = await uploadFileToCloudStorage({ file: req.files?.thumbnail });

				const { title, slug, body, summary, tags, categories, meta_description, meta_keywords, published } = req.body;

				const generatedSlug = slug ? slug.split(' ').join('-').toLowerCase() : title.split(' ').join('-').toLowerCase();
				const newTitle = title?.charAt(0)?.toUpperCase() + title?.substring(1);

				// ** GENERATE UNIQUE ID
				let uniqueID;
				const entries = await Blogs.find({}).sort({ createdAt: -1 });
				if (entries?.length) {
					const lastEntry = entries[0];
					uniqueID = parseInt(lastEntry.uniqueID) + 1;
				} else uniqueID = 1;

				// ** CREATE NEW RECORD
				const newBlog = await new Blogs({
					uniqueID,
					title: newTitle,
					body,
					slug: generatedSlug,
					thumbnail: filePublicId,
					summary,
					tags,
					categories,
					published,
					meta_description,
					meta_keywords,
					author: req?.user?._id,
				});
				await newBlog.save();

				for (let i = 0; i < categories?.length; i++)
					await BlogCategories.findOneAndUpdate({ _id: categories[i] }, { $push: { blogs: newBlog?._id } });
				for (let i = 0; i < tags?.length; i++) await BlogTags.findOneAndUpdate({ _id: tags[i] }, { $push: { blogs: newBlog?._id } });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.CREATE_BLOG.title,
					details: `${ACTIVITY_TYPES.CREATE_BLOG.desc} - ${title} with ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'New Blog Created Successfully!' } });
			}
			// ** EDIT BLOG
			if (req.method === 'PATCH') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.EDIT_BLOG, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { uniqueID, title, slug, body, summary, tags, categories, meta_description, meta_keywords, published } = req.body;

				const generatedSlug = slug ? slug.split(' ').join('-').toLowerCase() : title.split(' ').join('-').toLowerCase();
				const newTitle = title?.charAt(0)?.toUpperCase() + title?.substring(1);

				// ** UPLOAD BLOG THUMBNAIL
				const { filePublicId } = await uploadFileToCloudStorage({ file: req.files?.thumbnail });

				const blogData = await Blogs.findOneAndUpdate(
					{ uniqueID },
					{
						title: newTitle,
						thumbnail: filePublicId ? filePublicId : undefined,
						body,
						summary,
						tags,
						categories,
						slug: generatedSlug,
						meta_description,
						meta_keywords,
						published,
					},
					{ new: false }
				);

				// ** FIRST, DELETE BLOG FROM TAGS AND CATEGORIES ASSOCIATED WITH THIS BLOG
				for (let i = 0; i < blogData?.categories?.length; i++)
					await BlogCategories.findOneAndUpdate(
						{ _id: blogData?.categories[i], blogs: blogData?._id },
						{ $pull: { blogs: blogData?._id } }
					);
				for (let i = 0; i < blogData?.tags?.length; i++)
					await BlogTags.findOneAndUpdate({ _id: blogData?.tags[i], blogs: blogData?._id }, { $pull: { blogs: blogData?._id } });

				// ** NEXT, UPDATE TAGS AND CATEGORIES NOW ASSOCIATED WITH THIS BLOG
				for (let i = 0; i < categories?.length; i++)
					await BlogCategories.findOneAndUpdate({ _id: categories[i] }, { $push: { blogs: blogData?._id } });
				for (let i = 0; i < tags?.length; i++) await BlogTags.findOneAndUpdate({ _id: tags[i] }, { $push: { blogs: blogData?._id } });

				// ** DELETE THE FORMER CATEGORY THUMBNAIL IF AND ONLY IF A FILE WAS SENT
				if (req.files?.thumbnail) deleteFileFromCloudStorage({ publicId: blogData?.thumbnail });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_BLOG.title,
					details: `${ACTIVITY_TYPES.UPDATE_BLOG.desc} - ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});

				// ** RETURN FEEDBACK UPDATE
				const updatedBlogData = await BlogCategories.findOne({ uniqueID });
				return responseLogic({ req, res, status: 200, data: { message: 'Blog Updated Successfully!', updatedBlogData } });
			}
			// ** DELETE BLOG
			if (req.method === 'DELETE') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.DELETE_BLOG, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { blog } = req?.query;
				const blogData = await Blogs.findOneAndDelete({ uniqueID: blog });

				// ** DELETE BLOG FROM TAGS AND CATEGORIES ASSOCIATED WITH THIS BLOG
				for (let i = 0; i < blogData?.categories?.length; i++)
					await BlogCategories.findOneAndUpdate(
						{ _id: blogData?.categories[i], blogs: blogData?._id },
						{ $pull: { blogs: blogData?._id } }
					);
				for (let i = 0; i < blogData?.tags?.length; i++)
					await BlogTags.findOneAndUpdate({ _id: blogData?.tags[i], blogs: blogData?._id }, { $pull: { blogs: blogData?._id } });

				// ** DELETE BLOG FILE FROM CLOUD STORAGE
				deleteFileFromCloudStorage({ publicId: blogData?.thumbnail });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.DELETE_BLOG.title,
					details: `${ACTIVITY_TYPES.DELETE_BLOG.desc} - ${blogData?.title} with ID: ${blogData?.uniqueID}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Blog Deleted Successfully!' } });
			}

			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
};
module.exports = RawReqController;
