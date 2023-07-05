/** @format */

import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import UseMediaQuery from '@/utils/use_media_query';

const MuiModal = ({
	children,
	openModal,
	setOpenModal,
	modalSize,
	disableDefaultFullScreen,
	fullScreen,
	closeOnOverlayClick,
	modalTitle,
	modalBody,
	modalActions,
}) => {
	const { isMatchWidth } = UseMediaQuery({ vw: '500px' });
	const [Open, setOpen] = React.useState(false);
	const handleOpen = () => {
		setOpenModal && setOpenModal(true);
		setOpen(true);
	};
	const handleClose = (event, reason) => {
		// console.log({ event, reason });
		if (reason && reason == 'backdropClick' && !closeOnOverlayClick) return;
		setOpenModal && setOpenModal(false);
		setOpen(false);
	};

	React.useEffect(() => {
		if (openModal) handleOpen();
		if (!openModal) handleClose();
	}, [openModal]);

	return (
		<React.Fragment>
			{children && <span onClick={handleOpen}>{children}</span>}
			<Dialog
				fullScreen={fullScreen ? fullScreen : disableDefaultFullScreen ? false : isMatchWidth}
				maxWidth={modalSize ? modalSize : 'sm'}
				fullWidth
				open={Open}
				onClose={handleClose}>
				<DialogTitle className='d-flex align-items-center justify-content-start w-100'>{modalTitle}</DialogTitle>

				<DialogContent className={`w-100 ${isMatchWidth ? 'px-2' : 'px-4'} overflow-x-hidden`} dividers>
					{modalBody}
				</DialogContent>

				{modalActions && <DialogActions className='w-100 d-flex justify-content-between align-items-center'>{modalActions}</DialogActions>}
			</Dialog>
		</React.Fragment>
	);
};

export default MuiModal;
