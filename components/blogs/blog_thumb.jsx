/** @format */

import React from 'react';
import styles from '@/components/components.module.css';
import Link from 'next/link';
import { APP_ROUTES, CLOUD_ASSET_BASEURL } from '@/config';
import { Divider } from '@mui/material';
import { CategoryChip, TagChip, ImageTag } from '..';
import UseMediaQuery from '@/utils/use_media_query';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import Moment from 'react-moment';

const BlogThumb = ({ blog, blogsettings, textColorClassName, isCategory, isLast, isAdminPanelView, isTagHidden, isCategoryHidden }) => {
	const blogSlug = `${APP_ROUTES.BLOGS}/${blog?.slug}`;
	const { isMatchWidth } = UseMediaQuery({ vw: '500px' });

	const textColor = textColorClassName ? textColorClassName : 'text-dark';
	return (
		<React.Fragment>
			<div className='w-full flex items-center justify-start'>
				<Link target={isAdminPanelView ? '_blank' : ''} href={blogSlug} className={styles.blog_thumb_img}>
					<ImageTag src={`${CLOUD_ASSET_BASEURL}/${blog?.thumbnail}`} className={`my-auto`} alt={blog?.title} />
				</Link>
				<div className='w-full flex items-start flex-column justify-start overflow-x-hidden'>
					{!isCategory && (
						<div className='flex flex-wrap w-full'>
							{isTagHidden && (
								<div className={`text-[13px] mb-1 px-1 border border-zinc-300 ${textColor} rounded-sm`}>This tag is hidden</div>
							)}
							{blog?.tags?.slice(0, isAdminPanelView ? undefined : isMatchWidth ? 2 : 3)?.map((tag, i) => (
								<TagChip hideLink={true} tag={tag} key={i} />
							))}
							{!isAdminPanelView && blog?.tags?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 0 && (
								<div className={`mb-1 ml-1 text-[13px] font-medium-custom px-1 border border-zinc-300 ${textColor} rounded-sm`}>
									+ {blog?.tags?.slice(isMatchWidth ? 2 : 3, undefined)?.length} more article tag
									{blog?.tags?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 1 ? 's' : ''}
								</div>
							)}
						</div>
					)}
					{isCategory && (
						<div className='flex flex-wrap w-full'>
							{isCategoryHidden && <div className={`text-[13px] mb-1 px-1 border ${textColor} rounded-1`}>This category is hidden</div>}
							{blog?.categories?.slice(0, isAdminPanelView ? undefined : isMatchWidth ? 2 : 3)?.map((category, i) => (
								<CategoryChip hideLink={true} category={category} key={i} />
							))}
							{blog?.categories?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 0 && (
								<div className={`mb-1 ml-1 text-[13px] font-medium-custom px-1 border border-zinc-300 ${textColor} rounded-1`}>
									+ {blog?.categories?.slice(isMatchWidth ? 2 : 3, undefined)?.length} more categor
									{blog?.categories?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 1 ? 'ies' : 'y'}
								</div>
							)}
						</div>
					)}
					<Link
						target={isAdminPanelView ? '_blank' : ''}
						href={blogSlug}
						className={`text-decor-none ${textColor} mb-1 fs-7 font-medium-custom flex flex-wrap`}>
						{blog?.title}
					</Link>
					<div className='mb-1 text-[13px] flex flex-wrap'>
						{(isAdminPanelView || blogsettings?.show_views) && (
							<div className='my-auto mr-1'>
								<RemoveRedEyeTwoToneIcon className={`${textColor} text-[15px] mr-1`} />
								<span className={`${textColor} text-[13px] my-auto`}>{blog?.views?.length} views |</span>
							</div>
						)}
						{(isAdminPanelView || blogsettings?.show_comments) && (
							<div className='my-auto mr-1'>
								<ForumOutlinedIcon className={`${textColor} text-[15px] mr-1`} />
								<span className={`${textColor} text-[13px] my-auto`}>{blog?.comments?.length} |</span>
							</div>
						)}
						<span className={`${textColor} text-[13px] my-auto`}>
							<span className='ml-1'>
								<Moment format='MMMM'>{blog?.createdAt}</Moment>
							</span>
							<span className='ml-1'>
								<Moment format='DD'>{blog?.createdAt}</Moment>,
							</span>
							<span className='ml-1'>
								<Moment format='YYYY'>{blog?.createdAt}</Moment>
							</span>
						</span>
					</div>
					{isAdminPanelView && (
						<div className='my-1 text-[13px] flex flex-wrap'>
							{blog?.featured && (
								<div className='my-auto mr-1'>
									<StarOutlineOutlinedIcon className={`${textColor} text-[15px] mr-1`} />
									<span className={`${textColor} text-[13px] my-auto`}>Featured |</span>
								</div>
							)}
							<div className='my-auto mr-1'>
								{Boolean(blog?.published) && <PublishedWithChangesOutlinedIcon className={`${textColor} text-[15px] mr-1`} />}
								{!Boolean(blog?.published) && <UnpublishedOutlinedIcon className={`${textColor} text-[15px] mr-1`} />}
								<span className={`${textColor} text-[13px] my-auto`}>{Boolean(blog?.published) ? 'Published' : 'Hidden'}</span>
							</div>
						</div>
					)}
				</div>
			</div>
			{!isLast && <Divider className='my-2 w-full' />}
		</React.Fragment>
	);
};

export default BlogThumb;
