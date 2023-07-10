/** @format */

import React, { useEffect, useRef, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { GLOBALTYPES } from '@/redux/types';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { pageview } from '@/utils/google_analytics';

const RouteChangeLinearProgress = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [progress, setProgress] = useState(0);
	const [buffer, setBuffer] = useState(10);

	const progressRef = useRef(() => {});
	useEffect(() => {
		progressRef.current = () => {
			if (progress > 100) {
				setProgress(0);
				setBuffer(10);
			} else {
				const diff = Math.random() * 10;
				const diff2 = Math.random() * 10;
				setProgress(progress + diff);
				setBuffer(progress + diff + diff2);
			}
		};
	});
	useEffect(() => {
		const timer = setInterval(() => progressRef.current(), 500);
		return () => clearInterval(timer);
	}, []);

	// ** PAGE TRANSITION LOADER
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const handleRouteChange = (url, { shallow }) => {
			setLoading(true);
			dispatch({ type: GLOBALTYPES.RESETLOADING, payload: null });
			console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`);
		};
		const handleRouteChangeComplete = (url) => {
			pageview(url, document.title);
			setLoading(false);
		};
		const handleRouteChangeError = (err, url) => {
			if (err.cancelled) {
				console.log(`Route to ${url} was cancelled!`);
			}
		};

		router.events.on('routeChangeStart', handleRouteChange);
		router.events.on('routeChangeComplete', handleRouteChangeComplete);
		router.events.on('routeChangeError', handleRouteChangeError);
		return () => {
			router.events.off('routeChangeStart', handleRouteChange);
			router.events.off('routeChangeComplete', handleRouteChangeComplete);
			router.events.off('routeChangeError', handleRouteChangeError);
		};
	}, [router]);

	if (loading)
		return (
			<LinearProgress
				sx={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100vw', zIndex: '5000' }}
				color='primary'
				variant='buffer'
				value={progress}
				valueBuffer={buffer}
			/>
		);
};

export default RouteChangeLinearProgress;
