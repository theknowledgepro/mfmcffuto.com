/** @format */

import React from 'react';
import styles from '@/components/components.module.css';
import Link from 'next/link';

const SeeMoreLink = ({ href, actionText }) => {
	return (
		<div className={styles.see_more}>
			<Link className='text-[var(--color-primary)]' href={href ?? ''}>
				{actionText}
			</Link>
		</div>
	);
};

export default SeeMoreLink;
