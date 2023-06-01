/** @format */

import React from 'react';
import MetaTags from '@/pages/_meta_tags';
import { WebFooter, WebHeader } from '@/components';
const WebLayout = ({ children, metatags, sitesettings }) => {
	return (
		<React.Fragment>
			<MetaTags metatags={metatags} />
			<WebHeader sitesettings={sitesettings} />
			{children}
			<WebFooter sitesettings={sitesettings} />
		</React.Fragment>
	);
};

export default WebLayout;
