/** @format */

export const IS_SERVER = typeof window === 'undefined';
export function getProtocol() {
	const isProd = process.env.NEXT_PUBLIC_PUB === 'production';
	if (isProd) return 'https://';
	return 'http://';
}

export function getAbsoluteUrl() {
	if (!IS_SERVER) return window.location.href;
	return undefined;
}
