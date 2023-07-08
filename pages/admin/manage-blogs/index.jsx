/** @format */

import React, { useEffect, useState } from 'react';
import { AdminLayout, CategoryChip, MuiModal, MuiXDataGridTable, ReactEditor, SetUpPageSEO, TagChip } from '@/components';
import { API_ROUTES, APP_ROUTES, CLOUD_ASSET_BASEURL, LIMITS, MEMBER_ROLES, SITE_DATA } from '@/config';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import {
	Box,
	Button,
	CircularProgress,
	TextField,
	InputAdornment,
	Switch,
	Avatar,
	FormControlLabel,
	InputLabel,
	Checkbox,
	MenuItem,
	Select,
} from '@mui/material';
import { BsDot } from 'react-icons/bs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { deleteDataAPI, getDataAPI, patchDataAPI, patchFormDataAPI, postFormDataAPI } from '@/utils/api_client_side';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '@/redux/types';
import { useRouter } from 'next/router';
import AdminController from '@/pages/api/admin/controller';
import Link from 'next/link';
import Moment from 'react-moment';
import comp_styles from '@/components/components.module.css';
import { validate } from '@/utils/validate';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import WebController from '@/pages/api/controller';

const RenderBlogStatusChip = ({ blog }) => {
	return (
		<div
			style={{ width: 'max-content' }}
			className={`d-flex align-items-center justify-content-center rounded-pill px-3 py-1 text-white fs-8 mild-shadow ${
				Boolean(blog?.published) ? 'bg-success' : 'bg-secondary'
			}`}>
			{Boolean(blog?.published) ? 'Published' : 'Hidden'}
		</div>
	);
};

