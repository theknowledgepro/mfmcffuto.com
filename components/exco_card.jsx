/** @format */

import React from 'react';
import { CLOUD_ASSET_BASEURL, S3FOLDERS } from '@/config';
import ImageTag from './image_tag';

const ExcoCard = ({ exco, wrapperClassName }) => {
	return (
		<div className={`xss:mx-1 xss:my-4 sm:m-4 border w-full max-w-[400px] max-h-[400px] h-[350px] relative rounded-[5px] ${wrapperClassName}`}>
			<ImageTag
				style={{}}
				className='w-full max-h-[100%] h-full border border-zinc-300 rounded-[5px] shadow-[0_0_3px_rgba(166,53,144,0.8)]'
				src={exco?.avatar.includes(S3FOLDERS.EXCOS_AVATARS) ? `${CLOUD_ASSET_BASEURL}/${exco?.avatar}` : exco?.avatar}
			/>
			<div className='absolute bottom-[-20%] w-[90%] rounded-[5px] hover:translate-y-[-38%] xss:p-4 md:p-10 border border-zinc-300 bg-white flex flex-col items-center justify-center shadow-[0_0_3px_rgba(166,53,144,0.8)] mx-auto'>
				<div className='w-full mb-2'>{`${exco?.lastname ? exco?.lastname : ''} ${exco?.firstname ? exco?.firstname : ''} ${
					exco?.secondname ? exco?.secondname : ''
				}`}</div>
				<div className='text-gray-300 text-[14px]'>{exco?.office}</div>
			</div>
		</div>
	);
};

export default ExcoCard;
