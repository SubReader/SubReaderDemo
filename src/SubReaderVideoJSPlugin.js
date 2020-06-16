import videojs from "video.js";
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "qrcode.react";

import { StreamPlayer } from "@subreader/core";

import { Observable } from "rxjs/Rx";
import "./SubReaderVideoJSPlugin.css";

const Plugin = videojs.getPlugin("plugin");
const MenuButton = videojs.getComponent("MenuButton");
const Menu = videojs.getComponent("Menu");
const Component = videojs.getComponent("Component");

class LiveSubtitle {
	delegate = null;

	constructor(track) {
		this.track = track;
	}

	load() {
		const cues = [];
		for (let i = 0; i < this.track.cues.length; i++) {
			const trackCue = this.track.cues[i];
			const div = document.createElement("div");
			div.innerHTML = trackCue.text;

			const cue = {
				text: div.innerText,
				timeIn: trackCue.startTime * 1000,
				timeOut: trackCue.endTime * 1000,
			};
			cues.push(cue);
		}

		this.delegate.onCues(cues);
	}
}

class LiveStream {
	delegate = null;

	constructor(player) {
		this.player = player;
		this.player.on("pause", this.onPause);
		this.player.on("ended", this.onPause);
		this.player.on("playing", this.onPlay);
		this.player.on("timeupdate", this.onSync);
		this.player.on("seek", this.onTime);

		this.player.textTracks().on("addtrack", this.onTracks);
		this.onTracks();
	}

	liveTrackFor(track) {
		switch (track.kind) {
			case "subtitle": {
				return {
					...track,
					track: new LiveSubtitle(track.subtitle),
				};
			}
		}
	}

	load() {
		this.onTracks();
	}

	onPause = () => {
		this.delegate.onReceivePlaying(false);
	};

	onPlay = () => {
		this.delegate.onReceivePlaying(true);
	};

	onSync = () => {
		const time = this.player.currentTime() * 1000;
		this.delegate.onReceiveSync(time);
	};

	onTime = () => {
		const time = this.player.currentTime() * 1000;
		this.delegate.onReceiveTime(time);
	};

	onTracks = () => {
		const playerTracks = this.player.textTracks();
		const tracks = [];
		for (let i = 0; i < playerTracks.length; i++) {
			const playerTrack = playerTracks[i];

			switch (playerTrack.kind) {
				case "subtitles": {
					const subtitleTrack = {
						subtitle: playerTrack,
						id: playerTrack.language,
						language: playerTrack.language,
						kind: "subtitle",
					};
					tracks.push(subtitleTrack);
				}
			}
		}
		if (this.delegate) {
			this.delegate.onReceiveTracks(tracks);
		}
	};
}

export default class SubReaderPlugin extends Plugin {
	constructor(player, options) {
		super(player, options);

		const streamPlayer = new StreamPlayer({
			liveStream: new LiveStream(player),
			delegate: {
				didSelectTrack(track) {
					console.log("select track", track);
				},
				didSelectVoice(voice) {
					console.log("select voice", voice);
				},
				didSpeakCue(cue, index) {
					console.log("speak cue", cue, index);
				},
				onCues(cues) {
					console.log("cues", cues);
				},
				onInfo() {},
				onPlaying(playing) {
					console.log("playing", playing);
				},
				onTime(time) {
					console.log("time", time);
				},
				onTracks(tracks) {
					console.log("tracks", tracks);
				},
				onVoices(voices) {
					console.log("voices", voices);
				},
			},
		});

		player.on("ready", () => {
			player.controlBar.subreader = player.controlBar.addChild(
				"subReaderMenuButton"
			);
			player.controlBar
				.el()
				.insertBefore(
					player.controlBar.subreader.el(),
					player.controlBar.el().firstChild.nextSibling
				);
		});

		// const $stream = Observable.from(options.stream$);

		// const $playing = Observable.create((observer) => {
		// 	function onStart() {
		// 		observer.next(true);
		// 	}
		// 	function onStop() {
		// 		observer.next(false);
		// 	}

		// 	player.on("pause", onStop);
		// 	player.on("ended", onStop);
		// 	player.on("playing", onStart);

		// 	return function dispose() {
		// 		player.off("pause", onStop);
		// 		player.off("ended", onStop);
		// 		player.off("playing", onStart);
		// 	};
		// });

		// const $timeupdate = Observable.create((observer) => {
		// 	function onTime() {
		// 		observer.next(Math.floor(player.currentTime() * 1000));
		// 	}

		// 	player.on("timeupdate", onTime);

		// 	return function dispose() {
		// 		player.off("timeupdate", onTime);
		// 	};
		// });

		// const $timeseek = Observable.create((observer) => {
		// 	function onTime() {
		// 		observer.next(Math.floor(player.currentTime() * 1000));
		// 	}

		// 	player.on("seeking", onTime);

		// 	return function dispose() {
		// 		player.off("seeking", onTime);
		// 	};
		// });

		// const $time = $timeupdate
		// 	.throttle(() => Observable.interval(2000))
		// 	.merge($timeseek);

		// const $state = Observable.combineLatest(
		// 	$playing,
		// 	$time,
		// 	(playing, time) => {
		// 		return {
		// 			playing,
		// 			time,
		// 		};
		// 	}
		// );

		// const $subtitles = Observable.create((observer) => {
		// 	const tracks = player.textTracks();

		// 	function handleTracks() {
		// 		const subtitles$ = [];

		// 		for (let i = 0; i < tracks.length; i++) {
		// 			const track = tracks[i];
		// 			subtitles$.push(
		// 				new Promise((resolve) => {
		// 					function handleLoadedData() {
		// 						const cues = [];
		// 						for (let j = 0; j < track.cues.length; j++) {
		// 							const cue = track.cues[j];
		// 							const div = document.createElement("div");
		// 							div.innerHTML = cue.text;
		// 							cues.push({
		// 								timeIn: Math.floor(cue.startTime * 1000),
		// 								timeOut: Math.floor(cue.endTime * 1000),
		// 								text: div.innerText,
		// 							});
		// 						}
		// 						resolve({
		// 							language: track.language,
		// 							cues,
		// 						});
		// 						track.removeEventListener("loadeddata", handleLoadedData);
		// 					}
		// 					track.oncuechange = handleLoadedData;
		// 					track.addEventListener("loadeddata", handleLoadedData);
		// 				})
		// 			);
		// 		}

		// 		Promise.all(subtitles$).then((subtitles) => {
		// 			observer.next(subtitles);
		// 		});
		// 	}

		// 	tracks.addEventListener("addtrack", handleTracks);

		// 	return function dispose() {
		// 		tracks.removeEventListener("addtrack", handleTracks);
		// 	};
		// });

		// $stream.combineLatest($subtitles).subscribe(([stream, subtitles]) => {
		// 	console.log("Setting subtitles", subtitles);
		// 	stream.setSubtitles(subtitles);
		// });

		// $stream.combineLatest($state).subscribe(([stream, state]) => {
		// 	stream.setState(state);
		// });
	}
}

class QR extends React.Component {
	state = {
		isLoading: true,
		streamId: null,
	};
	// componentWillMount() {
	//   this.props.stream$.then(stream => {
	//     this.setState({ streamId: stream.id, isLoading: false });
	//   });
	// }
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
