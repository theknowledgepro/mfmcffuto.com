/** @format */

import React, { useState } from 'react';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { AdminLayout, BlogThumb, MuiModal, MuiXDataGridTable, SetUpPageSEO } from '@/components';
import { API_ROUTES, APP_ROUTES, CLOUD_ASSET_BASEURL, LIMITS, MEMBER_ROLES, SITE_DATA } from '@/config';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import { Box, Button, CircularProgress, TextField, InputAdornment, Switch, Avatar, IconButton } from '@mui/material';
import { BsDot } from 'react-icons/bs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { deleteDataAPI, patchFormDataAPI, postFormDataAPI } from '@/utils/api_client_side';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '@/redux/types';
import { useRouter } from 'next/router';
import AdminController from '@/pages/api/admin/controller';
import Link from 'next/link';
import Moment from 'react-moment';
import comp_styles from '@/components/components.module.css';
import { validate } from '@/utils/validate';
import WebController from '@/pages/api/controller';
import AuthController from '@/pages/api/auth/controller';
import { DispatchUserAuth } from '@/utils/misc_functions';

const RenderCategoryStatusChip = ({ category }) => {
	return (
		<div
			style={{ width: 'max-content' }}
			className={`flex items-center justify-center rounded-[30px] px-3 py-1 text-white text-[14px] mild-shadow ${
				Boolean(category?.published) ? 'bg-green-500' : 'bg-gray-400'
			}`}>
			{Boolean(category?.published) ? 'Published' : 'Hidden'}
		</div>
	);
};

