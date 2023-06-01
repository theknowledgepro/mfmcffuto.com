/** @format */

import { toast as toastFunc } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import comp_styles from './components.module.css';
import { GLOBALTYPES } from '@/redux/types';
import { IoMdCheckmarkCircleOutline, IoMdInformationCircle } from 'react-icons/io';

const Toast = () => {
	const { toast } = useSelector((state) => state);
	const dispatch = useDispatch();

	const { title, success, info, error, warning, duration, position, icon } = toast;

	const handleClose = ({ toastId }) => {
		toastFunc.remove(toastId);
		dispatch({ type: GLOBALTYPES.TOAST, payload: {} });
	};

	const customToast = ({ toastId }) =>
		toastFunc.custom(
			(t) => (
				<div
					id='TOAST_BOX'
					className={`${comp_styles.toast} ${t.visible ? 'animate-enter' : 'animate-leave'} ${success && comp_styles.toast_success} ${
						info && comp_styles.toast_info
					} ${error && comp_styles.toast_error} ${warning && comp_styles.toast_warning}`}>
					<div className='flex'>
						<div className='mr-1'>
							{success && <IoMdCheckmarkCircleOutline fontSize='25px' color='#fff' />}
							{info && <IoMdInformationCircle fontSize='25px' color='#fff' />}
							{warning && <IoMdInformationCircle fontSize='25px' color='#fff' />}
							{error && <IoMdInformationCircle fontSize='25px' color='#fff' />}
						</div>
						<div className={`w-100 ${comp_styles.toast_body}`}>
							{title && success && <span className='text-bold'>{title.length ? title : 'Success!'}</span>}
							{title && info && <span className='text-bold'>{title.length ? title : 'Info!'}</span>}
							{title && error && <span className='text-bold'>{title.length ? title : 'Error!'}</span>}
							{title && warning && <span className='text-bold'>{title.length ? title : 'Warning!'}</span>}
							<span
								style={{
									lineHeight: '1.2rem',
									display: 'flex',
									flexWrap: 'wrap',
								}}
								dangerouslySetInnerHTML={{
									__html: (success && success) || (info && info) || (error && error) || (warning && warning),
								}}></span>
						</div>
					</div>
					<IconButton sx={{ cursor: 'pointer', color: '#fff' }} onClick={() => handleClose(toastId)}>
						<CloseIcon fontSize='small' />
					</IconButton>
				</div>
			),
			{
				duration: duration ? duration : 8000,
				position: position ? position : 'top-right',
				icon: icon,
				id: toastId,
			}
		);

	const [state, setState] = useState(null);
	useEffect(() => {
		if (success || info || error || warning) {
			if (state?.toastId) handleClose(state.toastId);

			customToast({
				toastId: (success && success) || (info && info) || (error && error) || (warning && warning),
			});
			setState({
				toastId: (success && success) || (info && info) || (error && error) || (warning && warning),
			});
		}

		const timer = setTimeout(
			() => {
				handleClose({
					toastId: (success && success) || (info && info) || (error && error) || (warning && warning),
				});
				setState(null);
			},
			duration ? duration : 8000
		);

		return () => {
			clearTimeout(timer);
			setState(null);
		};
	}, [toast, success, info, error, warning, duration, dispatch]);

	return <Toaster />;
};

export default Toast;
