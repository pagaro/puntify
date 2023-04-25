import React, {useState, useEffect} from 'react';
import './header.css'
import {useNavigate} from "react-router-dom";
import isTokenValid from "../security/isTokenValid";
import Cookies from "js-cookie";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    isTokenValid().then((result) => {
        if (result) {
            setIsLoggedIn(result);
        }
    })

    const handleHome = () => {
        navigate('/')
    };


    const handleLogin = () => {
        navigate('/login')
    };

    const handleRegister = () => {
        navigate('/register')
    };

    const handleLogout = () => {
        Cookies.remove('access_token')
        setIsLoggedIn(false);
        window.location.reload();
    };

    return (
        <header>
            <button className="logo" onClick={handleHome}>Puntify</button>
            {isLoggedIn ? (
                <div className="button">
                    <button onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            ) : (
                <div className="button">
                    <button onClick={handleLogin}>
                        Login
                    </button>
                    <button onClick={handleRegister}>
                        Register
                    </button>
                </div>

            )}
        </header>
    );
};

export default Header;
