const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".playlist");
const heading = $(".header-desc");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");

const app = {
    currentIndex: 0,
    isPlaying: false,

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
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
          <div class="song">
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

        $(".playlist").innerHTML = htmls.join("");
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
                app.isPlaying = false;
                audio.pause();
                player.classList.remove("playing");
            } else {
                app.isPlaying = true;
                audio.play();
                player.classList.add("playing");
            }
        };
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    start: function () {
        this.defineProperties();

        this.loadCurrentSong();

        this.render();

        this.handleEvents();
    },
};

app.start();
