/** @format */

import { Divider, Paper, Grid } from '@mui/material';
import React from 'react';
import styles from '@/components/components.module.css';
import Link from 'next/link';
import { APP_ROUTES, ASSETS, CLOUD_ASSET_BASEURL, SITE_DATA } from '@/config';
import { stringToColor } from '@/utils/misc_functions';
import { BlogThumb, ImageTag } from '..';
import Moment from 'react-moment';

const CategoryCard = ({ isCategoryPage, category, blogsettings }) => {
	const categorySlug = `${APP_ROUTES.BLOGS_CATEGORIES}/${category?.slug}`;
	return (
		<Grid item={true} xs={12} sm={4} md={4} className={styles.category_card_wrapper}>
			<Paper className='rounded-[3px] bg-white p-3'>
				{isCategoryPage && (
					<React.Fragment>
						<div
							style={{ background: stringToColor(category?.title), textShadow: '0 0 20px rgb(255 255 255 / 100%)' }}
							className='py-2 mb-2 rounded-[3px] text-center text-[25px]'>
							{category?.title}
						</div>
					</React.Fragment>
				)}
				<div className='w-full pb-2 flex items-center justify-between'>
					<div className={`text-[14px] ${styles.category_title}`}>{category?.title}</div>
					<Link href={categorySlug} className='text-decor-none text-dark cursor-pointer text-[14px]'>
						{isCategoryPage ? 'Visit Category' : 'View Articles'}
					</Link>
				</div>
				<div className='py-2 w-full relative'>
					<Link href={categorySlug} className={`${styles.category_card_image}`}>
						<ImageTag
							src={`${CLOUD_ASSET_BASEURL}/${category?.thumbnail?.trim()}`}
							className={`rounded-[3px] w-[]`}
							alt={category?.title}
						/>
					</Link>
					<div className={`${styles.category_card_description}`}>
						<div
							className='overflow-hidden w-full h-full flex flex-col rounded-[3px] items-start justify-center rounded-2 p-3 text-white mild-shadow'
							style={{ background: stringToColor(category?.title) }}>
							<Link href={categorySlug} className='text-decor-none text-white'>
								{category?.description}
							</Link>
							<div className='flex'>
								<ImageTag src={ASSETS.LOGO} className={`rounded-[50%] w-[30px] h-[30px] mr-2`} alt={category?.title} />
								<div className='text-[13px] my-auto font-medium-custom'>
									By {SITE_DATA.NAME} -
									<span className='ms-1'>
										<Moment className='text-[12px]' format='MMMM'>
											{category?.blogs?.[0]?.createdAt}
										</Moment>
									</span>
									<span className='ms-1'>
										<Moment className='text-[12px]' format='DD'>
											{category?.blogs?.[0]?.createdAt}
										</Moment>
										,
									</span>
									<span className='ms-1'>
										<Moment className='text-[12px]' format='YYYY'>
											{category?.blogs?.[0]?.createdAt}
										</Moment>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{category?.blogs?.length > 0 && (
					<div className='w-full mt-5 flex flex-col items-center justify-center'>
						<div className='w-full text-[12px] font-medium-custom py-2'>
							{isCategoryPage ? 'All' : 'Recently Published'} Articles in this Category
						</div>
						<Divider className='mb-2 w-full' />
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
				<Divider className='my-2 w-full' />
				{category?.blogs?.length > 0 && (
					<div className={styles.see_more}>
						<Link className='text-[14px] color-primary text-decor-none' href={categorySlug}>
							{isCategoryPage ? 'Browse Category' : 'Find more Articles in this Category'}
						</Link>
					</div>
				)}
			</Paper>
		</Grid>
	);
};

export default CategoryCard;
