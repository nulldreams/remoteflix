const fastify = require('fastify')()
const app = fastify
const cors = require('cors')
app.use(cors())
const port = process.env.PORT || 5000
const io = require('socket.io')(app.server)

const ngrok = require('ngrok')
const qrcode = require('qrcode-terminal')

async function generateURL (port) {
    let url = await ngrok.connect(port)
    generateQRCode(url)
    return url
}

async function generateQRCode (url) {
    return new Promise((resolve, reject) => {
        qrcode.generate(url, { small: true }, (_qrcode) => {
            return console.log(_qrcode)
        })
    })
}

io.on('connection', function (socket) {

    socket.on('stream', (msg) => {
        io.sockets.emit('stream', msg)
    })

    socket.on('all-shows', (shows) => {
        io.sockets.emit('all-shows', shows)
    })

    socket.on('all-genres', (shows) => {
        io.sockets.emit('all-genres', shows)
    })

    socket.on('list-genre', (shows) => {
        io.sockets.emit('list-genre', shows)
    })

    socket.on('info-show', (info_show) => {
        io.sockets.emit('info-show', info_show)
    })

    socket.on('disconnect', function () {

    })
})

app.listen(port, '0.0.0.0', async (localhost) => {
    let server = await generateURL(port)
})