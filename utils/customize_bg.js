/** @format */

import React from "react";

export const CustomizeAppBackground = ({ color }) => {
	React.useEffect(() => {
		document.querySelector(':root').style.setProperty('--app-bg', color);
		return () => document.querySelector(':root').style.setProperty('--app-bg', 'var(--app-bg)');
	}, []);
};
