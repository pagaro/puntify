// MusicList.js
import React, {useState, useEffect} from "react";
import axios from "axios";
import './music.css'
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";

const AdminMusicPage = ({onMusicClick}) => {
    const [musicList, setMusicList] = useState([]);
    const navigate = useNavigate();
    const [updateList, setUpdateList] = useState(false);

    useEffect(() => {
        const fetchMusicList = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API pour récupérer la liste des musiques
                const response = await axios.get("http://localhost:8000/music", {withCredentials: true});
                setMusicList(response.data);
                setUpdateList(false)
            } catch (error) {
                console.error("Erreur lors de la récupération de la liste des musiques :", error);
            }
        };
        fetchMusicList();
    }, [updateList]);

    const handleMusicClick = (musicId) => {
        navigate(`/admin/play/${musicId}`);
    };



    const handlePlayButtonClick = (e, musicId) => {
        e.stopPropagation();
        onMusicClick(musicId);
    };

    const handleRemove = (e, musicId) => {
        e.stopPropagation();
        const removeMusic = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API pour récupérer la liste des musiques
                const response = await axios.delete(`http://localhost:8000/music/${musicId}`, {withCredentials: true});
                toast("Suppression réussie")
                // console.log(musicList[musicId])
                setUpdateList(!updateList);

            } catch (error) {
                toast(error.response.data.detail)
            }
        };

        removeMusic();
    };

    return (
        <div className="music-page">
            <div className="music-list">
                <h1>Liste des musiques</h1>
                <ul>
                    {musicList.map((music) => (
                        <li key={music.id} onClick={() => handleMusicClick(music.id)}>
                            <div className="music-item">
                                <div style={{display:"flex"}}>
                                    <img className="cover-art" src={`data:image/jpeg;base64,${music.cover_art}`}
                                         alt={`${music.title} cover`}/>
                                    <div className="music-info">
                                        <h3>{music.title}</h3>
                                        <p>{music.artist}</p>
                                        <p>{music.album}</p>
                                        <p>{music.duration} sec</p>
                                    </div>
                                </div>
                                <div>
                                <button className="button-admin" onClick={(e) => handlePlayButtonClick(e, music.id)}>▶️</button>
                                <button className="button-admin" onClick={(e) => handleRemove(e, music.id)}>🚮</button>
                                    <button className="button-admin" onClick={(e) =>  handleMusicClick(music.id)}>📝</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <ToastContainer/>
        </div>

    );
};

export default AdminMusicPage;
