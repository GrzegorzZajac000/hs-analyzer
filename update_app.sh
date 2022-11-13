#/bin/bash
npm install --global yarn
pm2 stop index.js
git pull
yarn install
yarn prod
pm2 start index.js --watch
