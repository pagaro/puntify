import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import isTokenValid from "./security/isTokenValid";

function HomePage() {
    const [fields, setFields] = useState({isLogged: false});
    const navigate = useNavigate();

    // Utilisation du Hook useEffect pour appeler la fonction userLoginStatus lors du chargement de la page
    useEffect(() => {
        isTokenValid().then((result) => {
            console.log(result)
            if (result) {
                setFields({...fields, isLogged: true});
            }
        })
    }, []);

    const handleMusic = () => {
        navigate('/music')
    };


    // Si l'utilisateur est connecté, afficher la page LoggedHomePage
    if (fields.isLogged) {
        return (<div className="lobby-page">
            <div className="lobby">
                <h1>Welcome to the Puntify Home Page</h1>
                <button onClick={handleMusic}>Liste des musiques</button>
            </div>
        </div>);
    }

    // Sinon, afficher la page d'accueil avec les boutons de connexion et d'inscription
    return (
        <div className="lobby-page">
            <div className="lobby">
                <h1>Welcome to the Punto Home Page</h1>
                <Link to="/login">
                    <button>Login</button>
                </Link>
                <Link to="/register">
                    <button>Register</button>
                </Link>
            </div>
        </div>
    );
}

// Exportation du composant HomePage en tant que composant par défaut pour être utilisé dans d'autres fichiers
export default HomePage;
