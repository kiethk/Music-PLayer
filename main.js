const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Music Player";

const playlist = $(".playlist");
const heading = $(".header-desc");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const preBtn = $(".btn-pre");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "7 years",
            singer: "Lukas Graham",
            path: "./assets/audio/song1.weba",
            image: "./assets/img/thumb1.jpg",
        },
        {
            name: "Attention",
            singer: "Charlie Puth",
            path: "./assets/audio/song2.weba",
            image: "./assets/img/thumb2.jpg",
        },
        {
            name: "Die With A Smile",
            singer: "Lady Gaga, Bruno Mars",
            path: "./assets/audio/song3.weba",
            image: "./assets/img/thumb3.jpg",
        },
        {
            name: "See You Again",
            singer: "Wiz Khalifa",
            path: "./assets/audio/song4.weba",
            image: "./assets/img/thumb4.jpg",
        },
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: "./assets/audio/song5.weba",
            image: "./assets/img/thumb5.jpg",
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
          <div class="song ${
              index === this.currentIndex ? "active" : ""
          }" data-index="${index}">
                    <div
                        class="thumb"
                        class="cd-thumb"
                        style="
                            background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
          `;
        });

        playlist.innerHTML = htmls.join("");
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth;

        //Handling CD rotate/stop
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 20000, // 10 seconds
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();
        //Zoom in/out CD
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //Handle clicking play button
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        //Audio is playing
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        //Audio is pausing
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        //When the song's progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                progress.value = Math.floor(
                    (audio.currentTime * 100) / audio.duration
                );
            }
        };

        //Handling when rewinding songs
        progress.onchange = function (e) {
            audio.currentTime = (e.target.value * audio.duration) / 100;
        };

        //         When next Song
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        };
        //When previous Song
        preBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.preSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        };

        //Handling turn on/off random mode
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            app.setConfig("isRandom", app.isRandom);
            randomBtn.classList.toggle("active", app.isRandom);
        };

        //Handling play a song repeat
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            app.setConfig("isRepeat", app.isRepeat);
            repeatBtn.classList.toggle("active", app.isRepeat);
        };

        // Handling next song when audio ended
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closet(".option")) {
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        };
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }, 300);
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * app.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        this.loadConfig();

        this.defineProperties();

        this.loadCurrentSong();

        this.render();

        this.handleEvents();

        //
        repeatBtn.classList.toggle("active", app.isRepeat);
        randomBtn.classList.toggle("active", app.isRandom);
    },
};

app.start();
