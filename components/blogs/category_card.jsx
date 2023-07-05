/** @format */

import { Divider, Paper, Grid } from '@mui/material';
import React from 'react';
import styles from '@/components/components.module.css';
import Link from 'next/link';
import { APP_ROUTES, CLOUD_ASSET_BASEURL, SITE_DATA } from '@/config';
import { stringToColor } from '@/utils/misc_functions';
import { BlogThumb, ImageTag } from '..';
import Moment from 'react-moment';

const CategoryCard = ({ isCategoryPage, category, blogsettings }) => {
	const categorySlug = `${APP_ROUTES.BLOGS_CATEGORIES}/${category?.slug}`;
	return (
		<Grid item={true} xs={12} sm={4} md={4} className={styles.category_card_wrapper}>
			<Paper className='rounded-1 bg-white p-3'>
				{isCategoryPage && (
					<React.Fragment>
						<div
							style={{ background: stringToColor(category?.title), textShadow: '0 0 20px rgb(255 255 255 / 100%)' }}
							className='py-2 mb-2 rounded-1 text-center fs-3'>
							{category?.title}
						</div>
					</React.Fragment>
				)}
				<div className='w-100 pb-2 d-flex align-items-center justify-content-between'>
					<div className={`fs-8 ${styles.category_title}`}>{category?.title}</div>
					<Link href={categorySlug} className='text-decor-none text-dark cursor-pointer fs-8'>
						{isCategoryPage ? 'Visit Category' : 'View Articles'}
					</Link>
				</div>
				<div className='py-2 w-100 position-relative'>
					<Link href={categorySlug} className={`${styles.category_card_image}`}>
						<ImageTag src={`${CLOUD_ASSET_BASEURL}/${category?.thumbnail?.trim()}`} className={`rounded-1`} alt={category?.title} />
					</Link>
					<div className={`${styles.category_card_description}`}>
						<div
							className='overflow-hidden w-100 h-100 d-flex flex-column align-items-start justify-content-center rounded-2 p-3 text-white mild-shadow'
							style={{ background: stringToColor(category?.title) }}>
							<Link href={categorySlug} className='text-decor-none text-white'>
								{category?.description}
							</Link>
							<div className='d-flex'>
								<ImageTag src={category?.author?.avatar} className={`rounded-circle me-1`} alt={category?.title} />
								<div className='fs-9 my-auto fw-bold'>
									By {SITE_DATA.NAME} -
									<span className='ms-1'>
										<Moment format='MMMM'>{category?.blogs?.[0]?.createdAt}</Moment>
									</span>
									<span className='ms-1'>
										<Moment format='DD'>{category?.blogs?.[0]?.createdAt}</Moment>,
									</span>
									<span className='ms-1'>
										<Moment format='YYYY'>{category?.blogs?.[0]?.createdAt}</Moment>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{category?.blogs?.length > 0 && (
					<div className='w-100 mt-5 d-flex flex-column align-items-center justify-content-center'>
						<div className='w-100 fs-9 fw-bold pb-2'>{isCategoryPage ? 'All' : 'Recently Published'} Articles in this Category</div>
						<Divider className='bg-primary mb-2 w-100' />
						<div className={`${styles.category_card_blog_thumb_column} py-2 scroll-design`}>
							{category?.blogs?.slice(0, isCategoryPage ? undefined : blogsettings?.no_of_articles_on_category_card)?.map((blog, i) => (
								<BlogThumb
									isLast={
										i ===
										(category?.blogs?.length > blogsettings?.no_of_articles_on_category_card
											? blogsettings?.no_of_articles_on_category_card - 1
											: category?.blogs?.length - 1)
									}
									blogsettings={blogsettings}
									key={i}
									blog={blog}
								/>
							))}
						</div>
					</div>
				)}
				<Divider className='bg-primary my-2 w-100' />
				{category?.blogs?.length > 0 && (
					<div className={styles.see_more}>
						<Link className='fs-8 color-primary text-decor-none' href={categorySlug}>
							{isCategoryPage ? 'Browse Category' : 'Find more Articles in this Category'}
						</Link>
					</div>
				)}
			</Paper>
		</Grid>
	);
};

export default CategoryCard;
