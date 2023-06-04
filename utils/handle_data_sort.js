/** @format */
import { useEffect, useState } from 'react';
import { handleClientAPIRequestErrors } from './errors';
import { getDataAPI } from './api_client_side';

const handleDataSort = ({ userAuth, dispatch, defaultSelectOption, setDataStore, setSortArgs, fetchUrl, queryParam }) => {
	const [sort, setSort] = useState(null);
	const [sortSelect, setSortSelect] = useState(defaultSelectOption);
	const [sortLoading, setSortLoading] = useState(false);
	const [sortLoadingError, setSortLoadingError] = useState(false);

	const handleSort = (event) => {
		setSortSelect(event.target.value);
		setSort(setSortArgs(event));
	};

	const fetchSorted = async () => {
		if (sortLoading) return;
		setSortLoadingError(false);
		setSortLoading(true);
		try {
			const res = await getDataAPI(`${fetchUrl}?${sort !== undefined && sort !== null && `${queryParam}=${sort}`}`, userAuth.access_token);
			if (res?.data?.status === 200) setDataStore([...res.data.results]);
			setSortLoading(false);
		} catch (err) {
			setSortLoading(false);
			setSortLoadingError(true);
			handleClientAPIRequestErrors({ err, dispatch });
		}
	};

	useEffect(() => {
		// ** THIS WILL BE TRIGGERED NOT WHEN PAGE MOUNTS BUT ONLY WHEN THE SELECT IS TOGGLED
		if (sort !== null) fetchSorted();
	}, [sort]);

	return { sortSelect, handleSort, sortLoading, sortLoadingError };
};

export default handleDataSort;
