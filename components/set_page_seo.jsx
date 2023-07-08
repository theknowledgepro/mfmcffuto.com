/** @format */

import React, { useState } from 'react';
import { MuiModal } from '.';
import { Avatar, Button, CircularProgress, InputAdornment, TextField } from '@mui/material';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { API_ROUTES, LIMITS, SITE_DATA } from '@/config';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { useDispatch } from 'react-redux';
import { postDataAPI } from '@/utils/api_client_side';
import { useRouter } from 'next/router';
import { GLOBALTYPES } from '@/redux/types';

const SetUpPageSEO = ({ fromPage, pageName, pageSeoData, pageSlug, session }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const initialState = {
		page_slug: pageSlug,
		meta_description: '',
		meta_keywords: '',
		...pageSeoData,
	};
	const [seoData, setSeoData] = useState(initialState);
	const { page_slug, meta_description, meta_keywords } = seoData;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setSeoData({ ...seoData, [name]: value });
	};

	const handleCloseModal = () => setOpenModal(false);

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleUpdate = async () => {
		setErrors({
			meta_description: !meta_description && 'Meta Description is required.',
			meta_keywords: !meta_keywords && 'Meta Keywords are required.',
		});
		if (!meta_description || !meta_keywords) return;

		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			console.log({ ...seoData, pageSeoData, page_name: pageName });
			const res = await postDataAPI(API_ROUTES.MANAGE_PAGE_SEO, { ...seoData, page_name: pageName }, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				handleCloseModal();
				router.push(fromPage);
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	return (
		<MuiModal
			openModal={openModal}
			setOpenModal={setOpenModal}
			modalTitle={
				<div className='w-full flex items-center justify-between'>
					<div className='w-full flex'>
						<QueryStatsOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />{' '}
						<span className='my-auto text-[16px] font-medium-custom'>{pageName} Page SEO </span>
					</div>
					<Avatar src={session?.user?.avatar} alt={session?.user?.firstname} className={`shadow-sm`} />
				</div>
			}
			modalBody={
				<React.Fragment>
					<TextField
						onChange={handleChangeInput}
						value={meta_description}
						color='primary'
						className='w-full mt-4'
						name='meta_description'
						label='Meta Description'
						placeholder='e.g the best blog in the city for readers...'
						variant='standard'
						inputProps={{ maxLength: LIMITS.META_DESCRIPTION_LIMIT }}
						multiline
						helperText={errors.meta_description}
						error={errors.meta_description ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<QueryStatsOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary fs-9'>
						{meta_description?.length} / {LIMITS.META_DESCRIPTION_LIMIT} characters allowed.
					</div>

					<TextField
						onChange={handleChangeInput}
						value={meta_keywords}
						color='primary'
						className='w-full mt-4'
						name='meta_keywords'
						label='Meta Keywords'
						placeholder='Separate each words with a comma...'
						variant='standard'
						inputProps={{ maxLength: LIMITS.META_KEYWORDS_LIMIT }}
						multiline
						helperText={errors.meta_keywords}
						error={errors.meta_keywords ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<QueryStatsOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary text-[12px]'>
						{meta_keywords?.length} / {LIMITS.META_KEYWORDS_LIMIT} characters allowed.
					</div>
				</React.Fragment>
			}
			modalActions={
				<React.Fragment>
					{!isSubmitting && (
						<React.Fragment>
							<Button onClick={handleUpdate} className='w-full text-decor-none btn-site' variant='contained'>
								<QueryStatsOutlinedIcon fontSize='small' sx={{ mr: '5px' }} /> Update SEO Data
							</Button>
							<Button onClick={() => setOpenModal(false)} className='text-decor-none' color='white' variant='contained'>
								<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
							</Button>
						</React.Fragment>
					)}
					{isSubmitting && <CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />}
				</React.Fragment>
			}>
			<Button className='text-decor-none bg-white' color='white' variant='contained'>
				<QueryStatsOutlinedIcon fontSize='small' sx={{ mr: '5px' }} /> {pageName} Page SEO
			</Button>
		</MuiModal>
	);
};

export default SetUpPageSEO;
