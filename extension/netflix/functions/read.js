(() => {
    let last = window.innerHeight + document.body.scrollTop
	let arr_shows = []
    console.log(document.getElementsByClassName('slider-item').length)

    function scrollToBottom() {
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
            if (i + 1 === _shows.length) console.log(arr_shows)
        }
    }
    scrollToBottom()
})()