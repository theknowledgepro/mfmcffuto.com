/** @format */

import {
	WebLayout,
	WebSectionBreadCrumb,
	CategoryChip,
	BlogCommentCard,
	TagChip,
	SocialShareModal,
	SubscribeToBlogNotificationForm,
	BlogThumb,
	BlogCard,
	DrawerBlock,
	BlogSectionCommonFooter,
	BlogContent,
	WithDrawer,
} from '@/components';
import { APP_ROUTES, CUSTOM_UI_TYPES, SITE_DATA } from '@/config';
import React, { useState, useRef } from 'react';
import styles from '@/pages/pages_styles.module.css';
import comp_styles from '@/components/components.module.css';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import Moment from 'react-moment';
import { Avatar, Divider, IconButton, InputAdornment, TextField } from '@mui/material';
import { stringToColor } from '@/utils/misc_functions';
import Link from 'next/link';
import ShareIcon from '@mui/icons-material/Share';
import CollectionsBookmarkTwoToneIcon from '@mui/icons-material/CollectionsBookmarkTwoTone';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import { SvgIcons } from '@/components/icons';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import WebController from '@/pages/api/controller';

const RenderCommentsSection = ({ blogData, dividerBgColor }) => {
	const [inputData, setInputData] = useState({ comment: '', use: '' });
	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setInputData({ ...inputData, [name]: value });
	};
	const [errors, setErrors] = React.useState({});
	const handleSubmitComment = () => {};
	return (
		<div style={{ zIndex: '4' }} className={`${styles.sticky_card_from_md_up} overflow-hidden w-100 py-2`}>
			<Paper className='w-100 pt-2 mb-2 bg-inherit border position-relative'>
				<div className='w-100 px-2'>
					<div className={`fs-8 ${comp_styles.category_title}`}>Comments</div>
					<Divider className='mt-3 w-100' sx={{ background: dividerBgColor }} />
				</div>
				<div className={`${styles.comment_section} scroll-design`}>
					<div className={`${blogData?.comments?.length === 0 ? 'h-100' : ''} px-2 pb-5 mb-5 w-100`}>
						{blogData?.comments?.length === 0 && (
							<div className='d-flex flex-column align-content-center justify-content-center h-100 w-100'>
								<div className='m-auto d-flex flex-column text-center'>
									<ForumOutlinedIcon className='mx-auto blog-text-theme' />
									<div className='fs-8'>
										No comments yet!
										<br />
										Be the first to make a comment!
									</div>
								</div>
							</div>
						)}
						{blogData?.comments?.map((comment, i) => (
							<BlogCommentCard key={i} comment={comment} />
						))}
					</div>
					<div className='px-2 pb-2 bg-inherit w-100 position-absolute bottom-0'>
						<TextField
							onChange={handleChangeInput}
							defaultValue={inputData?.comment}
							className='w-100'
							color='primary'
							name='comment'
							variant='standard'
							multiline
							maxRows={3}
							helperText={errors.comment}
							error={errors.comment ? true : false}
							InputProps={{
								startAdornment: (
									<InputAdornment sx={{ padding: '5px 0 20px', margin: 'auto 0' }} position='start'>
										<Avatar src={blogData?.author?.avatar} sx={{ mr: 1, bgcolor: 'var(--color-primary)' }}>
											{blogData?.author?.lastname?.charAt(0)?.toUpperCase()}
										</Avatar>
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment sx={{ padding: '5px 0 20px', margin: 'auto 0' }} position='end'>
										<IconButton sx={{ ml: 0.5 }} onClick={handleSubmitComment} edge='start'>
											<SendTwoToneIcon className='color-primary' sx={{ transform: 'rotate(-45deg)' }} />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</div>
				</div>
			</Paper>
		</div>
	);
};

const BlogPage = ({
	metatags,
	settings,
	blogData,
	blogsettings,
	previousBlogSlug,
	nextBlogSlug,
	blogsRelatedByCategories,
	blogsRelatedByTags,
	youMayAlsoLike,
}) => {
	const sections = blogData?.featured
		? [{ title: 'Articles & Blogs', href: APP_ROUTES.BLOGS }, { title: 'Featured', href: APP_ROUTES.FEATURED_BLOGS }, `${blogData?.title}`]
		: [{ title: 'Articles & Blogs', href: APP_ROUTES.BLOGS }, `${blogData?.title}`];

	const authorName = `${blogData?.author?.lastname?.charAt(0)?.toUpperCase()}${blogData?.author?.lastname
		?.slice(1, undefined)
		?.toLowerCase()} ${blogData?.author?.firstname?.charAt(0)?.toUpperCase()}${blogData?.author?.firstname?.slice(1, undefined)?.toLowerCase()} ${
		blogData?.author?.secondname
	}`;
	const dividerBgColor = 'var(--blog-section-dividers)';

	React.useEffect(() => {
		document.querySelector(':root').style.setProperty('--app-bg', 'var(--blog-section-bg)');
		return () => document.querySelector(':root').style.setProperty('--app-bg', 'var(--app-bg)');
	}, []);
	const divRef = useRef(null);

	return (
		<WebLayout
			withDrawer={true}
			headerOriginalBgColor={true}
			metatags={{ meta_title: `${blogData?.title} | ${SITE_DATA.OFFICIAL_NAME}`, ...metatags }}
			sitesettings={settings}>
			<div className={``} style={{ background: 'var(--blog-section-bg)' }}>
				<WithDrawer
					useWidth='240px'
					sitesettings={settings}
					main={
						<div className={`px-2 ${styles.blog_data_space_right} ${styles.page_top_margin_with_drawer} h-100`}>
							<Grid spacing={1} columns={{ xs: 12, sm: 12, md: 12 }} container={true} className='pb-4'>
								<Grid xs={12} sm={12} md={8} item={true} className=''>
									<Paper ref={divRef} elevation={0} className='p-2 w-100 border bg-inherit'>
										<WebSectionBreadCrumb sectionsColor={'var(--blog-section-color)'} sections={sections} />
										<div className={`${comp_styles.category_title} ${styles.blog_data_title} blog-text-theme mb-4`}>
											{blogData?.title}
										</div>
										<div className='d-flex w-100 flex-wrap'>
											{blogData?.tags?.map((tag, i) => (
												<TagChip hideLink={false} tag={tag} key={i} />
											))}
										</div>
										<Divider className='w-100 my-3' sx={{ background: dividerBgColor }} />
										<div className='d-flex w-100 align-content-center justify-content-between'>
											<div className='d-flex'>
												<Avatar src={blogData?.author?.avatar} sx={{ mr: 1, bgcolor: stringToColor(blogData?.title) }}>
													{blogData?.author?.lastname?.charAt(0)?.toUpperCase()}
												</Avatar>
												<div className='d-flex flex-column'>
													<div className='fs-9 my-auto blog-text-theme fw-bold'>Author - {authorName}</div>
													<div className='mt-1 fs-9 blog-text-theme d-flex flex-wrap'>
														{blogsettings?.show_views && (
															<div className='my-auto me-1'>
																<RemoveRedEyeTwoToneIcon className='fs-6 blog-text-theme me-1' />
																<span className='fs-9 my-auto'>{blogData?.views?.length} views |</span>
															</div>
														)}
														{blogsettings?.show_comments && (
															<div className='my-auto me-1'>
																<ForumOutlinedIcon className='fs-6 blog-text-theme me-1' />
																<span className='fs-9 my-auto'>{blogData?.comments?.length} |</span>
															</div>
														)}
														<span className='my-auto'>
															<span className='ms-1'>
																<Moment format='MMMM'>{blogData?.createdAt}</Moment>
															</span>
															<span className='ms-1'>
																<Moment format='DD'>{blogData?.createdAt}</Moment>,
															</span>
															<span className='ms-1'>
																<Moment format='YYYY'>{blogData?.createdAt}</Moment>
															</span>
														</span>
													</div>
												</div>
											</div>
											<SocialShareModal url={blogData?.slug}>
												<ShareIcon className='blog-text-theme' />
											</SocialShareModal>
										</div>
										<Divider className='w-100 my-3' sx={{ background: dividerBgColor }} />
										<div className='w-100 d-flex flex-column align-items-center justify-content-center'>
											<BlogContent divRef={divRef} content={blogData?.body} />
											<Divider className='w-100 my-3' sx={{ background: dividerBgColor }} />
											<div className='w-100'>
												<div className='fs-5 fw-bold blog-text-theme'>
													@ Blog Categor{blogData?.categories?.length > 1 ? 'ies' : 'y'}
												</div>
												<div className='d-flex mt-2 w-100 flex-wrap'>
													{blogData?.categories?.map((category, i) => (
														<CategoryChip hideLink={false} category={category} key={i} />
													))}
												</div>
												<div className='w-100'>
													<Link href={APP_ROUTES.BLOGS_CATEGORIES} className='fw-bold text-decor-none color-primary fs-8'>
														Explore Articles & Blogs Categories
													</Link>
												</div>
											</div>
											<Divider className='w-100 my-2' sx={{ background: dividerBgColor }} />
											<div className='w-100'>
												<div className='fs-5 fw-bold blog-text-theme'># Blog Tags</div>
												<div className='d-flex mt-2 w-100 flex-wrap'>
													{blogData?.tags?.map((tag, i) => (
														<TagChip hideLink={false} tag={tag} key={i} />
													))}
												</div>
												<div className='w-100'>
													<Link href={APP_ROUTES.BLOGS_TAGS} className='fw-bold text-decor-none color-primary fs-8'>
														Explore Articles & Blogs Tags
													</Link>
												</div>
											</div>
											<Divider className='w-100 my-2' sx={{ background: dividerBgColor }} />
											<div className='w-100'>
												<div className='w-100 d-flex flex-wrap'>
													<SocialShareModal url={blogData?.slug}>
														<div className='fs-6 blog-text-theme'>
															<ShareIcon className='blog-text-theme' /> Share
														</div>
													</SocialShareModal>
												</div>
											</div>
											<Divider className='w-100 my-2' sx={{ background: dividerBgColor }} />
											<div className='w-100 d-flex align-content-center justify-content-between'>
												{previousBlogSlug?.slug && (
													<Link
														href={`${APP_ROUTES.BLOGS}/${previousBlogSlug?.slug}`}
														className='text-decor-none color-primary fs-8'>
														{'<'} Previous
													</Link>
												)}
												{nextBlogSlug?.slug && (
													<Link
														href={`${APP_ROUTES.BLOGS}/${nextBlogSlug?.slug}`}
														className='text-decor-none color-primary fs-8'>
														Next {'>'}
													</Link>
												)}
											</div>
										</div>
									</Paper>
									<Paper className='p-2 mt-2 w-100 border bg-inherit'>
										<div className='fs-5 fw-bold blog-text-theme'> Meet the Author</div>
										<Divider className='w-100 my-2' sx={{ background: dividerBgColor }} />
										<div className='d-flex justify-between w-100 flex-column flex-md-row gap-3'>
											<Avatar
												src={blogData?.author?.avatar}
												className='m-auto'
												sx={{ mr: 1, bgcolor: stringToColor(blogData?.title), height: '60px', width: '60px' }}>
												{blogData?.author?.lastname?.charAt(0)?.toUpperCase()}
											</Avatar>
											<div className='w-100 d-flex flex-column align-items-center justify-content-center align-items-md-start justify-content-md-start'>
												<div className='fs-9 my-auto fw-bold blog-text-theme'>{authorName}</div>
												<div className='w-100 my-2 fs-7 blog-text-theme'>{blogData?.author?.about}</div>
												<div className='mb-1 fs-9 blog-text-theme d-flex flex-wrap'>
													{blogsettings?.show_views && (
														<div className='my-auto me-1'>
															<CollectionsBookmarkTwoToneIcon className='fs-6 blog-text-theme me-1' />
															<span className='fs-9 my-auto border-bottom blog-text-theme'>
																{blogData?.author?.articles?.length} Published Articles{' '}
																<DoneAllTwoToneIcon className='my-auto fs-6 text-success' />
															</span>
														</div>
													)}
												</div>
												<div className={`my-2 ${comp_styles.social_icons}`}>
													{blogData?.author?.social_handles?.facebook_url && (
														<Link
															target='_blank'
															href={blogData?.author?.social_handles?.facebook_url}
															className={`${comp_styles.icon} facebook`}>
															<SvgIcons.FaFacebookF />
														</Link>
													)}
													{blogData?.author?.social_handles?.instagram_url && (
														<Link
															target='_blank'
															href={blogData?.author?.social_handles?.instagram_url}
															className={`${comp_styles.icon} instagram`}>
															<SvgIcons.FaInstagram />
														</Link>
													)}
													{blogData?.author?.social_handles?.telegram_url && (
														<Link
															target='_blank'
															href={blogData?.author?.social_handles?.telegram_url}
															className={`${comp_styles.icon} telegram`}>
															<SvgIcons.FaTelegramPlane />
														</Link>
													)}
													{blogData?.author?.social_handles?.whatsApp_url && (
														<Link
															target='_blank'
															href={`https://wa.me/${blogData?.author?.social_handles?.whatsApp_url}?text=Hello,%20${authorName},%20My%20name%20is%20"`}
															className={`${comp_styles.icon} whatsapp`}>
															<SvgIcons.FaWhatsapp />
														</Link>
													)}
													{blogData?.author?.social_handles?.youTube_url && (
														<Link
															target='_blank'
															href={blogData?.author?.social_handles?.youTube_url}
															className={`${comp_styles.icon} youtube`}>
															<SvgIcons.FaYoutube />
														</Link>
													)}
												</div>
											</div>
										</div>
									</Paper>
								</Grid>
								<Grid
									xs={12}
									sm={12}
									md={4}
									item={true}
									className='pb-2 d-flex flex-column flex-column-reverse flex-md-column align-items-start position-relative'>
									<div className='w-100'>
										{blogsRelatedByCategories?.length > 0 && (
											<Paper className='border w-100 p-2 my-2 bg-inherit'>
												<div className='w-100'>
													<div className={`fs-8 ${comp_styles.category_title} blog-text-theme`}>
														Related Posts By Category
													</div>
													<Divider className='my-3 w-100' sx={{ background: dividerBgColor }} />
													<div className='w-100 my-2'>
														{blogsRelatedByCategories?.map((blog, i) => (
															<BlogThumb
																textColorClassName='blog-text-theme'
																isCategory={true}
																blogsettings={blogsettings}
																key={i}
																blog={blog}
															/>
														))}
													</div>
												</div>
											</Paper>
										)}

										{blogsRelatedByTags?.length > 0 && (
											<Paper className='border w-100 p-2 my-2 bg-inherit'>
												<div className='w-100'>
													<div className={`fs-8 ${comp_styles.category_title} blog-text-theme`}>Related Posts By Tags</div>
													<Divider className='my-3 w-100' sx={{ background: dividerBgColor }} />
													<div className='w-100 my-2'>
														{blogsRelatedByTags?.map((blog, i) => (
															<BlogThumb
																textColorClassName='blog-text-theme'
																blogsettings={blogsettings}
																key={i}
																blog={blog}
															/>
														))}
													</div>
												</div>
											</Paper>
										)}
										<SubscribeToBlogNotificationForm />
									</div>
									<RenderCommentsSection dividerBgColor={dividerBgColor} blogData={blogData} />
								</Grid>
							</Grid>

							<div className='w-100 pb-5 mb-5'>
								<h1 className={`${comp_styles.section_title} blog-text-theme`}>You May Also Like...</h1>
								<Divider className='w-100 mt-2 mb-5' sx={{ background: dividerBgColor }} />
								<Grid
									spacing={0}
									columns={{ xs: 12, sm: 8, md: 12 }}
									container={true}
									className='w-100 d-flex align-items-center justify-content-center'>
									{youMayAlsoLike.map((blog, i) => (
										<BlogCard
											responsiveSizes={{ xs: 12, sm: 4, md: 4 }}
											responsiveHeight={{
												xs:
													!blogsettings?.blog_preview_card_custom_display ||
													blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
														? '238px'
														: '420px',
												sm:
													!blogsettings?.blog_preview_card_custom_display ||
													blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1
														? '268px'
														: '420px',
											}}
											blog={blog}
											size={'LARGE'}
											blogsettings={blogsettings}
											key={i}
										/>
									))}
								</Grid>
							</div>
							<BlogSectionCommonFooter />
						</div>
					}
				/>
			</div>
		</WebLayout>
	);
};

export async function getServerSideProps({ req, res, query }) {
	// ** PASS PARAMS TO REQ OBJECT FOR FILTERS AND FETCH LIMITS IN SERVER SIDE REQUESTS
	req.query = query;

	// ** GET SITE SETTINGS
	const siteSettings = await WebController.getSiteSettings(req, res, true);

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);

	// ** GET BLOG DATA
	let blog = await WebController.getBlogDataPage(req, res, true);
	blog = blog ? (blog?.published ? blog : { published: blog?.published }) : {};

	// ** GET PREVIOUS AND NEXT BLOGS FROM ANY OF THIS BLOGS CATEGORIES
	req.query.blogMainCategory = blog?.categories?.length ? blog?.categories[0] : '';
	req.query.blogSlug = blog?.slug;
	const prevAndNextBlogByCategory = await WebController.getPrevAndNextBlogByCategory(req, res, true);

	// ** GET PUBLISHED BLOGS RELATED BY CATEGORY
	req.query.limit = 6;
	req.query.categoryTitles = blog?.categories?.length
		? blog?.categories?.map((category, i) => {
				return category?.title;
		  })
		: [];
	const blogsRelatedByCategories = await WebController.getBlogsRelatedByCategories(req, res, true);

	// ** GET PUBLISHED BLOGS RELATED BY TAGS
	req.query.tagTitles = blog?.tags?.length
		? blog?.tags?.map((tag, i) => {
				return tag?.title;
		  })
		: [];
	const blogsRelatedByTags = await WebController.getBlogsRelatedByTags(req, res, true);

	// ** RECENT BLOGS
	req.query.limit = 12;
	const recentBlogs = await WebController.getBlogsWithPopulatedFields(req, res, true);

	return {
		props: {
			metatags: JSON.parse(
				JSON.stringify({
					og_title: `${blog?.title ? blog?.title : 'Not Found!'} | ${SITE_DATA.OFFICIAL_NAME}`,
					og_description: blog?.meta_description,
					og_url: `${APP_ROUTES.BLOGS}/${blog?.slug}`,
					og_image: blog?.thumbnail,

					twitter_title: `${blog?.title ? blog?.title : 'Not Found!'} | ${SITE_DATA.OFFICIAL_NAME}`,
					twitter_description: blog?.meta_description,
					twitter_card: 'summary_large_image',
					twitter_image: blog?.thumbnail,
					twitter_site: siteSettings?.org_twitter_username,

					meta_title: `${blog?.title ? blog?.title : 'Not Found!'} | ${SITE_DATA.OFFICIAL_NAME}`,
					meta_description: blog?.meta_description,
					meta_keywords: blog?.meta_keywords,
				})
			),
			settings: siteSettings,
			blogsettings: blogSettings,
			blogData: blog,
			previousBlogSlug: prevAndNextBlogByCategory[0]?.slug ? prevAndNextBlogByCategory[0] : '',
			nextBlogSlug: prevAndNextBlogByCategory[1]?.slug ? prevAndNextBlogByCategory[1] : '',
			blogsRelatedByCategories: blogsRelatedByCategories?.length ? blogsRelatedByCategories : [],
			blogsRelatedByTags: blogsRelatedByTags?.length ? blogsRelatedByTags : [],
			youMayAlsoLike: recentBlogs?.length ? recentBlogs : [],
		},
	};
}

export default BlogPage;
