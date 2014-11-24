#!/bin/sh

cd ~/art
tar xvf ../www-build.tar
rm ../www-build.tar
npm install --production
node_modules/bower/bin/bower install

export NODE_ENV=production
export PORT=18010

#starting www
if forever restart bin/www.js; then
    echo www.js restarted
else
    forever start bin/www.js
    echo www.js started
fi
