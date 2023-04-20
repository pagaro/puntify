import React, { useState, useEffect } from 'react';
import './header.css'
import {useNavigate} from "react-router-dom";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.reload();
    };

    return (
        <header>
            <h1>Puntify</h1>
            <button onClick={isLoggedIn ? handleSignOut : handleLogin}>
                {isLoggedIn ? 'Sign Out' : 'Login'}
            </button>
        </header>
    );
};

export default Header;
