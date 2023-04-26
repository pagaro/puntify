// src/components/MusicUpload.js
import React, { useState } from "react";
import axios from "axios";
import './form.css'
import {toast, ToastContainer} from "react-toastify";

const UploadPage = () => {
    const [musicData, setMusicData] = useState({
        name: "",
        artist: "",
        file: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", musicData.name);
        formData.append("artist", musicData.artist);
        formData.append("file", musicData.file);

        try {
            const response = await axios.post("http://localhost:8000/music/", formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            toast("Fichier musical téléchargé avec succès.")
        } catch (error) {
            toast("Erreur lors du téléchargement du fichier musical.\n" + error.response.data.detail)
            console.log(error)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMusicData({ ...musicData, [name]: value });
    };

    return (
        <div className="form-page">
            <form onSubmit={handleSubmit} className="form">
                <h1>Upload de fichiers musicaux</h1>
                <label>
                    Nom :
                    <input type="text" name="name" value={musicData.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Artiste :
                    <input type="text" name="artist" value={musicData.artist} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Fichier :
                    <input type="file" name="file" onChange={(e) => setMusicData({ ...musicData, file: e.target.files[0] })} required />
                </label>
                <br />
                <button type="submit">Envoyer</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default UploadPage;
