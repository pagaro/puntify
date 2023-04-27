// src/components/MusicUpload.js
import React, { useState } from "react";
import axios from "axios";
import './form.css'
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";

const AdminUploadPage = () => {
    const [fileMusic, setFileMusic] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/music/", {file:fileMusic},{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            console.log(response)
            toast("Fichier musical téléchargé avec succès.")
        } catch (error) {
            toast("Erreur lors du téléchargement du fichier musical.\n" + error.response.data.detail)
            console.log(error)
        }
    };

    return (
        <div className="form-page">
            <form onSubmit={handleSubmit} className="form">
                <h1>Upload de fichiers musicaux</h1>
                <label>
                    Fichier :
                    <input type="file" name="file" onChange={(e) => setFileMusic(e.target.files[0])} required />
                </label>
                <br />
                <button type="submit">Envoyer</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AdminUploadPage;
