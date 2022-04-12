const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const PLAYER_STORAGE_KEY = "music-player";

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Counting Stars",
      singer: "OneRepublic",
      image: "./assets/img/counting-star.jpg",
      path: "./assets/music/CountingStars-OneRepublic-5506215.mp3",
    },
    {
      name: "Mirrors",
      singer: "Justin Bieber",
      image: "./assets/img/mirrors.jpg",
      path: "./assets/music/Mirrors-JustinTimberlake-2469630.mp3",
    },
    {
      name: "Wellerman",
      singer: "NathanEvans",
      image: "./assets/img/wellerman.jpg",
      path: "./assets/music/WellermanSeaShanty-NathanEvans-6992825.mp3",
    },
    {
      name: "Something Just Like This",
      singer: "Coldplay, the Chainsmokers",
      image: "./assets/img/something-just-like-this.jpg",
      path: "./assets/music/SomethingJustLikeThis-TheChainsmokersColdplay-5337136.mp3",
    },
    {
      name: "Apologize",
      singer: "Timbaland",
      image: "./assets/img/apologize.jpg",
      path: "./assets/music/Apologize-TimbalandOneRepublic-5910232.mp3",
    },
    {
      name: "Blank Space",
      singer: "Taylor Swift",
      image: "./assets/img/blank-space.jpg",
      path: "./assets/music/BlankSpace-TaylorSwift-6077900.mp3",
    },
    {
      name: "I Really Like You",
      singer: "Carly RaeJepsen",
      image: "./assets/img/i-really-like-you.jpg",
      path: "./assets/music/IReallyLikeYou-CarlyRaeJepsen-3940527.mp3",
    },
    {
      name: "Lemon Tree",
      singer: "Fools Garden",
      image: "./assets/img/lemon-tree.jpg",
      path: "./assets/music/LemonTree-FoolsGarden_45ena.mp3",
    },
    {
      name: "Shake It Off",
      singer: "Taylor Swift",
      image: "./assets/img/shake-it-off.jpg",
      path: "./assets/music/ShakeItOff-TaylorSwift-6077891.mp3",
    },
    {
      name: "Shape Of You",
      singer: "Anton Hagman",
      image: "./assets/img/shape-of-you.jpg",
      path: "./assets/music/ShapeOfYou-AntonHagman-4899187.mp3",
    },
    {
      name: "Shake It Off",
      singer: "Taylor Swift",
      image: "./assets/img/shake-it-off.jpg",
      path: "./assets/music/ShakeItOff-TaylorSwift-6077891.mp3",
    },
    {
      name: "Shape Of You",
      singer: "Anton Hagman",
      image: "./assets/img/shape-of-you.jpg",
      path: "./assets/music/ShapeOfYou-AntonHagman-4899187.mp3",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index=${index}>
        <div
          class="thumb"
          style="background-image: url('${song.image}')"
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });

    return (playlist.innerHTML = htmls.join(""));
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });

    cdThumbAnimate.pause();

    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomPlay();
      } else {
        _this.nextSong();
      }
      _this.scrollActiveSong();
      _this.render();
      audio.play();
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomPlay();
      } else {
        _this.prevSong();
      }
      _this.render();
      _this.scrollActiveSong();
      audio.play();
    };

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  scrollActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomPlay: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
