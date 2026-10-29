import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Route change hole (Navbar er jekono link click korle) page ta auto upore chole jabe.
 * Ei component ta Router er vitore, layout e ekbar boshate hobe.
 */
const ScrollToTop = () => {
    const { pathname, search, hash } = useLocation();

    useEffect(() => {
        // #section link hole oi section e jete dibe, upore jabe na
        if (hash) return;

        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [pathname, search, hash]);

    return null;
};

export default ScrollToTop;