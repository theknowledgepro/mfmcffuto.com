/** @format */

const SiteSettings = require('@/models/site_settings_model');
const BlogTags = require('@/models/blog_tags_model');
const BlogCategories = require('@/models/blog_categories_model');
const BlogComments = require('@/models/blog_comments');
const Blogs = require('@/models/blog_model');
const Users = require('@/models/user_model');
const SeoSettings = require('@/models/seo_model');
const responseLogic = require('@/middlewares/server_response_logic');
const connectDB = require('@/middlewares/db_config');
const { makeObectArrayUniqueByValueIndex } = require('@/utils/misc_functions');

const WebController = {
	getAllBlogTagsPage: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const categoriesSelectionFields = `-_id title slug`;
			const tagsSelectionFields = `-_id title slug`;
			const blogSelectionFields = '-_id title slug thumbnail views summary comments createdAt';
			const blogAuthorSelectionFileds = `-_id firstname secondname lastname avatar`;

			const limit = req?.query?.limit ?? null;

			const allTags = await BlogTags.find({ published: true })
				.select(req?.query?.select)
				.limit(limit)
				.populate({
					path: 'blogs',
					select: blogSelectionFields,
					match: { published: { $eq: true } },
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'author',
						select: blogAuthorSelectionFileds,
						model: Users,
					},
				})
				.populate({
					path: 'blogs',
					select: blogSelectionFields,
					match: { published: { $eq: true } },
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'categories',
						match: { published: { $eq: true } },
						select: categoriesSelectionFields,
						model: BlogCategories,
						options: { sort: { createdAt: -1 } },
					},
				})
				.populate({
					path: 'blogs',
					select: blogSelectionFields,
					match: { published: { $eq: true } },
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'tags',
						match: { published: { $eq: true } },
						select: tagsSelectionFields,
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
	getBlogCategories: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			const blogSettings = await SiteSettings.findOne({ type: 'Blog-Settings' });

			const limit = req?.query?.limit ?? null;
			const categoriesSelectionFields = `-_id title slug`;
			const tagsSelectionFields = `-_id title slug`;

			const allCategories = await BlogCategories.find({ published: true })
				.select(`-_id -uniqueID -published -meta_description -meta_keywords -updatedAt -type_writer_strings -__v`)
				.populate({
					path: 'author',
					select: '-_id firstname secondname lastname avatar',
					model: Users,
				})
				.populate({
					path: 'blogs',
					select: '-_id title slug thumbnail createdAt views comments',
					match: { published: { $eq: true } },
					model: Blogs,
					options: { limit: blogSettings?.config?.no_of_articles_on_category_card, sort: { createdAt: -1 } },
					populate: {
						path: 'tags',
						match: { published: { $eq: true } },
						select: tagsSelectionFields,
						model: BlogTags,
						options: { sort: { createdAt: -1 } },
					},
				})
				.sort({ updatedAt: -1 }); // ** FETCHES RECENTLY UPDATED CATEGORY

			const newData =
				allCategories.length === 1
					? allCategories
					: allCategories
							.sort((obj1, obj2) => (obj1.blogs?.length < obj2.blogs?.length ? 1 : obj1.blogs?.length > obj2.blogs?.length ? -1 : 0)) // ** SORTS THE ARRAY BY LENGTH OF BLOGS
							.filter((index) => index.blogs?.length >= blogSettings?.config?.no_of_articles_on_category_card) // ** GET CATEGORIES WITH BLOG LENGTH EQUAL TO VARIABLE SET FROM ADMIN PANEL
							.slice(0, limit);
			return JSON.parse(JSON.stringify(newData));
		} catch (err) {
			return {};
		}
	}, // DONE
	getBlogsWithPopulatedFields: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const limit = req?.query?.limit ?? 12;
			const featuredFilter = req?.query?.featured !== undefined ? { featured: req?.query?.featured } : {};

			const recentBlogs = await Blogs.find({ published: true, ...featuredFilter })
				.limit(limit)
				.select('-_id -uniqueID -meta_description -meta_keywords -published -updatedAt -body -__v')
				.populate({
					path: 'author',
					select: '-_id firstname secondname lastname avatar',
					model: Users,
				})
				.populate({
					path: 'tags',
					select: '-_id title slug',
					match: { published: { $eq: true } },
					model: BlogTags,
					options: { sort: { createdAt: -1 } },
				})
				.populate({
					path: 'categories',
					select: '-_id title slug',
					match: { published: { $eq: true } },
					model: BlogCategories,
					options: { sort: { createdAt: -1 } },
				})
				.sort({ createdAt: -1 });
			return JSON.parse(JSON.stringify(recentBlogs));
		} catch (err) {
			return {};
		}
	}, // DONE
	getCategoryDataPage: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const blogSelectionFields = `-_id title slug thumbnail summary comments views createdAt`;
			const blogAuthorSelectionFileds = `-_id firstname secondname lastname avatar`;
			const categoriesSelectionFields = `-_id title slug`;
			const tagsSelectionFields = `-_id title slug`;

			const categoryData = await BlogCategories.findOne({ slug: req?.query?.category })
				.select('-uniqueID -_id -author -createdAt -updatedAt -__v')
				.populate({
					path: 'blogs',
					select: blogSelectionFields,
					match: { published: { $eq: true } },
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'author',
						select: blogAuthorSelectionFileds,
						model: Users,
					},
				})
				.populate({
					path: 'blogs',
					select: blogSelectionFields,
					match: { published: { $eq: true } },
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'categories',
						match: { published: { $eq: true } },
						select: categoriesSelectionFields,
						model: BlogCategories,
						options: { sort: { createdAt: -1 } },
					},
				})
				.populate({
					path: 'blogs',
					select: blogSelectionFields,
					match: { published: { $eq: true } },
					model: Blogs,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'tags',
						match: { published: { $eq: true } },
						select: tagsSelectionFields,
						model: BlogTags,
						options: { sort: { createdAt: -1 } },
					},
				})
				.sort({ createdAt: -1 });
			return JSON.parse(JSON.stringify(categoryData));
		} catch (err) {
			return {};
		}
	}, // DONE
	getBlogDataPage: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const blogAuthorSelectionFileds = `-_id firstname secondname lastname avatar about articles social_handles`;
			const categoriesSelectionFields = `-_id title slug`;
			const tagsSelectionFields = `-_id title slug`;
			const commentsSelectionFields = `-_id -uniqueID -published`;

			let blogData = await Blogs.findOne({ slug: req?.query?.blog })
				.select('-_id -__v -uniqueID -updatedAt')
				.populate({
					path: 'author',
					select: blogAuthorSelectionFileds,
					model: Users,
				})
				.populate({
					path: 'categories',
					match: { published: { $eq: true } },
					select: categoriesSelectionFields,
					model: BlogCategories,
					options: { sort: { createdAt: -1 } },
				})
				.populate({
					path: 'tags',
					match: { published: { $eq: true } },
					select: tagsSelectionFields,
					model: BlogTags,
					options: { sort: { createdAt: -1 } },
				})
				.populate({
					path: 'comments',
					match: { published: { $eq: true } },
					select: commentsSelectionFields,
					model: BlogComments,
					options: { sort: { createdAt: -1 } },
					populate: {
						path: 'user',
						select: '-_id firstname secondname lastname avatar',
						model: Users,
					},
				});
			return JSON.parse(JSON.stringify(blogData));
		} catch (err) {
			return {};
		}
	}, // DONE
	getPrevAndNextBlogByCategory: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const mainCategory = await BlogCategories.findOne(req.query.blogMainCategory);
			const blogs = await Blogs.find({ categories: mainCategory?._id }).select('-_id slug').sort({ createdAt: -1 });

			const blogIndex = blogs
				.map((blog, i) => (blog?.slug === req?.query?.blogSlug ? i : ''))
				.filter((index) => Number.isInteger(index))
				.toString();

			const prevAndNextBlogs = [blogs[Number(blogIndex) - 1], blogs[Number(blogIndex) + 1]].filter((index) => index !== undefined);

			return JSON.parse(JSON.stringify(prevAndNextBlogs));
		} catch (err) {
			return {};
		}
	}, // DONE
	getBlogsRelatedByCategories: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const categories = await BlogCategories.find({ title: req.query.categoryTitles });
			const categoryIds = categories?.map((category, i) => {
				return category?._id.toString();
			});

			const blogs = await Blogs.find({ categories: { $in: categoryIds }, published: true })
				.select('-_id -__v -updatedAt -body -meta_keywords -meta_description -uniqueID -published -author -summary')
				// .populate({
				// 	path: 'tags',
				// 	select: '-_id title slug',
				// 	match: { published: { $eq: true } },
				// 	model: BlogTags,
				// 	options: { sort: { createdAt: -1 } },
				// })
				.populate({
					path: 'categories',
					select: '-_id title slug',
					match: { published: { $eq: true } },
					model: BlogCategories,
					options: { sort: { createdAt: -1 } },
				})
				.sort({ createdAt: -1 });

			return JSON.parse(
				JSON.stringify(
					makeObectArrayUniqueByValueIndex({ array: blogs, index: 'slug' })
						.slice(0, req.query?.limit ?? undefined)
						.filter((index) => index?.slug !== req?.query?.blogSlug)
				)
			);
		} catch (err) {
			console.log({ err });
			return {};
		}
	}, // DONE
	getBlogsRelatedByTags: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return responseLogic({ SSG, req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const tags = await BlogTags.find({ title: req.query.tagTitles });
			const tagIds = tags?.map((tag, i) => {
				return tag?._id.toString();
			});

			const blogs = await Blogs.find({ tags: { $in: tagIds }, published: true })
				.select('-_id -__v -updatedAt -body -meta_keywords -meta_description -uniqueID -published -author -summary')
				.populate({
					path: 'tags',
					select: '-_id title slug',
					match: { published: { $eq: true } },
					model: BlogTags,
					options: { sort: { createdAt: -1 } },
				})
				// .populate({
				// 	path: 'categories',
				// 	select: '-_id title slug',
				// 	match: { published: { $eq: true } },
				// 	model: BlogCategories,
				// 	options: { sort: { createdAt: -1 } },
				// })
				.sort({ createdAt: -1 });

			return JSON.parse(
				JSON.stringify(
					makeObectArrayUniqueByValueIndex({ array: blogs, index: 'slug' })
						.slice(0, req.query?.limit ?? undefined)
						.filter((index) => index?.slug !== req?.query?.blogSlug)
				)
			);
		} catch (err) {
			return {};
		}
	}, // DONE

	// ** GET BLOG SETTINGS CONTROLLER
	getSiteSettings: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return {};
			await connectDB();
			const settings = await SiteSettings.findOne({ type: 'Site-Settings' });
			return JSON.parse(JSON.stringify(settings?.config));
		} catch (err) {
			return {};
		}
	}, //DONE

	// ** GET BLOG SETTINGS CONTROLLER
	getBlogSettings: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return {};
			await connectDB();
			const blogSettings = await SiteSettings.findOne({ type: 'Blog-Settings' });
			return JSON.parse(JSON.stringify(blogSettings?.config));
		} catch (err) {
			return {};
		}
	}, // DONE

	// ** GET PAGE SEO CONTROLLER
	getPageSEO: async (req, res, SSG = false) => {
		try {
			if (req.method !== 'GET') return {};
			await connectDB();

			const pageSlug = req?.query?.pageSlug;

			const pageSeo = await SeoSettings.findOne({ page_slug: pageSlug }).select('-_id -__v -createdAt -updatedAt');
			return JSON.parse(JSON.stringify(pageSeo));
		} catch (err) {
			return {};
		}
	}, // DONE
};

module.exports = WebController;
