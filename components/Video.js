import React, { useState } from 'react';
import styles from './video.module.scss';
import ReactPlayer from 'react-player';

const Video = ({ data }) => {
    const [isPlaying, setIsPlaying] = useState(true); // Ensure autoplay is triggered

    return data?.videoUrl && (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                {/* Aspect Ratio Box */}
                <div className={styles.box}>
                    <ReactPlayer
                        url={'/' + data.videoUrl} // Replace YouTube link with a video file URL
                        width="100%"
                        height="100%"
                        playing={isPlaying} // Autoplay enabled
                        muted={true} // Ensure autoplay works in browsers
                        loop={true} // Enable looping
                        controls={true} // Enable controls for better playback options
                    />
                </div>
            </div>
        </div>
    );
};

export default Video;
