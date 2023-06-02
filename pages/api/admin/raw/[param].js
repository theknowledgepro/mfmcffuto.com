/** @format */

import { authenticate } from '@/middlewares/auth_middleware';
import RawReqController from './controller';
import useBodyParser from '@/middlewares/body_parser';

const RawRouter = async (incomingReqObj, incomingResObj) => {
	const { req, res } = await useBodyParser(incomingReqObj, incomingResObj);
	switch (req.query.param) {
		case 'create-admin':
			return authenticate(req, res, RawReqController.createAdmin);
		// case 'edit-admin':
		// 	return authenticate(req, res, RawReqController.editAdmin);
		// // ** SITE SETTINGS ROUTES
		// case 'update-site-settings':
		// 	return authenticate(req, res, RawReqController.updateSiteSettings);
		// case 'create-admin':
		// 	return RawReqController.createAdmin(req, res);
		default:
			break;
	}
};

export default RawRouter;

export const config = {
	api: { bodyParser: false },
};
