const http = require("http");

const server = http.createServer((req, res) => {
  console.log("request received");
  console.log(req.headers);
  res.setHeader("Content-Type", "text/html");
  res.setHeader("x-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(
    `<html>
      <head>
        <style>
          span {height: 50px;}
          .normal {height: 100px; width:30px;background-color:rgb(0,255,0);}
          .container {color: pink; font-size: 14px; display:flex;width:300px;height:200px;background-color:rgb(255,0,0); justify-content:space-between;}
          #my-img {height:80px; width: 100px; align-self: center;background-color: rgb(0,0,255);}
        </style>
      </head>
      <body>
        <div class="container">
          <span id="my-img"></span>
          <span class="normal"></span>
        </div>
      </body>
    </html>`
  );
});

server.listen(8088);
