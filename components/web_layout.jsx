/** @format */

import React from 'react';
import MetaTags from '@/pages/_meta_tags';
import { WebFooter, WebHeader } from '@/components';
const WebLayout = ({ children, metatags, sitesettings, headerOriginalBgColor }) => {
	return (
		<React.Fragment>
			<MetaTags metatags={metatags} />
			<WebHeader headerOriginalBgColor={headerOriginalBgColor} sitesettings={sitesettings} />
			{children}
			<WebFooter sitesettings={sitesettings} />
		</React.Fragment>
	);
};

export default WebLayout;
