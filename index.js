const cheerio = require('cheerio');

var imageText = 'Picture';
var tableText = 'Table'

module.exports = {
  book: {
    assets: './assets',
    css: [
      'chartnumber.css'
    ]
  },
  hooks: {
    "page": function(page) {
      var tableCount = 0;
      var imageCount = 0;
      if(this.options.pluginsConfig['chartnumber'].image !== undefined)
        imageText = this.options.pluginsConfig['chartnumber'].image;
      if(this.options.pluginsConfig['chartnumber'].table !== undefined)
        tableText = this.options.pluginsConfig['chartnumber'].table;
      $ = cheerio.load(page.content);
      $('table').each(function(i, table){
        tableCount++;
        $(table).before('<p class="chartnumber">' + tableText + ": " + page.level.replace(/^1\./, '') + '.-' + tableCount);
      });
      $('img').each(function(i, img){
        imageCount++;
        $(img).before('<p class="chartnumber">' + imageText + ": " + page.level.replace(/^1\./, '') + '.-' + imageCount);
      });
      page.content = $.html();
      return page;
    }
  }
}