const CreateBlogFunctionality = ({ allCategories, allTags, allBlogs, session, blog, isEdit }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const initialState = blog
		? { ...blog, thumbnail: `${CLOUD_ASSET_BASEURL}/${blog?.thumbnail?.trim()}` }
		: { title: '', slug: '', thumbnail: '', summary: '', tags: [], categories: [], meta_description: '', meta_keywords: '', published: true };
	const [blogData, setBlogData] = useState(initialState);
	const { title, slug, thumbnail, summary, tags, categories, meta_description, meta_keywords, published } = blogData;
	const [body, setBody] = useState('');
	const [file, setFile] = useState(null);
	const handleChangeInput = (e) => {
		const { name, value, checked } = e.target;
		setBlogData({ ...blogData, [name]: name === 'published' ? checked : value });
	};

	// ** IF ISEDIT, FETCH BLOG BODY
	const [isFetchingBlogContent, setIsFetchingBlogContent] = useState(false);
	const [isErrored, setIsErrored] = useState(false);

	const fetchBlogContent = async () => {
		if (!openModal || !isEdit) return;
		if (isFetchingBlogContent) return;
		setIsFetchingBlogContent(true);
		setIsErrored(false);
		try {
			const res = await getDataAPI(`${API_ROUTES.GET_BLOG_CONTENT}?blog=${blog?.uniqueID}`);
			if (res?.status === 200) {
				setIsFetchingBlogContent(false);
				if (res?.data?.uniqueID !== blog?.uniqueID) return setIsErrored(true);
				setBody(res?.data?.body);
			}
		} catch (err) {
			setIsFetchingBlogContent(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	useEffect(() => {
		fetchBlogContent();
	}, [openModal]);

	const handleSelectCategories = (e) => {
		const { name, checked } = e.target;
		setBlogData({
			...blogData,
			categories: checked ? [...categories, name] : categories.filter((index) => index.toString() !== name.toString()),
		});
	};

	const handleSelectTags = (e) => {
		const { name, checked } = e.target;
		setBlogData({
			...blogData,
			tags: checked ? [...tags, name] : tags.filter((index) => index.toString() !== name.toString()),
		});
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
			setBlogData((previousState) => {
				return { ...blogData, thumbnail: upload.target.result };
			});
		};
		reader.readAsDataURL(file);
		setFile(file);
	};

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const handleCloseModal = () => {
		setOpenModal(false);
		setFile(null);
	};

	const handleCreateBlog = async () => {
		setErrors({
			title: !title && 'Please provide a name for this new blog.',
			meta_description: !meta_description && 'Please provide a meta description for this blog.',
			meta_keywords: !meta_keywords && 'Please provide some meta keywords for this blog.',
			summary:
				(!summary && 'Please provide a summary for this blog.') ||
				(summary?.toString()?.length < LIMITS.BLOG_SUMMARY_LIMIT &&
					`Blog Summary should be at least ${LIMITS.BLOG_SUMMARY_LIMIT} characters.`),
		});
		if (!title || !meta_description || !meta_keywords || !summary || summary?.toString()?.length < LIMITS.BLOG_SUMMARY_LIMIT) return;
		if (!body) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please provide a content for this blog!` } });
		if (tags?.length === 0) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please select at least one tag for this blog!` } });
		if (categories?.length === 0)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please select at least one category for this blog!` } });
		if (allBlogs.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Blog with this Title already exists!` } });
		if (allBlogs.find((index) => index?.slug === slug))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Blog with this slug already exists!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(API_ROUTES.MANAGE_BLOGS, { ...blogData, body, thumbnail: file });
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setBlogData(initialState);
				router.push(APP_ROUTES.MANAGE_BLOGS);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	const handleEditBlog = async () => {
		setErrors({
			title: !title && 'Please provide a name for this new blog.',
			meta_description: !meta_description && 'Please provide a meta description for this blog.',
			meta_keywords: !meta_keywords && 'Please provide some meta keywords for this blog.',
			summary:
				(!summary && 'Please provide a summary for this blog.') ||
				(summary?.toString()?.length < LIMITS.BLOG_SUMMARY_LIMIT &&
					`Blog Summary should be at least ${LIMITS.BLOG_SUMMARY_LIMIT} characters.`),
		});
		if (!title || !meta_description || !meta_keywords || !summary || summary?.toString()?.length < LIMITS.BLOG_SUMMARY_LIMIT) return;
		if (!body) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please provide a content for this blog!` } });
		if (tags?.length === 0) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please select at least one tag for this blog!` } });
		if (categories?.length === 0)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please select at least one category for this blog!` } });
		if (allBlogs.filter((index) => index.uniqueID !== blog?.uniqueID)?.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Blog with this Title already exists!` } });
		if (allBlogs.filter((index) => index.uniqueID !== blog?.uniqueID)?.find((index) => index?.slug === slug))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Blog with this slug already exists!` } });

		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await patchFormDataAPI(API_ROUTES.MANAGE_BLOGS, { ...blogData, body, thumbnail: file ? file : thumbnail });
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setBlogData({ ...blogData, ...res?.data?.updatedblogData });
				router.push(APP_ROUTES.MANAGE_BLOGS);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	const [isFullScreen, setIsFullScreen] = useState(false);
	return (
		<MuiModal
			openModal={openModal}
			setOpenModal={setOpenModal}
			modalSize={'md'}
			fullScreen={isFullScreen}
			modalTitle={
				<div className='w-100 d-flex align-items-center justify-content-between'>
					<div className='d-flex'>
						<Button className='text-decor-none btn-site' variant='contained'>
							{isEdit && <EditIcon fontSize='small' sx={{ mr: '5px' }} />}
							{!isEdit && <MenuBookOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />}
							{isEdit ? `${blog?.title}` : 'Create New Blog'}
						</Button>
						<div className='my-auto mx-2 cursor-pointer'>
							{isFullScreen ? (
								<FullscreenExitIcon onClick={() => setIsFullScreen(!isFullScreen)} sx={{ fontSize: '25px', color: '#0009' }} />
							) : (
								<FullscreenIcon onClick={() => setIsFullScreen(!isFullScreen)} sx={{ fontSize: '25px', color: '#0009' }} />
							)}
						</div>
					</div>
					<Avatar src={session?.user?.avatar} alt={session?.user?.firstname} className={`mild-shadow`} />
				</div>
			}
			modalBody={
				<div className='w-100'>
					<TextField
						onChange={handleChangeInput}
						value={title}
						color='primary'
						className='w-100 mt-4'
						name='title'
						placeholder='e.g thebestblogs'
						label='Blog Title'
						variant='outlined'
						helperText={errors.title}
						error={errors.title ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>

					{!isFetchingBlogContent && !isErrored && (
						<div className='w-100 mt-4'>
							<ReactEditor content={body} setContent={setBody} />
						</div>
					)}
					{isFetchingBlogContent && !isErrored && (
						<div className='w-100 mt-5 d-flex flex-column align-items-center justify-content-center'>
							<CircularProgress style={{ color: 'var(--color-primary)', height: '40px', width: '40px' }} sx={{ mt: 3 }} />
							<div className='mt-4 w-100 text-center color-primary fs-7'>Loading Blog Content...</div>
						</div>
					)}
					{!isFetchingBlogContent && isErrored && (
						<div className='w-100 mt-5 d-flex flex-column align-items-center justify-content-center'>
							<div className='mt-4 w-100 text-center color-primary fs-7'>An Error Occured While Fetching Blog Content...</div>
							<Button onClick={fetchBlogContent} className='text-decor-none mt-4' color='white' variant='contained'>
								Retry
							</Button>
						</div>
					)}
					<TextField
						onChange={handleChangeInput}
						value={slug}
						color='primary'
						className='w-100 mt-4'
						name='slug'
						label='Blog Slug'
						variant='standard'
						placeholder='Provide a custom slug for this blog || OPTIONAL'
						helperText={errors.slug}
						error={errors.slug ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={summary}
						color='primary'
						className='w-100 mt-4'
						name='summary'
						label='Blog Summary'
						variant='standard'
						placeholder='Provide a summary used to Preview Blog'
						helperText={errors.summary}
						inputProps={{ maxLength: LIMITS.BLOG_SUMMARY_LIMIT + 10 }}
						error={errors.summary ? true : false}
						multiline
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary fs-9'>
						{summary?.length} / {LIMITS.BLOG_SUMMARY_LIMIT + 10} characters allowed.
					</div>

					<div className='w-100 mt-4'>
						<div className='d-flex' style={{ marginLeft: '-10px' }}>
							<BsDot className='color-primary fs-2 my-auto' />
							<span className='fw-bold fs-6 my-auto'>Select Categories for this Blog</span>
						</div>
						{allCategories.map((category, i) => (
							<FormControlLabel
								control={
									<Checkbox
										checked={Boolean(categories?.find((index) => index?.toString() === category?._id))}
										name={category?._id}
										onChange={handleSelectCategories}
										inputProps={{ 'aria-label': 'controlled' }}
									/>
								}
								label={category?.title}
								labelPlacement='end'
								key={i}
								className='w-100 d-flex'
							/>
						))}
					</div>

					<div className='w-100 mt-4'>
						<div className='d-flex' style={{ marginLeft: '-10px' }}>
							<BsDot className='color-primary fs-2 my-auto' />
							<span className='fw-bold fs-6 my-auto'>Select Tags for this Blog</span>
						</div>
						{allTags.map((tag, i) => (
							<FormControlLabel
								control={
									<Checkbox
										checked={Boolean(tags?.find((index) => index?.toString() === tag?._id))}
										name={tag?._id}
										onChange={handleSelectTags}
										inputProps={{ 'aria-label': 'controlled' }}
									/>
								}
								label={`#${tag?.title}`}
								labelPlacement='end'
								key={i}
								className='w-100 d-flex'
							/>
						))}
					</div>

					<div className={`${comp_styles.img_input} mild-shadow mt-4 d-flex flex-column align-items-center justify-content-center`}>
						<img
							alt='Select Blog Thumbnail'
							style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '300px' }}
							className='img-thumbnail'
							src={thumbnail}
						/>
						<input onChange={handleThumbnailUpload} type='file' name='thumbnail' id={`${comp_styles.avatar_input}`} accept='image/*' />
					</div>

					<div className='w-100 border-bottom fw-bold border-info rounded-1 p-1 fs-9 color-primary text-center mt-4'>
						Set Up SEO for this Blog.
					</div>
					<TextField
						onChange={handleChangeInput}
						value={meta_description}
						color='primary'
						className='w-100 mt-4'
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
									<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
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
						className='w-100 mt-4'
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
									<MenuBookOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary fs-9'>
						{meta_keywords?.length} / {LIMITS.META_KEYWORDS_LIMIT} characters allowed.
					</div>

					<div className='my-4 w-100'>
						<div className='d-flex'>
							<BsDot className='color-primary fs-2 my-auto' />
							<span className='my-auto'>Blog Status</span>
						</div>
						<div className='d-flex'>
							<Switch checked={Boolean(published)} onChange={handleChangeInput} name='published' />
							<span className={`${published ? 'color-primary' : 'text-secondary'} fw-bold my-auto`}>
								{published ? 'Published' : 'Hidden'}
							</span>
						</div>
					</div>
				</div>
			}
			modalActions={
				!isEdit ? (
					<React.Fragment>
						{!isSubmitting && (
							<React.Fragment>
								<Button onClick={handleCreateBlog} className='w-100 text-decor-none btn-site' variant='contained'>
									<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Create New Blog
								</Button>
								<Button onClick={handleCloseModal} className='text-decor-none' color='white' variant='contained'>
									<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
								</Button>
							</React.Fragment>
						)}
						{isSubmitting && (
							<CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />
						)}
					</React.Fragment>
				) : (
					<React.Fragment>
						{!isSubmitting && (
							<React.Fragment>
								<Button onClick={handleEditBlog} className='w-100 text-decor-none btn-site' variant='contained'>
									<EditIcon fontSize='small' sx={{ mr: '5px' }} /> Update Blog
								</Button>
								<Button onClick={handleCloseModal} className='text-decor-none' color='white' variant='contained'>
									<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
								</Button>
							</React.Fragment>
						)}
						{isSubmitting && (
							<CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />
						)}
					</React.Fragment>
				)
			}>
			{isEdit && (
				<Button className='text-decor-none btn-site' variant='contained'>
					<EditIcon />
				</Button>
			)}
			{!isEdit && (
				<Button className='text-decor-none btn-site' variant='contained'>
					<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Create New Blog
				</Button>
			)}
		</MuiModal>
	);
};

