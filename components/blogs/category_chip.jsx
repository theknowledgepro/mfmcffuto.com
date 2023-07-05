/** @format */

import { APP_ROUTES } from '@/config';
import { stringToColor } from '@/utils/misc_functions';
import Link from 'next/link';
import React from 'react';

const CategoryChip = ({ category, hideLink }) => {
	const categorySlug = hideLink ? '' : `${APP_ROUTES.BLOGS_CATEGORIES}/${category?.slug}`;

	return (
		<React.Fragment>
			{hideLink && (
				<span
					className='btn-animated text-decor-none mb-2 mx-1 fs-9 fw-medium px-1 little-shadow text-white rounded-1'
					style={{ background: stringToColor(category?.title) }}>
					{category?.title}
				</span>
			)}
			{!hideLink && (
				<Link
					href={categorySlug}
					className='btn-animated text-decor-none mb-2 mx-1 fs-9 fw-medium px-1 little-shadow text-white rounded-1'
					style={{ background: stringToColor(category?.title) }}>
					{category?.title}
				</Link>
			)}
		</React.Fragment>
	);
};

export default CategoryChip;
