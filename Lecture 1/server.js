const http = require("http");

const server = http.createServer(function (req, res) {
  if (req.url === "/") {
    res.end("Welcome to Node Server");
  } else if (req.url === "/about") {
    res.end("About Page");
  } else if (req.url === "/contact") {
    res.end("Contact Page");
  } else {
    res.writeHead(404);
    res.end("404 - Page Not Found");
  }
});

const PORT = 3000;

server.listen(PORT, function () {
  console.log("Server running at http://localhost:" + PORT);
});