import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import './music.css'

const PlayPage = ({onMusicClick}) => {
    const [songInfo, setSongInfo] = useState(null);
    const { id } = useParams()

    useEffect(() => {
        const fetchSongInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/music/${id}`, {
                    withCredentials: true,
                });
                setSongInfo(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données', error);
            }
        };

        fetchSongInfo();
    }, []);

    const handlePlay = () => {
        onMusicClick(id);
    };

    return (
        <div className='music-page'>
            {songInfo ? (
                <div className='song-info'>
                    <h2>{songInfo.title}
                        <button className="play-button" onClick={handlePlay}>▶️</button>
                    </h2>
                    <p>Artiste : {songInfo.artist}</p>
                    <p>Album : {songInfo.album}</p>
                    <p>Année : {songInfo.year}</p>
                    <p>Genre : {songInfo.genre}</p>
                    <p>Durée : {songInfo.duration} secondes</p>
                    <p>Bitrate : {songInfo.bitrate} kbps</p>
                    <p>Taille du fichier : {songInfo.filesize} octets</p>
                    <p>URL : {songInfo.url}</p>
                    <img src={`data:image/jpeg;base64,${songInfo.cover_art}`} alt={`Couverture de l'album ${songInfo.album}`} />
                </div>
            ) : (
                <p>Chargement des informations...</p>
            )}
        </div>
    );
};

export default PlayPage;
