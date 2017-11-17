### deploy ###


* make sure NodeJs 8.6.0 installed

* make sure `ffmpeg` terminal command is available


```shell

# clone repo
git clone git@bitbucket.org:gostgroup/bg-rtsp.git

# change directory
cd bg-rtsp

# checkout master
git checkout master

# fetch and pull (if you did not clone)
git fetch
git pull origin master

# install dependencies with --no-shrinkwrap, use it over npm i to avoid unknown with npm@5^ and package-lock.json
npm run i

# build everything and then start server using ts-node
npm run start

# server will be running on port 3004

```

### mjpeg streaming ###

POST /mjpeg/start?url=someMjpegUrl      - start an ffmpeg transcoding process , use src/client/modules/html5-stream/stream-mjpeg.ts to connect on the client

### misc ###

# formats and codecs
https://gist.githubusercontent.com/granoeste/8727308/raw/678faed77165b9a3e96b0cbbhosta03/webkitmediasource-is-type-supported.html
