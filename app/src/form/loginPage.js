import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './form.css';
import qs from "qs";
import { useCookies } from 'react-cookie'
import Cookies from "js-cookie";
import {toast, ToastContainer} from "react-toastify";
import isTokenValid from "../security/isTokenValid";

function LoginPage() {
    const [fields, setFields] = useState({email:'',password:''})
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token'])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/login",
                qs.stringify({ username : fields.email ,password : fields.password
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", // Définissez l'en-tête 'Content-Type' approprié
                    },
                });

            // Cookies.set('access_token', response.data.access_token , { domain: 'localhost:3000' });
            setCookie('access_token', response.data.access_token, { path: '/'})
            navigate('/');
        } catch (error) {
            console.log(error)
            toast(error.response.data.detail)
        }
    }

    useEffect(()=> {
        isTokenValid().then((result)=> {
            if (result){
                navigate("/");
            }
        })
    },[navigate])

    return (
        <div className="form-page">
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Email or Username:
                    <input type="text" value={fields.email} onChange={e => setFields({...fields , email: e.target.value})}/>
                </label>
                <br/>
                <label>
                    Password:
                    <input type="password" value={fields.password} onChange={e => setFields({...fields , password: e.target.value})}/>
                </label>
                <br/>
                <div>Don’t have an account? <a href={'/register'}>Register</a></div>
                <button type="submit">Login</button>
            </form>

            <ToastContainer/>
        </div>
    );
}

export default LoginPage;
