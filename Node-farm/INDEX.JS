const fs = require('fs');
const http = require('http'); // gives networking capability ie. building networking server
const url = require('url');

const slugify=require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

// slug is last part of our url
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const tempOverview = fs.readFileSync(
  `Node-farm/template/overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `Node-farm/template/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `Node-farm/template/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync('Node-farm/dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// const slugs = dataObj.map(el => slugify(el.productName,{lower:true}));
// console.log(slugs);
//console.log(slugify('Fresh Avacados',{lower : true}));



const server = http.createServer((req, res) => {
  // istconsole.log(req.url);
  console.log(url.parse(req.url,true)); // parse the url into objects
 // const { query, pathname } = url.parse(req.url, true);
  const pathname = req.url;

  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(' ');
    // console.log(cardsHtml)
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // 1res.end(tempOverview);
    res.end(output);

    // PRODUCT PAGE
  } else if (pathname === '/product') {
    // istconsole.log(query);
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //res.end("this is the product");
  }

  //API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //res.end("API");
  }

  // NOT FOUND
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello coders',
    }); // for making status code
    res.end('Page NOT FOUND'); // THE 404 ERROR IS CALLED HTTP STATUS CODE
  }
});
//start listening for incoming request => starting up the server

server.listen(8000, '127.0.0.1', () => {
  // first is port ,second= host
  console.log('listening to request on port 8000');
});
