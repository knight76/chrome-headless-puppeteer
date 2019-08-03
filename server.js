const http = require('http')
const puppeteer = require('puppeteer')
const url = require('url')

const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600
const port = 3000

http.createServer(async (request, response) => {
  const urlParts = url.parse(request.url, true)
  const urlPathname = urlParts.pathname
  const urlParams = urlParts.query
  const requrl = urlParams['url']

  if (!requrl) {
    response.writeHead(200)
    response.end('Capture Service.')
    return
  }

  let browerWidth, browerHeight
  if (urlPathname === '/capture') {
    if (parseInt(urlParams['w'], 0) > 0) {
      browerWidth = parseInt(urlParams['w'], 0)
    }
    if (parseInt(urlParams['h'], 0) > 0) {
      browerHeight = parseInt(urlParams['h'], 0)
    }
  } else if (urlPathname === '/check.html') {
    response.writeHead(200)
    response.end()
  } else {
    response.writeHead(500)
    response.end()
    return
  }

  if (!browerWidth) {
    browerWidth = DEFAULT_WIDTH
  }
  if (!browerHeight) {
    browerHeight = DEFAULT_HEIGHT
  }

  let page
  try {
    const browser = await puppeteer.launch({
             args: ['--no-sandbox']
    });

    page = await browser.newPage()
    await page.setViewport({
      width: browerWidth,
      height: browerHeight
    })

    await page.goto(requrl, {
      waitUntil: 'networkidle2'
    })

    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 100
    })

    console.log("5")
    response.writeHead(200, {
      'content-type': 'image/jpg',
      'cache-control': 'public,max-age=60,immutable'
    })

    response.end(screenshot, 'binary')
  } catch (e) {
    console.log(e)
    response.writeHead(500, {
      'Content-Type': 'text/plain'
    })
    response.end('UNKNOWN ERROR(500)!!')
  } finally {
    if (page && page.isClosed() == false) {
      await page.close()
    }
  }
}).listen(port)

console.log(`Capture server running port : ${port}...`)
