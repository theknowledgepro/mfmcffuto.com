/** @format */

import React, { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { IoMdInformationCircle } from 'react-icons/io';
import CircularProgress from '@mui/material/CircularProgress';

const CreateAdminModal = ({
	openModal,
	setOpenModal,
	closeModal,
	children,
	handleConfirm,
	isLoading,
	content = { title: '', body: '', actionText: '', actionIcon: '' },
}) => {
	const [Open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpenModal && setOpenModal(false);
		setOpen(false);
	};

	useEffect(() => {
		if (openModal) handleOpen();
		if (!openModal || closeModal) handleClose();
	}, [openModal, closeModal]);

	return (
		<React.Fragment>
			{children && <span onClick={handleOpen}>{children}</span>}
			<Dialog open={Open} onClose={handleClose}>
				<DialogTitle className='flex items-center justify-left w-full'>
					<IoMdInformationCircle fontSize='25px' color='#0009' />
					<span className='text-base ml-2'>{content.title}</span>
				</DialogTitle>

				<DialogContent className='w-full text-center row' dividers>
					{content.body}
				</DialogContent>

				<DialogActions className='w-full flex justify-between items-center'>
					<Button onClick={handleConfirm} className='w-full bg-red-500 text-white mr-2 text-decor-none' variant='contained'>
						{!isLoading && (
							<React.Fragment>
								{content.actionIcon} {content.actionText}
							</React.Fragment>
						)}
						{isLoading && <CircularProgress style={{ color: 'white', height: '20px', width: '20px', marginRight: '5px' }} />}
					</Button>

					{!isLoading && (
						<Button onClick={handleClose} className='ml-2 text-decor-none'>
							Cancel
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};

export default CreateAdminModal;
