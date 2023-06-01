import { useState, useEffect } from 'react'

const UseMediaQuery = ({ vw, vh }) => {
    const [isMatchWidth, setIsMatchWidth] = useState(undefined)
    const [isMatchHeight, setIsMatchHeight] = useState(undefined)

    useEffect(() => {

        let customWidthMQ = vw ? window.matchMedia(`(max-width:${vw})`) : false;
        let customHeightMQ = vh ? window.matchMedia(`(max-width:${vh})`) : false;
        const handleMediaQuery = () => {
            (vw && customWidthMQ.matches) ? setIsMatchWidth(true) : setIsMatchWidth(false);
            (vh && customHeightMQ.matches) ? setIsMatchHeight(true) : setIsMatchHeight(false);
        }

        vw && customWidthMQ.addEventListener('change', handleMediaQuery)
        vh && customHeightMQ.addEventListener('change', handleMediaQuery)
        handleMediaQuery()
        
        return () => {
            vw && customWidthMQ.removeEventListener('change', handleMediaQuery);
            vh && customHeightMQ.removeEventListener('change', handleMediaQuery)
        }
    }, [])

    return { isMatchWidth, isMatchHeight }
}

export default UseMediaQuery
