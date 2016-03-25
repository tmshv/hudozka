#!/bin/sh

dir_path="$1"
build_file="$2"
script="out/index.js"

cd ${dir_path}
gunzip -c ${build_file} | tar xopf -
npm install --production --loglevel error

#starting www
#if forever restart ${script}; then
#    echo Instagram Microservice restarted
#else
#    forever start ${script}
#    echo Instagram Microservice started
#fi
