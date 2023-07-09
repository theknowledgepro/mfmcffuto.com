/** @format */

import { toast as toastFunc } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoMdCheckmarkCircleOutline, IoMdInformationCircle } from 'react-icons/io';

const Toast = () => {
	const { toast } = useSelector((state) => state);

	const { title, success, info, error, warning, promise, loading, duration = 5000, position } = toast;

	useEffect(() => {
		const message = success || info || error || warning || loading;
		const messageString = Array.isArray(message) ? message.pop() : message;

		if (success)
			toastFunc.success(<span dangerouslySetInnerHTML={{ __html: messageString }}></span>, {
				icon: <IoMdCheckmarkCircleOutline fontSize='25px' className='text-green-500' />,
				id: 'success',
			});
		if (info)
			toastFunc.error(<span dangerouslySetInnerHTML={{ __html: messageString }}></span>, {
				icon: <IoMdInformationCircle fontSize='25px' className='text-blue-700' />,
				id: 'info',
			});
		if (error)
			toastFunc.error(<span dangerouslySetInnerHTML={{ __html: messageString }}></span>, {
				icon: <IoMdInformationCircle fontSize='25px' className='text-red-500' />,
				id: 'error',
			});
		if (warning)
			toastFunc.error(<span dangerouslySetInnerHTML={{ __html: messageString }}></span>, {
				icon: <IoMdInformationCircle fontSize='25px' className='text-yellow-500' />,
				id: 'warning',
			});
		if (loading) toastFunc.loading(<span dangerouslySetInnerHTML={{ __html: messageString }}></span>, { id: 'loading' });
		if (promise)
			toastFunc.promise(
				promise,
				{
					loading: 'Loading',
					success: (data) => `Successfully saved ${data.name}`,
					error: (err) => `This just happened: ${err.toString()}`,
				},
				{
					style: {
						minWidth: '250px',
					},
					success: {
						duration: 5000,
						icon: '🔥',
					},
				}
			);
	}, [toast, success, info, error, warning, promise, loading]);

	return <Toaster />;
};

export default Toast;
