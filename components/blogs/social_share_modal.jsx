/** @format */

import { IconButton } from '@mui/material';
import React from 'react';
import { RWebShare } from 'react-web-share';

const SocialShareModal = ({ children, url }) => {
	return (
		<React.Fragment>
			<RWebShare
				data={{
					text: '',
					url: url,
					title: 'Xonict!',
				}}
				sites={['facebook', 'twitter', 'whatsapp', 'reddit', 'telegram', 'linkedin', 'mail', 'copy', 'vk', 'okru']}
				onClick={() => {}}>
				<IconButton>{children}</IconButton>
			</RWebShare>
		</React.Fragment>
	);
};

export default SocialShareModal;
