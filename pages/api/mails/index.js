/** @format */

const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const priorityHeader = {
	high: {
		'x-priority': '1',
		'x-msmail-priority': 'High',
		importance: 'high',
	},
	normal: {
		'x-priority': '3',
		'x-msmail-priority': 'Normal',
		importance: 'normal',
	},
	low: {
		'x-priority': '5',
		'x-msmail-priority': 'Low',
		importance: 'low',
	},
};

const mailHandler = async ({ from, to, subject, replacements, htmlTemplate, attachments, headers }) => {
	const smtpTransport = nodemailer.createTransport({
		host: process.env.AWS_SMTP_HOST,
		port: parseInt(process.env.AWS_SMTP_PORT ?? '587', 10),
		auth: {
			user: process.env.AWS_SMTP_USERNAME,
			pass: process.env.AWS_SMTP_PASSWORD,
		},
	});

	const rootDir = path.join(process.cwd());
	const source = await fs.readFile(rootDir + `/pages/api/mails/${htmlTemplate}`, 'utf8', (err, data) => {
		if (err) throw err;
		return data;
	});
	const template = handlebars.compile(source);
	const htmlToSend = template(replacements);
	const mailOptions = {
		from,
		to,
		subject,
		html: htmlToSend,
		attachments,
		headers: headers ?? priorityHeader.normal,
	};
	return await smtpTransport.sendMail(mailOptions);
};

/** REQUEST OTP  */
const requestPasswordResetOTPEmail = ({ email, OTP, expiresIn }) => {
	return mailHandler({
		from: {
			name: 'Backend Locals',
			address: 'no-reply@officehotspot.com',
		},
		to: ['promisedera@officehotspot.com'],
		subject: 'Password Reset OTP',
		replacements: { email, OTP, expiresIn },
		htmlTemplate: 'request_password_reset_otp.handlebars',
	});
};

const welcomeEmail = ({ email }) => {
	return mailHandler({
		from: ADMIN_EMAIL,
		to: email,
		subject: 'Welcome on Board! @' + SITE_NAME,
		htmlTemplate: './welcome_on_register.handlebars',
	});
};

const passwordReset = ({ email, url }) => {
	return mailHandler({
		from: ADMIN_EMAIL,
		to: email,
		subject: 'Password Reset | ' + SITE_NAME,
		replacements: { url },
		htmlTemplate: './reset_password.handlebars',
	});
};

module.exports = { requestPasswordResetOTPEmail, welcomeEmail, passwordReset };
