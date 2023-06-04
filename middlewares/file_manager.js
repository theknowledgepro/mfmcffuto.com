/** @format */

const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

const uploadFileToCloudStorage = async ({ filePath, folder }) => {
	const options = {
		use_filename: false,
		unique_filename: true,
		overwrite: true,
		folder: folder,
	};

	const { fileUrl, filePublicId } = await new Promise((resolve, reject) => {
		cloudinary.v2.uploader
			.upload(filePath, options, function (error, result) {
				if (error) reject(error);
				resolve({ fileUrl: result?.url, filePublicId: result?.public_id });
			})
			.then()
			.catch((_err) => console.log({ _err, message: `Could not upload file, please try again later.` }));
	});

	return { fileUrl, filePublicId };
};

const deleteFileFromCloudStorage = async ({ publicId }) => {
	cloudinary.v2.uploader
		.destroy(publicId, function (error, result) {
			if (error) throw error;
			console.log(result);
		})
		.then((resp) => console.log(resp))
		.catch((_err) => console.log({ _err, message: `Could not delete file, please try again later.` }));
};

module.exports = {
	uploadFileToCloudStorage,
	deleteFileFromCloudStorage,
};
