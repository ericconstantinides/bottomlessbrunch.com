const Crawler = require('crawler')
const myHelpers = require('../lib/myHelpers.js')
const sanitizeHtml = require('sanitize-html')

module.exports = function (yId, postCallback) {
  const myCrawler = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error)
      } else {
        var $ = res.$
        // $ is Cheerio by default
        // a lean implementation of core jQuery designed specifically for the server
        const yObj = {}
        yObj.fetchedTime = new Date()
        $('.bordered-rail .ylist .short-def-list dl').each((i, item) => {
          const q = myHelpers.camelize(
            sanitizeHtml($(item).find('dt').text())
              .trim()
          )
          const a = myHelpers.booleanArrayOrString(
            sanitizeHtml($(item).find('dd').text())
              .trim()
          )
          yObj[q] = a
        })
        postCallback(yObj)
      }
      done()
    }
  })

  const yUrl = `https://www.yelp.com/biz/${yId}`

  // Queue just one URL, with default callback
  myCrawler.queue(yUrl)
}
