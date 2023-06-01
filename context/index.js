import React, { createContext, useContext, useState } from 'react';
const AppContext = createContext();

export const ContextProvider = ({ children }) => {

	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isSideNavExpand, setIsSideNavExpand] = useState(true);
	const [isBreakpointMd, setIsBreakpointMd] = useState(undefined);

    return (
		<AppContext.Provider 
			value={{
				isFullScreen, setIsFullScreen,
				isSideNavExpand, setIsSideNavExpand,
				isBreakpointMd, setIsBreakpointMd
			}}>
			{children}
		</AppContext.Provider>
  	)
};

export const useAppContext = () => {
    return useContext(AppContext);
}

export default ContextProvider;