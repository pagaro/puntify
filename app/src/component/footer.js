// src/components/Footer.js

import React, {useState} from 'react';
import './footer.css';

const Footer = ({urlMusic}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        const audio = document.getElementById('footer-audio');
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    return (
        <>
            {urlMusic && (
                <div className="footer">
                    <audio id="footer-audio" src={urlMusic}/>
                    <div className="footer-controls">
                        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;
