/** @format */

import { APP_ROUTES } from '@/config';
import { stringToColor } from '@/utils/misc_functions';
import Link from 'next/link';
import React from 'react';

const TagChip = ({ tag, hideLink }) => {
	const tagSlug = hideLink ? '' : `${APP_ROUTES.BLOGS_TAGS}#${tag?.slug}`;

	return (
		<React.Fragment>
			{hideLink && (
				<span
					className='btn-animated line-height-1 text-decor-none mb-1 mx-1 text-[13px] font-medium-custom px-2 shadow-sm text-white rounded-[5px]'
					style={{ background: stringToColor(tag?.title) }}>
					#{tag?.title}
				</span>
			)}
			{!hideLink && (
				<Link
					href={tagSlug}
					className='btn-animated line-height-1 text-decor-none mb-1 mx-1 text-[13px] font-medium-custom px-2 shadow-sm text-white rounded-[5px]'
					style={{ background: stringToColor(tag?.title) }}>
					#{tag?.title}
				</Link>
			)}
		</React.Fragment>
	);
};

export default TagChip;
