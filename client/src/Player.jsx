import React, { forwardRef } from 'react';
import YouTube from "react-youtube";

const Player = forwardRef((props, ref) => {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 0,
        // controls: 0,
      },
    };

  const handleStateChange = (event) => {
    if (event.data === YouTube.PlayerState.UNSTARTED) {
      const player = event.target;
      const duration = player.getDuration();
      player.pauseVideo();
      player.seekTo(duration / 2);
      player.playVideo();
    }
  };

  return (
    <YouTube videoId={props.videoId} opts={opts} onStateChange={handleStateChange} ref={ref} />
  );
});

export default Player;