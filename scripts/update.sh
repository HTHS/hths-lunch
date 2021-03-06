#!/bin/sh

git checkout . -f;
git pull;
chmod +x ./update.sh;
npm install;
bower --allow-root install;
gulp build;
forever restart ../server.js;
echo "Updated to latest version, rebuilt dependencies and scripts, and restarted server.";
