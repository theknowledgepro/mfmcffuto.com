/** @format */

const { default: connectDB, ACTIVITY_TYPES } = require('@/middlewares/db_config');
const responseLogic = require('@/middlewares/server_response_logic');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('@/models/user_model');
const { createAccessToken, createRefreshToken, ExpiresIn } = require('@/middlewares/create_jwt_token');
const activityLog = require('@/middlewares/activity_log');
const { APP_ROUTES, SITE_DATA } = require('@/config');

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
				redirect: { destination: APP_ROUTES.LOGIN, permanent: false },
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
	requestPasswordResetToken: () => {
		res.status(200).json({ name: 'John Doe' });
	},
	verifyPasswordResetToken: () => {
		res.status(200).json({ name: 'John Doe' });
	},
	resetAccountPassword: () => {
		res.status(200).json({ name: 'John Doe' });
	},
};

module.exports = AuthController;
