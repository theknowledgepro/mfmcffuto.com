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
					className='btn-animated line-height-1 text-decor-none mb-1 mx-1 text-[13px] font-medium-custom px-2 shadow-sm text-white rounded-[5px]'
					style={{ background: stringToColor(category?.title) }}>
					{category?.title}
				</span>
			)}
			{!hideLink && (
				<Link
					href={categorySlug}
					className='btn-animated line-height-1 text-decor-none mb-1 mx-1 text-[13px] font-medium-custom px-2 shadow-sm text-white rounded-[5px]'
					style={{ background: stringToColor(category?.title) }}>
					{category?.title}
				</Link>
			)}
		</React.Fragment>
	);
};

export default CategoryChip;
