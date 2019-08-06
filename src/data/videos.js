const language = navigator.language.slice(0, 2) == "sv" ? "sv" : "da";

export default {
  "ready-player-one": {
    title: "Ready Player One",
    poster:
      "https://image.tmdb.org/t/p/original/q7fXcrDPJcf6t3rzutaNwTzuKP1.jpg",
    cover:
      "https://image.tmdb.org/t/p/original/pU1ULUq8D3iRxl1fdX2lZIzdHuI.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/q7fXcrDPJcf6t3rzutaNwTzuKP1.jpg",
    src:
      "https://static.subreader.dk/trailers/ready-player-one-trailer-3_i320.m4v",
    tracks: [
      {
        language: "da",
        label: "Dansk",
        default: language == "da",
        kind: "subtitles",
        src: "trailers/ready-player-one/da.vtt"
      },
      {
        language: "sv",
        label: "Svenska",
        default: language == "sv",
        kind: "subtitles",
        src: "trailers/ready-player-one/sv.vtt"
      }
    ]
  },
  "avengers-infinity-war": {
    title: "Avengers: Infinity War",
    cover:
      "https://image.tmdb.org/t/p/w600_and_h900_bestv2/544LXWd8lerbryS251XQltF1Gs9.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/xmgAsda5sPNpx5ghJibJ80S7Pfx.jpg",
    poster:
      "https://image.tmdb.org/t/p/original/xmgAsda5sPNpx5ghJibJ80S7Pfx.jpg",
    src:
      "https://static.subreader.dk/trailers/avengers-infinity-war-trailer-1_a720p.m4v",
    tracks: [
      {
        language: "da",
        label: "Dansk",
        default: language == "da",
        kind: "subtitles",
        src: "trailers/avengers-infinity-war/da.vtt"
      },
      {
        language: "sv",
        label: "Svenska",
        default: language == "sv",
        kind: "subtitles",
        src: "trailers/avengers-infinity-war/sv.vtt"
      }
    ]
  },
  "deadpool-2": {
    title: "Deadpool 2",
    cover:
      "https://image.tmdb.org/t/p/w600_and_h900_bestv2/wZiUdM8lVbpTYqDjVjgbzMUtKQD.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/fdSWl53eyOlYEcScy4omKibsuaZ.jpg",
    poster:
      "https://image.tmdb.org/t/p/original/fdSWl53eyOlYEcScy4omKibsuaZ.jpg",
    src: "https://static.subreader.dk/trailers/deadpool-2-teaser-1_i320.m4v",
    tracks: [
      {
        language: "da",
        label: "Dansk",
        default: language == "da",
        kind: "subtitles",
        src: "trailers/deadpool-2/da.vtt"
      },
      {
        language: "sv",
        label: "Svenska",
        default: language == "sv",
        kind: "subtitles",
        src: "trailers/deadpool-2/sv.vtt"
      }
    ]
  },
  "star-wars-solo": {
    title: "Solo: A Star Wars Story",
    cover:
      "https://image.tmdb.org/t/p/w600_and_h900_bestv2/4oD6VEccFkorEBTEDXtpLAaz0Rl.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/y9jGaGNn1dQDhPkhMumXaLize73.jpg",
    poster:
      "https://image.tmdb.org/t/p/original/y9jGaGNn1dQDhPkhMumXaLize73.jpg",
    src:
      "https://static.subreader.dk/trailers/solo-a-star-wars-story-teaser-1_i320.m4v",
    tracks: [
      {
        language: "da",
        label: "Dansk",
        default: language == "da",
        kind: "subtitles",
        src: "trailers/star-wars-solo/da.vtt"
      },
      {
        language: "sv",
        label: "Svenska",
        default: language == "sv",
        kind: "subtitles",
        src: "trailers/star-wars-solo/sv.vtt"
      }
    ]
  },
  /*  "la-la-land": {
    title: "La La Land",
    cover:
      "https://image.tmdb.org/t/p/original/48V533KhwWiJauZjoYawej1gWUj.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/vFR4EMDkSH6X2wtpFrgFcT6jCus.jpg",
    poster:
      "https://image.tmdb.org/t/p/original/vFR4EMDkSH6X2wtpFrgFcT6jCus.jpg",
    src:
      "http://movietrailers.apple.com/movies/summit/lalaland/la-la-land-trailer-3-usca_i320.m4v",
    tracks: [
      {
        language: "da",
        label: "Dansk",
        default: true,
        kind: "subtitles",
        src: "trailers/la-la-land/da.vtt"
      }
    ]
  },*/
  "the-post": {
    title: "The Post",
    poster:
      "https://image.tmdb.org/t/p/original/4MNUxckmk3DOGpvDYk4IPs0R4Ks.jpg",
    cover:
      "https://image.tmdb.org/t/p/original/h4XG3g6uMMPIBPjAoQhC2QIMdkl.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/8sb4aBST28vN3rBz704XJczS0Ld.jpg",
    src: "https://static.subreader.dk/trailers/the-post-trailer-1_i320.m4v",
    tracks: [
      {
        language: "da",
        label: "Dansk",
        default: language == "da",
        kind: "subtitles",
        src: "trailers/the-post/da.vtt"
      },
      {
        language: "sv",
        label: "Svenska",
        default: language == "sv",
        kind: "subtitles",
        src: "trailers/the-post/sv.vtt"
      }
    ]
  }
};
