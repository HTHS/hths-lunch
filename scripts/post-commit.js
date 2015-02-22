var port = 9418;
var http = require('http'),
	querystring = require('querystring'),
	exec = require('child_process').exec,
	request = require('supertest');

process.on('uncaughtException', function(error) {
	console.error('Error: ', error);
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
			var branch = buildInfo.branch;
			var commitSHA = buildInfo.commit_id;
			var commitMessage = buildInfo.message;
			var author = buildInfo.committer;

			if (status === 'success' && branch === 'master') {
				exec('git log --pretty=format:"%H"', function(error, stdout, stderr) {
					if (error) {
						console.log(error);
						console.log(stderr);
					} else {
						response.writeHead(200, {
							'Content-Type': 'application/json'
						});

						if (stdout === commitSHA) {
							console.log('stdout: %s, commit SHA: %s', stdout, commitSHA);
							console.log('Nothing new to deploy.');
							response.write('{"updated": false}');
							response.end();
						} else {
							console.log('%s: updating deployment', (new Date()).toLocaleString());
							response.write('{"updated": true}');
							response.end();

							exec('./scripts/update.sh', function(error, stdout, stderr) {
								if (error) {
									console.log('Git pull error: ', error, stdout, stderr);
								} else {
									request('https://api.rollbar.com')
										.post('/api/1/deploy/')
										.send({
											access_token: 'c3352d3a8f1e4526aac01b3913bad18f',
											environment: 'production',
											revision: commitSHA,
											local_username: 'autobot',
											comment: commitMessage
										})
										.end(function(err, res) {
											if (!err) {
												console.log('%s: sent deploy information to Rollbar', (new Date()).toLocaleString());
											}
										});

									console.log('Commit %s\nAuthor: %s\n\t%s\n', commitSHA, author, commitMessage);
									console.log('%s: finished updating deployment', (new Date()).toLocaleString());
								}
							});
						}
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
