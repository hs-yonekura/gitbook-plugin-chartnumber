const cheerio = require('cheerio');

module.exports = {
  hooks: {
    "page": function(page){
      $ = cheerio.load(page.contents());
      $('table').each(function(i, table)){
        console.log($(table).html());
      }
    }
  }
}
