/** @format */

import { GLOBALTYPES } from '@/redux/types';
import { validate } from './validate';

export const singleFileUpload = ({ event, accept, setFile, setPreviewStore, isSubmitting, dispatch }) => {
	const reader = new FileReader();
	const file = event.target.files[0];
	if (!file) return;
	const fileType = file.type.split('/')[1];

	if (isSubmitting)
		return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'Unable to upload file! 🥴<br/>Submission in progress...', title: false } });
	if (validate.file({ fileType, types: accept }).errMsg)
		return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: 'File format is Incorrect!' } });

	reader.onload = (upload) => {
		setPreviewStore((previousState) => {
			return [upload.target.result];
		});
	};
	reader.readAsDataURL(file);
	setFile(file);
};

export const multipleFileUpload = ({ event, accept = [], reject = [], setFiles, setPreviewStore, isSubmitting, dispatch }) => {
	const files = [...event.target.files];
	let err = '';
	let collection = [];
	if (!files) return;

	if (isSubmitting)
		return dispatch({
			type: GLOBALTYPES.TOAST,
			payload: { info: `Unable to upload file${files.length > 1 ? 's' : ''}! 🥴<br/>Submission in progress...`, title: false },
		});

	files.forEach((file) => {
		const fileType = file.type.split('/')[1];

		if (!file) return (err = 'No Files Selected!');
		if (reject?.length === 0 && validate.file({ fileType, types: accept }).errMsg) return (err = 'File format is incorrect!');
		if (reject?.length > 0 && validate.file({ fileType, types: reject, reject: true }).errMsg) return (err = 'File format is not accepted!');

		collection.push(file);

		let reader = new FileReader();
		reader.onload = (upload) => {
			setPreviewStore((pre) => {
				return [...pre, upload.target.result];
			});
		};
		reader.readAsDataURL(file);
	});

	if (err) return dispatch({ type: GLOBALTYPES.TOAST, payload: { info: err } });

	setFiles((previousState) => {
		return [...previousState, ...collection];
	});
};

export const deleteFile = ({ i, files, previewStore, setFiles, setPreviewStore }) => {
	const collection = [...files];
	const previews = [...previewStore];

	collection.splice(i, 1);
	previews.splice(i, 1);

	setFiles(collection);
	setPreviewStore(previews);
};
