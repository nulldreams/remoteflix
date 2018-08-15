const ngrok = require('ngrok')
const qrcode = require('qrcode-terminal')

exports.generateURL = async (port) => {
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