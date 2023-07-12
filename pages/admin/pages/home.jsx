/** @format */

import { AdminLayout, ControlledAccordion, ImageTag, MuiModal } from '@/components';
import { API_ROUTES, CLOUD_ASSET_BASEURL, APP_ROUTES, MEMBER_ROLES, SITE_DATA } from '@/config';
import React, { useState } from 'react';
import { DispatchUserAuth } from '@/utils/misc_functions';
import AuthController from '@/pages/api/auth/controller';
import AdminController from '@/pages/api/admin/controller';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import CottageTwoToneIcon from '@mui/icons-material/CottageTwoTone';
import {
	IconButton,
	Avatar,
	Divider,
	Paper,
	Box,
	Button,
	TextField,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	InputAdornment,
} from '@mui/material';
import { BsDot } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import comp_styles from '@/components/components.module.css';
import { GLOBALTYPES } from '@/redux/types';
import { validate } from '@/utils/validate';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { patchFormDataAPI, postFormDataAPI } from '@/utils/api_client_side';
import NewspaperSharpIcon from '@mui/icons-material/NewspaperSharp';

const RenderSlideSettingComponent = ({ homePageSettings, slide, allSlides, slideIndex, session }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);

	const initialState = {
		main_headline: '',
		description: '',
		backgroundImage: slide?.backgroundImage ? `${CLOUD_ASSET_BASEURL}/${slide?.backgroundImage}` : '',
		...slide,
	};
	const [slideData, setSlideData] = useState(initialState);
	const { main_headline = '', description = '', backgroundImage = '' } = slideData;
	const [file, setFile] = useState(null);

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setSlideData({ ...slideData, [name]: value });
	};
	const handleThumbnailUpload = (event) => {
		const reader = new FileReader();
		const file = event?.target?.files[0];
		const fileType = file?.type?.split('/')[1];
		if (!file) return;
		if (isSubmitting)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Unable to upload file! 🥴<br/>Submission in progress...', title: false } });
		if (validate.file({ fileType, types: ['png', 'jpg', 'jpeg'] }).errMsg)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'File format is Incorrect!' } });

		reader.onload = (upload) => {
			setSlideData((previousState) => {
				return { ...slideData, backgroundImage: upload.target.result };
			});
		};
		reader.readAsDataURL(file);
		setFile(file);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setFile(null);
	};

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleUpdateSlide = async () => {
		setErrors({
			main_headline: !main_headline && 'This field is required.',
			description: !description && 'This field is required.',
		});
		if (!main_headline || !description) return;
		if (!file) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please attach a background for this slide!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(
				API_ROUTES.UPDATE_PAGE_CUSTOMIZATION_SETTINGS,
				{
					...homePageSettings,
					slides: allSlides?.map((slide, index) => {
						return index === slideIndex ? { ...slideData, backgroundImage: file ? null : slideData.backgroundImage, index: null } : slide;
					}),
					slideIndex: slideIndex,
					backgroundImage: file ? file : slideData.backgroundImage,
					page_settings: 'Home-Page-Settings',
				},
				session?.token
			);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setSlideData({ ...slideData, ...res?.data?.updatedSlideData });
				router.push(router.pathname);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};
	return (
		<div className='xss:col-span-1 sm:col-span-6 md:col-span-3 p-2'>
			<ControlledAccordion
				parentClassName={'w-full'}
				accordionSummary={
					slide?.backgroundImage ? (
						<ImageTag
							className='w-full h-full'
							style={{ maxHeight: '150px' }}
							src={`${CLOUD_ASSET_BASEURL}/${slide?.backgroundImage}`}
							alt='slide-image'
						/>
					) : (
						<div className='text-center font-medium-custom text-[14px] w-full'>Set Up Content For Slide {slideIndex + 1}</div>
					)
				}
				accordionBody={
					<div className='mt-2 w-full text-center'>
						<div className='w-full text-[15px] font-medium-custom mb-2'>{slide?.main_headline}</div>
						<div className='w-full text-[14px]'>{slide?.description}</div>
						<Divider className='my-2' />
						<MuiModal
							openModal={openModal}
							setOpenModal={setOpenModal}
							modalSize={'sm'}
							modalTitle={
								<div className='w-full flex items-center justify-start font-medium-custom text-[18px]'>
									{<NewspaperSharpIcon fontSize='small' sx={{ mr: '5px' }} />}
									{`Set Up Content For Slide ${slideIndex + 1}`}
								</div>
							}
							modalBody={
								<div className='w-full'>
									<div className='line-height-1b mb-5 text-[13px] text-gray-600 text-center w-full'>
										Please ensure that the texts entered are not too many and can contain the availbale space provided on the home
										page slides.
										<br />
										Do well to check the responsivenes on various screen sizes for optimal user experience.
									</div>
									<TextField
										onChange={handleChangeInput}
										value={main_headline}
										color='primary'
										className='w-full mt-6'
										name='main_headline'
										label='Slde Headline Text'
										variant='outlined'
										helperText={errors.main_headline}
										error={errors.main_headline ? true : false}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
												</InputAdornment>
											),
										}}
									/>
									<TextField
										onChange={handleChangeInput}
										value={description}
										color='primary'
										className='w-full mt-8'
										name='description'
										label='Slde Headline Description'
										variant='outlined'
										helperText={errors.description}
										error={errors.description ? true : false}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
												</InputAdornment>
											),
										}}
									/>
									<div
										className={`${comp_styles.img_input} rounded-[5px] mild-shadow mt-4 flex flex-col items-center justify-center`}>
										{backgroundImage && (
											<img
												alt='Select Slide Background Image'
												style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '300px' }}
												src={backgroundImage}
											/>
										)}
										{!backgroundImage && (
											<div className='font-medium-custom color-primary'>Click to Upload Slide Background Image</div>
										)}
										<input
											onChange={handleThumbnailUpload}
											type='file'
											name='thumbnail'
											id={`${comp_styles.avatar_input}`}
											accept='image/*'
										/>
									</div>
								</div>
							}
							modalActions={
								<React.Fragment>
									{!isSubmitting && (
										<React.Fragment>
											<Button onClick={handleUpdateSlide} className='w-full normal-case btn-site' variant='contained'>
												<EditIcon fontSize='small' sx={{ mr: '5px' }} /> Update Slide Content
											</Button>
											<Button onClick={handleCloseModal} className='normal-case' color='white' variant='contained'>
												<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
											</Button>
										</React.Fragment>
									)}
									{isSubmitting && (
										<CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />
									)}
								</React.Fragment>
							}>
							<Button className='normal-case btn-site mx-auto' variant='contained'>
								<NewspaperSharpIcon fontSize='small' sx={{ mr: '5px' }} />
								Update Slide Content
							</Button>
						</MuiModal>
					</div>
				}
			/>
		</div>
	);
};

