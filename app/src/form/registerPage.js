import React, {useEffect, useState} from 'react';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import {useNavigate} from "react-router-dom";
import './form.css';
import userLoginStatus from "./userLoginStatus";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
    const [fields, setFields] = useState({email: '', password: '',confirmPassword :'', username:''});
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (fields.password !== fields.confirmPassword) {
            toast('Les mots de passe ne correspondent pas')
            return;
        }

        const passwordStrength = zxcvbn(fields.password);

        if (passwordStrength.score < 3) {
            toast("Mot de passe faible")
            //todo
            // return;
        }

        try {
            await axios.post("http://localhost:8000/users/", fields);
            navigate("/login");
        } catch (error) {
            console.log(error)
            toast(error.response.data.detail)
        }
    }

    useEffect(()=> {
        userLoginStatus().then((result)=> {
            if (result.isLoggedIng){
                navigate("/");
            }
        })
    },[])


    return (
        <div className="form-page">
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Email:
                    <input type="email" value={fields.email} onChange={e => setFields({...fields , email: e.target.value})}/>
                </label>
                <br/>
                <label>
                    Username:
                    <input type="text" value={fields.username} onChange={e => setFields({...fields , username: e.target.value})}/>
                </label>
                <br/>
                <label>
                    Password:
                    <input type="password" value={fields.password} onChange={e => setFields({...fields , password: e.target.value})}/>
                </label>
                <br/>
                <label>
                    Confirmer Password:
                    <input type="password" value={fields.confirmPassword} onChange={e => setFields({...fields , confirmPassword: e.target.value})}/>
                </label>
                <br/>
                <button type="submit">Signup</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default RegisterPage;
