#!/bin/sh

gunzip build.tar.gz
tar xf build.tar -C ~/art
rm build.tar

cd ~/art
npm install --production --loglevel error

export NODE_ENV=production
export PORT=18010

#starting www
if forever restart bin/www.js; then
    echo www.js restarted
else
    forever start bin/www.js
    echo www.js started
fi
