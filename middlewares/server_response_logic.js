/** @format */

const handleErrors = (res, err) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	const hideError = process.env.PROD_ENV === 'production';
	res.status(statusCode).json({
		message: false ? 'An error occured! Please contact Support.' : err.message,
		stack: false ? null : err.stack,
	});
	// ** TODO: SEND A MESSAGE TO THE DEVELOPER / ADMIN OF THE SERVER ERROR OF 500 (INTERNAL SERVER ERROR)
};

const responseLogic = ({ SSG, req, res, status, data, catchError }) => {
	if (catchError && SSG) return console.log({ SSG, status, data, catchError });

	if (catchError && !SSG) return handleErrors(res, catchError);

	if (SSG) return JSON.parse(JSON.stringify({ status, data }));

	if (!catchError && !SSG) return res.status(status).json({ ...data, status });
};

module.exports = responseLogic;
