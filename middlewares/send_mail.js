/** @format */

const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { SITE_DATA } = require('@/config');

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
	const { source } = await new Promise((resolve, reject) => {
		fs.readFile(rootDir + `/pages/api/mails/${htmlTemplate}`, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve({ source: data });
		});
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

/** REQUEST PASSWORD RESET OTP  */
const requestPasswordResetOTPEmail = ({ email, OTP, expiresIn }) => {
	return mailHandler({
		from: {
			name: SITE_DATA.NAME,
			address: `support${SITE_DATA.BUSINESS_EMAIL_HANDLE}`,
		},
		to: [email],
		subject: 'Password Reset OTP',
		replacements: { email, OTP, expiresIn },
		htmlTemplate: 'request_password_reset_otp.handlebars',
	});
};

module.exports = { requestPasswordResetOTPEmail };
