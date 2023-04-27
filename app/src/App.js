import React, {useState} from "react";
import {Route, Routes} from 'react-router-dom';
import HomePage from "./component/homePage";
import LoginPage from "./form/loginPage";
import RegisterPage from "./form/registerPage";
import MusicPage from "./music/musicPage";
import PlayPage from "./music/playPage";
import AdminUploadPage from "./form/adminUploadPage";
import PrivateRoute from "./security/PrivateRoute";
import Footer from "./component/footer";
import Header from "./component/header";
import AdminMusicPage from "./music/adminMusicPage";
import AdminPlayPage from "./form/adminPlayPage";

function App() {
    const [id, setId] = useState(null);

    // Créez une fonction pour gérer le clic sur une musique
    const handleMusicClick = (id) => {
        setId(id)
    };

    const handleOnClose = () => {
        setId(null)
    }


    return (
        <>
            <Header/>
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/login" element={<LoginPage/>}/>
                <Route exact path="/register" element={<RegisterPage/>}/>

                <Route exact path='/music' element={<PrivateRoute/>}>
                    <Route exact path='/music' element={<MusicPage onMusicClick={handleMusicClick}/>}/>
                    <Route path="/music/play/:id" element={<PlayPage onMusicClick={handleMusicClick}/>}/>
                    <Route path="/music/upload" element={<AdminUploadPage/>}/>
                </Route>
                <Route exact path='/admin' element={<PrivateRoute/>}>
                    <Route path="/admin" element={<AdminMusicPage onMusicClick={handleMusicClick}/>}/>
                    <Route path="/admin/play/:id" element={<AdminPlayPage onMusicClick={handleMusicClick}/>}/>
                </Route>
            </Routes>
            <Footer idMusic={id} onClose={handleOnClose}/>
        </>
    );
}

// Exportation du composant principal App en tant que composant par défaut pour être utilisé dans d'autres fichiers
export default App;
