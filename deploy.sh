#!/bin/sh

tarfile=build.tar.gz
tarpath=$TMPDIR$tarfile

env GZIP=-9 tar -czf $tarpath \
    --disable-copyfile \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.idea \
    --exclude=.DS_Store \
    --exclude=deploy.sh \
    --exclude=install.sh .

echo "build file: $tarpath"

ssh shburg.et "rm -rf art/*"
scp $tarpath shburg@146.185.183.243:~
scp install.sh shburg@146.185.183.243:~
ssh shburg.et "./install.sh"
rm $tarpath
echo "art.shlisselburg.org deployment completed successfully"