const ViewBlogDetailsModal = ({ allBlogs, allTags, allCategories, blog, params, session }) => {
	const [openModal, setOpenModal] = useState(false);
	const RenderTitle = ({ title }) => {
		return (
			<div className='d-flex' style={{ marginLeft: '-10px' }}>
				<BsDot className='color-primary fs-2 my-auto' />
				<span className='my-auto fw-bold'>{title}</span>
			</div>
		);
	};

	return (
		<MuiModal
			openModal={openModal}
			setOpenModal={setOpenModal}
			closeOnOverlayClick={true}
			modalSize={'md'}
			modalTitle={
				<div className='w-100 d-flex align-items-center justify-content-between'>
					<Button className='text-decor-none btn-site' variant='contained'>
						<MenuBookOutlinedIcon fontSize='small' sx={{ mr: '5px' }} /> {blog?.title}
					</Button>
					<Avatar src={session?.user?.avatar} alt={session?.user?.firstname} className={`mild-shadow`} />
				</div>
			}
			modalBody={
				<React.Fragment>
					<div className='d-flex p-2 align-items-center justify-content-center mt-3 flex-column'>
						<div
							className='border border-info mb-2 d-flex flex-column align-items-center justify-content-center rounded-2 p-2'
							style={{ width: '250px' }}>
							<Avatar
								src={blog?.author?.avatar}
								sx={{ width: '100px', height: '100px' }}
								alt={blog?.author?.firstname}
								className={`mild-shadow`}
							/>
							<div className='mt-2 fs-8 text-center'>{`${blog?.author?.lastname ? blog?.author?.lastname : ''} ${
								blog?.author?.firstname ? blog?.author?.firstname : ''
							} ${blog?.author?.secondname ? blog?.author?.secondname : ''}`}</div>
							<div className='mt-1 fs-9 color-primary fw-bold text-center'>
								{blog?.author?.member_role === MEMBER_ROLES.MASTER && 'Master Admin'}
								{blog?.author?.member_role === MEMBER_ROLES.MANAGER && 'Manager Admin'}
							</div>
							<div className='mt-1 fs-9 text-secondary text-center'>
								Created Blog On:
								<div className='rounded-2 w-100 px-2'>
									<Moment format='LT'>{blog?.createdAt}</Moment> - <Moment format='ddd'>{blog?.createdAt}</Moment>,
									<span className='ms-1'>
										<Moment format='DD'>{blog?.createdAt}</Moment>/<Moment format='MM'>{blog?.createdAt}</Moment>/
										<Moment format='YY'>{blog?.createdAt}</Moment>
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className='d-flex flex-column'>
						<RenderTitle title='Blog Title' />
						<div className='border-bottom border-2 border-info w-100 p-2'>{blog?.title}</div>
					</div>
					<div className='d-flex mt-3 flex-column'>
						<RenderTitle title='Status' />
						<div className='w-100 ms-2'>
							<RenderBlogStatusChip blog={blog} />
						</div>
					</div>
					<div className='border-top border-2 border-info pt-3 d-flex mt-3 flex-column'>
						<RenderTitle title='Last Updated' />
						<div className='w-100 p-2'>
							<Moment format='LT'>{blog?.updatedAt}</Moment> - <Moment format='ddd'>{blog?.updatedAt}</Moment>,
							<span className='ms-1'>
								<Moment format='DD'>{blog?.updatedAt}</Moment>/<Moment format='MM'>{blog?.updatedAt}</Moment>/
								<Moment format='YY'>{blog?.updatedAt}</Moment>
							</span>
						</div>
					</div>
					<div className='w-100 d-flex flex-wrap border-top border-bottom border-2 border-info py-2 mt-3 flex-column'>
						<RenderTitle title='Visit Blog' />
						<Link href={`${APP_ROUTES.BLOGS}/${blog?.slug}`} className='text-decor-none color-primary fs-7' target='_blank'>
							{`${APP_ROUTES.BLOGS}/${blog?.slug}`}
							<OpenInNewIcon sx={{ ml: 0.5 }} className='fs-6 fw-bold' />
						</Link>
					</div>
					<div className='d-flex flex-column mt-3'>
						<RenderTitle title='Blog ID' />
						<div className='border-bottom border-2 border-info w-100 p-2'>{blog?.uniqueID}</div>
					</div>
					<div className='d-flex flex-column mt-3'>
						<RenderTitle title='Tags Associated with this Blog' />
						<div className='border-bottom border-2 border-info d-flex flex-wrap w-100 p-2'>
							{allTags
								.filter((tagIndex) => blog?.tags?.find((index) => index?.toString() === tagIndex?._id?.toString()))
								?.map((tag, i) => (
									<TagChip hideLink={true} tag={tag} key={i} />
								))}
						</div>
					</div>
					<div className='d-flex flex-column mt-3'>
						<RenderTitle title='Categories Associated with this Blog' />
						<div className='border-bottom border-2 border-info d-flex flex-wrap w-100 p-2'>
							{allCategories
								.filter((catIndex) => blog?.categories?.find((index) => index?.toString() === catIndex?._id?.toString()))
								?.map((category, i) => (
									<CategoryChip hideLink={true} category={category} key={i} />
								))}
						</div>
					</div>
				</React.Fragment>
			}
			modalActions={
				<React.Fragment>
					<CreateBlogFunctionality
						isEdit={true}
						session={session}
						blog={blog}
						allBlogs={allBlogs}
						allCategories={allCategories}
						allTags={allTags}
					/>
					<Button onClick={() => setOpenModal(false)} className='text-decor-none' color='white' variant='contained'>
						<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Close
					</Button>
				</React.Fragment>
			}>
			<span className='cursor-pointer'>{blog?.title}</span>
		</MuiModal>
	);
};

