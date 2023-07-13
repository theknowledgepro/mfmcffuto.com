/** @format */

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import UseMediaQuery from '@/utils/use_media_query';
import { ExcoCard } from '.';

const MeetCurrentExecutives = ({ currentExcosGroup, carouselSettings = {} }) => {
	const { isMatchWidth: base } = UseMediaQuery({ vw: '520px' });
	const { isMatchWidth: sm } = UseMediaQuery({ vw: '920px' });

	const [beforeChange, setBeforeChange] = React.useState(0);
	const [afterChange, setAfterChange] = React.useState(0);
	const defaultCarouselSettings = {
		dots: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: false,
		cssEase: 'linear',
		speed: 700,
		slidesToShow: currentExcosGroup?.excos?.length >= 3 ? (base ? 1 : sm ? 2 : 3) : 1,
		slidesToScroll: currentExcosGroup?.excos?.length >= 3 ? (base ? 1 : sm ? 1 : 1) : 1,
		beforeChange: (current, next) => setBeforeChange(next),
		afterChange: (current) => setAfterChange(current),
		...carouselSettings,
	};

	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2
				style={{ fontFamily: 'var(--font-family-medium)' }}
				className={`line-height-2 font-semibold text-[30px] text-center w-full my-[10px]`}>
				Meet the <span className='text-[var(--color-primary)] text-[30px] mx-1'> {currentExcosGroup?.name} </span>Excos
			</h2>
			<i className='text-[14px] text-center w-full text-gray-600 mb-2'>In the days of thy power ... thy people shall be willing...</i>

			<div className='w-full'>
				<Slider className='relative' {...defaultCarouselSettings}>
					{currentExcosGroup?.excos?.map((exco, index) => (
						<ExcoCard isActiveIndex={afterChange === index} key={index} exco={exco} wrapperClassName={''} />
					))}
				</Slider>
			</div>
		</section>
	);
};

export default MeetCurrentExecutives;
