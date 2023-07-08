/** @format */

import React, { Component } from 'react';
import Slider from 'react-slick';
import Typewriter from 'typewriter-effect';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ImageTag } from '@/components';

export default class SlickGoTo extends React.Component {
	state = {
		slideIndex: 0,
		updateCount: 0,
	};

	render() {
		const settings = {
			// ...this.props.carouselSettings,
			afterChange: () => this.setState((state) => ({ updateCount: state.updateCount + 1 })),
			beforeChange: (current, next) => this.setState({ slideIndex: next }),
		};

		const slider = this.slider;
        
		return (
			<React.Fragment>
				<Slider className='relative' ref={(slider) => (this.slider = slider)} {...settings}>
					{this.props.slides.map((slide, i) => (
						<div key={i} className={`relative min-h-[95vh] bg-inherit`}>
							<ImageTag
								className='absolute bg-inherit h-full object-cover w-full '
								src={slide?.image}
								style={{ maxHeight: '768px' }}
								alt={`Slide Thumbnail`}
							/>
							<div className={`absolute top-0 start-0 w-full h-full flex items-center`} style={{ background: 'rgba(43, 57, 64, .5)' }}>
								<div
									className={`relative xss:ml-[8px] md:ml-[70px] pt-[100px] pb-[30px] pr-[100px ] border-l-[15px] border-[var(--color-primary)] xss:h-[70%] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100px] before:h-[15px] before:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[100%] after:mt-[-15px] after:left-0 after:w-[100px] after:h-[15px] after:bg-[var(--color-primary)]`}>
									<div className={`flex justify-start`}>
										<div className={`px-3 w-[100%]`}>
											<h1 className={`xss:text-[30px] md:text-[50px] font-[600] text-white mb-4`}>{slide?.title}</h1>
											<div className='text-[17px] font-[400] text-white mb-4 pb-2'>
												<Typewriter
													onInit={(typewriter) => {
														typewriter
															.pauseFor(i * 20000)
															.typeString(slide?.content)
															.deleteAll()
															.start();
														slider?.slickGoTo(i + 1);
													}}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</Slider>
			</React.Fragment>
		);
	}
}