const CreateCategoryFunctionality = ({ allCategories, session, category, isEdit }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);

	const initialState = category
		? { ...category, thumbnail: `${CLOUD_ASSET_BASEURL}/${category?.thumbnail?.trim()}` }
		: { title: '', description: '', slug: '', thumbnail: '', meta_description: '', meta_keywords: '', published: true };
	const [categoryData, setCategoryData] = useState(initialState);
	const { title, description, slug, thumbnail, meta_description, meta_keywords, published } = categoryData;
	const [file, setFile] = useState(null);

	// ** DYNAMIC FORM FUNCTIONALITY FOR TYPEWRITER TEXTS

	const categoryTypeWriterStringsInitialState = categoryData?.type_writer_strings?.length ? categoryData?.type_writer_strings : [''];
	const [categoryTypeWriterTexts, setCategoryTypeWriterTexts] = useState(categoryTypeWriterStringsInitialState);

	const handleTypeWriterTextInputs = (index, event) => {
		let data = [...categoryTypeWriterTexts];
		data[index] = event.target.value;
		setCategoryTypeWriterTexts(data);
	};

	const handleAddTypeWriterTextInputs = () => setCategoryTypeWriterTexts([...categoryTypeWriterTexts, '']);

	const handleRemoveFields = (index) => {
		if (index === 0 && categoryTypeWriterTexts.length === 1)
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `At least one field is required for the typewriter.` } });
		let data = [...categoryTypeWriterTexts];
		data.splice(index, 1);
		setCategoryTypeWriterTexts(data);
	};

	const handleChangeInput = (e) => {
		const { name, value, checked } = e.target;
		setCategoryData({ ...categoryData, [name]: name === 'published' ? checked : value });
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
			setCategoryData((previousState) => {
				return { ...categoryData, thumbnail: upload.target.result };
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

	const handleCreateCategory = async () => {
		setErrors({
			title: !title && 'Please provide a name for this new category.',
			description: !description && 'Please provide a description for this category.',
			meta_description: !meta_description && 'Please provide a meta description for this category.',
			meta_keywords: !meta_keywords && 'Please provide some meta keywords for this category.',
		});
		if (!title || !description || !meta_description || !meta_keywords) return;
		if (allCategories.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Category with this Title already exists!` } });
		if (allCategories.find((index) => index?.slug === slug))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Category with this slug already exists!` } });
		if (!categoryTypeWriterTexts.find((index) => index?.toString()?.length))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `At least one field is required for the typewriter!` } });
		if (!file) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please attach a thumbnail for this category!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await postFormDataAPI(
				API_ROUTES.MANAGE_BLOG_CATEGORIES,
				{
					...categoryData,
					thumbnail: file,
					type_writer_strings: categoryTypeWriterTexts
						?.filter((index) => index.toString()?.trim()?.length)
						?.map((text, i) => {
							return text?.toString()?.trim();
						}),
				},
				session?.token
			);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setCategoryData(initialState);
				setCategoryTypeWriterTexts(categoryTypeWriterStringsInitialState);
				router.push(APP_ROUTES.MANAGE_BLOG_CATEGORIES);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	const handleEditCategory = async () => {
		setErrors({
			title: !title && 'Please provide a name for this new category.',
			description: !description && 'Please provide a description for this category.',
			meta_description: !meta_description && 'Please provide a meta description for this category.',
			meta_keywords: !meta_keywords && 'Please provide some meta keywords for this category.',
		});
		if (!title || !description || !meta_description || !meta_keywords) return;
		if (allCategories.filter((index) => index.uniqueID !== category?.uniqueID)?.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Category with this Title already exists!` } });
		if (allCategories.filter((index) => index.uniqueID !== category?.uniqueID)?.find((index) => index?.slug === slug))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Category with this slug already exists!` } });
		if (!categoryTypeWriterTexts.find((index) => index?.toString()?.length))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `At least one field is required for the typewriter!` } });
		if (!file && !thumbnail) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `Please attach a thumbnail for this category!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await patchFormDataAPI(
				API_ROUTES.MANAGE_BLOG_CATEGORIES,
				{
					...categoryData,
					thumbnail: file ? file : thumbnail,
					type_writer_strings: categoryTypeWriterTexts
						?.filter((index) => index.toString()?.trim()?.length)
						?.map((text, i) => {
							return text?.toString()?.trim();
						}),
				},
				session?.token
			);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setCategoryData({ ...categoryData, ...res?.data?.updatedCategoryData });
				setCategoryTypeWriterTexts([...res?.data?.updatedCategoryData?.type_writer_strings]);
				// console.log(res?.data?.updatedCategoryData);
				router.push(APP_ROUTES.MANAGE_BLOG_CATEGORIES);
				handleCloseModal();
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
			modalSize={'sm'}
			modalTitle={
				<div className='w-full flex items-center justify-between'>
					<Button className='normal-case btn-site' variant='contained'>
						{isEdit && <EditIcon fontSize='small' sx={{ mr: '5px' }} />}
						{!isEdit && <CategoryOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />}
						{isEdit ? `${category?.title}` : 'Create Blog Category'}
					</Button>
					<Avatar src={session?.user?.avatar} alt={session?.user?.firstname} className={`mild-shadow`} />
				</div>
			}
			modalBody={
				<div className='w-full'>
					<TextField
						onChange={handleChangeInput}
						value={title}
						color='primary'
						className='w-full mt-4'
						name='title'
						placeholder='e.g thebestblogs'
						label='Category Title'
						variant='outlined'
						helperText={errors.title}
						error={errors.title ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<CategoryOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChangeInput}
						value={description}
						color='primary'
						className='w-full mt-4'
						name='description'
						label='Category Description'
						placeholder='e.g the best blog in the city for readers...'
						variant='standard'
						inputProps={{ maxLength: LIMITS.CATEGORIES_DESCRIPTION_CHARACTERS_LIMIT }}
						multiline
						helperText={errors.description}
						error={errors.description ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<CategoryOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary text-[13px]'>
						{description?.length} / {LIMITS.CATEGORIES_DESCRIPTION_CHARACTERS_LIMIT} characters allowed.
					</div>

					<TextField
						onChange={handleChangeInput}
						value={slug}
						color='primary'
						className='w-full mt-4'
						name='slug'
						label='Category Slug'
						variant='standard'
						placeholder='Provide a custom slug for this category || OPTIONAL'
						helperText={errors.slug}
						error={errors.slug ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<CategoryOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>

					<div className='w-full my-4'>
						{categoryTypeWriterTexts.map((text, index) => (
							<div key={index} className='w-full flex items-center justify-center'>
								<TextField
									onChange={(e) => handleTypeWriterTextInputs(index, e)}
									value={categoryTypeWriterTexts[index]}
									color='primary'
									className='w-full mt-4'
									size='small'
									label={`TypeWriter Text ${index + 1}`}
									variant='outlined'
									multiline
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<CategoryOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
											</InputAdornment>
										),
									}}
								/>
								<IconButton className='mt-3 ms-2' onClick={() => handleRemoveFields(index)}>
									<CancelIcon />
								</IconButton>
							</div>
						))}
						<Button className='py-1 normal-case mt-4 btn-site text-white btn-animated' onClick={handleAddTypeWriterTextInputs}>
							<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Add More Fields
						</Button>
					</div>

					<div className={`${comp_styles.img_input} rounded-[5px] mild-shadow mt-4 flex flex-col items-center justify-center`}>
						{thumbnail && (
							<img
								alt='Select Category Thumbnail'
								style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '300px' }}
								className='img-thumbnail'
								src={thumbnail}
							/>
						)}
						{!thumbnail && <div className='font-medium-custom color-primary'>Click to Upload Category Thumbnail</div>}
						<input onChange={handleThumbnailUpload} type='file' name='thumbnail' id={`${comp_styles.avatar_input}`} accept='image/*' />
					</div>

					<div className='w-full border-b font-medium-custom border-zinc-300 rounded-1 p-1 text-[13px] color-primary text-center mt-4'>
						Set Up SEO for this category.
					</div>
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
									<CategoryOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary text-[13px]'>
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
									<CategoryOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary text-[13px]'>
						{meta_keywords?.length} / {LIMITS.META_KEYWORDS_LIMIT} characters allowed.
					</div>

					<div className='my-4 w-full'>
						<div className='flex'>
							<BsDot className='color-primary text-[40px] my-auto' />
							<span className='my-auto'>Category Status</span>
						</div>
						<div className='flex'>
							<Switch checked={Boolean(published)} onChange={handleChangeInput} name='published' />
							<span className={`${published ? 'color-primary' : 'text-gray-500'} font-medium-custom my-auto`}>
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
								<Button onClick={handleCreateCategory} className='w-full normal-case btn-site' variant='contained'>
									<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Create Blog Category
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
				) : (
					<React.Fragment>
						{!isSubmitting && (
							<React.Fragment>
								<Button onClick={handleEditCategory} className='w-full normal-case btn-site' variant='contained'>
									<EditIcon fontSize='small' sx={{ mr: '5px' }} /> Update Blog Category
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
				)
			}>
			{isEdit && (
				<Button className='normal-case btn-site' variant='contained'>
					<EditIcon />
				</Button>
			)}
			{!isEdit && (
				<Button className='normal-case btn-site' variant='contained'>
					<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Create Blog Category
				</Button>
			)}
		</MuiModal>
	);
};

const ViewCategoryDetailsModal = ({ session, category, allCategories }) => {
	const [openModal, setOpenModal] = useState(false);
	const RenderTitle = ({ title }) => {
		return (
			<div className='flex' style={{ marginLeft: '-10px' }}>
				<BsDot className='color-primary text-[40px] my-auto' />
				<span className='my-auto font-medium-custom'>{title}</span>
			</div>
		);
	};
	return (
		<MuiModal
			openModal={openModal}
			setOpenModal={setOpenModal}
			closeOnOverlayClick={true}
			modalTitle={
				<div className='w-full flex items-center justify-between'>
					<Button className='normal-case btn-site' variant='contained'>
						<CategoryOutlinedIcon fontSize='small' sx={{ mr: '5px' }} /> {category?.title}
					</Button>
					<Avatar src={session?.user?.avatar} alt={session?.user?.firstname} className={`mild-shadow`} />
				</div>
			}
			modalBody={
				<React.Fragment>
					<div className='flex p-2 items-center justify-center mt-3 flex-col'>
						{/* <RenderTitle title='Author' /> */}
						<div
							className='border border-zinc-300 mb-2 flex flex-col items-center justify-center rounded-2 p-2'
							style={{ width: '250px' }}>
							<Avatar
								src={category?.author?.avatar}
								sx={{ width: '100px', height: '100px' }}
								alt={category?.author?.firstname}
								className={`mild-shadow`}
							/>
							<div className='mt-2 text-[14px] text-center'>{`${category?.author?.lastname ? category?.author?.lastname : ''} ${
								category?.author?.firstname ? category?.author?.firstname : ''
							} ${category?.author?.secondname ? category?.author?.secondname : ''}`}</div>
							<div className='mt-1 text-[13px] color-primary font-medium-custom text-center'>
								{category?.author?.member_role === MEMBER_ROLES.MASTER && 'Master Admin'}
								{category?.author?.member_role === MEMBER_ROLES.MANAGER && 'Manager Admin'}
							</div>
							<div className='mt-1 text-[13px] text-gray-500 text-center'>
								Created Category On:
								<div className='rounded-2 w-full px-2'>
									<Moment className='text-[14px]' format='LT'>{category?.createdAt}</Moment> - <Moment className='text-[14px]' format='ddd'>{category?.createdAt}</Moment>,
									<span className='ms-1'>
										<Moment className='text-[14px]' format='DD'>{category?.createdAt}</Moment>/<Moment className='text-[14px]' format='MM'>{category?.createdAt}</Moment>/
										<Moment className='text-[14px]' format='YY'>{category?.createdAt}</Moment>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Category Title' />
						<div className='border-b border-zinc-300 w-full p-2'>{category?.title}</div>
					</div>
					<div className='flex mt-3 flex-col'>
						<RenderTitle title='Category Description' />
						<div className='border-b border-zinc-300 w-full p-2'>{category?.description}</div>
					</div>
					<div className='flex mt-3 flex-col'>
						<RenderTitle title='Status' />
						<div className='w-full ms-2'>
							<RenderCategoryStatusChip category={category} />
						</div>
					</div>

					<div className='border-t border-zinc-300 pt-3 flex mt-3 flex-col'>
						<RenderTitle title='Last Updated' />
						<div className='w-full p-2'>
							<Moment className='text-[14px]' format='LT'>{category?.updatedAt}</Moment> - <Moment className='text-[14px]' format='ddd'>{category?.updatedAt}</Moment>,
							<span className='ms-1'>
								<Moment className='text-[14px]' format='DD'>{category?.updatedAt}</Moment>/<Moment className='text-[14px]' format='MM'>{category?.updatedAt}</Moment>/
								<Moment className='text-[14px]' format='YY'>{category?.updatedAt}</Moment>
							</span>
						</div>
					</div>

					<div className='w-full flex flex-wrap border-t border-b border-zinc-300 py-2 mt-3 flex-col'>
						<RenderTitle title='Visit Category' />
						<Link href={`${APP_ROUTES.BLOGS_CATEGORIES}/${category?.slug}`} className='normal-case color-primary fs-7' target='_blank'>
							{`${APP_ROUTES.BLOGS_CATEGORIES}/${category?.slug}`}
							<OpenInNewIcon sx={{ ml: 0.5 }} className='text-[16px] font-medium-custom' />
						</Link>
					</div>
					<div className='flex flex-col mt-3'>
						<RenderTitle title='Category ID' />
						<div className='border-b border-zinc-300 w-full p-2'>{category?.uniqueID}</div>
					</div>
					{category?.blogs?.length === 0 && (
						<div className='flex flex-col mt-3'>
							<RenderTitle title='No Blogs Associated with this Category' />
						</div>
					)}
					{category?.blogs?.length > 0 && (
						<div className='flex flex-col mt-3'>
							<RenderTitle title='Blogs Associated with this Category' />
							<div className='border-b border-zinc-300 w-full p-2'>
								{category?.blogs?.map((blog, i) => (
									<BlogThumb
										key={i}
										blog={{
											...blog,
											categories: category?.published
												? [
														// ** LET THIS category COME FIRST IN THE categories LIST
														...blog?.categories?.filter((index) => index?.title === category?.title),
														...blog?.categories?.filter((index) => index?.title !== category?.title),
												  ]
												: blog?.categories?.filter((index) => index?.title !== category?.title),
										}}
										isAdminPanelView={true}
										isCategory={true}
										isLast={i === category?.blogs?.length - 1}
										isCategoryHidden={!category?.published}
									/>
								))}
							</div>
						</div>
					)}
				</React.Fragment>
			}
			modalActions={
				<React.Fragment>
					<CreateCategoryFunctionality isEdit={true} allCategories={allCategories} session={session} category={category} />,
					<Button onClick={() => setOpenModal(false)} className='normal-case' color='white' variant='contained'>
						<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Close
					</Button>
				</React.Fragment>
			}>
			<span className='cursor-pointer'>{category?.title}</span>
		</MuiModal>
	);
};

const DeleteCategoryModal = ({ session, category }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleDeleteCategory = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await deleteDataAPI(`${API_ROUTES.MANAGE_BLOG_CATEGORIES}?category=${category?.uniqueID}`, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setOpenModal(false);
				router.push(APP_ROUTES.MANAGE_BLOG_CATEGORIES);
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
				<div className='w-full text-[16px] font-medium-custom flex items-center justify-between'>
					<div>
						Delete <span className='color-primary'>{category?.title}?</span>
					</div>
				</div>
			}
			modalBody={
				<div className='w-full text-center'>
					<div>Are you sure you want to delete this category?</div>
					<div>It will be permanently deleted.</div>
				</div>
			}
			modalActions={
				<React.Fragment>
					{!isSubmitting && (
						<React.Fragment>
							<Button
								onClick={handleDeleteCategory}
								className='w-full normal-case bg-red-600 text-white'
								color='danger'
								variant='contained'>
								<DeleteIcon fontSize='small' sx={{ mr: '5px' }} /> Delete
							</Button>
							<Button onClick={() => setOpenModal(false)} className='w-full btn-site normal-case' variant='contained'>
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

const ManageCategories = ({ userAuth, categories, blogCategoriesPageSEOData }) => {
	// ** DISPATCH USER AUTH
	DispatchUserAuth({ userAuth });
	const session = useSelector((state) => state.auth);

	const columns = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'title',
			headerName: 'Title',
			width: 200,
			renderCell: (params) => {
				return <ViewCategoryDetailsModal session={session} category={params?.row} allCategories={categories} />;
			},
		},
		{ field: 'blogCount', headerName: 'No. of Articles & Blogs', type: 'number', align: 'center', width: 200 },
		{
			field: 'published',
			headerName: 'Status',
			type: 'actions',
			width: 100,
			renderCell: (params) => {
				return <RenderCategoryStatusChip category={params?.row} />;
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
						<CreateCategoryFunctionality isEdit={true} allCategories={categories} session={session} category={params?.row} />
						<DeleteCategoryModal key={params?.row?.id} session={session} category={params?.row} />
					</React.Fragment>
				);
			},
		},
		{
			field: 'slug',
			headerName: 'Category Link',
			width: 120,
			align: 'center',
			renderCell: (params) => {
				return (
					<Link target='_blank' className='normal-case color-primary' href={`${APP_ROUTES.BLOGS_CATEGORIES}/${params?.row?.slug}`}>
						Visit Category
					</Link>
				);
			},
		},
	];

	const rows = categories?.map((category, index) => {
		return {
			id: index + 1,
			uniqueID: category?.uniqueID,
			title: category?.title,
			description: category?.description,
			slug: category?.slug,
			thumbnail: category?.thumbnail,
			meta_description: category?.meta_description,
			meta_keywords: category?.meta_keywords,
			published: category?.published,
			author: category?.author,
			blogs: category?.blogs,
			blogCount: category?.blogs?.length,
			type_writer_strings: category?.type_writer_strings,
			updatedAt: category?.updatedAt,
			createdAt: category?.createdAt,
		};
	});

	return (
		<AdminLayout
			metatags={{ meta_title: `Manage Categories | ${SITE_DATA.OFFICIAL_NAME}` }}
			pageIcon={<CategoryOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Manage Categories'}>
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
					<CreateCategoryFunctionality allCategories={categories} session={session} />
				</div>
				<div className='mt-3'>
					<SetUpPageSEO
						fromPage={APP_ROUTES.MANAGE_BLOG_CATEGORIES}
						pageSlug={APP_ROUTES.BLOGS_CATEGORIES}
						pageSeoData={blogCategoriesPageSEOData}
						pageName={'Blog Categories'}
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

	// ** GET ALL BLOG CATEGORIES
	const allCategories = await AdminController.getAllBlogCategories(req, res, true);

	// ** GET BLOG CATEGORIES PAGE SEO DATA
	req.query = query;
	req.query.pageSlug = APP_ROUTES.BLOGS_CATEGORIES;
	const blogCategoriesPageSEOData = await WebController.getPageSEO(req, res, true);
	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			categories: allCategories?.length ? allCategories : [],
			blogCategoriesPageSEOData: blogCategoriesPageSEOData,
		},
	};
}

export default ManageCategories;
