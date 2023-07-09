/** @format */

import React from 'react';
import styles from '@/components/components.module.css';
import Link from 'next/link';

const WebSectionBreadCrumb = ({ sections = [], activePageColor, sectionsColor }) => {
	return (
		<div className='w-full flex flex-wrap text-[16px]'>
			{sections?.map((section, i) => (
				<div className={styles.web_section_bread_crumb} key={i}>
					{i + 1 !== sections?.length && (
						<div>
							<Link style={{ color: sectionsColor }} href={section?.href ? section?.href : ''}>
								{section.title}
							</Link>
							<span style={{ color: sectionsColor }} className='mx-1'>{'>'}</span>{' '}
						</div>
					)}
					{i + 1 === sections?.length && <div className={activePageColor ? activePageColor : 'color-primary'}>{section}</div>}
				</div>
			))}
		</div>
	);
};

export default WebSectionBreadCrumb;
