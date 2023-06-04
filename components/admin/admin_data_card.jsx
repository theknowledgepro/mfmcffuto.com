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
import { FaUserEdit } from 'react-icons/fa';
import { EditAdminModal } from '..';
import { useSelector } from 'react-redux';
import { APP_ROUTES, MEMBER_ROLES } from '@/config';

const AdminDataCard = ({ admin }) => {
	const { auth } = useSelector((state) => state);
	const [expanded, setExpanded] = React.useState(false);
	const handleToggle = () => (event, isExpanded) => setExpanded(isExpanded ? true : false);

	const handleMouseOver = () => setExpanded(true);
	const handleMouseOut = () => setExpanded(false);

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
						{admin._id === auth.user._id && 'You'}
						{admin._id !== auth.user._id && (
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
						<Typography className='text-info text-sm' sx={{ fontWeight: 500, mr: 1 }}>
							Date Created:
						</Typography>
						<Typography className='text-sm' sx={{ fontWeight: 500, mr: 2, color: '#0009' }}>
							<Moment format='ddd'>{admin.createdAt}</Moment> - <Moment format='LT'>{admin.createdAt}</Moment>
						</Typography>
						<Typography className='text-sm' sx={{ fontWeight: 500, mr: 2, color: '#0009' }}>
							<Moment format='DD'>{admin.createdAt}</Moment>/<Moment format='MM'>{admin.createdAt}</Moment>/
							<Moment format='YY'>{admin.createdAt}</Moment>
						</Typography>
					</div>
					<Divider className='my-2' />
					<div className='w-full flex items-center justify-between'>
						<EditAdminModal admin={admin}>
							<Button variant='outlined' className='mr-2 text-decor-none py-2'>
								<FaUserEdit style={{ fontSize: '20px' }} />
							</Button>
						</EditAdminModal>
						<Link href={`${APP_ROUTES.ACTIVITY_LOGS}?user=${admin.url}`} className='text-none color-primary'>
							<Button variant='outlined' className='text-decor-none w-full'>
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
