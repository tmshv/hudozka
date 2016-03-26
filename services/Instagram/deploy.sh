#!/bin/sh

echo "Deploying Instagram Microservice"

#NODE_ENV=production gulp deploy

server="art.shburg.org"
tarfile="build.tar.gz"
tarpath=$TMPDIR${tarfile}
destpath="~/www/art.shburg.org/services/instagram"
private=".private"

echo "Building..."
NODE_ENV=production npm run webpack
npm run build

echo "Packing..."
env GZIP=-9 tar -czf ${tarpath} \
    --disable-copyfile \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.idea \
    --exclude=.DS_Store \
    --exclude=.private* \
    --exclude=src \
    --exclude=deploy.sh \
    --exclude=install.sh \
    .

echo "Build file: $tarpath"

scp ${tarpath} hoster@${server}:${destpath}
echo "Build file successfully uploaded on ${server}"

scp ${private} hoster@${server}:${destpath}

echo "Installing..."
ssh hoster@${server} "bash -s" -- < ./install.sh ${destpath} ${tarfile}

rm ${tarpath}
echo "Done"
