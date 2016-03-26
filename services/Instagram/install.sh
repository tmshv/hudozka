#!/bin/sh

dir_path="$1"
build_file="$2"
app="hudozka-instagram"
script="forever.json"

cd ${dir_path}
gunzip -c ${build_file} | tar xopf -
npm install --production --loglevel error

if forever restart ${app}; then
    echo Instagram Microservice restarted
else
    forever start ${script}
    echo Instagram Microservice started
fi
