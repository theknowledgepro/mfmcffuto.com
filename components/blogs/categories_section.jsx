/** @format */

import React from 'react';
import { CategoryCard, NoDataFound } from '..';
import styles from '@/components/components.module.css';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { APP_ROUTES } from '@/config';
import { Button } from '@mui/material';

const CategoriesSection = ({ categories = [], blogsettings, isCategoryPage }) => {
	return (
		<section className='w-100 py-3'>
			{!isCategoryPage && (
				<React.Fragment>
					<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`line-height-2 font-semibold text-[30px] text-center w-full my-[10px]`}>
						Explore <span className='text-[var(--color-primary)] text-[30px] mx-1'>Articles & Blogs Categories!</span>
					</h2>
					<div className='text-[14px] text-center w-full text-gray-600 mb-6'>
						Stay spiritually healthy with our soul-lifting & edifying articles!
					</div>
				</React.Fragment>
			)}

			<Grid spacing={0} columns={{ xs: 12, sm: 8, md: 12 }} container={true} className='items-center justify-center'>
				{categories.map((category, i) => (
					<CategoryCard categoryIndex={i} isCategoryPage={isCategoryPage} category={category} blogsettings={blogsettings} key={i} />
				))}
				{categories?.length === 0 && (
					<React.Fragment>
						<NoDataFound
							renderAction={
								<Link href={APP_ROUTES.BLOGS}>
									<Button className='mt-4 btn-site btn-animated text-white text-decor-none px-5 font-medium-custom'>
										Explore Blogs
									</Button>
								</Link>
							}
							sorryText='Ooops! We could not find any Blog Categories at this time!!'
						/>
						<Divider className='my-2 w-100' />
					</React.Fragment>
				)}
			</Grid>
			{!isCategoryPage && (
				<React.Fragment>
					<div className={`${styles.see_more} my-4`}>
						<Link className='text-[16px] color-primary text-decor-none' href={APP_ROUTES.BLOGS_CATEGORIES}>
							<Button variant='contained text-white text-decor-none font-medium-custom rounded-2 btn-animated mild-shadow btn-site'>
								Explore All Blogs Categories
							</Button>
						</Link>
					</div>
					<Divider className='my-2 w-100' />
				</React.Fragment>
			)}
		</section>
	);
};

export default CategoriesSection;
