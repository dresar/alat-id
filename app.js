// Simple static server for Passenger on cPanel
// Melayani file statis dari direktori tempat app.js berada.
// Fallback ke index.html untuk routing SPA/Next export.

const http = require('http')
const fs = require('fs')
const path = require('path')

const root = __dirname
const port = process.env.PORT || 3000

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
}

function sendFile(res, filePath, status = 200) {
  const ext = path.extname(filePath).toLowerCase()
  const type = mime[ext] || 'application/octet-stream'
  res.writeHead(status, { 'Content-Type': type })
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0])
    let safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
    if (safePath === '/' || safePath === '') safePath = '/index.html'

    const filePath = path.join(root, safePath)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(res, filePath)
    }

    const fallback = path.join(root, 'index.html')
    if (fs.existsSync(fallback)) {
      return sendFile(res, fallback)
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found')
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Server error')
  }
})

server.listen(port, () => {
  console.log(`Static server running on port ${port}`)
})

module.exports = server