const SlideSettings = ({ session, homePageSettings }) => {
	const slides = homePageSettings?.slides?.length
		? [...Array(4)]?.map((slide, i) => {
				if (homePageSettings?.slides[i]) return homePageSettings?.slides[i];
				return {};
		  })
		: [{}, {}, {}, {}];

	return (
		<React.Fragment>
			<div className='w-full flex py-2 font-medium-custom color-primary'>
				<BsDot style={{ color: SITE_DATA.THEME_COLOR, fontSize: '25px', margin: 'auto 0' }} /> Slideshow Settings
			</div>
			<div className='w-full mt-2 grid xss:grid-cols-1 sm:grid-cols-12 md:grid-cols-12'>
				{slides?.map((slide, index) => (
					<RenderSlideSettingComponent
						key={index}
						homePageSettings={homePageSettings}
						allSlides={slides}
						slide={{
							main_headline: slide?.main_headline,
							description: slide?.description,
							backgroundImage: slide?.backgroundImage,
						}}
						slideIndex={index}
						session={session}
					/>
				))}
			</div>
		</React.Fragment>
	);
};

const AboutUsSettings = ({ session, homePageSettings }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [aboutUsData, setAboutUsData] = useState({
		about_us_text: '',
		our_vision: '',
		our_mission: [''],
		...homePageSettings,
	});
	const { about_us_text = '', our_vision = '', our_mission = [''] } = aboutUsData;

	const handleTypeWriterTextInputs = (index, event) => {
		let data = [...aboutUsData?.our_mission];
		data[index] = event.target.value;
		setAboutUsData({ ...aboutUsData, our_mission: data });
	};

	const handleAddTypeWriterTextInputs = () => setAboutUsData({ ...aboutUsData, our_mission: [...our_mission, ''] });

	const handleRemoveFields = (index) => {
		if (index === 0 && our_mission.length === 1)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `At least one mission statement is required!` } });
		let data = [...our_mission];
		data.splice(index, 1);
		setAboutUsData({ ...aboutUsData, our_mission: data });
	};

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setAboutUsData({ ...aboutUsData, [name]: value });
	};

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleUpdate = async () => {
		setErrors({
			about_us_text: !about_us_text && 'Please give some texts for this section.',
			our_vision: !our_vision && 'Please give some texts for this section.',
		});
		if (!about_us_text || !our_vision) return;
		if (our_mission.length === 0 || !our_mission.find((index) => index?.toString()?.length))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Please add at least one mission statement!', title: false } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(
				API_ROUTES.UPDATE_PAGE_CUSTOMIZATION_SETTINGS,
				{ ...homePageSettings, ...aboutUsData, page_settings: 'Home-Page-Settings' },
				session?.token
			);
			dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message, title: false } });

			if (res?.status === 200) {
				setIsSubmitting(false);
				router.push(router.pathname);
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, returnData: true });
		}
	};

	return (
		<div className='w-full border-b border-zinc-300 pb-2 pt-4 font-medium-custom color-primary pb-4'>
			<div className='w-full flex border-b border-zinc-300 pb-2 pt-4 font-medium-custom color-primary'>
				<BsDot style={{ color: SITE_DATA.THEME_COLOR, fontSize: '25px', margin: 'auto 0' }} /> About Us Section
			</div>
			<div className='grid xss:grid-cols-1 md:grid-cols-2 gap-5'>
				<TextField
					onChange={handleChangeInput}
					value={about_us_text}
					color='primary'
					className='col-span-1 mt-8'
					name='about_us_text'
					placeholder=''
					label='About Us'
					multiline
					variant='outlined'
					helperText={errors.about_us_text}
					error={errors.about_us_text ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					onChange={handleChangeInput}
					value={our_vision}
					color='primary'
					className='w-100 mt-8'
					name='our_vision'
					placeholder=''
					label='Our Vision'
					multiline
					variant='outlined'
					helperText={errors.our_vision}
					error={errors.our_vision ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
			</div>
			<Paper className='mx-auto max-w-[500px] px-2 mt-8'>
				{our_mission?.map((text, index) => (
					<div key={index} className='col-md-12 flex flex-center'>
						<TextField
							onChange={(e) => handleTypeWriterTextInputs(index, e)}
							value={our_mission[index]}
							color='primary'
							className='w-full mt-4'
							size='small'
							label={`Mission Statement ${index + 1}`}
							variant='outlined'
							multiline
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
									</InputAdornment>
								),
							}}
						/>
						<IconButton className='mt-4' onClick={() => handleRemoveFields(index)}>
							<CancelIcon />
						</IconButton>
					</div>
				))}
				<Button variant='outlined' className='my-3 font-medium-custom normal-case' onClick={handleAddTypeWriterTextInputs}>
					<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add A Mssion Statement
				</Button>
			</Paper>
			<div className='flex items-center justify-center mt-4'>
				{isSubmitting && <CircularProgress style={{ color: SITE_DATA.THEME_COLOR, height: '50px', width: '50px' }} />}
				{!isSubmitting && (
					<Button onClick={handleUpdate} variant='contained' className='font-medium-custom normal-case btn-site'>
						<NewspaperSharpIcon sx={{ fontSize: '22px', my: 'auto', mr: 1 }} /> Update About Us Section
					</Button>
				)}
			</div>
		</div>
	);
};

