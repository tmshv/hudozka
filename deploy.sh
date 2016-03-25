#!/bin/sh

echo "Deploying art.shburg.org"

NODE_ENV=production gulp deploy

server="art.shburg.org"
tarfile="build.tar.gz"
tarpath=$TMPDIR${tarfile}
destpath="~/www/art.shburg.org"

echo "Packing..."
env GZIP=-9 tar -czf ${tarpath} \
    --disable-copyfile \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.idea \
    --exclude=.DS_Store \
    --exclude=deploy.sh \
    --exclude=install.sh \
    .

echo "Build file: $tarpath"

#ssh h "rm -rf $destpath/*"
ssh h "rm -rf $destpath/public/*"
scp ${tarpath} hoster@${server}:${destpath}
echo "Build file successfully uploaded on server"

echo "Installing..."
ssh hoster@${server} "bash -s" -- < ./install.sh ${destpath} ${tarfile}

rm ${tarpath}
echo "Done"