const DeleteBlogModal = ({ blog, session }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleDeleteBlog = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await deleteDataAPI(`${API_ROUTES.MANAGE_BLOGS}?blog=${blog?.uniqueID}`);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setOpenModal(false);
				router.push(APP_ROUTES.MANAGE_BLOGS);
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
			closeOnOverlayClick={true}
			modalSize={'xs'}
			disableDefaultFullScreen={true}
			modalTitle={
				<div className='w-100 fs-6 fw-bold d-flex align-items-center justify-content-between'>
					<div>
						Delete <span className='color-primary'>{blog?.title}?</span>
					</div>
				</div>
			}
			modalBody={
				<div className='w-100 text-center'>
					<div>Are you sure you want to delete this blog?</div>
					<div>It will be permanently deleted.</div>
				</div>
			}
			modalActions={
				<React.Fragment>
					{!isSubmitting && (
						<React.Fragment>
							<Button onClick={handleDeleteBlog} className='w-100 text-decor-none' color='danger' variant='contained'>
								<DeleteIcon fontSize='small' sx={{ mr: '5px' }} /> Delete
							</Button>
							<Button onClick={() => setOpenModal(false)} className='w-100 text-decor-none' variant='contained'>
								<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Cancel
							</Button>
						</React.Fragment>
					)}
					{isSubmitting && <CircularProgress style={{ color: 'var(--color-primary)', margin: 'auto', height: '40px', width: '40px' }} />}
				</React.Fragment>
			}>
			<Button variant='contained' color='danger' sx={{ ml: 1 }} size='small'>
				<DeleteIcon />
			</Button>
		</MuiModal>
	);
};

