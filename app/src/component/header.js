import React, {useEffect, useState} from 'react';
import './header.css'
import {useNavigate} from "react-router-dom";
import isTokenValid from "../security/isTokenValid";
import Cookies from "js-cookie";

const Header = () => {
    const [fields, setFields] = useState({isLogged: false, isAdmin: false});
    const navigate = useNavigate();

    useEffect(() => {
        isTokenValid().then((result) => {
            if (result) {
                setFields({...fields, isLogged: true, isAdmin: result.data.admin});
            }
        })
    }, [navigate])

    const handleHome = () => {
        navigate('/')
    };


    const handleLogin = () => {
        navigate('/login')
    };

    const handleRegister = () => {
        navigate('/register')
    };

    const handleAdmin = () => {
        navigate('/admin')
    };

    const handleLogout = () => {
        Cookies.remove('access_token')
        setFields({...fields, isLogged: false});
        window.location.reload();
    };

    return (
        <header>
            <button className="logo" onClick={handleHome}>Puntify</button>
            {fields.isLogged ? (
                <div className="button">
                    <button onClick={handleLogout}>
                        Sign out
                    </button>
                    {fields.isAdmin && (
                        <button onClick={handleAdmin}>
                            Admin
                        </button>
                    )}
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
