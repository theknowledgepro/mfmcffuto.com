/** @format */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_S3_REGION,
});

// const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
const fileHostName = 'https://dvlye389i9odw.cloudfront.net/';

const uploadFile = async ({ file, S3Folder, fileKeyNameToReplace, appendFileExtensionToFileKeyName }) => {
	if (!file) return {};
	const fileSize = file?.size;
	const filePath = file.filepath;
	const mimeType = file?.mimetype;
	const fileExt = path.extname(file.originalFilename.toLowerCase());

	const fileKeyName = fileKeyNameToReplace
		? fileKeyNameToReplace
		: `${S3Folder ? `${S3Folder}/` : ''}${Date.now().toString()}${appendFileExtensionToFileKeyName ? fileExt : ''}`;
	console.log({ fileKeyName });

	const { fileData } = await new Promise((resolve, reject) => {
		const fileStream = fs.createReadStream(filePath);
		s3.upload(
			{
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: fileKeyName.trim(),
				ContentType: mimeType,
				Body: fileStream,
			},
			(s3Err, s3Data) => {
				if (s3Err) throw s3Err;
				fs.unlink(filePath, function (unlinkErr) {
					if (unlinkErr) if (unlinkErr) throw unlinkErr;
				});
				console.log(`File uploaded successfully at ${s3Data?.Location}`);
				resolve({ fileData: s3Data });
			}
		);
	});

	return { fileData };
};

const deleteFile = async ({ keyName }) => {
	const isDeleted = await new Promise((resolve, reject) => {
		s3.deleteObject(
			{
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: keyName,
			},
			(err, data) => {
				if (err) throw err;
				console.log('File deleted successfully!');
				resolve(true);
			}
		);
	});
	return isDeleted;
};

module.exports = { uploadFile, deleteFile, fileHostName };

// ** UPLOAD CATEGORY THUMBNAIL BY REWRITING TO THE EXISTING FILE IN STORAGE
// await uploadFile({ file: req?.files?.thumbnail, fileKeyNameToReplace: updatedCategoryData?.thumbnail }).catch((err) => {
// 	throw err;
// });

// ** DELETE CATEGORY FILE FROM CLOUD STORAGE
// await deleteFile({ keyName: categoryData?.thumbnail }).catch((err) => {
// 	throw err;
// });
