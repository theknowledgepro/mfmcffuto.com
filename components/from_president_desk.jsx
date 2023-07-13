/** @format */

import React from 'react';
import comp_styles from './components.module.css';
import { ImageTag } from '.';

const FromthePresidentsDesk = ({ homePageSettings }) => {
	return (
		<section className='w-full flex flex-col items-center justify-center mb-5'>
			<h2
				style={{ fontFamily: 'var(--font-family-medium)' }}
				className={`font-semibold text-[30px] text-center line-height-2 w-full my-[20px]`}>
				From the<span className='text-[var(--color-primary)] text-[30px] mx-2'>Presidents's</span>Desk...
			</h2>
			<div className={`items-center justify-center grid xss:grid-cols-1 md:grid-cols-2`}>
				<div className={`col-span-1 mb-5`}>
					<div
						className={`line-height-2 xss:text-[26px] md:text-[40px] font-medium-custom mt-3 color-primary normal-case ${comp_styles.category_title}`}>
						{homePageSettings?.from_the_president_desk?.semester_theme}
					</div>
					<div className={`mt-2 font-medium-custom`}>
						{homePageSettings?.from_the_president_desk?.semester_emphasis} <br />
						(Semester's Emphasis)
					</div>
					<div className={`text-[var(--color-primary)] mt-[8px]`}>
						{homePageSettings?.from_the_president_desk?.semester_anchor_scriptures}
					</div>

					<pre
						className={`${comp_styles.tab_body} line-height-1b p-0 m-0 mt-3`}
						style={{ whiteSpace: 'pre-wrap' }}
						dangerouslySetInnerHTML={{ __html: homePageSettings?.from_the_president_desk?.writings }}></pre>
				</div>

				<div className='col-span-1 mb-5 flex flex-col items-center justify-center'>
					<div className='w-full h-full flex flex-col items-center justify-center'>
						<ImageTag
							src={homePageSettings?.from_the_president_desk?.president_avatar}
							className={`shadow-[0_0_3px_rgba(166,53,144,0.8)] w-[340px] h-[340px] rounded-[50%] border border-zinc-400`}
							alt='fellowship-president'
						/>
						<div className='mt-3 font-medium-custom text-[16px]'>{homePageSettings?.from_the_president_desk?.president_fullname}</div>
						<div className='font-medium-custom text-[14px] color-primary'>Executive President MFMCF FUTO Chapter.</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FromthePresidentsDesk;
