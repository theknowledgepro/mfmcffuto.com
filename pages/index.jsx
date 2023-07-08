/** @format */

import { AboutUsIntro, ImageTag, WebLayout, WorshipDays, FromthePresidentsDesk } from '@/components';
import Slider from 'react-slick';
import styles from '@/pages/pages_styles.module.css';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SITE_DATA, ASSETS } from '@/config';
import React, { useRef } from 'react';
import image1 from '@/assets/demo/1.jpg';
import image2 from '@/assets/demo/2.jpg';
import image3 from '@/assets/demo/3.jpg';
import { Divider } from '@mui/material';

const HomePage = ({ metatags, settings }) => {
	const carouselSettings = {
		dots: false,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 20000,
		pauseOnHover: false,
		fade: true,
		speed: 1000,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	const slides = [
		{
			title: 'Experience Worship!',
			content: 'Experience WorshipExperience WorshipExperience WorshipExperience WorshipExperience Worship',
			image: image1,
		},
		{
			title: 'The Place of Encounter',
			content:
				'The Place of EncounterThe Place of EncounterThe Place of EncounterThe Place of EncounterThe Place of EncounterThe Place of EncounterThe Place of Encounter',
			image: image2,
		},
		{
			title: 'Home Of Prayer!',
			content: 'Home Of PrayerHome Of PrayerHome Of PrayerHome Of PrayerHome Of Prayer',
			image: image3,
		},
	];

	const useSlider = useRef(null);

	return (
		<WebLayout metatags={{ meta_title: `Home | ${SITE_DATA.OFFICIAL_NAME}`, ...metatags }} sitesettings={settings}>
			<Slider
				className='relative'
				ref={(slider) => {
					useSlider.current = slider;
				}}
				{...carouselSettings}>
				{slides.map((slide, i) => (
					<div key={i} className={`relative min-h-[99vh] bg-inherit`}>
						<ImageTag
							className='absolute bg-inherit h-full object-cover w-full '
							src={slide?.image}
							style={{ maxHeight: '768px' }}
							alt={`Slide Thumbnail`}
						/>
						<div className={`absolute top-0 start-0 w-full h-full flex items-center`} style={{ background: 'rgba(43, 57, 64, .5)' }}>
							<div
								className={`relative xss:ml-[8px] md:ml-[70px] pt-[100px] pb-[30px] pr-[100px ] border-l-[15px] border-[var(--color-primary)] xss:h-[70%] md:h-[62%] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100px] before:h-[15px] before:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[100%] after:mt-[-15px] after:left-0 after:w-[100px] after:h-[15px] after:bg-[var(--color-primary)]`}>
								<div className={`flex justify-start`}>
									<div className={`px-3 xss:w-[90vw] md:w-[60vw]`}>
										<h1 className={`xss:text-[30px] md:text-[50px] font-[600] text-white mb-4`}>{slide?.title}</h1>
										<div className='xss:text-[17px] md:text-[20px] font-[400] text-white mb-4 pb-2'>
											<Typewriter
												onInit={(typewriter) => {
													typewriter
														.pauseFor(i * 20500)
														.typeString(slide?.content)
														.deleteAll()
														.start();
												}}
												options={{ loop: true }}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={`absolute flex items-center gap-2 font-semibold bottom-[10px] right-[15px]`}>
							<ImageTag className='w-[40px] h-[40px]' src={ASSETS.LOGO} alt='logo' />
							<div className='text-white pr-[5px]'>
								Dr. D.K. Olukoya
								<div className='text-[12px]'>General Overseer</div>
								<div className='text-[12px]'>MFM worldwide</div>
							</div>
						</div>
					</div>
				))}
			</Slider>

			<div className={`${styles.page_padding} pb-[40px]`}>
				<AboutUsIntro />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-one)]`}>
				<WorshipDays />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full`}>
				<FromthePresidentsDesk />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-one)]`}>
				<WorshipDays />
			</div>


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
