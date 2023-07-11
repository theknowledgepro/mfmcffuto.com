/** @format */

import useElementOnScreen from '@/utils/use_element_on_screen';
import React, { useEffect, useRef } from 'react';
import { CLOUD_ASSET_BASEURL } from '@/config';
import { FlipCard, ImageTag } from '.';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

export const WorshipEvent = ({ event, cardWrapperClassName }) => {
	const cardRef = useRef(null);
	const options = { root: null, rootMargin: '0px', threshold: 0.5 };

	const isVisible = useElementOnScreen(options, cardRef);
	const handleFlip = () => {
		if ('ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
			cardRef.current.classList.toggle('rotate-flip');
		}
	};
	useEffect(() => {
		handleFlip();
	}, [isVisible]);

	return (
		<FlipCard
			ref={cardRef}
			onClick={handleFlip}
			cardWrapperClassName={cardWrapperClassName ? cardWrapperClassName : 'col-span-1'}
			cardWrapperHeight={'390px'}
			frontContent={
				<div className='w-full h-full relative'>
					<ImageTag
						src={`${CLOUD_ASSET_BASEURL}/${event?.thumbnail?.trim()}`}
						className={`w-full h-full max-h-[290px] rounded-[inherit]`}
						alt='Worhip Day Graphics'
					/>
					<div className='absolute bottom-0 left-0 right-0 w-full bg-white'>
						<div className={`border-t border-zinc-300 py-1 flex justify-between`}>
							<div className='border-r border-zinc-300 px-3 w-full font-medium-custom flex flex-col items-center justify-center'>
								<CalendarMonthOutlinedIcon className='mb-1' />
								<div className='text-center small'>Every {event?.day}</div>
							</div>
							<div className='px-3 w-full font-medium-custom flex flex-col items-center justify-center'>
								<AccessTimeOutlinedIcon className='mb-1' />
								<div className='text-center small'>{event?.time}</div>
							</div>
						</div>
						<div className='border-t border-zinc-300 px-3 py-2 w-full font-medium-custom flex items-center justify-center'>
							<LocationOnOutlinedIcon className='mr-1' />
							<div className='text-center font-medium-custom text-[14px]'>{event?.venue}</div>
						</div>
					</div>
				</div>
			}
			rearContent={
				<div className='p-3 flex flex-col items-center justify-center w-full h-full'>
					<blockquote>
						<p>{event?.quote}</p>
						<i className='text-center text-[12px] font-medium-custom text-gray-400'> - {event?.quote_author}</i>
					</blockquote>
					<div className='py-3 text-center w-full'>{event?.description}</div>
					<i className='font-medium-custom text-center text-[14px] pb-1 text-[var(--color-primary)] border-b border-zinc-300'>
						Jesus is Lord!
					</i>
				</div>
			}
		/>
	);
};

const WorshipDays = ({
	worshipDays = [
		{
			day: 'Tuesday',
			time: '6:30pm',
			venue: 'SAAT Auditorium',
			quote: { author: 'Ps. 119:130', text: 'The entrance of your word gives light, it imparteth understanding to the simple man...' },
			description:
				'Join us every Tuesdays as we delve into the revelation knowledge of the Word of God for life transforming encounters by the Word of God and the ministration of the Holy Ghost!',
		},
		{},
		{},
	],
}) => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2
				style={{ fontFamily: 'var(--font-family-medium)' }}
				className={`line-height-2 font-semibold text-[30px] text-center w-full my-[20px]`}>
				<span className='text-[var(--color-primary)] text-[30px] mr-2'>Worship</span>with Us!
			</h2>
			<div className='w-full grid xss:grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
				{worshipDays.map((event, index) => (
					<WorshipEvent event={event} key={index} />
				))}
			</div>
		</section>
	);
};

export default WorshipDays;
