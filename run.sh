#  sudo du -h --max-depth=1 -x /
# strace -p1234 -s9999 -e write
# ffmpeg -rtsp_transport tcp  -i rtsp://host:554/57 -b:v 90k -c libx264 -f mpegts http://127.0.0.1:1840/publish/asd

# ps aux | sort -rss |  head -n 20
# ps aux --sort -rss
# for pid in $(ps -ef | grep "ffmpeg" | awk '{print $2}'); do kill -9 $pid; done
# lsof -t -i:1806
# kill -9 1234

#docker rm $(docker ps -a -q)
#docker rmi -f $(docker images -q)


HOST_NAME=host
USERNAME=user
HOST_SSH=$USERNAME@$HOST_NAME
DIR_STREAMING=/opt/streaming

test() {
  echo "TEST $1";
}

devup() {
  docker-compose -f dev.yml up "$@"
}

devdown() {
  docker-compose -f dev.yml down --remove-orphans "$@"
}



build(){
  lerna=./node_modules/.bin/lerna
  $lerna bootstrap && \
  $lerna run compile && \
  $lerna bootstrap && \
  $lerna run build
}


deploy(){
  dirUser=""
  dirRoot=""
  for service in "$@"
  do
      dirUser=/home/user/$service
      dirRoot=/opt/streaming/$service/dist
      # ssh -t $HOST_SSH sudo supervisorctl stop $group:*
      scp -r ./$service/dist $HOST_SSH:$dirUser
      ssh -t $HOST_SSH "
        sudo rm -rf $dirRoot ;
        echo removed $dirRoot;
        sudo mkdir -p  $dirRoot ;
        sudo mv $dirUser/* $dirRoot ;
        sudo rm -rf $dirUser ;
       "
  done
}

up_sys(){
  docker-compose -f dc-sys.yml up -d
}
down_sys(){
  docker-compose -f dc-sys.yml down
}

dc(){
    REGISTRY_HOST=127.0.0.1 docker-compose \
    -f dc-base.yml \
    -f dc-nsq.yml \
    -f dc-nginx.yml \
    -f dc-streaming.yml \
    "$@"
}
dc_dev(){
  docker-compose \
    -f dc-base.yml \
    -f dc-nsq.yml \
    -f dc-nginx.yml -f dc-nginx-build.yml \
    -f dc-streaming.yml -f dc-streaming-build.yml \
    "$@"
}


up(){
  docker-compose -f dc-base.yml build && \
  docker-compose \
    -f dc-nsq.yml \
    -f dc-nginx.yml -f dc-nginx-build.yml \
    -f dc-streaming.yml -f dc-streaming-build.yml \
    up --build -d
}

down(){
  docker-compose \
    -f dc-nsq.yml \
    -f dc-nginx.yml -f dc-nginx-build.yml \
    -f dc-streaming.yml -f dc-streaming-build.yml \
   down
}

up_prod(){
  REGISTRY_HOST=127.0.0.1 docker-compose -f dc-nsq.yml -f dc-streaming.yml up -d
}

down_prod(){
  REGISTRY_HOST=127.0.0.1 docker-compose --f dc-nsq.yml -f dc-streaming.yml down
}

registry_start(){
  docker run -d -p 5001:5000 --restart=always --name registry registry:2.6.2
}

#as su
portainer(){
  docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer -H unix:///var/run/docker.sock
}


sup(){
  ssh -t $HOST_SSH sudo supervisorctl $@
}

ssh(){
  ssh -t $HOST_SSH "$@"
}

chmode(){
  chmod +x ./caddy/caddy
}

ech(){
  echo $@
}

copy(){
  scp -r ./runs $HOST_SSH:/home/user
}

start_nginx(){
  $DIR_STREAMING/nginx/ts/sbin/nginx &>/dev/null &
  $DIR_STREAMING/nginx/rtmp/sbin/nginx &>/dev/null &
}

stop_nginx(){
  $DIR_STREAMING/nginx/ts/sbin/nginx -s stop &
  $DIR_STREAMING/nginx/rtmp/sbin/nginx -s stop &
}


# start_nginx(){
#   ssh -t $HOST_SSH "
#     sudo $DIR_STREAMING/nginx/ts/sbin/nginx &
#     echo ts started ;
#     sudo $DIR_STREAMING/nginx/rtmp/sbin/nginx &
#     echo second finished ;
#   "
# }

# stop_nginx(){
#    ssh -t $HOST_SSH "
#   sudo $DIR_STREAMING/nginx/ts/sbin/nginx -s stop & ;
#   echo ts started ;
#   sudo $DIR_STREAMING/nginx/rtmp/sbin/nginx -s stop  & ;
#   echo second finished ;
#   "
# }

stop_rtmp(){
   ssh -t $HOST_SSH "
    sudo $DIR_STREAMING/nginx/rtmp/sbin/nginx -s stop ;
    echo second finished
  "
}

copy2(){
   scp -r ./hub/dist $HOST_SSH:/home/user/hub
}


size(){
  git rev-list --objects --all \
| git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
| awk '/^blob/ {print substr($0,6)}' \
| sort --numeric-sort --key=2 \
| cut --complement --characters=13-40 \
| numfmt --field=2 --to=iec-i --suffix=B --padding=7 --round=nearest
}


hls(){
  ssh -t $HOST_SSH "
     sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -b:v 600k -threads 1 -f mpegts http://127.0.0.1:1840/publish/asd
  "
}


kill(){
   ssh -t $HOST_SSH "
     sudo for pid in $(ps -ef | grep "$1" | awk '{print $2}'); do kill -9 $pid; done
  "
}
# sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -b:v 1200k -f m$pegts http://127.0.0.1:1840/publish/asd ;
#  sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -b:v 90k -f mpegts http://127.0.0.1:1840/publish/asd ;
# sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -f mpegts http://127.0.0.1:1840/publish/asd ;  ??

# sudo ffmpeg -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -framerate 60  -s 1280x720 -f mpegts http://127.0.0.1:1840/publish/asd ;
# sudo ffmpeg -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -r 30 -s 1280x720 -pix_fmt yuv420p -f mpegts http://127.0.0.1:1840/publish/asd ;  // works but frame loss
# sudo ffmpeg -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i  rtsp://host:554/57 -c:v libx264 -r 30 -s 1280x720 -pix_fmt yuv420p -f mpegts http://127.0.0.1:1840/publish/asd ;
# sudo ffmpeg -rtsp_transport tcp -use_wallclock_as_timestamps 1  -i  rtsp://host:554/57 -b:v 90k -c libx264 -f mpegts http://127.0.0.1:1840/publish/asd ;

"$@"




