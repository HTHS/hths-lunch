var port = 9418;
var http = require('http'),
	querystring = require('querystring'),
	exec = require('child_process').exec;

process.on('uncaughtException', function(error) {
	console.error('Uncaught exception: ' + error.message);
	console.trace();
});

var server = http.createServer(function(request, response) {
	if (request.method === 'GET') {
		exec('git log -1 --name-only', function(error, stdout, stderr) {
			response.writeHead(200, {
				'Content-Type': 'text/html'
			});
			response.write('<html><body><pre>');
			response.write(stdout);
			response.write('</pre></body></html>');
			response.end();
		});
	} else {
		var body = '';
		request.on('data', function(chunk) {
			body += chunk.toString();
		});

		request.on('end', function() {
			var buildInfo = JSON.parse(body).build;
			var status = buildInfo.status;
			var commitSHA = buildInfo.commit_id;
			var commitMessage = buildInfo.message;
			var author = buildInfo.committer;

			if (buildInfo.status === 'success') {
				console.log('Updating deployment at %s', (new Date()).toLocaleString());
				exec('./scripts/update.sh', function(error, stdout, stderr) {
					if (error) {
						console.log('Git pull error: ', error, stdout, stderr);
					} else {
						console.log('Commit %s\nAuthor: %s\n\t%s\n', commitSHA, author, commitMessage);
						console.log('Updated deployment at %s', (new Date()).toLocaleString());
					}
				});
			}
		});
	}
});

server.listen(port, function() {
	var serverDetails = server.address();
	var address = serverDetails.address;
	if (address === '0.0.0.0') {
		address = 'localhost';
	}
	console.log('Git post-commit server running at http://%s:%s', address, serverDetails.port);
});
