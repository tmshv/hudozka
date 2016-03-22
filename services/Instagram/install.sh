#!/bin/sh

dir_path="$1"
build_file="$2"

cd ${dir_path}
gunzip -c ${build_file} | tar xopf -
npm install --production --loglevel error

#starting www
if forever restart src/index.js; then
    echo Instagram Microservice restarted
else
    forever start src/index.js
    echo Instagram Microservice started
fi
