#/bin/bash
pm2 stop index.js
git pull
npm install --force
npm run prod
pm2 start index.js --watch
