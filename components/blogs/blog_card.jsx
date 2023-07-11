/** @format */

import React, { useRef } from 'react';
import { Box, Divider, Grid, Paper } from '@mui/material';
import styles from '@/components/components.module.css';
import { APP_ROUTES, CLOUD_ASSET_BASEURL, CUSTOM_UI_TYPES, LIMITS, ASSETS } from '@/config';
import Link from 'next/link';
import { TagChip, CategoryChip, ImageTag } from '..';
import UseMediaQuery from '@/utils/use_media_query';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import Moment from 'react-moment';
import { stringToColor } from '@/utils/misc_functions';

const BlogCard = ({ blog, blogsettings, responsiveSizes = { xs: 12, sm: 4, md: 6 }, responsiveHeight = {}, size, blogType }) => {
	const blogSlug = `${APP_ROUTES.BLOGS}/${blog?.slug}`;
	const { isMatchWidth } = UseMediaQuery({ vw: '500px' });

	const titleRef = useRef(null);

	if (blogsettings?.blog_preview_card_custom_display === CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD2 && blogType !== 'FEATURED')
		return (
			<Grid item={true} {...responsiveSizes} className={`rounded-sm my-auto ${isMatchWidth ? 'p-1' : 'p-2'}`}>
				<Paper
					elevation={2}
					sx={{ height: { ...responsiveHeight }, borderRadius: '0px' }}
					className='relative flex flex-col items-baseline justify-end w-full bg-white rounded-[4px]'>
					<div
						title={blog?.title}
						style={{ '--image-color': stringToColor(blog?.title), maxHeight: '55%', borderRadius: '0px' }}
						className={styles.blog_card_wrapper}>
						<ImageTag
							src={blog?.thumbnail ? `${CLOUD_ASSET_BASEURL}/${blog?.thumbnail?.trim()}` : ASSETS.LOGO}
							className={`border ${styles.blog_img}`}
							style={{ borderRadius: '0' }}
							alt={blog?.title}
						/>
						<div className='absolute z-3 p-2 left-0 top-0 w-full flex flex-wrap items-start justify-start'>
							{blog?.categories
								?.slice(0, isMatchWidth !== undefined && isMatchWidth && size === 'SMALL' ? 1 : 2)
								?.map((category, i) => (
									<CategoryChip hideLink={true} category={category} key={i} />
								))}
						</div>
					</div>
					<div
						style={{ height: '45%', width: '100%' }}
						className='absolute text-dark z-3 p-2 left-0 bottom-0 w-full flex flex-col items-baseline justify-start'>
						<div style={{ top: -8 }} className='absolute flex flex-wrap w-full'>
							{!(isMatchWidth !== undefined && isMatchWidth && size === 'SMALL') &&
								blog?.tags
									?.slice(0, isMatchWidth || size === 'SMALL' ? 2 : 3)
									?.map((tag, i) => <TagChip hideLink={true} tag={tag} key={i} />)}

							{((isMatchWidth !== undefined && !isMatchWidth) || size === 'LARGE') &&
								blog?.tags?.slice(isMatchWidth || size === 'SMALL' ? 2 : 3, undefined)?.length > 0 && (
									<div className='bg-white mb-1 ml-1 text-[13px] font-medium-custom px-1 border text-dark rounded-1'>
										+ {blog?.tags?.slice(isMatchWidth || size === 'SMALL' ? 2 : 3, undefined)?.length} more tag
										{blog?.tags?.slice(isMatchWidth || size === 'SMALL' ? 2 : 3, undefined)?.length > 1 ? 's' : ''}
									</div>
								)}
						</div>
						<div
							style={{
								position: 'absolute',
								bottom: '10px',
								height: 'max-content',
								width: '100%',
							}}>
							<Link href={blogSlug} className='text-single-line text-dark text-decor-none' style={{ width: '100%' }}>
								<div
									ref={titleRef}
									style={{ width: '90%' }}
									className={`text-single-line mt-2 text-dark font-medium-custom ${size === 'SMALL' && 'fs-8'} ${
										size === 'LARGE' && 'fs-5'
									}`}>
									{blog?.title}
								</div>
							</Link>
							<Divider className='my-1' sx={{ width: '90%' }} />
							<Link href={blogSlug} className='text-dark text-decor-none'>
								<div className='line-height-1b mb-2 flex flex-wrap fs-7' style={{ width: '90%' }}>
									{blog?.summary?.length > LIMITS.BLOG_SUMMARY_LIMIT
										? blog?.summary?.slice(0, LIMITS.BLOG_SUMMARY_LIMIT) + '...'
										: blog?.summary}
								</div>
							</Link>
							<Divider className='my-1' sx={{ width: '90%' }} />
							{((isMatchWidth !== undefined && !isMatchWidth) || size === 'LARGE') && (
								<div className='mb-1 text-[13px] text-dark flex flex-wrap'>
									{blogsettings?.show_views && (
										<div className='my-auto mr-1'>
											<RemoveRedEyeTwoToneIcon className='text-[15px] text-dark mr-1' />
											<span className='text-[13px] my-auto'>{blog?.views?.length} views |</span>
										</div>
									)}
									{blogsettings?.show_comments && (
										<div className='my-auto mr-1'>
											<ForumOutlinedIcon className='text-[15px] text-dark mr-1' />
											<span className='text-[13px] my-auto'>{blog?.comments?.length} |</span>
										</div>
									)}
									<span className='my-auto'>
										<span className='ml-1'>
											<Moment className='text-[13px]' format='MMMM'>
												{blog?.createdAt}
											</Moment>
										</span>
										<span className='ml-1'>
											<Moment className='text-[13px]' format='DD'>
												{blog?.createdAt}
											</Moment>
											,
										</span>
										<span className='ml-1'>
											<Moment className='text-[13px]' format='YYYY'>
												{blog?.createdAt}
											</Moment>
										</span>
									</span>
								</div>
							)}
							{((isMatchWidth !== undefined && !isMatchWidth) || size === 'LARGE') && (
								<div className='text-dark flex'>
									{blog?.author?.avatar && (
										<ImageTag
											src={
												blog?.author?.avatar
													? blog?.author?.avatar
													: blog?.author?.gender === 'Male'
													? ASSETS.MALE_AVATAR
													: ASSETS.FEMALE_AVATAR
											}
											className={`rounded-[50%] mr-1 ${styles.blog_author_avatar}`}
											alt={blog?.title}
										/>
									)}
									<div className='text-[13px] my-auto font-medium-custom'>
										{size === 'SMALL'
											? blog?.author?.lastname?.charAt(0)?.toUpperCase()
											: `${blog?.author?.lastname?.charAt(0)?.toUpperCase()}${blog?.author?.lastname
													.slice(1, undefined)
													?.toLowerCase()}`}
										{size === 'SMALL' && '. '}
										{` ${blog?.author?.firstname?.charAt(0)?.toUpperCase()}${blog?.author?.firstname
											?.slice(1, undefined)
											?.toLowerCase()} `}
										{blog?.author?.secondname?.length > 12
											? blog?.author?.secondname?.slice(0, 12) + '...'
											: blog?.author?.secondname?.slice(0, 12)}
									</div>
								</div>
							)}
						</div>
					</div>
				</Paper>
			</Grid>
		);
	return (
		<Grid item={true} {...responsiveSizes} className={`rounded-md my-auto ${isMatchWidth ? 'p-1' : 'p-2'}`}>
			<Box sx={{ height: { ...responsiveHeight } }} className='relative flex flex-col items-baseline justify-end w-full rounded-sm'>
				<Paper title={blog?.title} style={{ '--image-color': stringToColor(blog?.title) }} className={styles.blog_card_wrapper}>
					<ImageTag src={blog?.thumbnail ? `${CLOUD_ASSET_BASEURL}/${blog?.thumbnail?.trim()}` : ASSETS.LOGO} className={styles.blog_img} alt={blog?.title} />
					<div className='absolute z-[1000] p-2 left-0 top-0 w-full flex flex-wrap items-start justify-start'>
						{blog?.categories?.slice(0, isMatchWidth !== undefined && isMatchWidth && size === 'SMALL' ? 1 : 2)?.map((category, i) => (
							<CategoryChip hideLink={true} category={category} key={i} />
						))}
					</div>
					<div className='absolute z-[1000] p-2 left-0 bottom-0 w-full flex flex-col items-start justify-start'>
						<div className='my-1 flex flex-wrap w-full'>
							{!(isMatchWidth !== undefined && isMatchWidth && size === 'SMALL') &&
								blog?.tags
									?.slice(0, isMatchWidth || size === 'SMALL' ? 2 : 3)
									?.map((tag, i) => <TagChip hideLink={true} tag={tag} key={i} />)}

							{((isMatchWidth !== undefined && !isMatchWidth) || size === 'LARGE') &&
								blog?.tags?.slice(isMatchWidth || size === 'SMALL' ? 2 : 3, undefined)?.length > 0 && (
									<div className='bg-white mb-1 ml-1 text-[13px] font-medium-custom px-1 border text-dark rounded-1'>
										+ {blog?.tags?.slice(isMatchWidth || size === 'SMALL' ? 2 : 3, undefined)?.length} more tag
										{blog?.tags?.slice(isMatchWidth || size === 'SMALL' ? 2 : 3, undefined)?.length > 1 ? 's' : ''}
									</div>
								)}
						</div>
						<Link href={blogSlug} className='text-decor-none'>
							<div className={`text-white w-full font-medium-custom ${size === 'SMALL' && 'fs-8'} ${size === 'LARGE' && 'fs-5'}`}>
								{blog?.title?.length > 35 && size === 'SMALL' ? blog?.title?.slice(0, 35) + '...' : blog?.title?.slice(0, undefined)}
							</div>
							{
								<div className='mb-1 text-[13px] text-white flex flex-wrap'>
									{((isMatchWidth !== undefined && !isMatchWidth) || size === 'LARGE') && (
										<React.Fragment>
											{blogsettings?.show_views && (
												<div className='my-auto mr-1'>
													<RemoveRedEyeTwoToneIcon className='text-[15px] text-white mr-1' />
													<span className='text-[13px] my-auto'>{blog?.views?.length} views |</span>
												</div>
											)}
											{blogsettings?.show_comments && (
												<div className='my-auto mr-2'>
													<ForumOutlinedIcon className='text-[15px] text-white mr-1' />
													<span className='text-[13px] my-auto'>{blog?.comments?.length} |</span>
												</div>
											)}
										</React.Fragment>
									)}

									<span className='my-auto'>
										<span className=''>
											<Moment className='text-[13px]' format='MMMM'>
												{blog?.createdAt}
											</Moment>
										</span>
										<span className='ml-1'>
											<Moment className='text-[13px]' format='DD'>
												{blog?.createdAt}
											</Moment>
											,
										</span>
										<span className='ml-1'>
											<Moment className='text-[13px]' format='YYYY'>
												{blog?.createdAt}
											</Moment>
										</span>
									</span>
								</div>
							}
							{((isMatchWidth !== undefined && !isMatchWidth) || size === 'LARGE') && (
								<div className='text-white flex'>
									{blog?.author?.avatar && (
										<ImageTag
											src={
												blog?.author?.avatar
													? blog?.author?.avatar
													: blog?.author?.gender === 'Male'
													? ASSETS.MALE_AVATAR
													: ASSETS.FEMALE_AVATAR
											}
											className={`rounded-[50%] mr-1 ${styles.blog_author_avatar}`}
											alt={blog?.title}
										/>
									)}
									<div className='text-[13px] my-auto font-medium-custom'>
										{size === 'SMALL'
											? blog?.author?.lastname?.charAt(0)?.toUpperCase()
											: `${blog?.author?.lastname?.charAt(0)?.toUpperCase()}${blog?.author?.lastname
													.slice(1, undefined)
													?.toLowerCase()}`}
										{size === 'SMALL' && '. '}
										{` ${blog?.author?.firstname?.charAt(0)?.toUpperCase()}${blog?.author?.firstname
											?.slice(1, undefined)
											?.toLowerCase()} `}
										{blog?.author?.secondname?.length > 12
											? blog?.author?.secondname?.slice(0, 12) + '...'
											: blog?.author?.secondname?.slice(0, 12)}
									</div>
								</div>
							)}
						</Link>
					</div>
				</Paper>
			</Box>
		</Grid>
	);
};

export default BlogCard;
