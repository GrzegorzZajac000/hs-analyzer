#/bin/bash
pm2 stop appindex.js
git pull
pm2 start appindex.js --watch
