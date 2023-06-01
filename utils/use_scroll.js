import { useEffect, useState } from "react";


export const LoadMoreDataAtWindowBottom = () => {
    const [loadMore, setLoadMore] = useState(false)
    const [scrollPos, setScrollPos] = useState('')

    useEffect(() => {
        const handleFunction = () => {
            if (window.scrollY + window.innerHeight + 1 >= document.documentElement.scrollHeight) {
                setLoadMore(true)
                setScrollPos(window.scrollY)
            } else {
                setLoadMore(false)
            };
        }

        window.addEventListener('scroll', handleFunction);
        return () => window.removeEventListener('scroll', handleFunction);
    }, [])

    return { loadMore, scrollPos };
}

export const SmoothScrollToPosition = ({ element, posititon, trigger }) => {
    useEffect(() => {
        window.scroll({ ...posititon, behavior: 'smooth' });
    }, [trigger ? trigger : null]);
}

export const HideShowNavbarOnScroll = ({ targetRef, className, startPosition }) => {
    useEffect(() => {
        var prevScrollpos = window.pageYOffset;
        const handleFunction = () => {
            if (!targetRef.current) return;
            if (window.scrollY === 0) targetRef.current.classList.remove(className)
            if (window.scrollY < startPosition) return;

            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                targetRef.current.classList.remove(className)
            } else {
                targetRef.current.classList.add(className)
            }
            prevScrollpos = currentScrollPos;
        }

        window.addEventListener('scroll', handleFunction);
        return () => window.removeEventListener('scroll', handleFunction);
    }, [targetRef, className])

}


export const ChangeClassNameAtPosition = ({ targetRef, position, className }) => {
    useEffect(() => {
        const handleFunction = () => {
            if (!targetRef.current) return;
            if (window.scrollY > position) {
                targetRef.current.classList.add(className)
            } else {
                targetRef.current.classList.remove(className)
            }
        }

        window.addEventListener('scroll', handleFunction);
        return () => window.removeEventListener('scroll', handleFunction);
    }, [targetRef, position])
}