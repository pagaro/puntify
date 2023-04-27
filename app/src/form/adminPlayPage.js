import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import '../music/music.css'
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from 'react-router-dom';

const AdminPlayPage = ({onMusicClick}) => {
    const [songData, setSongData] = useState({});
    const {id} = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/music/${id}`, {
                    withCredentials: true,
                });
                if (response) {
                    setSongData(response.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données', error);
            }
        };

        fetchSongInfo();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSongData((prevData) => ({...prevData, [name]: value}));
    };

    const handlePlay = () => {
        onMusicClick(id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:8000/music/${id}`, songData, {
                withCredentials: true,
            });
            // Vous pouvez ajouter une notification ou un message de succès ici, par exemple :
            toast("Modifications enregistrées avec succès");
            navigate(`/admin`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour des données", error);
            // Vous pouvez ajouter une notification ou un message d'erreur ici, par exemple :
            toast("Échec de la mise à jour des données");
        }
    };


    return (
        <div className="form-page">
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Titre :
                    <input type="text" name="title" value={songData.title || ''} onChange={handleChange}/>
                </label>
                <label>
                    Artiste :
                    <input type="text" name="artist" value={songData.artist || ''} onChange={handleChange}/>
                </label>
                <label>
                    Album :
                    <input type="text" name="album" value={songData.album || ''} onChange={handleChange}/>
                </label>
                <label>
                    Année :
                    <input type="number" name="year" value={songData.year || ''} onChange={handleChange}/>
                </label>
                <label>
                    Genre :
                    <input type="text" name="genre" value={songData.genre || ''} onChange={handleChange}/>
                </label>
                <label>
                    Durée (secondes) :
                    <input type="number" name="duration" value={songData.duration || ''} onChange={handleChange}/>
                </label>
                <label>
                    Bitrate (kbps) :
                    <input type="number" name="bitrate" value={songData.bitrate || ''} onChange={handleChange}/>
                </label>
                <label>
                    Taille du fichier (octets) :
                    <input type="number" name="filesize" value={songData.filesize || ''} onChange={handleChange}/>
                </label>
                <button type="submit">Enregistrer les modifications</button>
            </form>
            <ToastContainer/>
        </div>
    );


    // <div className='music-page'>
    //     {songInfo ? (
    //         <div className='song-info'>
    //             <h2>{songInfo.title}
    //                 <button className="button-admin" onClick={handlePlay}>▶️</button>
    //             </h2>
    //             <p>Artiste : {songInfo.artist}</p>
    //             <p>Album : {songInfo.album}</p>
    //             <p>Année : {songInfo.year}</p>
    //             <p>Genre : {songInfo.genre}</p>
    //             <p>Durée : {songInfo.duration} secondes</p>
    //             <p>Bitrate : {songInfo.bitrate} kbps</p>
    //             <p>Taille du fichier : {songInfo.filesize} octets</p>
    //             <p>URL : {songInfo.url}</p>
    //             <img src={`data:image/jpeg;base64,${songInfo.cover_art}`} alt={`Couverture de l'album ${songInfo.album}`} />
    //         </div>
    //     ) : (
    //         <p>Chargement des informations...</p>
    //     )}
    // </div>
    // );
};

export default AdminPlayPage;
