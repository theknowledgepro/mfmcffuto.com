/** @format */

import React from 'react';
import { CLOUD_ASSET_BASEURL, S3FOLDERS } from '@/config';
import ImageTag from './image_tag';

const ExcoCard = ({ exco, wrapperClassName, isActiveIndex }) => {
	return (
		<div className='xss:px-2 xss:py-4 sm:p-4 w-full max-w-[400px] max-h-[400px] h-[350px]'>
			<div
				className={`flex flex-col items-center justify-center overflow-hidden shadow-[0_0_3px_rgba(166,53,144,0.8)] border w-full h-full relative rounded-[5px] ${wrapperClassName}`}>
				<ImageTag
					style={{}}
					alt='Exco avatar'
					className='w-full max-h-[100%] h-full border border-zinc-300 rounded-[5px] shadow-[0_0_3px_rgba(166,53,144,0.8)]'
					src={exco?.avatar.includes(S3FOLDERS.EXCOS_AVATARS) ? `${CLOUD_ASSET_BASEURL}/${exco?.avatar}` : exco?.avatar}
				/>
				<div
					className={`absolute bottom-[-35%] w-[90%] h-[50%] rounded-[5px] ${
						isActiveIndex && 'translate-y-[-45%]'
					} hover:translate-y-[-45%] transition-all ease-out duration-300 py-3 px-2 border border-zinc-300 bg-white flex flex-col shadow-[0_0_3px_rgba(166,53,144,0.8)]`}>
					<div className='w-full text-center font-medium-custom line-height-1b mb-1'>{`${exco?.lastname ? exco?.lastname : ''} ${
						exco?.firstname ? exco?.firstname : ''
					} ${exco?.secondname ? exco?.secondname : ''}`}</div>
					<div className='text-gray-300 text-center text-[15px] line-height-1b font-medium-custom'>{exco?.office}</div>
				</div>
			</div>
		</div>
	);
};

export default ExcoCard;