const FromPresidentDeskSettings = ({ session, homePageSettings, currentExcos = [] }) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const defaultPresidentFullName =
		currentExcos?.length > 0
			? `${currentExcos[0]?.lastname ? currentExcos[0]?.lastname : ''} ${currentExcos[0]?.firstname ? currentExcos[0]?.firstname : ''} ${
					currentExcos[0]?.secondname ? currentExcos[0]?.secondname : ''
			  }`
			: '';

	const defaultPresidentAvatar = currentExcos?.length > 0 ? `${currentExcos[0]?.avatar}` : '';

	const [sectionData, setSectionData] = useState(
		homePageSettings?.from_the_president_desk
			? homePageSettings?.from_the_president_desk
			: {
					semester_theme: '',
					semester_emphasis: '',
					semester_anchor_scriptures: '',
					writings: '',
					president_fullname: defaultPresidentFullName,
					president_avatar: defaultPresidentAvatar,
			  }
	);
	const {
		semester_theme = '',
		semester_emphasis = '',
		semester_anchor_scriptures = '',
		writings = '',
		president_fullname = defaultPresidentFullName,
		president_avatar = defaultPresidentAvatar,
	} = sectionData;
	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setSectionData({ ...sectionData, [name]: value });
	};
	const handleSelectPresident = (e) => {
		const matchingIndex = currentExcos.filter(
			(index) =>
				`${index?.lastname ? index?.lastname : ''} ${index?.firstname ? index?.firstname : ''} ${
					index?.secondname ? index?.secondname : ''
				}` === e.target.value
		)[0];
		setSectionData({
			...sectionData,
			president_fullname: `${matchingIndex[0]?.lastname ? matchingIndex[0]?.lastname : ''} ${
				matchingIndex[0]?.firstname ? matchingIndex[0]?.firstname : ''
			} ${matchingIndex[0]?.secondname ? matchingIndex[0]?.secondname : ''}`,
			president_avatar: matchingIndex?.avatar,
		});
	};
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleUpdate = async () => {
		setErrors({
			semester_theme: !semester_theme && 'This field is required!',
			semester_emphasis: !semester_emphasis && 'This field is required!',
			semester_anchor_scriptures: !semester_anchor_scriptures && 'This field is required!',
			writings: !writings && 'This field is required!',
			president_fullname: !president_fullname && 'This field is required!',
		});
		if (!semester_theme || !semester_emphasis || !semester_anchor_scriptures || !writings || !president_fullname) return;
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(
				API_ROUTES.UPDATE_PAGE_CUSTOMIZATION_SETTINGS,
				{ ...homePageSettings, from_the_president_desk: { ...sectionData }, page_settings: 'Home-Page-Settings' },
				session?.token
			);
			dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message, title: false } });

			if (res?.status === 200) {
				setIsSubmitting(false);
				router.push(router.pathname);
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, returnData: true });
		}
	};

	return (
		<div className='w-full border-b border-zinc-300 pb-2 pt-4 font-medium-custom color-primary pb-4'>
			<div className='w-full flex border-b border-zinc-300 pb-2 pt-4 font-medium-custom color-primary'>
				<BsDot style={{ color: SITE_DATA.THEME_COLOR, fontSize: '25px', margin: 'auto 0' }} /> President's Desk Section
			</div>

			<Paper className='mx-auto max-w-[550px] p-2 mt-8'>
				<TextField
					onChange={handleChangeInput}
					value={semester_theme}
					color='primary'
					className='w-full mt-8'
					name='semester_theme'
					placeholder=''
					label='Semester Theme'
					multiline
					variant='outlined'
					helperText={errors.semester_theme}
					error={errors.semester_theme ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					onChange={handleChangeInput}
					value={semester_emphasis}
					color='primary'
					className='w-full mt-8'
					name='semester_emphasis'
					placeholder=''
					label='Semester Emphasis'
					variant='outlined'
					helperText={errors.semester_emphasis}
					error={errors.semester_emphasis ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					onChange={handleChangeInput}
					value={semester_anchor_scriptures}
					color='primary'
					className='w-full mt-8'
					name='semester_anchor_scriptures'
					placeholder=''
					label='Semester Anchor Scriptures'
					variant='outlined'
					helperText={errors.semester_anchor_scriptures}
					error={errors.semester_anchor_scriptures ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					onChange={handleChangeInput}
					value={writings}
					color='primary'
					className='w-full mt-8'
					name='writings'
					placeholder=''
					label="From The President's Desk"
					multiline
					variant='standard'
					helperText={errors.writings}
					error={errors.writings ? true : false}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<NewspaperSharpIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
							</InputAdornment>
						),
					}}
				/>
				<Box sx={{ minWidth: 120, minHeight: 20, mt: '40px', mb: '30px' }}>
					<FormControl fullWidth size='small'>
						<InputLabel id='admin-level-select'>Current President</InputLabel>
						<Select
							error={errors.president_fullname ? true : false}
							labelId='admin-level-select'
							label='Current President'
							value={defaultPresidentFullName}
							onChange={handleSelectPresident}>
							{currentExcos?.length > 0 ? (
								currentExcos.map((exco, index) => (
									<MenuItem
										key={index}
										value={`${exco?.lastname ? exco?.lastname : ''} ${exco?.firstname ? exco?.firstname : ''} ${
											exco?.secondname ? exco?.secondname : ''
										}`}>
										<div className='w-full flex items-center justify-left'>
											<Avatar src={`${CLOUD_ASSET_BASEURL}/${exco?.avatar.trim()}`} alt={exco?.firstname} className={``} />
											<span className='ml-2 my-auto'>{`${exco?.lastname ? exco?.lastname : ''} ${
												exco?.firstname ? exco?.firstname : ''
											} ${exco?.secondname ? exco?.secondname : ''}`}</span>
										</div>
									</MenuItem>
								))
							) : (
								<MenuItem value=''>Please set up excos to choose a president</MenuItem>
							)}
						</Select>
					</FormControl>
				</Box>
			</Paper>
			<div className='flex items-center justify-center mt-4'>
				{isSubmitting && <CircularProgress style={{ color: SITE_DATA.THEME_COLOR, height: '50px', width: '50px' }} />}
				{!isSubmitting && (
					<Button onClick={handleUpdate} variant='contained' className='font-medium-custom normal-case btn-site'>
						<NewspaperSharpIcon sx={{ fontSize: '22px', my: 'auto', mr: 1 }} /> Update President's Desk Section
					</Button>
				)}
			</div>
		</div>
	);
};

const HomePageSettings = ({ userAuth, homePageSettings, currentExcos }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	const session = useSelector((state) => state.auth);

	return (
		<AdminLayout
			metatags={{ meta_title: `Home Settings | ${SITE_DATA.NAME}` }}
			pageIcon={<CottageTwoToneIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Home Settings'}>
			<SlideSettings homePageSettings={homePageSettings} session={session} />
			<AboutUsSettings homePageSettings={homePageSettings} session={session} />
			<FromPresidentDeskSettings homePageSettings={homePageSettings} currentExcos={currentExcos} session={session} />
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
	const isRestricted = await CheckAdminRestriction({ page: `${APP_ROUTES.PAGES_CUSTOMIZATION}/home`, adminId: verifyUserAuth?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET PAGE DATA
	req.page_settings = 'Home-Page-Settings';
	const homePageSettings = await AdminController.getPageSettings(req, res, true);

	const currentExcos = await AdminController.getCurrentFellowshipExcos(req, res, true);
	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			homePageSettings: homePageSettings?.data?.pageSettings,
			currentExcos: currentExcos?.data?.excos ? currentExcos?.data?.excos : [],
		},
	};
}

export default HomePageSettings;
