/** @format */

import React, { useState } from 'react';
import styles from '@/components/components.module.css';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import { Paper, Button, TextField } from '@mui/material';

const SubscribeToBlogNotificationForm = () => {
	const [email, setEmail] = useState('');
	const [subscriptionType, setSubscriptionType] = useState('');
	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setEmail(value);
	};

	const [errors, setErrors] = useState(false);
	const handleSubmit = () => {};

	return (
		<Paper className='w-100 p-3 my-3'>
			<div
				style={{ background: '#eee' }}
				className='position-relative p-2 rounded-1 w-100 h-100 d-flex flex-column align-content-center justify-content-center'>
				<div className={styles.subscribe_to_blog_notif_icon}>
					<NotificationsActiveTwoToneIcon />
				</div>
				<div className='pt-5 pb-3 fw-bold text-center'>Subscribe to Stay Updated!</div>
				<div className='pb-2 fs-8 text-secondary text-center'>Get Notified About New Updates Direct to Your Inbox!</div>
				<div className='w-100 px-2 pb-2'>
					<TextField
						onChange={handleChangeInput}
						defaultValue={email}
						color='primary'
						className='w-100 pt-1'
						name='email'
						label='Email Address'
						variant='standard'
						helperText={errors.email}
						error={errors.email ? true : false}
					/>
				</div>
				<Button
					onClick={handleSubmit}
					sx={{ height: '30px' }}
					className='btn-site text-white my-2 text-decor-none w-100 rounded-pill fs-6 btn-animated'>
					Subscribe!
				</Button>
				<div className='w-100 text-center text-secondary pt-1 fs-9'>Don't worry, we don't spam!</div>
			</div>
		</Paper>
	);
};

export default SubscribeToBlogNotificationForm;
