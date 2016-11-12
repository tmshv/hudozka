#!/bin/sh

dir_path="$1"
build_file="$2"
app="hudozka"
script="forever.json"

cd ${dir_path}

gunzip -c ${build_file} | tar xopf -

#rm build.tar

npm install --production --loglevel error
npm install ./modules/hudozka-api-v1/
npm install ./modules/hudozka-data/
npm install ./modules/hudozka-middlewares/

echo "Deploying finish. Please restart hudozka.service manually"
