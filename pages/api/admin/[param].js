/** @format */

import { authenticate } from '@/middlewares/auth_middleware';
import AdminController from './controller';

const AdminRouter = async (req, res) => {
	switch (req.query.param) {
		// ** MANAGE ADMIN ROUTES
		case 'get-all-admins':
			return authenticate(req, res, AdminController.getAllAdmins);
		case 'delete-admin':
			return authenticate(req, res, AdminController.deleteAdmin);
		// ** CONTACT FORM SUBMISSIONS ROUTES
		case 'get-contact-form-submissions':
			return authenticate(req, res, AdminController.getContactFormSubmissions);
		case 'mark-contact-form-read':
			return authenticate(req, res, AdminController.markContactFormAsRead);
		default:
			break;
	}
};

export default AdminRouter;
