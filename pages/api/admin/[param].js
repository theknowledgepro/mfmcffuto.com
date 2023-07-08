/** @format */

import { authenticate } from '@/middlewares/auth_middleware';
import AdminController from './controller';

const AdminRouter = async (req, res) => {
	switch (req.query.param) {
		// ** MANAGE ADMIN ROUTES
		case 'all-admins':
			return authenticate(req, res, AdminController.getAllAdmins);
		case 'delete-admin':
			return authenticate(req, res, AdminController.deleteAdmin);
		// ** MANAGE BLOG SETTINGS ROUTE
		case 'blog-settings':
			return authenticate(req, res, AdminController.updateBlogSettings);
		case 'blog-content':
			return authenticate(req, res, AdminController.getBlogBody);
		// ** MANAGE PAGE SEO ROUTES
		case 'seo-settings':
			return authenticate(req, res, AdminController.updateSEOSettings);
		// ** ACTIVITY LOGS ROUTES
		case 'activity-logs':
			return authenticate(req, res, AdminController.getAllActivityLogs);
		// ** CONTACT FORM SUBMISSIONS ROUTES
		case 'contact-form-submissions':
			return authenticate(req, res, AdminController.getContactFormSubmissions);
		case 'mark-contact-form-read':
			return authenticate(req, res, AdminController.markContactFormAsRead);
		default:
			break;
	}
};

export default AdminRouter;
