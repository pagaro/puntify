import React from "react";
import {Route, Routes} from 'react-router-dom';
import HomePage from "./homePage";
import LoginPage from "./form/loginPage";
import RegisterPage from "./form/registerPage";
import MusicPage from "./music/musicPage";
import PlayPage from "./music/playPage";
import UploadPage from "./form/uploadPage";
import PrivateRoute from "./security/PrivateRoute";



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
