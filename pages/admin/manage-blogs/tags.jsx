/** @format */

import { AdminLayout, BlogThumb, MuiModal, MuiXDataGridTable, SetUpPageSEO } from '@/components';
import { API_ROUTES, APP_ROUTES, LIMITS, MEMBER_ROLES, SITE_DATA } from '@/config';
import React, { useState } from 'react';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckAdminRestriction from '@/middlewares/check_admin_restriction';
import { Box, Button, CircularProgress, TextField, InputAdornment, Switch, Avatar } from '@mui/material';
import { BsDot } from 'react-icons/bs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { deleteDataAPI, patchDataAPI, postDataAPI } from '@/utils/api_client_side';
import { handleClientAPIRequestErrors } from '@/utils/errors';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '@/redux/types';
import { useRouter } from 'next/router';
import AdminController from '@/pages/api/admin/controller';
import Link from 'next/link';
import Moment from 'react-moment';
import WebController from '@/pages/api/controller';
import AuthController from '@/pages/api/auth/controller';
import { DispatchUserAuth } from '@/utils/misc_functions';

const RenderTagStatuSChip = ({ tag }) => {
	return (
		<div
			style={{ width: 'max-content' }}
			className={`flex items-center justify-center rounded-[30px] px-3 py-1 text-white text-[14px] shadow ${
				Boolean(tag?.published) ? 'bg-green-500' : 'bg-gray-400'
			}`}>
			{Boolean(tag?.published) ? 'Published' : 'Hidden'}
		</div>
	);
};

