const express = require('express')
const path = require("path");
const translate = require('translate-google')
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({ store: 'memory', max: 10000, ttl: 60 * 60 * 3 });
var Pornsearch = require('./collector');
const app = express()
const port = 5000
app.use('/public',express.static(__dirname +'/static'))
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', (req, res) => {
  provider.getUrl().then((data) => {
    res.render('index', { data: data });
  })
})

app.get('/search-:keywords.html', (req, res) => {
  let keywords = req.params.keywords
  let pornsearch=new Pornsearch()
    pornsearch.getVideoList(keywords).then((data) => {
      res.render('index', { data: data });
    })
  // translate(keywords, { to: 'en' }).then(text => {
  //   console.log(text)
  //   // memoryCache.set('foo', 'bar', { ttl: ttl }, function (err) {
  //   //   if (err) { throw err; }
  //   //   memoryCache.get('foo', function (err, result) {
  //   //     console.log(result);
  //   //     memoryCache.del('foo', function (err) { });
  //   //   });
  //   // });
    
  // });
})
app.get('/detail.html', (req, res) => {
  res.render('detail', {});
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;