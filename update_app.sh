#/bin/bash
pm2 stop index.js
git pull
pm2 start index.js --watch
