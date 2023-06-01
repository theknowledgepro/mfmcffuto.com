/** @format */

import AuthController from './controller';

const AuthRouter = async (req, res) => {
	switch (req.query.param) {
		case 'login':
			return AuthController.login(req, res);
		case 'logout':
			return AuthController.logout(req, res);
		case 'request-password-reset-token':
			return AuthController.requestPasswordResetToken(req, res);
		case 'verify-password-reset-token':
			return AuthController.verifyPasswordResetToken(req, res);
		case 'reset-account-password':
			return AuthController.resetAccountPassword(req, res);
		default:
			break;
	}
};

export default AuthRouter;
