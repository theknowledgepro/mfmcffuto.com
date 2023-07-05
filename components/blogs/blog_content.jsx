/** @format */

import React, { useEffect } from 'react';
import styles from '@/components/components.module.css';

const BlogContent = ({ content }) => {
	useEffect(() => {
		console.log({
			pre: document.querySelector('pre')?.innerText,
		});
	}, []);
	return <div className={`my-3 blog-text-theme ${styles?.blog_content}`} dangerouslySetInnerHTML={{ __html: content }}></div>;
};

export default BlogContent;
