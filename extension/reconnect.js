window.onload = function () {
    if (window.localStorage.getItem('remote-connect')) {
        // var socket = io.connect('https://socket-controller.herokuapp.com')
        var socket = io.connect('http://localhost:5000')

        socket.on('connect', function () {
            console.log('Client reconnected')
            socket.emit('stream', 'connected')
        })

        socket.on('stream', function (msg) {
            if (msg === 'parar/continuar') play()
            if (msg === 'next') next()
            if (msg === 'fullscreen') fullscreen()
            if (msg.indexOf('open') > -1) open(msg.replace('open:', ''))
            if (msg === 'all-genres') listGenres()
            if (msg.indexOf('list-genre') > -1) readGenre(msg.split(':')[1])
        })

        function getShowInfo() {
            let infoShow = {
                name: document.getElementsByClassName('ellipsize-text')[0].getElementsByTagName('h4')[0].innerText,
                season: document.getElementsByClassName('ellipsize-text')[0].getElementsByTagName('span')[0].innerText,
                episode_name: document.getElementsByClassName('ellipsize-text')[0].getElementsByTagName('span')[1].innerText
            }

            socket.emit('info-show', infoShow)
        }

        function play() {
            if (document.getElementsByClassName('button-nfplayerPause').length > 0) document.getElementsByClassName('button-nfplayerPause')[0].click()
            if (document.getElementsByClassName('button-nfplayerPlay').length > 0) document.getElementsByClassName('button-nfplayerPlay')[0].click()
        }

        function next() {
            if (document.getElementsByClassName('button-nfplayerNextEpisode').length > 0) document.getElementsByClassName('button-nfplayerNextEpisode')[0].click()
        }

        function fullscreen() {
            // if (document.getElementsByClassName('button-bvuiFullScreenOn').length > 0) document.getElementsByClassName('button-bvuiFullScreenOn')[0].click()
            // if (document.getElementsByClassName('button-bvuiFullScreenOff').length > 0) document.getElementsByClassName('button-bvuiFullScreenOff')[0].click()
            var
                el = document.documentElement,
                rfs =
                el.requestFullScreen ||
                el.webkitRequestFullScreen ||
                el.mozRequestFullScreen;
            rfs.call(el);
        }

        function open(path) {
            path = path.substring(0, path.indexOf('?'))
            window.location.href = `https://www.netflix.com${path}`
        }

        async function readGenre(genre) {
            let arr_shows = []

            function read(indice, cb) {
                let _shows = document.getElementsByClassName('lolomoRow')[indice].getElementsByClassName('slider-item')
                for (let i = 0; i < _shows.length; i++) {
                    if (_shows[i].getElementsByTagName('a')[0] !== undefined || _shows[i].getElementsByTagName('img')[0] !== undefined) {
                        arr_shows.push({
                            path: _shows[i].getElementsByTagName('a')[0].getAttribute('href'),
                            img: _shows[i].getElementsByTagName('img')[0].getAttribute('src'),
                            name: _shows[i].getElementsByClassName('fallback-text')[0].innerText
                        })
                    }
                    if (i + 1 === _shows.length) {
                        return cb(null, arr_shows)
                    }
                }
            }
            async function click(i, cb) {
                document.getElementsByClassName('handleNext')[i].click()
                setTimeout(() => {
                    return cb(null, true)
                }, 1000)
            }

            click(genre, (err, done) => {
                if (done) {
                    read(genre, (err, shows) => {
                        if (shows) {
                            socket.emit('list-genre', shows)
                        }
                    })
                }
            })
        }

        async function listGenres() {
            let last = window.innerHeight + document.body.scrollTop
            let list = []


            async function scrollToBottom() {
                bottom = document.body.scrollHeight
                current = window.innerHeight + document.body.scrollTop
                console.log(bottom, current, last)
                if ((bottom - current) > 0 && last !== bottom) {
                    last = bottom
                    window.scrollTo(0, bottom)
                    setTimeout(() => {
                        scrollToBottom()
                    }, 1000)
                } else if (last === bottom) {
                    console.log('we are in the bottom')
                    await allGenres()
                }
            }
            async function allGenres() {
                let genres = document.getElementsByClassName('row-header-title')
                for (let i = 0; i < genres.length; i++) {
                    list.push(document.getElementsByClassName('row-header-title')[i].innerText)
                    if (i + 1 === genres.length) {
                        socket.emit('all-genres', list)
                    }
                }
            }
            await scrollToBottom()
        }

        function read() {
            let last = window.innerHeight + document.body.scrollTop
            let arr_shows = []
            let indice = 0

            async function scrollToBottom() {
                bottom = document.body.scrollHeight
                current = window.innerHeight + document.body.scrollTop
                console.log(bottom, current, last)
                if ((bottom - current) > 0 && last !== bottom) {
                    last = bottom
                    window.scrollTo(0, bottom)
                    document.getElementsByClassName('icon-rightCaret')[indice].click()
                    document.getElementsByClassName('icon-rightCaret')[indice].click()
                    document.getElementsByClassName('icon-rightCaret')[indice].click()
                    indice++
                    setTimeout(() => {
                        scrollToBottom()
                    }, 1000)
                } else if (last === bottom) {
                    console.log('we are in the bottom')
                    console.log(document.getElementsByClassName('slider-item').length)
                    shows()
                }
            }

            function shows() {
                let _shows = document.getElementsByClassName('slider-item')
                for (let i = 0; i < _shows.length; i++) {
                    if (_shows[i].getElementsByTagName('a')[0] !== undefined || _shows[i].getElementsByTagName('img')[0] !== undefined) {
                        arr_shows.push({
                            path: _shows[i].getElementsByTagName('a')[0].getAttribute('href'),
                            img: _shows[i].getElementsByTagName('img')[0].getAttribute('src'),
                            name: _shows[i].getElementsByClassName('fallback-text')[0].innerText
                        })
                        console.log(arr_shows.length, i)
                    }
                    if (i + 1 === _shows.length) {
                        socket.emit('all-shows', arr_shows)
                    }
                }
            }
            scrollToBottom()
        }
    }
}