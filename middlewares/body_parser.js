/** @format */

const formidable = require('formidable');

const useBodyParser = async (req, res) => {
	const form = formidable({ multiples: true });
	const { fields, files } = await new Promise((resolve, reject) => {
		form.parse(req, async (err, fields, files) => {
			if (!fields) return resolve({});
			if (err) reject(err);
			resolve({ fields, files });
		});
	});

	req.body = fields;
	req.files = files;
	return { req, res };
};
module.exports = useBodyParser;
