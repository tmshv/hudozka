#!/bin/sh

tar cf ~/www-build.tar \
    --exclude=node_modules \
    --exclude=bower_components \
    --exclude=.git \
    --exclude=.idea \
    --exclude=deploy.sh \
    --exclude=install.sh .

ssh shburg.et "rm -rf art/*"
scp ~/www-build.tar shburg@37.139.6.120:~
scp install.sh shburg@37.139.6.120:~
ssh shburg.et "./install.sh && rm ./install.sh"
rm ~/www-build.tar
echo "art.shburg.org deployment completed successfully"
