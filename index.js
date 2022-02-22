const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return;
  console.log(req.url);
  console.log(req.headers);
  //parsing url
  const myUrl = new URL(req.url, `http://${req.headers.host}/`); //dynamic host name

  const pathname = myUrl.pathname;
  const id = myUrl.searchParams.get("id");
  console.log(pathname, id);

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>Welcome to the bicycle shop!</h1>");
});

server.listen(3000);
