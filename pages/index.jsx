/** @format */

import {
	AboutUsIntro,
	ImageTag,
	WebLayout,
	WorshipDays,
	FromthePresidentsDesk,
	GalleryPreviewSection,
	RecentlyPublishedArticles,
	ContactUsForm,
	MeetCurrentExecutives,
	UpcomingEvents,
	MeetAcadTeamSection,
	GiveTithesAndOfferingsSection,
	SermonsPreviewSection,
	FellowshipGroupsPreview,
} from '@/components';
import Slider from 'react-slick';
import styles from '@/pages/pages_styles.module.css';
import Typewriter from 'typewriter-effect';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SITE_DATA, ASSETS, CLOUD_ASSET_BASEURL } from '@/config';
import React from 'react';
import WebController from '@/pages/api/controller';
import AdminController from '@/pages/api/admin/controller';

const HomePage = ({ metatags, settings, recentBlogs, blogsettings, worshipDays, homePageSettings, currentExcosGroup }) => {
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

	return (
		<WebLayout metatags={metatags} sitesettings={settings}>
			<Slider
				className='relative'
				// ref={(slider) => {
				// 	useSlider.current = slider;
				// }}
				{...carouselSettings}>
				{homePageSettings?.slides?.map((slide, i) => (
					<div key={i} className={`relative min-h-[99vh] bg-inherit`}>
						<ImageTag
							className='absolute bg-inherit h-full object-cover w-full '
							src={`${CLOUD_ASSET_BASEURL}/${slide?.backgroundImage}`}
							style={{ maxHeight: '768px' }}
							alt={`Slide Thumbnail`}
						/>
						<div className={`absolute top-0 start-0 w-full h-full flex items-center`} style={{ background: 'rgba(43, 57, 64, .5)' }}>
							<div
								className={`relative xss:ml-[8px] md:ml-[70px] pt-[100px] pb-[30px] pr-[100px ] border-l-[15px] border-[var(--color-primary)] xss:h-[70%] md:h-[62%] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100px] before:h-[15px] before:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[100%] after:mt-[-15px] after:left-0 after:w-[100px] after:h-[15px] after:bg-[var(--color-primary)]`}>
								<div className={`flex justify-start`}>
									<div className={`px-3 xss:w-[90vw] md:w-[60vw]`}>
										<h1 className={`line-height-2 xss:text-[30px] md:text-[50px] font-[600] text-white mb-4`}>
											{slide?.main_headline}
										</h1>
										<div className='xss:text-[17px] md:text-[20px] font-[400] text-white mb-4 pb-2'>
											<Typewriter
												onInit={(typewriter) => {
													typewriter
														.pauseFor(i * 20500)
														.typeString(slide?.description)
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
						<div className={`absolute flex items-center gap-2 font-semibold bottom-[10px] xss:right-[15px] md:right-[25px]`}>
							<ImageTag className='w-[40px] h-[40px]' src={ASSETS.LOGO} alt='logo' />
							<div className='line-height-1 text-white pr-[5px]'>
								Dr. D.K. Olukoya
								<div className='line-height-1 text-[12px]'>General Overseer</div>
								<div className='line-height-1 text-[12px]'>MFM worldwide</div>
							</div>
						</div>
					</div>
				))}
			</Slider>

			<div className={`${styles.page_padding} pb-[40px]`}>
				<AboutUsIntro homePageSettings={homePageSettings} sitesettings={settings} />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-one)]`}>
				<WorshipDays worshipDays={worshipDays} />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-two)]`}>
				<UpcomingEvents />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full`}>
				<FromthePresidentsDesk homePageSettings={homePageSettings} />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-one)]`}>
				<MeetCurrentExecutives currentExcosGroup={currentExcosGroup} />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-two)]`}>
				<MeetAcadTeamSection />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-one)]`}>
				<RecentlyPublishedArticles articles={recentBlogs} blogsettings={blogsettings} />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-two)]`}>
				<SermonsPreviewSection />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-one)]`}>
				<FellowshipGroupsPreview />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-two)]`}>
				<GiveTithesAndOfferingsSection />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full`}>
				<GalleryPreviewSection />
			</div>

			<div className={`${styles.page_padding} py-[40px] w-full bg-[var(--bg-fair-one)]`}>
				<ContactUsForm />
			</div>
		</WebLayout>
	);
};

export async function getServerSideProps({ req, res, query }) {
	// ** GET SITE SETTINGS
	const siteSettings = await WebController.getSiteSettings(req, res, true);

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);

	// ** RECENT BLOGS
	req.query = query;
	req.query.limit = 6;
	const recentBlogs = await WebController.getBlogsWithPopulatedFields(req, res, true);

	// ** GET WORSHIP DAYS
	const worshipDays = await AdminController.getAllWorshipDays(req, res, true);
	// ** GET PAGE CONFIG FROM DB
	req.page_settings = 'Home-Page-Settings';
	const homePageSettings = await AdminController.getPageSettings(req, res, true);

	// ** GET CURRENT EXCOS
	req.query.removeFields = ['mobile', 'department', 'about', 'email', 'skills', 'hobbies', 'uniqueID', 'gender', ''];
	const currentExcosGroup = await AdminController.getCurrentFellowshipExcosGroup(req, res, true);
	return {
		props: {
			metatags: JSON.parse(
				JSON.stringify({
					og_title: `${SITE_DATA.OFFICIAL_NAME}`,
					twitter_site: siteSettings?.org_twitter_username,
					meta_title: `${SITE_DATA.OFFICIAL_NAME}`,
				})
			),
			settings: siteSettings,
			blogsettings: blogSettings,
			recentBlogs: recentBlogs?.length ? recentBlogs : [],
			worshipDays: worshipDays?.data?.length ? worshipDays?.data : [],
			homePageSettings: homePageSettings?.data?.pageSettings,
			currentExcosGroup: currentExcosGroup?.data ? currentExcosGroup?.data : {},
		},
	};
}

export default HomePage;
