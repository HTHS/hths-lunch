#!/bin/sh

if [ ! -e server.js ]
  then
  echo "Error: could not find server.js file"
  echo "Please run the generate-ssl-certs.sh script from the application root directory"
  echo "i.e: .scripts/generate-ssl-cers.sh"
  exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ./config/sslcerts
openssl genrsa -out ./config/sslcerts/key.pem -aes256 1024
openssl req -new -key ./config/sslcerts/key.pem -out ./config/sslcerts/csr.pem
openssl x509 -req -days 9999 -in ./config/sslcerts/csr.pem -signkey ./config/sslcerts/key.pem -out ./config/sslcerts/cert.pem
rm ./config/sslcerts/csr.pem
chmod 600 ./config/sslcerts/key.pem ./config/sslcerts/cert.pem
