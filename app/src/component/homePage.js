import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import isTokenValid from "../security/isTokenValid";
import './homePage.css'

function HomePage() {
    const [fields, setFields] = useState({isLogged: false, isAdmin: false});

    // Utilisation du Hook useEffect pour appeler la fonction userLoginStatus lors du chargement de la page
    useEffect(() => {
        isTokenValid().then((result) => {
            if (result) {
                setFields({...fields, isLogged: true, isAdmin: result.data.admin});
            }
        })
    }, []);

    // Sinon, afficher la page d'accueil avec les boutons de connexion et d'inscription
    return (
        <div className="lobby-page">
            <div className="lobby">
                <h1>Welcome to the Puntify Home Page</h1>
                {fields.isLogged ? (
                    <Link to="/music">
                        <button>Liste des musiques</button>
                    </Link>
                ) : (
                    <>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </>)}
                {fields.isAdmin && (
                    <>
                    <Link to="/music/upload">
                        <button>Upload</button>
                    </Link>
                    </>)}
            </div>
        </div>
    );
}

// Exportation du composant HomePage en tant que composant par défaut pour être utilisé dans d'autres fichiers
export default HomePage;
