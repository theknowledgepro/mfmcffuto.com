/** @format */

import React, { useEffect } from 'react';
import HeadElement from '@/pages/_meta_tags';

const AuthLayout = ({ children, metatags }) => {
	useEffect(() => {
		document.querySelector(':root').style.setProperty('--app-bg', '#f5f5f5');
		return () => document.querySelector(':root').style.setProperty('--app-bg', '#fff');
	}, []);

	return (
		<React.Fragment>
			<HeadElement metatags={metatags} />
			{children}
		</React.Fragment>
	);
};

export default AuthLayout;
