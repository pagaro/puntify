// MusicList.js
import React, {useState, useEffect} from "react";
import axios from "axios";
import './music.css'

const MusicList = ({onMusicClick}) => {
    const [musicList, setMusicList] = useState([]);

    useEffect(() => {
        const fetchMusicList = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API pour récupérer la liste des musiques
                const response = await axios.get("http://localhost:8000/music", {withCredentials: true});
                setMusicList(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de la liste des musiques :", error);
            }
        };

        fetchMusicList();
    }, []);

    const handleMusicClick = (musicId) => {
        if (musicId) {
            onMusicClick(musicId);
        }
    };

    return (
        <div className="music-page">
            <div className="music-list">
                <h1>Liste des musiques</h1>
                <ul>
                    {musicList.map((music) => (
                        <li key={music.id} onClick={() => handleMusicClick(music.id)}>
                            <div className="music-item">
                                <img className="cover-art" src={`data:image/jpeg;base64,${music.cover_art}`} alt={`${music.title} cover`} />
                                <div className="music-info">
                                    <h3>{music.title}</h3>
                                    <p>{music.artist}</p>
                                    <p>{music.album}</p>
                                    <p>{music.duration} sec</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
};

export default MusicList;
