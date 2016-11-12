#!/bin/sh

echo "Deploying art.shburg.org"

server="art.shburg.org"
tarfile="build.tar.gz"
tarpath=$TMPDIR${tarfile}
destpath="~/www/art.shburg.org"

echo "Building..."
npm run out
NODE_ENV=production npm run gulp deploy

echo "Packing $tarpath"
env GZIP=-9 tar -czf ${tarpath} \
    --disable-copyfile \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.idea \
    --exclude=.DS_Store \
    --exclude=src \
    --exclude=deploy.sh \
    --exclude=install.sh \
    .

echo "Uploading..."
ssh hoster@${server} "rm -rf $destpath/public/*"
scp ${tarpath} hoster@${server}:${destpath}

echo "Installing..."
ssh hoster@${server} "bash -s" -- < ./install.sh ${destpath} ${tarfile}

echo "Clear..."
rm ${tarpath}

echo "Done"
