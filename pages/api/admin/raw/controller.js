/** @format */

const connectDB = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const bcrypt = require('bcrypt');
const Users = require('@/models/user_model');
const BlogTags = require('@/models/blog_tags_model');
const BlogCategories = require('@/models/blog_categories_model');
const Blogs = require('@/models/blog_model');
const WorshipDays = require('@/models/worship_days_model');
const SiteSettings = require('@/models/site_settings_model');
const UpComingEvents = require('@/models/upcoming_events_model');
const FellowshipExcos = require('@/models/excos_model');
const activityLog = require('@/middlewares/activity_log');
const validate = require('@/middlewares/validate');
const { uploadFile, deleteFile } = require('@/middlewares/file_manager');
const { v4: uuidv4 } = require('uuid');
const CheckAdminRestriction = require('@/middlewares/check_admin_restriction');
const { ADMIN_PANEL_ACTIONS, MEMBER_ROLES, ACTIVITY_TYPES, S3FOLDERS } = require('@/config');

const capitalizeFirstLetter = (word) => {
	return word?.trim()?.charAt(0)?.toUpperCase() + word?.substring(1);
};

const capitalizeFirstLetterOfEachWord = (words) => {
	const Words = words.split(' ');
	const newWords = Words.map((word, index) => {
		return capitalizeFirstLetter(word);
	});
	return newWords.toString().split(',').join(' ');
};

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
			const { fileData } = await uploadFile({
				file: req.files?.avatar,
				S3Folder: S3FOLDERS.ADMIN_AVATARS,
				appendFileExtensionToFileKeyName: true,
			});

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
				avatar: fileData?.Key,
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

			const editedAdmin = await Users.findOneAndUpdate(
				{ url: adminUrl },
				{ firstname, secondname, lastname, username: newUsername, email, password: passwordHash, gender, mobile, member_role, avatar },
				{ new: false } // ** SET TO FALSE SO THAT THE OLD URL CAN BE USED TO DELETE AVATAR FROM STORAGE BELOW...
			);

			// ** AFTER ALL VALIDATIONS, STORE AVATAR TO CLOUD STORAGE
			if (req.files?.avatar && editedAdmin.avatar.toString() !== process.env.DEFAULT_AVATAR.toString()) {
				await uploadFile({ file: req?.files?.avatar, fileKeyNameToReplace: editedAdmin?.avatar }).catch((err) => {
					throw err;
				});
			}

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
				const { fileData } = await uploadFile({
					file: req.files?.thumbnail,
					S3Folder: S3FOLDERS.CATEGORY_THUMBNAILS,
					appendFileExtensionToFileKeyName: true,
				});

				const { title, description, slug, type_writer_strings, meta_description, meta_keywords, published } = req.body;
				const generatedSlug = slug ? slug?.trim().split(' ').join('-').toLowerCase() : title?.trim().split(' ').join('-').toLowerCase();
				const newTitle = title?.trim()?.charAt(0)?.toUpperCase() + title?.substring(1);

				// ** GENERATE UNIQUE ID
				let uniqueID;
				const entries = await BlogCategories.find({}).sort({ createdAt: -1 });
				if (entries?.length) {
					const lastEntry = entries[0];
					uniqueID = parseInt(lastEntry.uniqueID) + 1;
				} else uniqueID = 1;
				// console.log({ body: req.body, file: req.files, uniqueID });

				// ** CREATE NEW RECORD
				const newCategory = await new BlogCategories({
					uniqueID,
					title: newTitle,
					description,
					thumbnail: fileData?.Key,
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

				const generatedSlug = slug ? slug?.trim().split(' ').join('-').toLowerCase() : title?.trim().split(' ').join('-').toLowerCase();
				const newTitle = title?.charAt(0)?.toUpperCase() + title?.substring(1);

				// ** RECORD IN DB
				const categoryData = await BlogCategories.findOneAndUpdate(
					{ uniqueID },
					{
						title: newTitle,
						description,
						slug: generatedSlug,
						meta_description,
						meta_keywords,
						published,
						type_writer_strings,
					},
					{ new: true }
				);

				// ** REPLACE THE FORMER CATEGORY THUMBNAIL IF AND ONLY IF A FILE WAS SENT
				if (req.files?.thumbnail) {
					await uploadFile({ file: req?.files?.thumbnail, fileKeyNameToReplace: categoryData?.thumbnail }).catch((err) => {
						throw err;
					});
				}

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_BLOG_CATEGORY.title,
					details: `${ACTIVITY_TYPES.UPDATE_BLOG_CATEGORY.desc} - ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});

				// ** RETURN FEEDBACK UPDATE
				return responseLogic({
					req,
					res,
					status: 200,
					data: { message: 'Category Updated Successfully!', updatedCategoryData: categoryData },
				});
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
				await deleteFile({ keyName: categoryData?.thumbnail });

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
				const { fileData } = await uploadFile({
					file: req.files?.thumbnail,
					S3Folder: S3FOLDERS.BLOG_THUMBNAILS,
					appendFileExtensionToFileKeyName: true,
				});

				const { title, slug, body, summary, tags, categories, meta_description, meta_keywords, published, author } = req.body;

				const generatedSlug = slug ? slug?.trim().split(' ').join('-').toLowerCase() : title?.trim().split(' ').join('-').toLowerCase();
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
					thumbnail: fileData?.Key,
					summary,
					tags,
					categories,
					published,
					meta_description,
					meta_keywords,
					author: author?._id,
				});
				await newBlog.save();

				// ** RECORD BLOG AUTHOR IN DB
				await Users.findOneAndUpdate({ _id: author?._id }, { $push: { articles: newBlog?._id } });

				// ** RECORD BLOG CATEGORIES AND TAGS IN DB
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
				const { uniqueID, title, slug, body, summary, tags, categories, meta_description, meta_keywords, published, author } = req.body;

				const generatedSlug = slug ? slug?.trim().split(' ').join('-').toLowerCase() : title?.trim().split(' ').join('-').toLowerCase();
				const newTitle = title?.charAt(0)?.toUpperCase() + title?.substring(1);

				const blogData = await Blogs.findOneAndUpdate(
					{ uniqueID },
					{
						title: newTitle,
						body,
						summary,
						tags,
						categories,
						slug: generatedSlug,
						meta_description,
						meta_keywords,
						published,
						author: author?._id,
					},
					{ new: false }
				);

				// ** RECORD BLOG AUTHOR IN DB
				if (blogData?.author?._id !== author?._id) {
					await Users.findOneAndUpdate({ _id: blogData?.author?._id }, { $pull: { articles: blogData?._id } });
					await Users.findOneAndUpdate({ _id: author?._id }, { $push: { articles: blogData?._id } });
				}

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

				// ** REPLACE THE FORMER CATEGORY THUMBNAIL IF AND ONLY IF A FILE WAS SENT
				if (req.files?.thumbnail && blogData?.thumbnail) {
					await uploadFile({ file: req?.files?.thumbnail, fileKeyNameToReplace: blogData?.thumbnail }).catch((err) => {
						throw err;
					});
				} else if (req.files?.thumbnail && !blogData?.thumbnail) {
					// ** UPLOAD BLOG THUMBNAIL
					const { fileData } = await uploadFile({
						file: req.files?.thumbnail,
						S3Folder: S3FOLDERS.BLOG_THUMBNAILS,
						appendFileExtensionToFileKeyName: true,
					});
					await Blogs.findOneAndUpdate({ uniqueID }, { thumbnail: fileData?.Key });
				}

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_BLOG.title,
					details: `${ACTIVITY_TYPES.UPDATE_BLOG.desc} - ID: ${uniqueID}`,
					user_id: req?.user?._id,
				});

				// ** RETURN FEEDBACK UPDATE
				const updatedBlogData = await Blogs.findOne({ uniqueID });
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
				await deleteFile({ keyName: blogData?.thumbnail });

				// ** REMOVE BLOG FROM AUTHOR LIST OF BLOGS
				await Users.findOneAndUpdate({ _id: blogData?.author?._id }, { $pull: { articles: blogData?._id } });

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
	manageBlogAuthors: async (req, res) => {
		try {
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER && req.user?.member_role !== MEMBER_ROLES.MANAGER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			// ** ADD BLOG AUTHOR
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_BLOG_AUTHOR, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

				// ** UPLOAD BLOG AUTHOR AVATAR
				const { fileData } = await uploadFile({
					file: req.files?.avatar,
					S3Folder: S3FOLDERS.BLOG_AUTHORS,
					appendFileExtensionToFileKeyName: true,
				});

				const { firstname, secondname, lastname, email, mobile, avatar, gender, about, social_handles } = req.body;

				// ** CREATE NEW RECORD
				const newBlogAuthor = await new Users({
					firstname: capitalizeFirstLetter(firstname),
					secondname: capitalizeFirstLetter(secondname),
					lastname: capitalizeFirstLetter(lastname),
					email,
					mobile,
					avatar: fileData?.Key,
					gender,
					about,
					social_handles,
				});
				await newBlogAuthor.save();

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.CREATE_BLOG_AUTHOR.title,
					details: `${ACTIVITY_TYPES.CREATE_BLOG_AUTHOR.desc} - ${firstname} ${secondname} ${lastname}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Author Added Successfully!' } });
			}
			// ** EDIT BLOG AUTHOR
			if (req.method === 'PATCH') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.EDIT_BLOG_AUTHOR, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { url, firstname, secondname, lastname, email, mobile, avatar, gender, about, social_handles } = req.body;

				const blogAuthorData = await Users.findOneAndUpdate(
					{ url },
					{
						firstname,
						secondname,
						lastname,
						email,
						mobile,
						avatar,
						gender,
						about,
						social_handles,
					},
					{ new: true }
				);

				// ** REPLACE THE FORMER AVATAR IF AND ONLY IF A FILE WAS SENT
				if (req.files?.avatar) {
					await uploadFile({ file: req?.files?.avatar, fileKeyNameToReplace: blogAuthorData?.avatar }).catch((err) => {
						throw err;
					});
				}

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_BLOG_AUTHOR.title,
					details: `${ACTIVITY_TYPES.UPDATE_BLOG_AUTHOR.desc} - ${firstname} ${secondname} ${lastname}`,
					user_id: req?.user?._id,
				});

				// ** RETURN FEEDBACK UPDATE
				return responseLogic({ req, res, status: 200, data: { message: 'Author Updated Successfully!', updatedAuthorData: blogAuthorData } });
			}
			// ** DELETE BLOG AUTHOR
			if (req.method === 'DELETE') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.DELETE_BLOG_AUTHOR, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { author } = req?.query;
				const blogAuthorData = await Users.findOneAndDelete({ url: author });

				// ** DELETE ALL BLOGS AUTHORED BY THIS BLOG AUTHOR
				for (let i = 0; i < blogAuthorData?.articles?.length; i++) await Blogs.deleteMany({ _id: blogAuthorData?.articles[i] });

				// ** DELETE AVATAR FROM CLOUD STORAGE
				if (blogAuthorData?.avatar.toString() !== process.env.DEFAULT_AVATAR.toString())
					await deleteFile({ keyName: blogAuthorData?.avatar });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.DELETE_BLOG_AUTHOR.title,
					details: `${ACTIVITY_TYPES.DELETE_BLOG_AUTHOR.desc} - ${blogAuthorData?.lastname} ${blogAuthorData?.firstname} ${blogAuthorData?.secondname}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Blog Author Deleted Successfully!' } });
			}

			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},

	// ** WORSHIP EVENT CTRLERS
	manageWorshipEvent: async (req, res) => {
		try {
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER && req.user?.member_role !== MEMBER_ROLES.MANAGER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			// ** ADD WORSHIP DAY
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_DAY_OF_WORSHIP, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

				// ** UPLOAD THUMBNAIL
				const { fileData } = await uploadFile({
					file: req.files?.thumbnail,
					S3Folder: S3FOLDERS.WORSHIP_DAYS,
					appendFileExtensionToFileKeyName: true,
				});

				const { title, description, quote, quote_author, thumbnail, day, venue, time, published } = req.body;

				// ** CREATE NEW RECORD
				const newWorshipDay = await new WorshipDays({
					title: capitalizeFirstLetterOfEachWord(title),
					description,
					quote,
					quote_author: capitalizeFirstLetter(quote_author),
					thumbnail: fileData?.Key,
					day,
					venue: capitalizeFirstLetter(venue),
					time,
					published,
				});
				await newWorshipDay.save();

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.CREATE_DAY_OF_WORSHIP.title,
					details: `${ACTIVITY_TYPES.CREATE_DAY_OF_WORSHIP.desc} - ${title}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Worship Day Added Successfully!' } });
			}
			// ** EDIT WORSHIP DAY
			if (req.method === 'PATCH') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.EDIT_DAY_OF_WORSHIP, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { _id, title, description, quote, quote_author, thumbnail, day, venue, time, published } = req.body;

				const worshipDayData = await WorshipDays.findOneAndUpdate(
					{ _id },
					{
						title: capitalizeFirstLetterOfEachWord(title),
						description,
						quote,
						quote_author: capitalizeFirstLetter(quote_author),
						day,
						venue: capitalizeFirstLetter(venue),
						time,
						published,
					},
					{ new: true }
				);

				// ** REPLACE THE FORMER THUMBNAIL IF AND ONLY IF A FILE WAS SENT
				if (req.files?.thumbnail) {
					await uploadFile({ file: req?.files?.thumbnail, fileKeyNameToReplace: worshipDayData?.thumbnail }).catch((err) => {
						throw err;
					});
				}

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_DAY_OF_WORSHIP.title,
					details: `${ACTIVITY_TYPES.UPDATE_DAY_OF_WORSHIP.desc} - ${title}`,
					user_id: req?.user?._id,
				});

				// ** RETURN FEEDBACK UPDATE
				return responseLogic({
					req,
					res,
					status: 200,
					data: { message: 'Worship Day Updated Successfully!', updatedAuthorData: worshipDayData },
				});
			}
			// ** DELETE WORSHIP DAY
			if (req.method === 'DELETE') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.DELETE_DAY_OF_WORSHIP, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

				const worshipData = await WorshipDays.findOneAndDelete({ _id: req.query.worshipDay });

				// ** DELETE THUMBNAIL FROM CLOUD STORAGE
				if (worshipData?.thumbnail) await deleteFile({ keyName: worshipData?.thumbnail });

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.DELETE_DAY_OF_WORSHIP.title,
					details: `${ACTIVITY_TYPES.DELETE_DAY_OF_WORSHIP.desc} - ${worshipData?.title}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Worship Day Deleted Successfully!' } });
			}

			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},

	// ** MANAGE FELLOWSHIP EXCOS CONTROLLERS
	mangeExcoGroup: async (req, res, SSG = false) => {
		try {
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER && req.user?.member_role !== MEMBER_ROLES.MANAGER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			// ** CREATE EXCO GROUP
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.CREATE_EXCO_GROUP, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

				const { fileData } = await uploadFile({
					file: req.files?.group_picture,
					S3Folder: S3FOLDERS.EXCOS_GROUP_PICTURES,
					appendFileExtensionToFileKeyName: true,
				});

				const {
					name,
					name_anchor_scripture,
					purpose,
					purpose_anchor_scripture,
					excos,
					academic_session,
					assumption_date,
					resignation_date,
					group_picture,
					current,
					isNew,
				} = req.body;

				const newExcoGroup = await new FellowshipExcos({
					name,
					name_anchor_scripture,
					purpose,
					purpose_anchor_scripture,
					excos,
					academic_session,
					assumption_date,
					resignation_date,
					group_picture: fileData?.Key,
					current,
				});
				await newExcoGroup.save();

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: isNew ? ACTIVITY_TYPES.CREATE_EXCO_GROUP.title : ACTIVITY_TYPES.UPDATE_EXCO_GROUP.title,
					details: isNew ? `${ACTIVITY_TYPES.CREATE_EXCO_GROUP.desc} - ${name}` : `${ACTIVITY_TYPES.UPDATE_EXCO_GROUP.desc} - ${name}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: `Executive Group ${isNew ? 'Created' : 'Updated'} Successfully!` } });
			}
			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},

	// ** FILE UPLOAD CONTROLLERS
	uploadFile: async (req, res, SSG = false) => {
		try {
			if (req.body?.fileToDelete) {
				const fileToDelete = req.body?.fileToDelete;
				console.log({ fileToDelete });
				await deleteFile({ keyName: fileToDelete });
			}

			const { fileData } = await uploadFile({
				file: Object.values(req.files)[0],
				S3Folder: req.body?.fileFolder,
				appendFileExtensionToFileKeyName: true,
			});
			return responseLogic({ SSG: SSG, req, res, status: 200, data: { fileName: fileData?.Key } });
		} catch (err) {
			return responseLogic({ SSG: SSG, res, catchError: err });
		}
	},

	// ** PAGE CUSTOMIZATION SETTINGS CONTROLLER
	updatePageSettings: async (req, res) => {
		try {
			await connectDB();
			if (req.user?.member_role !== MEMBER_ROLES.MASTER && req.user?.member_role !== MEMBER_ROLES.MANAGER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.UPDATE_PAGE_SETTINGS, adminId: req?.user?._id });
			if (isRestricted) return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			// ** SET DATA TO RECORD FOR EACH PAGE SETTINGS AND DEPENDING ON FILE UPLOADED??
			let dataToRecord = {};
			let customFileName;
			let s3_folder;

			switch (req.body.page_settings) {
				case 'Home-Page-Settings':
					if (Object.values(req.files).length > 0 && req.body?.slideIndex) {
						customFileName = Date.now().toString();
						s3_folder = S3FOLDERS.SLIDES;
						dataToRecord = {
							...req.body,
							slides: req.body?.slides?.map((slide, index) => {
								if (index === Number(req.body.slideIndex)) return { ...slide, backgroundImage: `${s3_folder}/${customFileName}` };
								return slide;
							}),
							slideIndex: undefined,
						};
					} else dataToRecord = req.body;
					break;
				default:
					break;
			}

			// ** RECORD IN DB
			const settingsExist = await SiteSettings.findOne({ type: req.body.page_settings });
			if (settingsExist) {
				const updatedData = await SiteSettings.findOneAndUpdate({ type: req.body.page_settings }, { config: dataToRecord }, { new: false });
				switch (req.body.page_settings) {
					case 'Home-Page-Settings':
						if (Object.values(req.files).length > 0 && req.body?.slideIndex && updatedData?.config?.slides?.length) {
							// ** DELETION FOR SLIDES UPDATE
							const slideObject = updatedData?.config?.slides[Number(req.body?.slideIndex)];
							await deleteFile({ keyName: slideObject?.backgroundImage });
						}
						break;
					default:
						break;
				}
			} else {
				// ** UPLOAD NEW FILE
				if (Object.values(req.files).length > 0) {
					const { fileData } = await uploadFile({
						file: req.files?.backgroundImage,
						S3Folder: s3_folder,
						customFileName,
						appendFileExtensionToFileKeyName: false,
					});
				}
				const newRecord = new SiteSettings({ type: req.body.page_settings, config: dataToRecord });
				await newRecord.save();
			}

			// ** RECORD IN ACTIVITY_LOG DATABASE
			await activityLog({
				deed: ACTIVITY_TYPES.UPDATE_PAGE_SETTINGS.title,
				details: `${ACTIVITY_TYPES.UPDATE_PAGE_SETTINGS.desc} - ${req.body.page_settings}`,
				user_id: req?.user?._id,
				res,
			});
			return responseLogic({ req, res, status: 200, data: { message: 'Page Settings Updated Successfully!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
};
module.exports = RawReqController;
