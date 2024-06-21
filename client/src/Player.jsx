import React, { forwardRef } from 'react';
import YouTube from "react-youtube";

const Player = forwardRef((props, ref) => {
    const opts = {
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0,
      },
    };

  const handleStateChange = (event) => {
    if (event.data !== YouTube.PlayerState.PLAYING) {
      const player = event.target;
      const duration = player.getDuration();
      player.pauseVideo();
      player.seekTo(duration / 2);
      player.playVideo();
    }
  };

  const handleReady = (event) => {
    const player = event.target;
    const duration = player.getDuration();
    player.pauseVideo();
    player.seekTo(duration / 2);
    player.playVideo();
}

  return (
    <div style={{ position: 'relative', pointerEvents: 'none' }}>
      <YouTube videoId={props.videoId} opts={opts} onReady={handleReady} onStateChange={handleStateChange} ref={ref} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none', // This disables all click events on the overlay
      }}></div>
    </div>
  );
});

export default Player;