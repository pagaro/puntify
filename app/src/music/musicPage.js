// MusicList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './music.css'

const MusicList = () => {
    const [musicList, setMusicList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMusicList = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API pour récupérer la liste des musiques
                const response = await axios.get("http://localhost:8000/music",{ withCredentials: true });
                setMusicList(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de la liste des musiques :", error);
            }
        };

        fetchMusicList();
    }, []);

    const handleMusicClick = (musicId) => {
        navigate(`/music/play/${musicId}`);
    };

    return (
        <div className="music-list">
            <h1>Liste des musiques</h1>
            <ul>
                {musicList.map((music) => (
                    <li key={music.id} onClick={() => handleMusicClick(music.id)}>
                        {music.name} - {music.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicList;
