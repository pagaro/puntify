import React, {useEffect, useState} from "react";
import {Route, Routes} from 'react-router-dom';
import HomePage from "./homePage";
import LoginPage from "./form/loginPage";
import RegisterPage from "./form/registerPage";
import MusicPage from "./music/musicPage";
import PlayPage from "./music/playPage";
import UploadPage from "./form/uploadPage";
import PrivateRoute from "./security/PrivateRoute";
import Footer from "./component/footer";
import Header from "./component/header";
import axios from "axios";

function App() {
    const [urlMusic, setUrlMusic] = useState(null);
    const [id, setId] = useState(null);

    // Créez une fonction pour gérer le clic sur une musique
    const handleMusicClick = (id) => {
        setId(id)
    };

    useEffect(() => {
        const fetchUrlMusic = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API pour récupérer le fichier audio
                const response = await axios.get(`http://localhost:8000/music/${id}`,{ withCredentials: true });
                setUrlMusic(response.data.url);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'URL de la musique :", error);
            }
        };

        fetchUrlMusic();
    }, [id]);

    return (
        <>
            <Header/>
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/login" element={<LoginPage/>}/>
                <Route exact path="/register" element={<RegisterPage/>}/>

                <Route exact path='/music' element={<PrivateRoute/>}>
                    <Route exact path='/music' element={<MusicPage onMusicClick={handleMusicClick}/>}/>
                    <Route path="/music/play/:id" element={<PlayPage/>}/>
                    <Route path="/music/upload" element={<UploadPage/>}/>
                </Route>

            </Routes>
            <Footer urlMusic={urlMusic}/>
        </>
    );
}

// Exportation du composant principal App en tant que composant par défaut pour être utilisé dans d'autres fichiers
export default App;
