// src/components/Footer.js

import React, {useEffect, useState, useRef} from 'react';
import './footer.css';
import axios from "axios";

const Footer = ({idMusic, onClose}) => {
    const [fields, setFields] = useState(
        {urlMusic: null, isPlaying: false, currentTime: 0, duration: 0});
    const audioRef = useRef();

    useEffect(() => {
        const fetchUrlMusic = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API pour récupérer le fichier audio
                const response = await axios.get(`http://localhost:8000/music/${idMusic}`, {withCredentials: true});
                setFields({
                    ...fields,
                    urlMusic: response.data.url,
                    duration: response.data.duration,
                    isPlaying: false,
                    currentTime: 0
                })
            } catch (error) {
                console.error("Erreur lors de la récupération de l'URL de la musique :", error);
            }
        };

        if (idMusic) {
            fetchUrlMusic();
        }

    }, [idMusic]);

    useEffect(() => {
        if (fields.urlMusic && idMusic || fields.isPlaying) {
            handlePlayPause()
        }
    }, [fields.urlMusic]);


    const handlePlayPause = () => {
        setFields({
            ...fields, isPlaying: !fields.isPlaying
        })
        const audio = audioRef.current;
        if (fields.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    const handleTimeUpdate = (e) => {
        setFields({
            ...fields, currentTime: e.target.currentTime
        })
    };

    const handleSliderChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setFields({
            ...fields, currentTime: newTime
        })
        audioRef.current.currentTime = newTime;
    };

    const handleClose = () => {
        setFields({...fields, urlMusic: null})
        onClose();
    };

    return (
        <>
            <div className={`footer ${idMusic ? "active" : ""}`}>
                <audio
                    id="footer-audio"
                    src={fields.urlMusic}
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                />
                <div className="footer-controls">
                    <button className='play-close' onClick={handlePlayPause}>{fields.isPlaying ? '⏸️' : '▶️'}</button>
                    <span>{Math.floor(fields.currentTime / 60)}:{Math.floor(fields.currentTime % 60)}</span>
                    <input
                        type="range"
                        min="0"
                        max={fields.duration}
                        value={fields.currentTime}
                        onChange={handleSliderChange}
                    />
                    <span>{Math.floor(fields.duration / 60)}:{Math.floor(fields.duration % 60)}</span>
                    <button className='play-close' onClick={handleClose}>🔽️</button>
                </div>
            </div>
        </>
    );
};

export default Footer;
