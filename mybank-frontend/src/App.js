import React, {useEffect, useRef} from 'react';
import Router from "./config/Router";
import {useDispatch} from 'react-redux';
import {authActions} from './store/authentication-slice';
import {backendUrl} from "./config/constants";

function App() {
    const dispatch = useDispatch();
    const timeoutRef = useRef(null);

    useEffect(() => {
        const resetTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fetch(`${backendUrl}/logout`).then(() => {});
                dispatch(authActions.logoutUser());
                dispatch(authActions.logoutAdmin());
                dispatch(authActions.logoutStaff());
            }, 5 * 60 * 1000); // 5 minutes
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        resetTimer(); // Initialize timer

        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, [dispatch]);

    return <>
        <Router/>
    </>;
}

export default App;