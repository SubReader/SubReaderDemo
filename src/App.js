import React, { Component } from "react";
import * as SubReaderAPI from "subreader-api";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link
} from "react-router-dom";
import videos from "./data/videos";
import QRCode from "qrcode.react";
import videojs from "video.js";
import SubReaderVideoJSPlugin from "./SubReaderVideoJSPlugin";
import VideoPlayer from "./VideoPlayer";
videojs.registerPlugin("subreader", SubReaderVideoJSPlugin);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos,
      showAuthQR: false,
      authId: ""
    };
  }

  getServiceToken() {
    const serviceToken = localStorage.getItem("serviceToken");
    const expiration = localStorage.getItem("serviceTokenExpiration");
    if (serviceToken && expiration > Date.now()) {
      return Promise.resolve(serviceToken);
    }
    return SubReaderAPI.getAuthToken()
      .then(({ token: authToken, id: authId }) => {
        this.setState({
          showAuthQR: true,
          authId
        });
        return SubReaderAPI.getServiceToken(authToken);
      })
      .then(({ service_token: serviceToken, expires_in: expiresIn }) => {
        localStorage.setItem("serviceToken", serviceToken);
        localStorage.setItem("serviceTokenExpiration", Date.now() + expiresIn);
        this.setState({ showAuthQR: false });
        return serviceToken;
      });
  }

  componentWillMount() {
    this.stream$ = this.getServiceToken()
      .then(serviceToken => {
        console.log("serviceToken", serviceToken);
        return SubReaderAPI.getStreamToken(serviceToken);
      })
      .then(({ token: streamToken, id: streamId }) => {
        return new SubReaderAPI.Stream(streamToken, streamId);
      });
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              path="/:video_id"
              render={({ match }) => {
                const { video_id } = match.params;
                const video = this.state.videos[video_id];
                this.stream$.then(stream => {
                  stream.setInfo({
                    title: video.title,
                    cover: {
                      uri: video.cover
                    },
                    backdrop: {
                      uri: video.backdrop
                    }
                  });
                });
                return this.renderVideoPlayer(video, video_id);
              }}
            />
            <Redirect
              exact={true}
              from="/"
              to={`/${Object.keys(this.state.videos)[0] || "default"}`}
            />
          </Switch>
        </div>
      </Router>
    );
  }

  renderVideoPlayer(video, video_id) {
    const { videos, showAuthQR } = this.state;
    return (
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          width: "100%",
          maxWidth: "960px"
        }}
      >
        <div
          className="player-container"
          style={{
            width: "100%",
            flex: 1
          }}
        >
          <div
            style={{
              width: "100%",
              position: "relative",
              backgroundColor: "black"
            }}
          >
            <VideoPlayer
              autoplay={!this.state.showAuthQR}
              controls={true}
              fluid={true}
              aspectRatio="16:9"
              plugins={{
                subreader: {
                  stream$: this.stream$
                }
              }}
              sources={[
                {
                  src: video.src,
                  type: "video/mp4"
                }
              ]}
              tracks={video.tracks}
              poster={video.poster}
            />
          </div>
          <div style={{ padding: "0" }}>
            <h1>{video.title}</h1>
          </div>
        </div>
        <div
          className="player-thumbnails"
          style={{
            padding: "0px 10px",
            width: "300px"
          }}
        >
          {Object.keys(videos)
            .filter(id => id !== video_id)
            .map(id => {
              const video = videos[id];
              return (
                <Link
                  key={id}
                  to={`/${id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "20px 10px",
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "black"
                  }}
                  onClick={() => {
                    console.log("Change nav");
                  }}
                >
                  <img
                    alt={video.title}
                    src={video.poster}
                    style={{ width: "120px", borderRadius: "2px", flex: 3 }}
                  />
                  <span style={{ marginLeft: "10px", flex: 2 }}>
                    {video.title}
                  </span>
                </Link>
              );
            })}
        </div>
        {showAuthQR && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  display: "inline-block"
                }}
              >
                <QRCode
                  value={`subreader://authenticate?id=${this.state.authId}`}
                  level="M"
                  bgColor="transparent"
                  size={256}
                />
              </div>
              <h2>Scan med SubReader appen</h2>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
