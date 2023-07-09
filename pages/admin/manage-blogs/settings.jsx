/** @format */

import React, { useState } from 'react';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { AdminLayout } from '@/components';
import { MEMBER_ROLES, API_ROUTES, APP_ROUTES, CUSTOM_UI_TYPES, SITE_DATA } from '@/config';
import { Button, CircularProgress, Divider, Paper, Switch, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { postDataAPI } from '@/utils/api_client_side';
import { useRouter } from 'next/router';
import WebController from '@/pages/api/controller';
import { BsDot } from 'react-icons/bs';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { GLOBALTYPES } from '@/redux/types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AuthController from '@/pages/api/auth/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import { DispatchUserAuth } from '@/utils/misc_functions';

const BlogSectionSettings = ({ settings, userAuth }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	const session = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const router = useRouter();

	const [blogSettings, setBlogSettings] = useState({ ...settings });
	const {
		show_comments,
		show_views,
		no_of_articles_on_category_card,
		blog_preview_card_custom_display = CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1,
	} = blogSettings;

	const handleChangeInput = (e) => {
		const { name, value, checked } = e.target;
		// console.log({ name, value, checked });
		setBlogSettings({ ...blogSettings, [name]: name === 'blog_preview_card_custom_display' ? value : checked ? checked : Number(value) });
	};

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleUpdate = async () => {
		setErrors({
			no_of_articles_on_category_card:
				(!Number.isInteger(no_of_articles_on_category_card) ||
					Number(no_of_articles_on_category_card) < 1 ||
					Number(no_of_articles_on_category_card) > 10) &&
				'Please give a number between 1 and 10.',
		});

		if (
			!Number.isInteger(no_of_articles_on_category_card) ||
			Number(no_of_articles_on_category_card) < 1 ||
			Number(no_of_articles_on_category_card) > 10
		)
			return;
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postDataAPI(API_ROUTES.MANAGE_BLOGS_SETTINGS, { ...blogSettings }, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				router.push(APP_ROUTES.MANAGE_BLOGS_SETTINGS);
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	return (
		<AdminLayout
			metatags={{ meta_title: `Articles & Blogs Settings | ${SITE_DATA.OFFICIAL_NAME}` }}
			pageIcon={<SettingsTwoToneIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Articles & Blogs Settings'}>
			<div className='w-full h-full flex items-center justify-center'>
				<Paper className='p-2 w-full' sx={{ maxWidth: '450px' }}>
					<div className='my-4 w-full'>
						<FormControl>
							<FormLabel id='blog_preview_card_custom_display'>
								<div className='flex text-dark'>
									<BsDot className='color-primary text-[40px] my-auto' />
									<span className='my-auto text-[16px]'>Select Blog Preview Card Theme</span>
								</div>
							</FormLabel>
							<RadioGroup
								aria-labelledby='blog_preview_card_custom_display'
								name='blog_preview_card_custom_display'
								sx={{ ml: 1.5 }}
								value={blog_preview_card_custom_display}
								onChange={handleChangeInput}>
								<FormControlLabel value={CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD1} control={<Radio />} label='Theme 1' />
								<FormControlLabel value={CUSTOM_UI_TYPES.BLOG_UI.BLOGCARD2} control={<Radio />} label='Theme 2' />
							</RadioGroup>
						</FormControl>
					</div>
					<Divider className='w-full bg-primary mb-2' />
					<div className='my-4 w-full'>
						<div className='flex'>
							<BsDot className='color-primary text-[40px] my-auto' />
							<span className='my-auto text-[16px]'>Show Comments Count on Blogs</span>
						</div>
						<div className='flex'>
							<Switch checked={Boolean(show_comments)} onChange={handleChangeInput} name='show_comments' />
							<span className={`${show_comments ? 'color-primary' : 'text-secondary'} fw-bold my-auto`}>
								{show_comments ? 'Show' : 'Hide'}
							</span>
						</div>
					</div>
					<Divider className='w-full bg-primary my-2' />
					<div className='my-4 w-full'>
						<div className='flex'>
							<BsDot className='color-primary text-[40px] my-auto' />
							<span className='my-auto text-[16px]'>Show Views Count on Blogs</span>
						</div>
						<div className='flex'>
							<Switch checked={Boolean(show_views)} onChange={handleChangeInput} name='show_views' />
							<span className={`${show_views ? 'color-primary' : 'text-secondary'} fw-bold my-auto`}>
								{show_views ? 'Show' : 'Hide'}
							</span>
						</div>
					</div>
					<Divider className='w-full bg-primary my-2' />
					<div className='my-4 w-full'>
						<div className='flex'>
							<BsDot className='color-primary text-[40px] my-auto' />
							<span className='my-auto text-[16px]'>Number of Preview Articles on Category Card</span>
						</div>
						<div className='w-full flex items-center justify-center'>
							<TextField
								size='small'
								className='mt-2'
								variant='outlined'
								name='no_of_articles_on_category_card'
								onChange={handleChangeInput}
								sx={{
									'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
										WebkitAppearance: 'none',
										margin: 0,
									},
									'input[type=number]': {
										MozAppearance: 'textfield',
									},
								}}
								defaultValue={no_of_articles_on_category_card}
								inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', type: 'number' }}
								error={errors?.no_of_articles_on_category_card ? true : false}
								helperText={errors?.no_of_articles_on_category_card}
							/>
						</div>
					</div>

					<Divider className='w-full bg-primary my-2' />
					<div className='w-full flex items-center justify-center'>
						{!isSubmitting && (
							<Button onClick={handleUpdate} className='w-full text-decor-none btn-site' variant='contained'>
								<SettingsTwoToneIcon fontSize='small' sx={{ mr: '5px' }} /> Update Blog Settings
							</Button>
						)}
						{isSubmitting && (
							<CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />
						)}
					</div>
				</Paper>
			</div>
		</AdminLayout>
	);
};

export async function getServerSideProps({ req, res }) {
	// ** REDIRECT TO LOGIN IF COOKIE NOT EXIST
	const verifyUserAuth = await AuthController.generateAccessToken(req, res);
	if (verifyUserAuth?.redirect) return verifyUserAuth;

	// ** ASSIGN USER TO REQ OBJECT
	req.user = verifyUserAuth?.user;

	// ** REDIRECT TO 404 PAGE IF NOT ADMIN
	if (verifyUserAuth?.user?.member_role !== MEMBER_ROLES.MASTER && verifyUserAuth?.user?.member_role !== MEMBER_ROLES.MANAGER)
		return {
			redirect: { destination: APP_ROUTES.NOT_FOUND, permanent: false },
		};

	// REDIRECT TO DASHBOARD PAGE IF ADMIN IS RESTRICTED TO VIEW THIS PAGE
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.ACTIVITY_LOGS, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET BLOG SETTINGS
	const blogSettings = await WebController.getBlogSettings(req, res, true);
	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			settings: blogSettings,
		},
	};
}
export default BlogSectionSettings;