const CreateTagFunctionality = ({ session, allTags, tag, isEdit }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);

	const initialState = tag ? tag : { title: '', description: '', slug: '', published: true };
	const [tagData, setTagData] = useState(initialState);
	const { title, description, slug, published } = tagData;
	const handleChangeInput = (e) => {
		const { name, value, checked } = e.target;
		setTagData({ ...tagData, [name]: name === 'published' ? checked : value });
	};

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleCreateTag = async () => {
		setErrors({
			title: !title && 'Please provide a name for this new tag.',
			description: !description && 'Please provide a description for this tag.',
		});
		if (!title || !description) return;
		if (allTags.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Tag with this title already exists!` } });
		if (allTags.find((index) => index?.slug === slug))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Tag with this slug already exists!` } });
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			console.log({ session });
			const res = await postDataAPI(API_ROUTES.MANAGE_BLOG_TAGS, tagData, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setTagData(initialState);
				router.push(APP_ROUTES.MANAGE_BLOG_TAGS);
				handleCloseModal();
			}
		} catch (err) {
			setIsSubmitting(false);
			handleClientAPIRequestErrors({ err, dispatch, loadingData: null });
		}
	};

	const handleEditTag = async () => {
		setErrors({
			title: !title && 'Please provide a name for this new tag.',
			description: !description && 'Please provide a description for this tag.',
		});
		if (!title || !description) return;
		if (allTags.filter((index) => index.uniqueID !== tag?.uniqueID)?.find((index) => index?.title === title))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Tag with this title already exists!` } });
		if (allTags.filter((index) => index.uniqueID !== tag?.uniqueID)?.find((index) => index?.slug === slug))
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: `A Tag with this slug already exists!` } });

		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await patchDataAPI(API_ROUTES.MANAGE_BLOG_TAGS, tagData, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setTagData({ ...tagData, ...res?.data?.updatedTagData });
				router.push(APP_ROUTES.MANAGE_BLOG_TAGS);
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
			modalTitle={
				<div className='w-full flex items-center justify-between'>
					<Button className='text-decor-none btn-site' variant='contained'>
						{isEdit && <EditIcon fontSize='small' sx={{ mr: '5px' }} />}
						{!isEdit && <TagOutlinedIcon fontSize='small' sx={{ mr: '5px' }} />}
						{isEdit ? `${tag?.title}` : 'Create Blog Tag'}
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
						label='Tag Title'
						variant='outlined'
						helperText={errors.title}
						error={errors.title ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<TagOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
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
						label='Tag Description'
						placeholder='e.g the best blog in the city for readers...'
						variant='standard'
						inputProps={{ maxLength: LIMITS.TAGS_DESCRIPTION_CHARACTERS_LIMIT }}
						multiline
						helperText={errors.description}
						error={errors.description ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<TagOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>
					<div className='my-2 color-primary text-[12px]'>
						{description?.length} / {LIMITS.TAGS_DESCRIPTION_CHARACTERS_LIMIT} characters allowed.
					</div>

					<TextField
						onChange={handleChangeInput}
						value={slug}
						color='primary'
						className='w-full mt-4'
						name='slug'
						label='Tag Slug'
						variant='standard'
						placeholder='Provide a custom slug for this tag || OPTIONAL'
						helperText={errors.slug}
						error={errors.slug ? true : false}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<TagOutlinedIcon sx={{ color: SITE_DATA.THEME_COLOR }} />
								</InputAdornment>
							),
						}}
					/>

					<div className='my-4 w-full'>
						<div className='flex'>
							<BsDot className='color-primary text-[40px] my-auto' />
							<span className='my-auto'>Tag Status</span>
						</div>
						<div className='flex'>
							<Switch checked={Boolean(published)} onChange={handleChangeInput} name='published' />
							<span className={`${published ? 'color-primary' : 'text-gray-400'} font-medium-custom my-auto`}>
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
								<Button onClick={handleCreateTag} className='w-full text-decor-none btn-site' variant='contained'>
									<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Create Blog Tag
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
								<Button onClick={handleEditTag} className='w-full text-decor-none btn-site' variant='contained'>
									<EditIcon fontSize='small' sx={{ mr: '5px' }} /> Update Blog Tag
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
					<AddIcon fontSize='small' sx={{ mr: '5px' }} /> Create Blog Tag
				</Button>
			)}
		</MuiModal>
	);
};

const ViewTagDetailsModal = ({ tag, session, allTags }) => {
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
					<Button className='text-decor-none btn-site' variant='contained'>
						<TagOutlinedIcon fontSize='small' sx={{ mr: '5px' }} /> {tag?.title}
					</Button>
					<Avatar src={session?.user?.avatar} alt={session?.user?.firstname} className={`mild-shadow`} />
				</div>
			}
			modalBody={
				<React.Fragment>
					<div className='flex p-2 items-center justify-center mt-3 flex-col'>
						{/* <RenderTitle title='Author' /> */}
						<div
							className='border border-zinc-300 mb-2 flex flex-col items-center justify-center rounded-[10px] p-2'
							style={{ width: '250px' }}>
							<Avatar
								src={tag?.author?.avatar}
								sx={{ width: '100px', height: '100px' }}
								alt={tag?.author?.firstname}
								className={`mild-shadow`}
							/>
							<div className='mt-2 fs-8 text-center'>{`${tag?.author?.lastname ? tag?.author?.lastname : ''} ${
								tag?.author?.firstname ? tag?.author?.firstname : ''
							} ${tag?.author?.secondname ? tag?.author?.secondname : ''}`}</div>
							<div className='mt-1 text-[12px] color-primary font-medium-custom text-center'>
								{tag?.author?.member_role === MEMBER_ROLES.MASTER && 'Master Admin'}
								{tag?.author?.member_role === MEMBER_ROLES.MANAGER && 'Manager Admin'}
							</div>
							<div className='mt-1 text-[12px] text-gray-400 text-center'>
								Created Tag On:
								<div className='rounded-[10px] w-full px-2'>
									<Moment format='LT'>{tag?.createdAt}</Moment> - <Moment format='ddd'>{tag?.createdAt}</Moment>,
									<span className='ms-1'>
										<Moment format='DD'>{tag?.createdAt}</Moment>/<Moment format='MM'>{tag?.createdAt}</Moment>/
										<Moment format='YY'>{tag?.createdAt}</Moment>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className='flex flex-col'>
						<RenderTitle title='Tag Title' />
						<div className='border-b border-zinc-300 w-full p-2'>{tag?.title}</div>
					</div>
					<div className='flex mt-3 flex-col'>
						<RenderTitle title='Description' />
						<div className='border-b border-zinc-300 w-full p-2'>{tag?.description}</div>
					</div>
					<div className='flex mt-3 flex-col'>
						<RenderTitle title='Status' />
						<div className='w-full ms-2'>
							<RenderTagStatuSChip tag={tag} />
						</div>
					</div>

					<div className='border-top border-zinc-300 pt-3 flex mt-3 flex-col'>
						<RenderTitle title='Last Updated' />
						<div className='w-full p-2'>
							<Moment format='LT'>{tag?.updatedAt}</Moment> - <Moment format='ddd'>{tag?.updatedAt}</Moment>,
							<span className='ms-1'>
								<Moment format='DD'>{tag?.updatedAt}</Moment>/<Moment format='MM'>{tag?.updatedAt}</Moment>/
								<Moment format='YY'>{tag?.updatedAt}</Moment>
							</span>
						</div>
					</div>

					<div className='w-full flex flex-wrap border-top border-b border-zinc-300 py-2 mt-3 flex-col'>
						<RenderTitle title='Visit Tag' />
						<Link href={`${APP_ROUTES.BLOGS_TAGS}#${tag?.slug}`} className='text-decor-none color-primary fs-7' target='_blank'>
							{`${APP_ROUTES.BLOGS_TAGS}#${tag?.slug}`}
							<OpenInNewIcon sx={{ ml: 0.5 }} className='fs-6 font-medium-custom' />
						</Link>
					</div>
					<div className='flex flex-col mt-3'>
						<RenderTitle title='Tag ID' />
						<div className='border-b border-zinc-300 w-full p-2'>{tag?.uniqueID}</div>
					</div>
					{tag?.blogs?.length === 0 && (
						<div className='flex flex-col mt-3'>
							<RenderTitle title='No Blogs Associated with this Tag' />
						</div>
					)}
					{tag?.blogs?.length > 0 && (
						<div className='flex flex-col mt-3'>
							<RenderTitle title='Blogs Associated with this Tag' />
							<div className='border-b border-zinc-300 w-full p-2'>
								{tag?.blogs?.map((blog, i) => (
									<BlogThumb
										key={i}
										blog={{
											...blog,
											tags: tag?.published
												? [
														// ** LET THIS TAG COME FIRST IN THE TAGS LIST
														...blog?.tags?.filter((index) => index?.title === tag?.title),
														...blog?.tags?.filter((index) => index?.title !== tag?.title),
												  ]
												: blog?.tags?.filter((index) => index?.title !== tag?.title),
										}}
										isAdminPanelView={true}
										isLast={i === tag?.blogs?.length - 1}
										isTagHidden={!tag?.published}
									/>
								))}
							</div>
						</div>
					)}
				</React.Fragment>
			}
			modalActions={
				<React.Fragment>
					<CreateTagFunctionality isEdit={true} allTags={allTags} session={session} tag={tag} />
					<Button onClick={() => setOpenModal(false)} className='text-decor-none ml-2' color='white' variant='contained'>
						<CancelIcon fontSize='small' sx={{ mr: '5px' }} /> Close
					</Button>
				</React.Fragment>
			}>
			<span className='cursor-pointer'>{tag?.title}</span>
		</MuiModal>
	);
};

