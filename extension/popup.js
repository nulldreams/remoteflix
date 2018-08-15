function connect() {
  chrome.tabs.executeScript({
    file: 'connect.js'
  })
}
// function sendMessage() {
//   chrome.tabs.executeScript({
//     file: 'messages.js'
//   })
// }

// function playResume() {
//   chrome.tabs.executeScript({
//     file: 'youtube/functions/play-resume.js'
//   })
// }
// function next() {
//   chrome.tabs.executeScript({
//     file: 'youtube/functions/next.js'
//   })
// }

// function connect() {
//   chrome.tabs.executeScript({
//     file: 'netflix/functions/read.js'
//   })
// }

document.getElementById('connect').addEventListener('click', connect)
// document.getElementById('play').addEventListener('click', playResume)
// document.getElementById('next').addEventListener('click', next)