/** @format */

import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { Button, Typography } from '@mui/material';
import Moment from 'react-moment';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import { FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import { EditAdminModal, ConfirmActionDialog } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { APP_ROUTES, LOADING, MEMBER_ROLES } from '@/config';
import { isLoading } from '@/utils/get_loading_state';
import { deleteAdmin } from '@/redux/actions/auth_action';
import { GLOBALTYPES } from '@/redux/types';

const AdminDataCard = ({ admin, adminsStore, setAdminsStore }) => {
	const { auth, loading: loadingStore } = useSelector((state) => state);
	const dispatch = useDispatch();
	const [expanded, setExpanded] = React.useState(false);
	const handleToggle = () => (event, isExpanded) => setExpanded(isExpanded ? true : false);

	const handleMouseOver = () => setExpanded(true);
	const handleMouseOut = () => setExpanded(false);

	const [closeDeleteAdminModal, setCloseDeleteAdminModal] = React.useState(false);
	const handleDeleteAdmin = async () => {
		if (admin?.url === auth?.user?.url) {
			setCloseDeleteAdminModal(!closeDeleteAdminModal);
			return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'You cannot delete your account!' } });
		}
		if (isLoading(LOADING.DELETE_ADMIN, loadingStore)) return;
		const res = await dispatch(deleteAdmin({ auth, adminUrl: admin?.url }));
		if (res?.status === 200) {
			setCloseDeleteAdminModal(!closeDeleteAdminModal);
			if (adminsStore && setAdminsStore) {
				const updatedAdminsStore = adminsStore.filter((index) => index?.url !== admin?.url);
				setAdminsStore(updatedAdminsStore);
			}
		}
	};
	return (
		<div className='col-md-3 p-2'>
			<Accordion expanded={expanded} onChange={handleToggle} onMouseOut={handleMouseOut} onMouseOver={handleMouseOver} sx={{ mb: 1 }}>
				<AccordionSummary aria-controls={`${admin.username}-content`} id={`${admin.username}-header`}>
					<div className='w-full flex flex-col items-center justify-center'>
						<img
							src={admin.avatar}
							className='w-full'
							style={{ height: '220px', borderRadius: '5px', border: '1px solid #eee' }}
							alt='Admin Profile Photo'
						/>
						<div className='mt-2 flex w-full font-semibold text-center text-sm color-primary'>
							{admin.member_role === MEMBER_ROLES.MASTER && 'Master Admin - Level 1'}
							{admin.member_role === MEMBER_ROLES.MANAGER && 'Manager Admin - Level 2'}
						</div>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Divider />
					<div className='w-full text-center font-semibold mt-2'>
						{admin.url === auth.user.url && 'You'}
						{admin.url !== auth.user.url && (
							<React.Fragment>
								{admin.lastname} {admin.firstname} {admin.secondname}
							</React.Fragment>
						)}
					</div>
					<div className='w-full text-center text-sm mt-2'>
						<Link href={`mailto:${admin.email}`} className='text-none color-primary'>
							{admin.email}
						</Link>
					</div>
					<div className='w-full text-center text-sm font-semibold mt-2'>
						<Link href={`tel:${admin.mobile}`} className='text-none color-primary'>
							{admin.mobile}
						</Link>
					</div>
					<Divider className='my-2' />
					<div className='w-full text-muted flex flex-col items-center justify-center'>
						<Typography className='text-info text-sm' sx={{ mr: 1 }}>
							Date Created:
						</Typography>
						<Typography className='text-sm' sx={{ mr: 2, color: '#0009' }}>
							<Moment format='ddd'>{admin.createdAt}</Moment> - <Moment format='LT'>{admin.createdAt}</Moment>
						</Typography>
						<Typography className='text-sm' sx={{ mr: 2, color: '#0009' }}>
							<Moment format='DD'>{admin.createdAt}</Moment>/<Moment format='MM'>{admin.createdAt}</Moment>/
							<Moment format='YY'>{admin.createdAt}</Moment>
						</Typography>
					</div>
					<Divider className='my-2' />
					<div className='w-full flex items-center justify-center flex-wrap'>
						<EditAdminModal adminUrl={admin.url} adminsStore={adminsStore} setAdminsStore={setAdminsStore}>
							<Button variant='outlined' color='info' className='mt-2 mx-2 text-decor-none py-2 text-blue-500'>
								<FaUserEdit style={{ fontSize: '19px' }} />
							</Button>
						</EditAdminModal>
						<ConfirmActionDialog
							closeModal={closeDeleteAdminModal}
							handleConfirm={handleDeleteAdmin}
							isLoading={isLoading(LOADING.DELETE_ADMIN, loadingStore)}
							content={{
								title:  <span className='font-semibold text-red-700 fs-7'>Delete Admin Account?</span>,
								body: (
									<div className='w-100 items-center flex flex-col justify-center px-0 fs-7'>
										<div>Are you sure you want to delete this admin account?</div> <br />
										<div>
											The account for{' '}
											<span className='font-semibold text-red-700 mr-2'>
												{admin.lastname} {admin.firstname} {admin.secondname}
											</span>
											will be deleted permanently and cannot be undone!
										</div>
									</div>
								),
								actionText: 'Delete Account?',
								actionIcon: <FaTrashAlt className='mr-2' />,
							}}>
							<Button variant='outlined' color='danger' className='mt-2 mx-2 text-decor-none py-2 text-red-500'>
								<FaTrashAlt style={{ fontSize: '19px' }} />
							</Button>
						</ConfirmActionDialog>
						<Link href={`${APP_ROUTES.ACTIVITY_LOGS}?user=${admin.url}`} className='text-none w-full color-primary'>
							<Button variant='outlined' className='mt-2 text-decor-none w-full'>
								<WebStoriesIcon className='mr-2' /> View Activity
							</Button>
						</Link>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default AdminDataCard;
