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
			<div className='w-100 d-flex align-items-center justify-content-start'>
				<Link target={isAdminPanelView ? '_blank' : ''} href={blogSlug} className={styles.blog_thumb_img}>
					<ImageTag src={`${CLOUD_ASSET_BASEURL}/${blog?.thumbnail}`} className={`my-auto border`} alt={blog?.title} />
				</Link>
				<div className='w-100 d-flex align-items-start flex-column justify-content-start overflow-x-hidden'>
					{!isCategory && (
						<div className='d-flex flex-wrap w-100'>
							{isTagHidden && <div className={`fs-9 mb-1 px-1 border ${textColor} rounded-1`}>This tag is hidden</div>}
							{blog?.tags?.slice(0, isAdminPanelView ? undefined : isMatchWidth ? 2 : 3)?.map((tag, i) => (
								<TagChip hideLink={true} tag={tag} key={i} />
							))}
							{!isAdminPanelView && blog?.tags?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 0 && (
								<div className={`mb-1 ms-1 fs-9 fw-medium px-1 border ${textColor} rounded-1`}>
									+ {blog?.tags?.slice(isMatchWidth ? 2 : 3, undefined)?.length} more article tag
									{blog?.tags?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 1 ? 's' : ''}
								</div>
							)}
						</div>
					)}
					{isCategory && (
						<div className='d-flex flex-wrap w-100'>
							{isCategoryHidden && <div className={`fs-9 mb-1 px-1 border ${textColor} rounded-1`}>This category is hidden</div>}
							{blog?.categories?.slice(0, isAdminPanelView ? undefined : isMatchWidth ? 2 : 3)?.map((category, i) => (
								<CategoryChip hideLink={true} category={category} key={i} />
							))}
							{blog?.categories?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 0 && (
								<div className={`mb-1 ms-1 fs-9 fw-bold px-1 border ${textColor} rounded-1`}>
									+ {blog?.categories?.slice(isMatchWidth ? 2 : 3, undefined)?.length} more categor
									{blog?.categories?.slice(isMatchWidth ? 2 : 3, undefined)?.length > 1 ? 'ies' : 'y'}
								</div>
							)}
						</div>
					)}
					<Link
						target={isAdminPanelView ? '_blank' : ''}
						href={blogSlug}
						className={`text-decor-none ${textColor} mb-1 fs-7 fw-bold d-flex flex-wrap`}>
						{blog?.title}
					</Link>
					<div className='mb-1 fs-9 d-flex flex-wrap'>
						{(isAdminPanelView || blogsettings?.show_views) && (
							<div className='my-auto me-1'>
								<RemoveRedEyeTwoToneIcon className={`${textColor} fs-6 me-1`} />
								<span className={`${textColor} fs-9 my-auto`}>{blog?.views?.length} views |</span>
							</div>
						)}
						{(isAdminPanelView || blogsettings?.show_comments) && (
							<div className='my-auto me-1'>
								<ForumOutlinedIcon className={`${textColor} fs-6 me-1`} />
								<span className={`${textColor} fs-9 my-auto`}>{blog?.comments?.length} |</span>
							</div>
						)}
						<span className={`${textColor} fs-9 my-auto`}>
							<span className='ms-1'>
								<Moment format='MMMM'>{blog?.createdAt}</Moment>
							</span>
							<span className='ms-1'>
								<Moment format='DD'>{blog?.createdAt}</Moment>,
							</span>
							<span className='ms-1'>
								<Moment format='YYYY'>{blog?.createdAt}</Moment>
							</span>
						</span>
					</div>
					{isAdminPanelView && (
						<div className='my-1 fs-9 d-flex flex-wrap'>
							{blog?.featured && (
								<div className='my-auto me-1'>
									<StarOutlineOutlinedIcon className={`${textColor} fs-6 me-1`} />
									<span className={`${textColor} fs-9 my-auto`}>Featured |</span>
								</div>
							)}
							<div className='my-auto me-1'>
								{Boolean(blog?.published) && <PublishedWithChangesOutlinedIcon className={`${textColor} fs-6 me-1`} />}
								{!Boolean(blog?.published) && <UnpublishedOutlinedIcon className={`${textColor} fs-6 me-1`} />}
								<span className={`${textColor} fs-9 my-auto`}>{Boolean(blog?.published) ? 'Published' : 'Hidden'}</span>
							</div>
						</div>
					)}
				</div>
			</div>
			{!isLast && <Divider className='bg-primary my-2 w-100' />}
		</React.Fragment>
	);
};

export default BlogThumb;
