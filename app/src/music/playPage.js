// MusicPlayer.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PlayPage = () => {
    const { id } = useParams();
    const [musicURL, setMusicURL] = useState(null);

    useEffect(() => {
        const fetchMusicURL = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API pour récupérer le fichier audio
                const response = await axios.get(`http://localhost:8000/music/${id}`);
                setMusicURL(response.data.url);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'URL de la musique :", error);
            }
        };

        fetchMusicURL();
    }, [id]);

    return (
        <div className="music-player">
            {musicURL ? (
                <audio controls src={musicURL}>
                    Votre navigateur ne prend pas en charge l'élément audio.
                </audio>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default PlayPage;
