import React, { useRef, useEffect } from "react";
function useFirstTime(ref) {
    useEffect(() => {
        ref.current = false;
    }, []);
    return ref.current;
}
export { useFirstTime };