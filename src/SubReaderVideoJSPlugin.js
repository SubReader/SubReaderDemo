import videojs from "video.js";
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "qrcode.react";

import { Observable } from "rxjs/Rx";
import "./SubReaderVideoJSPlugin.css";

const Plugin = videojs.getPlugin("plugin");
const MenuButton = videojs.getComponent("MenuButton");
const Menu = videojs.getComponent("Menu");
const Component = videojs.getComponent("Component");

export default class SubReaderPlugin extends Plugin {
  constructor(player, options) {
    super(player, options);

    player.on("ready", () => {
      player.controlBar.subreader = player.controlBar.addChild(
        "subReaderMenuButton",
        {
          stream$: options.stream$
        }
      );
      player.controlBar
        .el()
        .insertBefore(
          player.controlBar.subreader.el(),
          player.controlBar.el().firstChild.nextSibling
        );
    });

    const $stream = Observable.from(options.stream$);

    const $playing = Observable.create(observer => {
      function onStart() {
        observer.next(true);
      }
      function onStop() {
        observer.next(false);
      }

      player.on("pause", onStop);
      player.on("ended", onStop);
      player.on("playing", onStart);

      return function dispose() {
        player.off("pause", onStop);
        player.off("ended", onStop);
        player.off("playing", onStart);
      };
    });

    const $timeupdate = Observable.create(observer => {
      function onTime() {
        observer.next(Math.floor(player.currentTime() * 1000));
      }

      player.on("timeupdate", onTime);

      return function dispose() {
        player.off("timeupdate", onTime);
      };
    });

    const $timeseek = Observable.create(observer => {
      function onTime() {
        observer.next(Math.floor(player.currentTime() * 1000));
      }

      player.on("seeking", onTime);

      return function dispose() {
        player.off("seeking", onTime);
      };
    });

    const $time = $timeupdate
      .throttle(() => Observable.interval(2000))
      .merge($timeseek);

    const $state = Observable.combineLatest(
      $playing,
      $time,
      (playing, time) => {
        return {
          playing,
          time
        };
      }
    );

    const $subtitles = Observable.create(observer => {
      const tracks = player.textTracks();

      function handleTracks() {
        const subtitles$ = [];

        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          subtitles$.push(
            new Promise(resolve => {
              function handleLoadedData() {
                const cues = [];
                for (let j = 0; j < track.cues.length; j++) {
                  const cue = track.cues[j];
                  const div = document.createElement("div");
                  div.innerHTML = cue.text;
                  cues.push({
                    timeIn: Math.floor(cue.startTime * 1000),
                    timeOut: Math.floor(cue.endTime * 1000),
                    text: div.innerText
                  });
                }
                resolve({
                  language: track.language,
                  cues
                });
                track.removeEventListener("loadeddata", handleLoadedData);
              }
              track.oncuechange = handleLoadedData;
              track.addEventListener("loadeddata", handleLoadedData);
            })
          );
        }

        Promise.all(subtitles$).then(subtitles => {
          observer.next(subtitles);
        });
      }

      tracks.addEventListener("addtrack", handleTracks);

      return function dispose() {
        tracks.removeEventListener("addtrack", handleTracks);
      };
    });

    $stream.combineLatest($subtitles).subscribe(([stream, subtitles]) => {
      console.log("Setting subtitles", subtitles);
      stream.setSubtitles(subtitles);
    });

    $stream.combineLatest($state).subscribe(([stream, state]) => {
      stream.setState(state);
    });
  }
}

class QR extends React.Component {
  state = {
    isLoading: true,
    streamId: null
  };
  componentWillMount() {
    this.props.stream$.then(stream => {
      this.setState({ streamId: stream.id, isLoading: false });
    });
  }
  render() {
    if (this.state.isLoading) return <div>Loading...</div>;
    return <QRCode value={`subreader://${this.state.streamId}`} />;
  }
}

class SubReaderMenu extends Menu {
  createEl() {
    const el = document.createElement("div");
    el.className = "vjs-subreader-qr-container";

    ReactDOM.render(<QR stream$={this.options_.stream$} />, el);

    this.contentEl_ = el;

    return el;
  }
}

export class SubReaderMenuButton extends MenuButton {
  constructor(player, options) {
    super(player, options);
    this.controlText("SubReader");
  }

  update() {
    const menu = this.createMenu();

    if (this.menu) {
      this.menu.dispose();
      this.removeChild(this.menu);
    }

    this.menu = menu;
    this.addChild(menu);

    this.buttonPressed_ = false;
    this.menuButton_.el_.setAttribute("aria-expanded", "false");
    this.show();
  }

  createMenu() {
    return new SubReaderMenu(this.player_, { stream$: this.options_.stream$ });
  }

  buildCSSClass() {
    return `vjs-subreader-button ${super.buildCSSClass()}`;
  }
}
Component.registerComponent("SubReaderMenu", SubReaderMenu);
Component.registerComponent("SubReaderMenuButton", SubReaderMenuButton);
