const http = require("http");
const url = require("url");
const fs = require("fs").promises;

const bicycles = require("./data/data.json");
// console.log(bicycles);
//Server
const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return;
  //   console.log(req.url);
  //   console.log(req.headers);

  //parsing url
  const myUrl = new URL(req.url, `http://${req.headers.host}/`); //dynamic host name

  const pathname = myUrl.pathname;
  const id = myUrl.searchParams.get("id");

  //bicycle page
  if (pathname === "/") {
    let html = await fs.readFile("./views/bicycles.html", "utf-8");
    const eachBicycle = await fs.readFile(
      "./views/partials/bicycle.html",
      "utf-8"
    );

    let allBicycles = "";
    for (let index = 0; index < 6; index++) {
      allBicycles += replaceTemplate(eachBicycle, bicycles[index]);
    }
    html = html.replace(/<%ALLBICYCLES%>/g, allBicycles);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  }
  //overview page
  else if (pathname === "/bicycle" && id >= 0 && id <= 5) {
    let html = await fs.readFile("./views/overview.html", "utf-8");
    const bicycle = bicycles.find((b) => b.id === id);

    html = replaceTemplate(html, bicycle);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  }
  //Images
  else if (/\.(png)$/i.test(req.url)) {
    const image = await fs.readFile(`./public/images/${req.url.slice(1)}`);
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(image);
  } else if (/\.(svg)$/i.test(req.url)) {
    const svg = await fs.readFile(`./public/images/icons.svg`);
    res.writeHead(200, { "Content-Type": "image/svg+xml" });
    res.end(svg);
  }
  //CSS
  else if (/\.(css)$/i.test(req.url)) {
    const css = await fs.readFile(`./public/css/index.css`);
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(css);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<div> <h2>File Not Found</h2> </div>");
  }

  //   res.writeHead(200, { "Content-Type": "text/html" });
  //   res.end("<h1>Welcome to the bicycle shop!</h1>");
});

server.listen(3000);

function replaceTemplate(html, bicycle) {
  html = html.replace(/<%IMAGE%>/g, bicycle.image);
  html = html.replace(/<%NAME%>/g, bicycle.name);

  let price = bicycle.originalPrice;
  if (bicycle.hasDiscount) {
    price = (price * (100 - bicycle.discount)) / 100;
  }
  html = html.replace(/<%NEWPRICE%>/g, ` $${price}.00`);
  html = html.replace(/<%OLDPRICE%>/g, `$${bicycle.originalPrice}.00`);
  html = html.replace(/<%ID%>/g, bicycle.id);

  if (bicycle.hasDiscount) {
    html = html.replace(
      /<%DISCOUNTRATE%>/g,
      `<div class="discount__rate">
        <p>${bicycle.discount}% Off</p>
      </div>
      `
    );
  } else {
    html = html.replace(/<%DISCOUNTRATE%>/g, "");
  }

  for (let index = 0; index < bicycle.star; index++) {
    html = html.replace(/<%STAR%>/, "checked");
  }
  html = html.replace(/<%STAR%>/g, "");
  return html;
}
