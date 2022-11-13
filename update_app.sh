#/bin/bash
npm install --global yarn
pm2 stop appindex.js
git pull
yarn install
yarn prod
pm2 start appindex.js --watch
