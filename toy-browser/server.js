const http = require('http');

const server = http.createServer((req, res) => {
    console.log('request received')
    console.log(req.headers)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('x-Foo', 'bar');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(
        `<html>
            <head>
                <style>
                    body {background: red;}
                </style>
            </head>
            <body>
                <div class="container" title='con'>
                    <img src="#" alt="test"></img>
                </div>
            </body>
        </html>`
    );
});

server.listen(8088);
