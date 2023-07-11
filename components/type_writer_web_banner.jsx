/** @format */

import React from 'react';
import styles from '@/components/components.module.css';
import pages_styles from '@/pages/pages_styles.module.css';
import Typewriter from 'typewriter-effect';
import { WebSectionBreadCrumb } from '.';

const TypeWriterWebBanner = ({ sections, stringsArray }) => {
	return (
		<React.Fragment>
			<div
				style={{ '--typewriter-web-banner-height': '60vh', '--typewriter-web-banner-max-height': '60vh' }}
				className={`${styles.typewriter_web_banner_container}`}>
				<div className={`${styles.typewriter_web_banner_typewritercontainer}`}>
					<div className={`${pages_styles.page_padding}`}>
						{sections && (
							<div className='my-4'>
								<WebSectionBreadCrumb activePageColor='#fff' sections={sections} />
							</div>
						)}
						<Typewriter
							options={{
								strings: stringsArray ? stringsArray : ['MFMCF FUTO', "...where champions are gathered!"],
								autoStart: true,
								loop: true,
								cursorClassName: 'xss:text-[28px] md:text-[40px]',
								wrapperClassName: 'xss:text-[28px] md:text-[40px]',
							}}
						/>
					</div>
				</div>
			</div>
			<svg style={{ background: 'inherit' }} width='100%' height='70' viewBox='0 0 100 100' preserveAspectRatio='none'>
				<path id='wavepath' d='M0,0  L100,0C15,150 40,0 0,100z' fill='var(--color-primary)'></path>
			</svg>
		</React.Fragment>
	);
};

export default TypeWriterWebBanner;
