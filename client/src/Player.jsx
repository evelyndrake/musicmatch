import React, { forwardRef } from 'react';
import YouTube from "react-youtube";

const Player = forwardRef((props, ref) => {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    };
  
    return (
      <YouTube videoId={props.videoId} opts={opts} onReady={event => event.target.pauseVideo()} ref={ref} />
    );
  });
  

export default Player;
