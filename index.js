const cheerio = require('cheerio');

var imageText = 'Picture';
var tableText = 'Table'
var indexNumber = 0;
var tableCount = 0;
var imageCount = 0;
var bl = false;

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
      var pageLevel = '';

      if(this.options.pluginsConfig['chartnumber'].image !== undefined)
        imageText = this.options.pluginsConfig['chartnumber'].image;
      if(this.options.pluginsConfig['chartnumber'].table !== undefined)
        tableText = this.options.pluginsConfig['chartnumber'].table;
      $ = cheerio.load(page.content);
      if (page.level == '1') bl = true;
      if (bl) pageLevel = '1.' + page.level;
      else pageLevel = page.level;

      if (pageLevel == '1.1')
      {
        tableCount = 0;
        imageCount = 0;
      }
      var currentNumber = Number(pageLevel.match(/(?<=^\d+\.)\d+/))
      if (indexNumber < currentNumber) {
        tableCount = 0;
        imageCount = 0;
        indexNumber = currentNumber;
      }
      $('table').each(function(i, table){
        var tableTitle = '';
        if ($(table).prev('blockquote').html())
        {
          tableTitle = $(table).prev('blockquote').text();
          $(table).prev('blockquote').remove();
        }
        tableCount++;
        var div = $(table).wrap('<div style="page-break-inside: avoid; text-align:center;"></div>')
        $(table).before('<p class="chartnumber">' + tableText + ". " + currentNumber + ' - ' + tableCount + '&nbsp;&nbsp;' + tableTitle);
      });
      $('img').each(function(i, img){
        if($(img).parent().parent().prop("tagName") === "BODY" && !$(img).parent().text().trim())
        {
          var imageTitle = '';
          if ($(img).parent().prev('blockquote').html())
          {
            imageTitle = $(img).parent().prev('blockquote').text();
            $(img).parent().prev('blockquote').remove();
            imageCount++;
            var div = $(img).wrap('<div class="wrap" style="page-break-inside: avoid; text-align:center;"></div>')
            $(img).after('<p class="imagenumber">' + imageText + ". " + currentNumber + ' - ' + imageCount + '&nbsp;&nbsp;' + imageTitle);
          }
          if ($(img).parent().prev().prev('blockquote').html())
          {
            imageTitle = $(img).parent().prev().prev('blockquote').text();
            $(img).parent().prev().prev('blockquote').remove();
            imageCount++;
            var div = $(img).wrap('<div class="wrap" style="page-break-inside: avoid;"></div>')
            $(img).after('<p class="imagenumber">' + imageText + ". " + currentNumber + ' - ' + imageCount + '&nbsp;&nbsp;' + imageTitle);
          }
        }
      });
      page.content = $.html();
      return page;
    }
  }
}
