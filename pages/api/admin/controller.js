/** @format */

const connectDB = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const ContactForm = require('@/models/contact_form_model');
const activityLog = require('@/middlewares/activity_log');
const SeoSettings = require('@/models/seo_model');
const SiteSettings = require('@/models/site_settings_model');
const ActivityLogs = require('@/models/activity_model');
const Users = require('@/models/user_model');
const BlogTags = require('@/models/blog_tags_model');
const BlogCategories = require('@/models/blog_categories_model');
const Blogs = require('@/models/blog_model');
const { MEMBER_ROLES, ADMIN_PANEL_ACTIONS, ACTIVITY_TYPES } = require('@/config');
const CheckAdminRestriction = require('@/middlewares/check_admin_restriction');

class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	paginating() {
		const page = this.queryString?.page * 1 || 1;
		const limit = this.queryString?.limit * 1 || 40;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

const AdminController = {
	// ** MANAGE BLOGS CONTROLLERS
	getAllBlogTags: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const publishedFilter = req?.query?.published !== undefined ? { published: req?.query?.published } : {};
			const filter = { ...publishedFilter };
			const limit = req?.query?.limit ?? null;

			const allTags = await BlogTags.find(filter)
				.select(req?.query?.select)
				.limit(limit)
				.populate({
					path: 'author',
					select: '-_id firstname secondname lastname member_role avatar',
					model: Users,
				})
				.populate({
					path: 'blogs',
					select: '-_id -body -meta_description -meta_keywords -author',
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'tags',
						select: '-_id title slug',
						model: BlogTags,
						options: { sort: { createdAt: -1 } },
					},
				})
				.sort({ createdAt: -1 });
			return JSON.parse(JSON.stringify(allTags));
		} catch (err) {
			return {};
		}
	}, // DONE
	getAllBlogCategories: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const publishedFilter = req?.query?.published !== undefined ? { published: req?.query?.published } : {};
			const filter = { ...publishedFilter };
			const limit = req?.query?.limit ?? null;

			const allCategories = await BlogCategories.find(filter)
				.select(req?.query?.select)
				.limit(limit)
				.populate({
					path: 'author',
					select: '-_id firstname secondname lastname member_role avatar',
					model: Users,
				})
				.populate({
					path: 'blogs',
					select: '-_id -body -meta_description -meta_keywords -author',
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'categories',
						select: '-_id title slug',
						model: BlogCategories,
						options: { sort: { createdAt: -1 } },
					},
				})
				.sort({ createdAt: -1 });
			return JSON.parse(JSON.stringify(allCategories));
		} catch (err) {
			return {};
		}
	}, // DONE
	getAllBlogs: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			const filter = {};
			const allBlogs = await Blogs.find(filter)
				.populate({
					path: 'author',
					select: 'url firstname secondname lastname member_role avatar',
					model: Users,
				})
				.select('-body')
				.sort({ createdAt: -1 });
			return JSON.parse(JSON.stringify(allBlogs));
		} catch (err) {
			return {};
		}
	}, // DONE
	getBlogBody: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			const blog = await Blogs.findOne({ uniqueID: req?.query?.blog }).select('uniqueID body -_id');
			return responseLogic({ req, res, status: 200, data: blog?._doc });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	}, // DONE
	getBlogAuthors: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (!req?.query?.isBlogCreate) {
				const blogSelectionFields = `title slug summary thumbnail published featured views tags categories`;
				const allAuthors = await Users.find({ member_role: MEMBER_ROLES.AUTHOR })
					.populate({
						path: 'articles',
						select: blogSelectionFields,
						model: Blogs,
						options: { sort: { createdAt: -1 } },
						populate: {
							path: 'tags',
							select: '-_id title slug',
							model: BlogTags,
						},
					})
					.populate({
						path: 'articles',
						select: blogSelectionFields,
						model: Blogs,
						options: { sort: { createdAt: -1 } },
						populate: {
							path: 'categories',
							select: '-_id title slug',
							model: BlogCategories,
						},
					});
				return JSON.parse(JSON.stringify(allAuthors));
			} else {
				const allAuthors = await Users.find({ member_role: MEMBER_ROLES.AUTHOR }).select('firstname secondname lastname avatar url');
				return JSON.parse(JSON.stringify(allAuthors));
			}
		} catch (err) {
			return {};
		}
	}, // DONE

	updateBlogSettings: async (req, res) => {
		try {
			await connectDB();
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.UPDATE_BLOG_SETTINGS, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

				const { show_comments, show_views, no_of_articles_on_category_card, categories_section_typewriter, blog_preview_card_custom_display } = req.body;

				const blogSettings = await SiteSettings.findOneOrCreate(
					{ type: 'Blog-Settings' },
					{
						type: 'Blog-Settings',
						config: { show_comments, show_views, no_of_articles_on_category_card, categories_section_typewriter, blog_preview_card_custom_display },
					}
				).catch((err) => {
					throw err;
				});
				// console.log({ sent: 'yess' });

				if (blogSettings)
					await SiteSettings.findOneAndUpdate(
						{ type: 'Blog-Settings' },
						{ config: { show_comments, show_views, no_of_articles_on_category_card, categories_section_typewriter, blog_preview_card_custom_display } }
					);

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_BLOG_SETTINGS.title,
					details: `${ACTIVITY_TYPES.UPDATE_BLOG_SETTINGS.desc}`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'Updated Successfully!' } });
			}
			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	}, // DONE
	// ** MANAGE PAGE SEO CONTROLLERS
	updateSEOSettings: async (req, res) => {
		try {
			await connectDB();
			if (req.method === 'POST') {
				const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.UPDATE_PAGE_SEO_DATA, adminId: req?.user?._id });
				if (isRestricted)
					return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });
				const { page_name, page_slug, meta_description, meta_keywords } = req?.body;

				const pageSeoSettings = await new SeoSettings({ page_slug, meta_description, meta_keywords });
				await pageSeoSettings.save();

				// ** RECORD IN ACTIVITY_LOG DATABASE
				await activityLog({
					deed: ACTIVITY_TYPES.UPDATE_PAGE_SEO_DATA.title,
					details: `${ACTIVITY_TYPES.UPDATE_PAGE_SEO_DATA.desc} ${page_name} Page`,
					user_id: req?.user?._id,
				});
				return responseLogic({ req, res, status: 200, data: { message: 'SEO updated successfully!' } });
			}
			return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	}, // DONE

	// ** MANAGE ADMINS CONTROLLER
	getAllAdmins: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ SSG: SSG, req, res, status: 401, data: { message: 'You are not authorized to view this data!' } });

			const levelFilter = req.query?.member_role ? { member_role: req.query?.member_role } : {};
			const filter = { ...levelFilter };
			const results = await Users.find(filter).select('-password -_id').sort({ createdAt: -1 });
			return responseLogic({ SSG: SSG, req, res, status: 200, data: { results } });
		} catch (err) {
			return responseLogic({ SSG: SSG, res, catchError: err });
		}
	},
	deleteAdmin: async (req, res) => {
		try {
			if (req.method !== 'DELETE') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ SSG: SSG, req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			const isRestricted = await CheckAdminRestriction({ action: ADMIN_PANEL_ACTIONS.DELETE_ADMIN, adminId: req?.user?._id });
			if (isRestricted) return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to perform this action!' } });

			if (req?.user?.url === req?.query?.admin)
				return responseLogic({ SSG: SSG, req, res, status: 401, data: { message: 'You cannot delete your account!' } });

			const user = await Users.findOneAndDelete({ url: req?.query?.admin });

			// ** RECORD IN ACTIVITY_LOG DATABASE
			await activityLog({
				deed: ACTIVITY_TYPES.DELETE_ADMIN.title,
				details: `${ACTIVITY_TYPES.DELETE_ADMIN.desc} - ${user?.lastname} ${user?.firstname}`,
				user_id: req?.user?._id,
			});
			return responseLogic({ req, res, status: 200, data: { message: 'Admin deleted successfully!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	// ** ACTIVITY LOGS CONTROLLER
	getAllActivityLogs: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			if (req.user?.member_role !== MEMBER_ROLES.MASTER)
				return responseLogic({ req, res, status: 401, data: { message: 'You are not authorized to view this data!' } });

			// console.log({ query: req.query });

			const dateRangeFilter = req.query?.dateRange ? { dateRange: req.query?.dateRange } : {};
			const userFilter = req.query?.user ? { user_url: req.query?.user } : {};
			const actionFilter = req.query?.deed ? { deed: req.query?.deed } : {};
			const accountsFilter = req.query?.account
				? { account_type: req.query?.account === 'ALL ADMINS' ? [MEMBER_ROLES.MASTER, MEMBER_ROLES.MANAGER] : req?.query?.account }
				: {};

			const filter = { ...dateRangeFilter, ...userFilter, ...actionFilter, ...accountsFilter };

			const features = new APIfeatures(ActivityLogs.find(filter), req.query).paginating();
			const results = await features.query
				.find({})
				.populate({
					path: 'user_id',
					select: 'firstname secondname lastname member_role url avatar',
					model: Users,
				})
				.sort({ createdAt: -1 });
			return responseLogic({ SSG: SSG, req, res, status: 200, data: { results } });
		} catch (err) {
			return responseLogic({ SSG: SSG, res, catchError: err });
		}
	},
	// ** CONTACT FORM SUBMISSIONS CONTROLLERS
	// getContactFormSubmissions: async (req, res, SSG = false) => {
	// 	try {
	// 		if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
	// 		await connectDB();

	// 		const filter = req.query?.read ? { read: req.query.read } : {};
	// 		const features = new APIfeatures(ContactForm.find(filter), req.query).paginating();
	// 		const submissions = await features.query.sort({ createdAt: -1 });

	// 		const allSubmissions = await ContactForm.find({});

	// 		return responseLogic({
	// 			SSG: SSG,
	// 			req,
	// 			res,
	// 			status: 200,
	// 			data: {
	// 				submissions,
	// 				unRead: allSubmissions.filter((index) => index.read === false).length,
	// 				read: allSubmissions.filter((index) => index.read === true).length,
	// 			},
	// 		});
	// 	} catch (err) {
	// 		return responseLogic({ SSG: SSG, res, catchError: err });
	// 	}
	// },

	// markContactFormAsRead: async (req, res) => {
	// 	try {
	// 		if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
	// 		await connectDB();

	// 		const { contact } = req.body;
	// 		const updated = await ContactForm.findByIdAndUpdate(contact, { read: true }, { new: true });
	// 		await activityLog({
	// 			deed: ACTIVITY_TYPES.READ_CONTACT_FORM.title,
	// 			details: `${ACTIVITY_TYPES.READ_CONTACT_FORM.desc} ${updated.uniqueID}`,
	// 			user_id: req.user._id,
	// 			res,
	// 		});

	// 		const allSubmissions = await ContactForm.find({});

	// 		return responseLogic({
	// 			req,
	// 			res,
	// 			status: 200,
	// 			data: {
	// 				updatedAt: updated.updatedAt,
	// 				unRead: allSubmissions.filter((index) => index.read === false).length,
	// 				read: allSubmissions.filter((index) => index.read === true).length,
	// 			},
	// 		});
	// 	} catch (err) {
	// 		return responseLogic({ res, catchError: err });
	// 	}
	// },

	// ** ACTIVITY LOGS CONTROLLER
	// getAllActivityLogs: async (req, res, SSG = false) => {
	// 	try {
	// 		if (req.method !== 'GET') return responseLogic({ SSG: SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
	// 		await connectDB();

	// 		const userFilter = req.query?.user ? { user_url: req.query?.user } : {};
	// 		const typeFilter = req.query?.type ? { type: req.query?.type } : {};
	// 		const dateFilter = req.query?.date ? { createdAt: req.query?.date } : {};
	// 		const filter = { ...userFilter, ...typeFilter, ...dateFilter };

	// 		const logs = await ActivityLogs.find(filter).sort({ createdAt: -1 });

	// 		return responseLogic({ SSG: SSG, req, res, status: 200, data: { logs } });
	// 	} catch (err) {
	// 		return responseLogic({ SSG: SSG, res, catchError: err });
	// 	}
	// },
};

module.exports = AdminController;
