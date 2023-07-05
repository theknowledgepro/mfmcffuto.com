/** @format */

import React from 'react';
import styles from '@/components/components.module.css';
import pages_styles from '@/pages/pages_styles.module.css';
import Typewriter from 'typewriter-effect';
import { WebSectionBreadCrumb } from '.';

const WebBanner = ({ sections, sectionTitle, sectionDescription }) => {
	return (
		<React.Fragment>
			<div
				style={{ '--typewriter-web-banner-height': '60vh', '--typewriter-web-banner-max-height': '60vh' }}
				className={`${styles.typewriter_web_banner_container}`}>
				<div className={`${styles.typewriter_web_banner_typewritercontainer}`}>
					<div className={`${pages_styles.page_padding}`}>
						<div className='my-4'>
							<WebSectionBreadCrumb activePageColor='#fff' sections={sections} />
						</div>
						<div>{sectionTitle}</div>
                        <div className='mt-2 fs-6'>{sectionDescription}</div>
					</div>
				</div>
			</div>
			<svg style={{ background: 'inherit' }} width='100%' height='70' viewBox='0 0 100 100' preserveAspectRatio='none'>
				<path id='wavepath' d='M0,0  L100,0C15,150 40,0 0,100z' fill='var(--color-primary)'></path>
			</svg>
		</React.Fragment>
	);
};

export default WebBanner;
