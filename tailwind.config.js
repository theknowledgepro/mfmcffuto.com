/**
 * @format
 * @type {import('tailwindcss').Config}
 */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			screens: {
				xss: '200px',
				xs: '320px',
				base: '475px',
				...defaultTheme.screens,
			},
		},
	},
	plugins: [],
};
