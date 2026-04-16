const next = require('next');
const http = require('http');

const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev: true, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
