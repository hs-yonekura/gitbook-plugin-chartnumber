const cheerio = require('cheerio');

var imageText = 'Picture';
var tableText = 'Table'

module.exports = {
  book: {
    assets: './assets',
    css: {
      website: 'chartnumber.css',
      epub: 'chartnumber.css'
    }
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
        var div = $(table).wrap('<div style="text-align:center;"></div>')
        $(table).before('<p class="chartnumber">' + tableText + ": " + page.level.replace(/^1\./, '') + '. - ' + tableCount);
      });
      $('img').each(function(i, img){
        if($(img).parent().prop("tagName") === "P" && $(img).parent().parent().prop("tagName") === "BODY" && !$(img).parent().text().trim())
        {
          imageCount++;
          var div = $(img).wrap('<div style="page-break-inside: avoid; text-align:center;"></div>')
          $(img).before('<p class="chartnumber">' + imageText + ": " + page.level.replace(/^1\./, '') + '. - ' + imageCount);
        }
      });
      page.content = $.html();
      return page;
    }
  }
}
