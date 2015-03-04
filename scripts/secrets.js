/**
 * Encrypt/Decrypt app secrets
 */
var crypto = require('crypto'),
	fs = require('fs'),
	zlib = require('zlib'),
	yargs = require('yargs'),
	glob = require('glob');

var argv = yargs
	.usage('Usage: $0 <command> -p [string]')
	.command('decrypt', 'Decrypt the keys for usage in the environment')
	.command('encrypt', 'Encrypt the keys for usage in the environment')
	.example('$0 decrypt -p password', 'Decrypt the keys with the password "password"')
	.option('p', {
		alias: 'password',
		demand: true,
		describe: 'Password to encrypt/decrypt keys',
		type: 'string'
	})
	.help('h')
	.alias('h', 'help')
	.check(function(argv) {
		return (argv._.indexOf('decrypt') !== -1 ^ argv._.indexOf('encrypt') !== -1) == true && argv.password !== ''; // XOR
	})
	.epilogue('Copyright 2015')
	.argv;
var algorithm = 'aes-256-ctr';

if (argv._.indexOf('encrypt') !== -1) {
	encrypt(argv.password);
} else if (argv._.indexOf('decrypt') !== -1) {
	decrypt(argv.password);
}

function decrypt(password) {
	console.log('Decrypting the keys.');

  var secretFiles = glob.sync('./config/env/!(test|sample).txt');

  for (var i = 0; i < secretFiles.length; i++) {
  	// input file
  	var r = fs.createReadStream(secretFiles[i]);
  	// zip content
  	// var zip = zlib.createGzip();
  	// decrypt content
  	var decrypt = crypto.createDecipher(algorithm, password)
  	// unzip content
  	// var unzip = zlib.createGunzip();
  	// write file
  	var w = fs.createWriteStream(secretFiles[i].replace('txt', 'js'));

  	r
  		// .pipe(zip)
  		.pipe(decrypt)
  		// .pipe(unzip)
  		.pipe(w);
  }
}

function encrypt(password) {
	console.log('Encrypting the keys.');

  var secretFiles = glob.sync('./config/env/!(test|sample).js');

  for (var i = 0; i < secretFiles.length; i++) {
  	// input file
  	var r = fs.createReadStream(secretFiles[i]);
  	// zip content
  	// var zip = zlib.createGzip();
  	// encrypt content
  	var encrypt = crypto.createCipher(algorithm, password);
  	// unzip content
  	// var unzip = zlib.createGunzip();
  	// write file
  	var w = fs.createWriteStream(secretFiles[i].replace('js', 'txt'));

  	r
  		// .pipe(zip)
  		.pipe(encrypt)
  		// .pipe(unzip)
  		.pipe(w);
  }
}
