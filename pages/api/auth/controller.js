/** @format */

const { default: connectDB, ACTIVITY_TYPES } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('@/models/user_model');
const { createAccessToken, createRefreshToken, ExpiresIn } = require('@/middlewares/create_jwt_token');
const activityLog = require('@/middlewares/activity_log');
const { APP_ROUTES, SITE_DATA } = require('@/config');
const { requestPasswordResetOTPEmail } = require('../mails');
const randomNumberGenerator = (length) => {
	let numbers = '';
	for (var i = 0; i < length; i++) {
		numbers += Math.floor(Math.random() * length + 1);
	}
	return numbers;
};

const AuthController = {
	login: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const { username, password } = req.body;
			const user = await Users.findOne({ username });
			if (!user) return responseLogic({ req, res, status: 400, data: { message: 'This Username does not exist!' } });

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) return responseLogic({ req, res, status: 400, data: { message: 'The Password you entered is incorrect!' } });

			// ** RECORD IN ACTIVITY_LOG DATABASE
			await Users.findByIdAndUpdate(user._id, { last_login: Date.now() });
			await activityLog({ deed: ACTIVITY_TYPES.LOGIN.title, details: `${ACTIVITY_TYPES.LOGIN.desc}`, user_id: user._id });

			const access_token = createAccessToken(user);
			const refresh_token = createRefreshToken(user);

			res.setHeader(
				'Set-Cookie',
				`refreshtoken=${refresh_token}; HttpOnly; Path=/; MaxAge=${ExpiresIn.RefreshToken.milliseconds}; Secure=${
					process.env.PROD_ENV === 'production'
				}`
			);

			return responseLogic({ req, res, status: 200, data: { message: 'Login Success!', access_token, user } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	logout: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			const handleLogOut = () => {
				res.setHeader(
					'Set-Cookie',
					`refreshtoken=; HttpOnly; Path=/; MaxAge=${ExpiresIn.RefreshToken.milliseconds}; Secure=${process.env.PROD_ENV === 'production'}`
				);
				return responseLogic({ req, res, status: 200, data: { message: 'Signed Out Successfully' } });
			};

			const rf_token = req.cookies?.refreshtoken;

			if (!rf_token) {
				handleLogOut();
			} else {
				// ** RECORD ACTION IN USER ACTIVITY_LOGS
				return jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
					if (err) handleLogOut();

					const user = await Users.findById(result._id);
					if (!user) handleLogOut();

					await activityLog({ deed: ACTIVITY_TYPES.LOGOUT.title, details: `${ACTIVITY_TYPES.LOGOUT.desc}`, user_id: user?._id });
					return handleLogOut();
				});
			}
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	generateAccessToken: async (req, res) => {
		try {
			await connectDB();
			const redirectObject = {
				redirect: { destination: `${APP_ROUTES.LOGIN}?redirectUrl=${req.url}`, permanent: false },
			};

			const rf_token = req.cookies?.refreshtoken;
			if (!rf_token) return redirectObject;

			return jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
				if (err) return redirectObject;
				const user = await Users.findById(result._id);

				if (!user) return redirectObject;

				const access_token = createAccessToken(result);
				return JSON.parse(JSON.stringify({ access_token, user: user }));
			});
		} catch (err) {
			return redirectObject;
		}
	},
	requestPasswordResetToken: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();

			const { email } = req.body;

			const user = await Users.findOne({ email });
			if (!user) return responseLogic({ req, res, status: 400, data: { message: 'This email does not exist in our records!' } });

			// ** GENERATE OTP AND SEND EMAIL TO USER
			const OTP = randomNumberGenerator(4);
			await requestPasswordResetOTPEmail({ email, OTP, expiresIn: ExpiresIn.PasswordResetToken.string });

			// ** SAVE A SIGNED OTP TO DB FOR VERIFICATION LATER ...
			// ** I USED JWT SO AS TO HAVE A TIME LIMIT FOR EACH OTP...
			const otp_secret = await jwt.sign({ OTP }, process.env.RESET_PASSWORD_TOKEN_SECRET, { expiresIn: ExpiresIn.PasswordResetToken.jwtValue });
			await Users.findByIdAndUpdate(user?._id, { otp_secret });

			return responseLogic({ req, res, status: 200, data: { message: "We've sent an OTP to your email address!" } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	verifyPasswordResetToken: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			const { email, OTPValue } = req.body;

			const user = await Users.findOne({ email });
			if (!user) return responseLogic({ req, res, status: 400, data: { message: 'This email does not exist in our records!' } });
			const otp_secret = user?.otp_secret;

			const { result } = await new Promise((resolve, reject) => {
				return jwt.verify(otp_secret, process.env.RESET_PASSWORD_TOKEN_SECRET, async (err, result) => {
					if (err) reject(new Error('The OTP you entered is expired!')); // ** THE ONLY POSSIBLE ERROR WILL BE THAT OF EXPIRY SINCE OTP_SECRET WAS FETCHED FROM DB...
					if (result?.OTP !== OTPValue) reject(new Error('The value you entered is incorrect!'));
					resolve({ result });
				});
			});

			return responseLogic({ req, res, status: 200, data: { message: 'Your OTP was verified succesfully!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
	resetAccountPassword: async (req, res) => {
		try {
			if (req.method !== 'POST') return responseLogic({ req, res, status: 404, data: { message: 'This route does not exist!' } });
			await connectDB();
			const { email, OTPValue, password, confirmPassword } = req.body;
			if (password !== confirmPassword)
				return responseLogic({ req, res, status: 400, data: { message: 'Password and Confirm Password do not match!' } });

			const passwordHash = await bcrypt.hash(password, 12);
			await Users.findOneAndUpdate({ email }, { passwordHash, otp_secret: null });

			return responseLogic({ req, res, status: 200, data: { message: 'Password reset succesfully!' } });
		} catch (err) {
			return responseLogic({ res, catchError: err });
		}
	},
};

module.exports = AuthController;
