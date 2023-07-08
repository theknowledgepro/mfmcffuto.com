/** @format */

import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import PropTypes from 'prop-types';
import { ContextProvider } from '../context';
import { Provider } from 'react-redux';
import { wrapper } from '../redux/store';
import PersistLayout from './_persist_layout';
import { SITE_DATA } from '@/config';
import '@/styles/index.css';

export const createEmotionCache = () => {
	return createCache({ key: 'css', prepend: true });
};

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme({
	typography: { fontFamily: ['YsabeauInfant'].join(',') },
	palette: {
		primary: { main: SITE_DATA.THEME_COLOR },
		danger: { main: '#dc3545' },
		info: { main: '#0495c7' },
		white: { main: '#fff' },
	},
});

function App({ Component, ...rest }) {
	const { store, props } = wrapper.useWrappedStore(rest);
	const { emotionCache = clientSideEmotionCache, pageProps } = props;
	return (
		<Provider store={store}>
			<ContextProvider>
				<CacheProvider value={emotionCache}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<PersistLayout>
							<Component {...pageProps} />
						</PersistLayout>
					</ThemeProvider>
				</CacheProvider>
			</ContextProvider>
		</Provider>
	);
}

App.propTypes = {
	Component: PropTypes.elementType.isRequired,
	emotionCache: PropTypes.object,
	pageProps: PropTypes.object.isRequired,
};

export default App;
