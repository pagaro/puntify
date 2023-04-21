import React from "react";
import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import HomePage from "./homePage";
import LoginPage from "./form/loginPage";
import RegisterPage from "./form/registerPage";
import MusicPage from "./music/musicPage";
import PlayPage from "./music/playPage";
import UploadPage from "./form/uploadPage";

// Définition du composant PrivateRoute qui vérifie la présence du token dans le localStorage
const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    // Si le token est présent, afficher les éléments enfants de la route parente avec Outlet
    // Sinon, rediriger l'utilisateur vers la page de connexion avec Navigate
    return token ? <Outlet/> : <Navigate to="/login"/>;
}

// Définition du composant principal App qui utilise la bibliothèque de routage react-router-dom
function App() {
    return (
        <Routes>
            <Route exact path="/" element={<HomePage/>}/>
            <Route exact path="/login" element={<LoginPage/>}/>
            <Route exact path="/register" element={<RegisterPage/>}/>

            <Route exact path='/music' element={<PrivateRoute/>}>
                <Route exact path='/music' element={<MusicPage/>}/>
                <Route path="/music/play/:id" element={<PlayPage/>}/>
                <Route path="/music/upload" element={<UploadPage/>}/>
            </Route>
        </Routes>

    );
}

// Exportation du composant principal App en tant que composant par défaut pour être utilisé dans d'autres fichiers
export default App;
