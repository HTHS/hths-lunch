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
			var last_payload = null;
			var commit = null;
			try {
				last_payload = JSON.parse(querystring.parse(body).payload);
				commit = last_payload.commits[0];
			} catch (err) {
				console.log('JSON error: ', err);
			}

			exec('./var/www/hths-lunch.tk/scripts/update.sh', function(error, stdout, stderr) {
				console.log(request.method, new Date());
				if (error != null) {
					console.log('Git pull error: ', error, stdout, stderr);
				} else if (commit != null) {
					console.log('Pulled commit ' + commit.node + ' by ' + commit.raw_author + '\n"' + commit.message + '"');
					var files = commit.files;
					if (files !== null) {
						for (var i = 0; i < files.length; i++) {
							var obj = files[i];
							console.log(obj.type + ': ' + obj.file);
						}
					}
				}

				response.writeHead(200, {
					'Content-Type': 'text/plain'
				});

				response.end(error ? stderr : stdout);
			});
		});
	}
});

server.listen(port, function() {
	var serverDetails = server.address();
	var address = serverDetails.address;
	if (address === '0.0.0.0') {
		address = 'localhost';
	}
	console.log('Git post-commit server running at http://' + address + ':' + serverDetails.port);
});