const DeleteTagModal = ({ tag, session }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleDeleteTag = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await deleteDataAPI(`${API_ROUTES.MANAGE_BLOG_TAGS}?tag=${tag?.uniqueID}`, session?.token);
			if (res?.status === 200) {
				setIsSubmitting(false);
				dispatch({ type: GLOBALTYPES.TOAST, payload: { success: res?.data?.message } });
				setOpenModal(false);
				router.push(APP_ROUTES.MANAGE_BLOG_TAGS);
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
				<div className='w-full fs-6 font-medium-custom flex items-center justify-between'>
					<div>
						Delete <span className='color-primary'>{tag?.title}?</span>
					</div>
				</div>
			}
			modalBody={
				<div className='w-full text-center'>
					<div>Are you sure you want to delete this tag?</div>
					<div>It will be permanently deleted.</div>
				</div>
			}
			modalActions={
				<React.Fragment>
					{!isSubmitting && (
						<React.Fragment>
							<Button
								onClick={handleDeleteTag}
								className='w-full text-decor-none bg-red-600 text-white'
								color='danger'
								variant='contained'>
								<DeleteIcon fontSize='small' sx={{ mr: '5px' }} /> Delete
							</Button>
							<Button onClick={() => setOpenModal(false)} className='w-full btn-site text-decor-none' variant='contained'>
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

const ManageTags = ({ userAuth, tags, blogTagsPageSEOData }) => {
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
				return <ViewTagDetailsModal session={session} tag={params?.row} allTags={tags} />;
			},
		},
		{ field: 'blogCount', headerName: 'No. of Articles & Blogs', type: 'number', align: 'center', width: 200 },
		{
			field: 'published',
			headerName: 'Status',
			type: 'actions',
			width: 100,
			renderCell: (params) => {
				return <RenderTagStatuSChip tag={params?.row} />;
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
						<CreateTagFunctionality isEdit={true} allTags={tags} session={session} tag={params?.row} />
						<DeleteTagModal session={session} tag={params?.row} />
					</React.Fragment>
				);
			},
		},
		{
			field: 'slug',
			headerName: 'Tag Link',
			width: 100,
			align: 'center',
			renderCell: (params) => {
				return (
					<Link target='_blank' className='text-decor-none color-primary' href={`${APP_ROUTES.BLOGS_TAGS}#${params?.row?.slug}`}>
						Visit Tag
					</Link>
				);
			},
		},
	];

	const rows = tags?.map((tag, index) => {
		return {
			id: index + 1,
			uniqueID: tag?.uniqueID,
			title: tag?.title,
			blogCount: tag?.blogs?.length,
			blogs: tag?.blogs,
			updatedAt: tag?.updatedAt,
			createdAt: tag?.createdAt,
			slug: tag?.slug,
			published: tag?.published,
			description: tag?.description,
			author: tag?.author,
		};
	});

	return (
		<AdminLayout
			metatags={{ meta_title: `Manage Tags | ${SITE_DATA.OFFICIAL_NAME}` }}
			pageIcon={<TagOutlinedIcon sx={{ fontSize: 'inherit', my: 'auto', mr: 1 }} className='text-muted' />}
			pageTitle={'Manage Tags'}>
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
					<CreateTagFunctionality allTags={tags} session={session} />
				</div>
				<div className='mt-3'>
					<SetUpPageSEO
						fromPage={APP_ROUTES.MANAGE_BLOG_TAGS}
						pageSeoData={blogTagsPageSEOData}
						pageSlug={APP_ROUTES.BLOGS_TAGS}
						pageName={'Blog Tags'}
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

	// ** GET ALL BLOG TAGS
	const allTags = await AdminController.getAllBlogTags(req, res, true);

	// ** GET BLOG TAGS PAGE SEO DATA
	req.query = query;
	req.query.pageSlug = APP_ROUTES.BLOGS_TAGS;
	const blogTagsPageSEOData = await WebController.getPageSEO(req, res, true);
	return {
		props: {
			userAuth: verifyUserAuth?.user ? verifyUserAuth : {},
			tags: allTags?.length ? allTags : [],
			blogTagsPageSEOData: blogTagsPageSEOData,
		},
	};
}

export default ManageTags;
