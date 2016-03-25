#!/bin/sh

dir_path="$1"
build_file="$2"

cd ${dir_path}

gunzip -c ${build_file} | tar xopf -

#rm build.tar

npm install --production --loglevel error

#starting www
if forever restart src/bin/www.js; then
    echo www.js restarted
else
    forever start src/bin/www.js
    echo www.js started
fi