const ManageBlogs = ({ categories, tags, blogs, blogHomePageSEOData }) => {
	const { data: session } = useSession();

	const columns = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'title',
			headerName: 'Title',
			width: 200,
			renderCell: (params) => {
				return (
					<ViewBlogDetailsModal
						allCategories={categories}
						allTags={tags}
						params={params}
						session={session}
						blog={params?.row}
						allBlogs={blogs}
					/>
				);
			},
		},
		{ field: 'views', headerName: 'Views', type: 'number', align: 'center', width: 100 },
		{ field: 'commentsLength', headerName: 'Comments', type: 'number', align: 'center', width: 100 },
		{
			field: 'published',
			headerName: 'Status',
			type: 'actions',
			width: 100,
			renderCell: (params) => {
				return <RenderBlogStatusChip blog={params?.row} />;
			},
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 200,
			renderCell: (params) => {
				return (
					<React.Fragment>
						<CreateBlogFunctionality
							allCategories={categories}
							allTags={tags}
							isEdit={true}
							allBlogs={blogs}
							session={session}
							blog={params?.row}
						/>
						<DeleteBlogModal session={session} blog={params?.row} />
					</React.Fragment>
				);
			},
		},
		{ field: 'tagsLength', headerName: 'Tags', type: 'number', align: 'center', width: 100 },
		{ field: 'categoriesLength', headerName: 'Categories', type: 'number', align: 'center', width: 100 },
	];

	const rows = blogs?.map((blog, index) => {
		return {
			id: index + 1,
			uniqueID: blog?.uniqueID,
			title: blog?.title,
			body: blog?.body,
			slug: blog?.slug,
			thumbnail: blog?.thumbnail,
			summary: blog?.summary,
			meta_description: blog?.meta_description,
			meta_keywords: blog?.meta_keywords,
			published: blog?.published,
			author: blog?.author,
			views: blog?.views?.length,
			commentsLength: blog?.comments?.length,
			tagsLength: blog?.tags?.length,
			categoriesLength: blog?.categories?.length,
			comments: blog?.comments?.length,
			tags: blog?.tags,
			categories: blog?.categories,
			updatedAt: blog?.updatedAt,
			createdAt: blog?.createdAt,
		};
	});

	return (
		<AdminLayout
			metatags={{ meta_title: `Manage Blogs | ${SITE_DATA.OFFICIAL_NAME}` }}
			pageIcon={<MenuBookOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Manage Blogs'}>
			<Box
				sx={{
					display: 'flex',
					alignItems: { md: 'center' },
					flexFlow: { xs: 'column', sm: 'column', md: 'row' },
					mb: 3,
					width: '100%',
					justifyContent: 'space-between',
				}}>
				<div className='mt-3'>
					<CreateBlogFunctionality allCategories={categories} allTags={tags} allBlogs={blogs} session={session} />
				</div>
				<div className='mt-3'>
					<SetUpPageSEO
						fromPage={APP_ROUTES.MANAGE_BLOGS}
						pageSlug={APP_ROUTES.BLOGS}
						pageSeoData={blogHomePageSEOData}
						pageName={'Articles & Blog'}
						session={session}
					/>
				</div>
			</Box>
			<MuiXDataGridTable columns={columns} rows={rows} checkboxSelection />
		</AdminLayout>
	);
};

