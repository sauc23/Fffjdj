import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { SocksProxyAgent } from 'socks-proxy-agent';

const socksProxyAgent = new SocksProxyAgent(
	'socks5://T8bG2grGMDGQP447oBjrt2aF:SidnvUVLHdQn2d6oRhV9KH4w@us.socks.nordhold.net:1080',
);

const httpServer = http.createServer();

const bareServer = createBareServer('/', {
	httpAgent: socksProxyAgent,
	httpsAgent: socksProxyAgent,
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
