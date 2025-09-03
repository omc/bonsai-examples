import http from 'http';
import httpProxy from 'http-proxy';
import { URL } from 'url';

const databaseUrlString = process.env.ELASTICSEARCH_NODE;
const listenPort = Number(process.env.PORT || 9200);

if (!databaseUrlString) {
  console.error('Configuration error: ELASTICSEARCH_NODE must be set.');
  process.exit(1);
}

let parsedUrl;

try {
  parsedUrl = new URL(databaseUrlString);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Configuration error: Invalid ELASTICSEARCH_NODE format. ${error.message}`);
  } else {
    console.error('An unknown error occurred while parsing ELASTICSEARCH_NODE.', error);
  }
  process.exit(1);
}

const proxyTarget = {
  protocol: parsedUrl.protocol,
  host: parsedUrl.hostname,
  port: parsedUrl.port,
};

const proxy = httpProxy.createProxyServer({
  target: proxyTarget,
  changeOrigin: true,
  secure: true,
});

proxy.on('proxyReq', (proxyReq, req, res) => {
  if (parsedUrl.username && parsedUrl.password) {
    const auth = `${parsedUrl.username}:${parsedUrl.password}`;
    const encodedAuth = Buffer.from(auth).toString('base64');
    proxyReq.setHeader('Authorization', `Basic ${encodedAuth}`);
  }
});

const server = http.createServer((req, res) => {
  proxy.web(req, res, {}, (err: Error) => {
      console.error(`Proxy error: ${err.message}`);
      res.writeHead(502).end('Proxy Error');
  });
});

console.log(`HTTP Reverse Proxy is running.`);
console.log(`Listening on http://localhost:${listenPort}`);
console.log(`Forwarding requests to ${parsedUrl.hostname}`);

server.listen(listenPort);