const fs = require('fs');
const path = require('path');
const https = require('https');
const { port } = require('./configs/venv');

const app = require('./app');
const server = https.createServer(
	{
		key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
		cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
	},
	app
);

server.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});
