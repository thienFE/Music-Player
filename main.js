const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const hero = $('.hero')
const cdWrapper = $('.cd-wrapper')
const audio = $('#audio')
const playBtn = $('.play-btn')
const progress = $('#progress-input')
const currentTime = $('.current-time')
const timeTotal = $('.time-total')
const itemContainer = $('.music-list .item-container')
const nextBtn = $('.next-btn')
const prevBtn = $('.prev-btn')
const randomBtn = $('.random-btn')
const listBtn = $('.list-btn')
const musicList = $('.music-list')
const playingIcon = $('.playing-icon')
const lyricsContent = $('.lyrics-content')

const app = {
    isPlaying: false,
    isRandom: false,
    isRedo: false,
    displayDiscIcon: false,
    checkClickNumber: 0,
    currentIndex: 0,
    songs: [    
        {
            name: 'All Falls Down',
            singer: 'Alan Walker ft. Noah Cyrus & Digital Farm Animals',
            path: './songs/All Falls Down.mp3',
            image: './music_img/AllFallsDown.webp'
        },
        {
            name: 'Âm thầm bên em',
            singer: 'Sơn Tùng M-TP',
            path: './songs/Am tham ben em.mp3',
            image: './music_img/AmThamBenEm.webp'
        },
        {
            name: 'So Far Away Acoustic (Cover)',
            singer: 'Adam Christopher',
            path: './songs/So Far Away Acoustic (Cover).mp3',
            image: './music_img/SoFarAway.webp'
        },
        {
            name: 'Comethru',
            singer: 'Jeremy Zucker feat. Bea Miller',
            path: './songs/Comethru.mp3',
            image: './music_img/ComeThru.webp'
        },
        {
            name: 'Darkside',
            singer: 'Alan Walker ft. Au/Ra and Tomine Harket',
            path: './songs/Darkside.mp3',
            image: './music_img/DarkSide.webp'
        },
        {
            name: 'Inferno',
            singer: 'Sub Urban & Bella Poarch',
            path: './songs/INFERNO.mp3',
            image: './music_img/Inferno.jpg'
        },
        {
            name: 'How you like that',
            singer: 'BLACKPINK',
            path: './songs/HowYouLikeThat.mp3',
            image: './music_img/How you like that.jpg'
        },
        {
            name: 'Blue',
            singer: 'Big Bang',
            path: './songs/Blue.mp3',
            image: './music_img/Blue.webp'
        },
        {
            name: 'At My Worst (Cover)',
            singer: 'Harryan',
            path: './songs/At My Worst (Cover).mp3',
            image: './music_img/AtMyWorst.webp'
        },
        {
            name: '2002',
            singer: 'Anne-Marie',
            path: './songs/2002.mp3',
            image: './music_img/2002.webp'
        },
    ],
    loadSongList() {
        const html = this.songs.map((song, index) => {
            return `<div class="item ${index === this.currentIndex ? 'active' : ''}" id="${index === this.currentIndex ? 'musicList-item-' + index : ''}" data-index = ${index}>
            <div class="song-avatar" style="background-image: url('${song.image}');"></div>
                    <div class="song-infomation">
                        <span>
                            <p class="name">${song.name}</p>
                            <p class="author">${song.singer}</p>
                        </span>
                        <span class="info-bonus"><i class="fas fa-ellipsis-h"></i></span>
                    </div>
                </div>`
        }).join('')
        itemContainer.innerHTML = html
    },
    loadCurrentSong() {
        const html = `  <div class="cd" style="background-image: url('${this.songs[this.currentIndex].image}');">
                        </div>
                        <div class="song-info">
                            <p class="song-name">${this.songs[this.currentIndex].name}</p>
                            <span class="singer">${this.songs[this.currentIndex].singer}</span>
                        </div>`
        cdWrapper.innerHTML = html

        audio.src = `${this.songs[this.currentIndex].path}`

        //Adjust playingIcon pot into the song (on music list) is playing
        playingIcon.style.top = `calc(41px + 24px + 80px * ${this.currentIndex})`

        //load Song-List after render current song
        this.loadSongList()

        this.scrollIntoViewCurrentSongInMusicList()
    },
    loadNextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    loadPrevSong() {
        if (this.currentIndex > 0) {
            this.currentIndex--
        }
        this.loadCurrentSong()
    },
    loadRandomSong() {
        this.currentIndex = Math.floor(Math.random() * this.songs.length)
        this.loadCurrentSong()
    },
    scrollIntoViewCurrentSongInMusicList() {
        const currentItem = document.getElementById(`musicList-item-${this.currentIndex}`)
        setTimeout(() => {
            currentItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    handleAudio() {
        if (this.isPlaying) {
            audio.play()
        } else {
            audio.pause()
            currentTime.innerHTML = '0:00'
            progress.value = 0
        }
    },
    handleEvents() {
        const _this = this
        //Handle when click on play button
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                _this.isPlaying = false
                audio.pause()
                playBtn.innerHTML = `<i class="fas fa-play"></i>`
                playingIcon.classList.remove('active')
            } else {
                _this.isPlaying = true
                audio.play()
                playBtn.innerHTML = `<i class="fas fa-pause"></i>`
                playingIcon.classList.add('active')
            }
        }
        // Handle when song is playing
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                // update value of progess and display on progress bar
                progress.value = progressPercent

                //display current-time
                const currentTimeMinute = Math.floor(audio.currentTime / 60)
                const currentTimeSecond = Math.floor(audio.currentTime - currentTimeMinute * 60)
                if (currentTimeSecond >= 10) {
                    currentTime.innerHTML = `${currentTimeMinute}:${currentTimeSecond}`
                } else {
                    currentTime.innerHTML = `${currentTimeMinute}:0${currentTimeSecond}`
                }
                //display song duration
                const durationMinute = Math.floor(audio.duration / 60)
                const durationSecond = Math.floor(audio.duration - durationMinute * 60)
                if (durationSecond >= 10) {
                    timeTotal.innerHTML = `${durationMinute}:${durationSecond}`
                } else {
                    timeTotal.innerHTML = `${durationMinute}:0${durationSecond}`
                }
                //when end current song
                if (audio.currentTime === audio.duration) {
                    // normal mode
                    if (!_this.isRandom) {
                        if (!_this.isRedo) {
                            _this.loadNextSong()
                            audio.play()
                        }
                    }
                    // redo mode
                    if (_this.isRedo) {
                        if (!_this.isRandom) {
                            _this.loadCurrentSong()
                            audio.play()
                        }
                    }
                    // random mode
                    if (_this.isRandom) {
                        if (!_this.isRedo) {
                            _this.loadRandomSong()
                            audio.play()
                        }
                    }
                }
            }
        }
        //Handle when seek the song by click on progress input
        progress.oninput = () => {
            audio.currentTime = progress.value / 100 * audio.duration
        }
        //Handle when the users click on next button
        nextBtn.onclick = () => {
            nextBtn.classList.add('active')
            setTimeout(() => {
                nextBtn.classList.remove('active')
            }, 200)
            // Handle random mode is actived or not
            if (_this.isRandom) {
                _this.loadRandomSong()
                _this.handleAudio()

            } else {
                _this.loadNextSong()
                _this.handleAudio()
            }
        }
        //Handle when the users click on prev button
        prevBtn.onclick = () => {
            prevBtn.classList.add('active')
            setTimeout(() => {
                prevBtn.classList.remove('active')
            }, 200)
            // when random mode is actived or not
            if (_this.isRandom) {
                _this.loadRandomSong()
                _this.handleAudio()
            } else {
                _this.loadPrevSong()
                _this.handleAudio()
            }
        }
        //Handle when users turn on random mode or redo mode
        randomBtn.onclick = () => {
            _this.checkClickNumber++
            switch (_this.checkClickNumber) {
                // random mode
                case 1:
                    randomBtn.classList.remove('redo-mode')
                    randomBtn.innerHTML = '<i class="fas fa-random"></i>'
                    _this.isRandom = true
                    _this.isRedo = false
                    randomBtn.classList.add('active')
                    break
                // redo-mode
                case 2:
                    _this.isRedo = true
                    _this.isRandom = false
                    randomBtn.classList.add('redo-mode')
                    randomBtn.innerHTML = '<i class="redo-icon fas fa-redo"></i>'
                    break
                // normal mode
                case 3:
                    _this.isRedo = false
                    _this.isRandom = false
                    randomBtn.classList.remove('active')
                    randomBtn.innerHTML = '<i class="fas fa-random"></i>'
                    _this.checkClickNumber = 0
                    break
            }
        }
        // Handle when users click on list button
        listBtn.onclick = () => {
            _this.displayDiscIcon = !(_this.displayDiscIcon)
            musicList.classList.toggle('active')
            cdWrapper.classList.toggle('hide')
            if (_this.displayDiscIcon) {
                listBtn.innerHTML = '<i class="fas fa-compact-disc disc-icon" data-id="disc-icon"></i>'
            } else {
                listBtn.innerHTML = '<img src="https://img.icons8.com/ios-glyphs/30/000000/lounge-music-playlist.png"/>'
            }
        }
        // Listen click on the playlist behaviour
        musicList.onclick = (e) => {
            const songNode = e.target.closest('.item:not(.active)')
            if (songNode || e.target.closest('.info-bonus')) {
                // Handle when click on a song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    songNode.classList.add('active')
                    _this.handleAudio()
                }
            }
        }
    },

    start() {
        this.handleEvents()
        this.loadCurrentSong()
    }
}

app.start()
