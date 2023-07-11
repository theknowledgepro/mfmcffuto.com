/** @format */

import React, { useState } from 'react';
import comp_styles from './components.module.css';
import { Button } from '@mui/material';
import { APP_ROUTES, ASSETS } from '@/config';
import Link from 'next/link';

const AboutUsIntro = ({ sitesettings, homePageSettings }) => {
	const [tabIndex, setTabIndex] = useState(0);
	const handleTabChange = (e, index) => {
		const Tabs = document.querySelectorAll('.tab-title');
		Tabs.forEach((tab) => tab.classList.remove('active'));
		e.target.classList.add('active');
		setTabIndex(index);
	};

	return (
		<section className={`${comp_styles.about_us_intro_wrapper} grid xss:grid-cols-1 md:grid-cols-2`}>
			<aside
				className={`${comp_styles.parrallax} col-span-1`}
				style={{ backgroundImage: `url(${sitesettings?.logoUrl ? sitesettings?.logoUrl : ASSETS?.LOGO?.src})` }}></aside>
			<aside className={`col-span-1 flex flex-col ${comp_styles.about_right}`}>
				<div className='w-full relative mb-5'>
					<blockquote className={`${comp_styles.blockquote}`}>
						<p className={`text-center`}>I was glad when they said...</p>
						<h3 className={`text-[30px] text-[var(--color-primary)] line-height-2`}>Let us go to the LORD's house...</h3>
						<p style={{ position: 'absolute', bottom: '-10px', right: '5px' }} className={`text-[13px] text-[var(--color-primary)]`}>
							Ps.122:1
						</p>
					</blockquote>
				</div>
				<section className={comp_styles.tab_wrapper}>
					<div className='w-full flex justify-between mt-2'>
						<Button onClick={(e) => handleTabChange(e, 0)} className={`${comp_styles.tab_title} active tab-title`}>
							About Us
						</Button>
						<Button onClick={(e) => handleTabChange(e, 1)} className={`${comp_styles.tab_title} tab-title`}>
							Our Vision
						</Button>
						<Button onClick={(e) => handleTabChange(e, 2)} className={`${comp_styles.tab_title} tab-title`}>
							Our Mission
						</Button>
					</div>
					<div className={comp_styles.tab_body}>
						{tabIndex === 0 && (
							<div>
								<div
									className='pt-3 text-[16px] flex xss:text-center text-start'
									dangerouslySetInnerHTML={{ __html: homePageSettings?.about_us_text }}></div>
								<div className={comp_styles.see_more}>
									<Link className='fs-14 color-primary' href={APP_ROUTES.ABOUT_US}>
										Learn more
									</Link>
								</div>
							</div>
						)}
						{tabIndex === 1 && (
							<div
								className='pt-3 text-[16px] flex xss:text-center text-start'
								dangerouslySetInnerHTML={{ __html: homePageSettings?.our_vision }}></div>
						)}
						{tabIndex === 2 && (
							<div className='pt-3 text-[16px]'>
								{homePageSettings?.our_mission?.map((mission, index) => (
									<div key={index} className='flex w-full my-2' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
										{/* <Image src={pinEmoji} className={`mr-2 my-auto`} style={{ width: '25px', height: '25px' }} /> */}
										<div className='my-auto' style={{ width: 'calc(100% - 40px)' }}>
											{mission?.trim()}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</aside>
		</section>
	);
};

export default AboutUsIntro;
