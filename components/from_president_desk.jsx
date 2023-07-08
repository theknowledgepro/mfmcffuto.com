/** @format */

import React from 'react';
import comp_styles from './components.module.css';
import { ImageTag } from '.';
// import president from '@/assets/images/presido.jpg'

const FromthePresidentsDesk = () => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2 style={{ fontFamily: 'var(--font-family-medium)' }} className={`font-semibold text-[30px] text-center w-full my-[20px]`}>
				From the<span className='text-[var(--color-primary)] mx-2'>Presidents's Desk...</span>
			</h2>
			<div className={`items-center justify-center grid xss:grid-cols-1 md:grid-cols-2`}>
				<div className={`col-span-1 mb-5`}>
					<div className={`xss:text-[26px] md:text-[40px] font-medium-custom mt-3 color-primary`}>His Shekinah Glory!</div>
					<div className={`font-medium-custom`}>
						Fellowship, Intimacy & Partnership <br />
						(Semester's Emphasis)
					</div>
					<div className={`text-[var(--color-primary)] mt-[8px]`}>Is. 60:1-3, 2Philippians 3:10a, Acts 4:13b.</div>

					<div className={`${comp_styles.tab_body} mt-3`}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae pellentesque turpis. Donec in hendrerit dui, vel blandit
						massa. Ut vestibulum suscipit cursus. Cras quis porta nulla, ut placerat risus. Aliquam nec magna eget velit luctus dictum.
						Phasellus et felis sed purus tristique dignissim. Morbi sit amet leo at purus accumsan pellentesque. Vivamus fermentum nisi
						vel dapibus blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</div>
				</div>

				<div className='col-span-1 mb-5 flex flex-col items-center justify-center'>
					<div className='w-full h-full flex flex-col items-center justify-center'>
						<ImageTag
							src={''}
							className={`shadow-[0_0_3px_rgba(166,53,144,0.8)] w-[340px] h-[340px] rounded-[50%] border border-zinc-400`}
							alt='fellowship-president'
						/>
						<div className='mt-3 font-medium-custom text-[16px]'>Bro. O. Abiodun Emmanuel</div>
						<div className='font-medium-custom text-[14px] color-primary'>Executive President MFMCF FUTO Chapter.</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FromthePresidentsDesk;
