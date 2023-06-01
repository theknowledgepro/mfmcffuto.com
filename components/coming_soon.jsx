/** @format */

import React from 'react';
import dancers from '@/assets/dancers.gif';
import developer from '@/assets/developer_image.png';
import Image from 'next/image';
import Link from 'next/link';
import { SvgIcons } from './icons';
import comp_styles from './components.module.css';

const ComingSoonPage = () => {
	return (
		<div className='h-full w-full px-3 pt-40 pb-20 bg-gray-200 flex flex-col items-center justify-center'>
			<Image alt='image' src={dancers} width={'100%'} height={'100%'} style={{ borderRadius: '5px' }} />
			<div className='mt-12 mb-5 text-5xl color-primary w-full text-center'>Watch Out!</div>
			<div className='w-full text-center text-lg color-primary my-4'>Something big is about to be built!</div>
			{/* <div className='w-full items-center flex flex-col justify-center'>
				<Image alt='image' src={developer} className='mild-shadow bg-white' height='250' width='250' style={{ borderRadius: '50%' }} />
				<div className='w-full text-center mt-5'>Contact the developer here...</div>
				<div className={`${comp_styles.social_icons} items-center justify-center flex w-full mt-5 text-sm font-bold`}>
					<Link
						href={`https://wa.me/+2347041960963?text=Hello,%20Chidera,%20Weldone%20on%20the%20job%20so%20far..."`}
						className={`${comp_styles.icon} radius-50 text-3xl mild-shadow whatsapp`}>
						<SvgIcons.FaWhatsapp />
					</Link>
				</div>
			</div> */}
		</div>
	);
};

export default ComingSoonPage;