export async function getServerSideProps({ req, res, query }) {
	// ** REDIRECT TO LOGIN IF COOKIE NOT EXIST
	const session = await getServerSession(req, res, authOptions);
	if (!session) return { redirect: { destination: `${APP_ROUTES.LOGIN}?redirectUrl=${req.url}`, permanent: false } };

	// ** REDIRECT TO USER DASHBOARD PAGE IF NOT ADMIN
	if (session?.user?.member_role !== MEMBER_ROLES.MASTER && session?.user?.member_role !== MEMBER_ROLES.MANAGER)
		return {
			redirect: { destination: APP_ROUTES.USER_DASHBOARD, permanent: false },
		};

	// REDIRECT TO DASHBOARD PAGE IF ADMIN IS RESTRICTED TO VIEW THIS PAGE
	const isRestricted = await CheckAdminRestriction({ page: APP_ROUTES.ACTIVITY_LOGS, adminId: session?.user?._id });
	if (isRestricted) return { redirect: { destination: APP_ROUTES.ADMIN_DASHBOARD, permanent: false } };

	// ** GET ALL BLOGS
	const allBlogs = await AdminController.getAllBlogs(req, res, true);
	const allCategories = await AdminController.getAllBlogCategories(req, res, true);
	const allTags = await AdminController.getAllBlogTags(req, res, true);

	// ** GET BLOG PAGE SEO DATA
	req.query = query;
	req.query.pageSlug = APP_ROUTES.BLOGS;
	const blogHomePageSEOData = await WebController.getPageSEO(req, res, true);
	return {
		props: {
			session: JSON.parse(JSON.stringify({ ...session })),
			blogs: allBlogs?.length ? allBlogs : [],
			tags: allTags?.length ? allTags : [],
			categories: allCategories?.length ? allCategories : [],
			blogHomePageSEOData: blogHomePageSEOData,
		},
	};
}

export default ManageBlogs;
