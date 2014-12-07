#!/bin/sh

git checkout .;
git pull;
chmod +x ./update.sh;
npm install;
bower --allow-root install;
gulp build;
forever restartall;
echo "Updated to latest version, rebuilt dependencies and scripts, and restarted server.";
