/** @format */

import { authenticate } from '@/middlewares/auth_middleware';
import RawReqController from './controller';
import useBodyParser from '@/middlewares/body_parser';

const RawRouter = async (incomingReqObj, incomingResObj) => {
	const { req, res } = await useBodyParser(incomingReqObj, incomingResObj);
	switch (req.query.param) {
		// ** MANAGE ADMINS ROUTES
		case 'create-admin':
			return authenticate(req, res, RawReqController.createAdmin);
		case 'edit-admin':
			return authenticate(req, res, RawReqController.editAdmin);
		// ** BLOGS ACTIONS ROUTES
		case 'blogtag':
			return authenticate(req, res, RawReqController.manageBlogTags);
		case 'blogcategory':
			return authenticate(req, res, RawReqController.manageBlogCategories);
		case 'blog':
			return authenticate(req, res, RawReqController.manageBlogs);
		case 'blogauthors':
			return authenticate(req, res, RawReqController.manageBlogAuthors);

		// ** WORSHIP DAYS ACTION ROUTES
		case 'worshipevent':
			return authenticate(req, res, RawReqController.manageWorshipEvent);

		// **PAGE CUSTOMIZATION SETTINGS ACTION ROUTES
		case 'pagesettings':
			return authenticate(req, res, RawReqController.updatePageSettings);
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
