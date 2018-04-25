import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./player.css";

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    this.player = this.createPlayer();
  }

  createPlayer() {
    const video = document.createElement("video");
    video.classList.add("video-js");
    video.dataset.vjsPlayer = true;
    video.controls = true;
    video.style.width = "100%";
    video.style.height = "100%";
    (this.props.sources || []).forEach(source => {
      const sourceEl = document.createElement("source");
      sourceEl.src = source.src;
      sourceEl.type = source.type;
      video.appendChild(sourceEl);
    });
    (this.props.tracks || []).forEach(track => {
      const trackEl = document.createElement("track");
      trackEl.src = track.src;
      trackEl.kind = track.kind;
      trackEl.srclang = track.language;
      trackEl.label = track.label;
      trackEl.default = track.default;
      video.appendChild(trackEl);
    });
    this.container.appendChild(video);
    return videojs(video, this.props);
  }

  componentDidUpdate() {
    if (this.player) this.player.dispose();
    this.player = this.createPlayer();
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div ref={node => (this.container = node)} />
      </div>
    );
  }
}
