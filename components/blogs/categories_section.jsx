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
					<h1 className={styles.section_title}>Explore Blog Categories</h1>
					<h2 className={styles.section_sub_title}>Wholesome articles for your taste!</h2>
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
									<Button className='mt-4 btn-site btn-animated text-white text-decor-none px-5 fw-bold'>Explore Blogs</Button>
								</Link>
							}
							sorryText='Ooops! We could not find any Blog Categories at this time!!'
						/>
						<Divider className='bg-primary my-2 w-100' />
					</React.Fragment>
				)}
			</Grid>
			{!isCategoryPage && (
				<React.Fragment>
					<div className={`${styles.see_more} my-4`}>
						<Link className='fs-5 color-primary text-decor-none' href={APP_ROUTES.BLOGS_CATEGORIES}>
							<Button variant='contained text-white text-decor-none fw-bold rounded-2 btn-animated mild-shadow btn-site'>
								Explore All Blogs Categories
							</Button>
						</Link>
					</div>
					<Divider className='bg-primary my-2 w-100' />
				</React.Fragment>
			)}
		</section>
	);
};

export default CategoriesSection;
