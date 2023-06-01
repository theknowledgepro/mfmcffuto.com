/** @format */

import { ComingSoonPage, WebLayout } from '@/components';


import { SITE_DATA } from '@/config';
import React from 'react';

const HomePage = ({ metatags, settings }) => {
	return (
		<WebLayout metatags={{ meta_title: `Home | ${SITE_DATA.OFFICIAL_NAME}`, ...metatags }} sitesettings={settings}>
			<ComingSoonPage />
		</WebLayout>
	);
};

export async function getServerSideProps({ req, res }) {
	// ** GET SITE SETTINGS
	// ** GET PAGE CONFIG FROM DB
	return {
		props: {
			metatags: {},
			settings: {},
		},
	};
}

export default HomePage;
