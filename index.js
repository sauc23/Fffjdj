import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { HttpsProxyAgent } from 'https-proxy-agent'; // Ensure correct import

const httpProxyAgent = new HttpsProxyAgent('https://e3z4acki-gv85bq9:ksc8d3rmv7@us-east-067.totallyacdn.com:443');

const httpServer = http.createServer();

const bareServer = createBareServer('/', {
	httpAgent: httpProxyAgent,
	httpsAgent: httpProxyAgent,
});

httpServer.on('request', (req, res) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeRequest(req, res);
	} else {
		res.writeHead(400);
		res.end('Not found.');
	}
});

httpServer.on('upgrade', (req, socket, head) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

httpServer.on('listening', () => {
	console.log('HTTP server listening');
});

httpServer.listen({
	port: 8080,
});
