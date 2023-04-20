import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import userLoginStatus from "./form/userLoginStatus";

function HomePage() {
    const [fields, setFields] = useState({isLogged: false});

    // Utilisation du Hook useEffect pour appeler la fonction userLoginStatus lors du chargement de la page
    useEffect(() => {
        userLoginStatus().then((result) => {
            setFields({...fields, isLogged: result.isLoggedIng});
        })
    }, []);

    // Si l'utilisateur est connecté, afficher la page LoggedHomePage
    if (fields.isLogged) {
        return (<div className="lobby-page">
            <div className="lobby">
                <h1>Welcome to the Puntify Home Page</h1>
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
