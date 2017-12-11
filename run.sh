#  sudo du -h --max-depth=1 -x /
# strace -p1234 -s9999 -e write
# ffmpeg -rtsp_transport tcp  -i rtsp://host:554/57 -b:v 90k -c libx264 -f mpegts http://127.0.0.1:1840/publish/asd

# ps aux | sort -rss |  head -n 20
# ps aux --sort -rss
# for pid in $(ps -ef | grep "ffmpeg" | awk '{print $2}'); do kill -9 $pid; done
# lsof -t -i:1806
# lsof -i :8000
# kill -9 1234

USERNAME=user
HOST_SSH=$USERNAME@$HOSTNAME
DIR_STREAMING=/opt/streaming

HOSTNAME_LOCAL=127.0.0.1
REGISTRY_HOST_LOCAL=127.0.0.1:5001

HOSTNAME_REMOTE=host
REGISTRY_HOST_REMOTE=host:5001


pull_tag_local(){
  docker pull portainer/portainer && docker tag portainer/portainer ${REGISTRY_HOST_LOCAL}/portainer && \
  docker pull registry && docker tag registry ${REGISTRY_HOST_LOCAL}/registry && \
  docker pull traefik && docker tag traefik ${REGISTRY_HOST_LOCAL}/traefik && \
  docker pull nsqio/nsq && docker tag nsqio/nsq ${REGISTRY_HOST_LOCAL}/nsq
}

pull_tag_remote(){
  docker pull portainer/portainer && docker tag portainer/portainer ${REGISTRY_HOST_REMOTE}/portainer && \
  docker pull registry && docker tag registry ${REGISTRY_HOST_REMOTE}/registry && \
  docker pull traefik && docker tag traefik ${REGISTRY_HOST_REMOTE}/traefik && \
  docker pull nsqio/nsq && docker tag nsqio/nsq ${REGISTRY_HOST_REMOTE}/nsq
}

dc(){
  docker-compose \
    -f dc-base.yml \
    -f dc-nsq.yml \
    -f dc-nginx.yml \
    -f dc-streaming.yml \
    "$@"
}

# use this for local development
dc_local(){
  REGISTRY_HOST=${REGISTRY_HOST_LOCAL} HOSTNAME=${HOSTNAME_LOCAL} dc "$@"
}

# use this alias on production server
dc_prod(){
  REGISTRY_HOST=${REGISTRY_HOST_LOCAL} HOSTNAME=${HOSTNAME_REMOTE} dc "$@"
}

# use this for building images locally (to push to prod registry)
dc_remote(){
  REGISTRY_HOST=${REGISTRY_HOST_REMOTE} HOSTNAME=${HOSTNAME_REMOTE} dc "$@"
}

# remove all images (do not do this)
rmi(){
  docker rmi -f $(docker images -q)
}

# remove all containers (do not do this)
rm(){
  docker rm $(docker ps -a -q)
}

registry_start(){
  docker run -d -p 5001:5000 --restart=always --name registry registry:2.6.2
}

portainer(){
  sudo docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer -H unix:///var/run/docker.sock
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

hls_remote(){
  ssh -t $HOST_SSH "
     sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -b:v 600k -threads 1 -f mpegts http://127.0.0.1:1840/publish/asd
  "
}

hls(){
  # ffmpeg  -y -rtsp_transport tcp -i rtsp://host:554/57 -c:v libx264 -s 1280x720 -b:v 600k -threads 1 -f mpegts http://host:1840/publish/asd
  ffmpeg  -y -rtsp_transport tcp -i rtsp://host:554/57 -c:v libx264 -s 1280x720 -f mpegts http://host:1840/publish/asd

}
# dc_files(){
#     dirUser=/home/user/camera-streaming
#     dirRoot=/opt/camera-streaming
#   # ssh -t $HOST_SSH sudo supervisorctl stop $group:*
#     scp -r ./$service/dist $HOST_SSH:$dirUser
#     ssh -t $HOST_SSH "
#       sudo rm -rf $dirRoot ;
#       echo removed $dirRoot;
#       sudo mkdir -p  $dirRoot ;
#       sudo mv $dirUser/* $dirRoot ;
#       sudo rm -rf $dirUser ;
#       "
# }



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


# test() {
#   echo "TEST $1";
# }

# devup() {
#   docker-compose -f dev.yml up "$@"
# }

# devdown() {
#   docker-compose -f dev.yml down --remove-orphans "$@"
# }



# build(){
#   lerna=./node_modules/.bin/lerna
#   $lerna bootstrap && \
#   $lerna run compile && \
#   $lerna bootstrap && \
#   $lerna run build
# }

# deploy(){
#   sh run.sh dc pull && \
#   sh run.sh dc up -d
# }

# deploy_remote(){
#   dc_dev build && \
#   dc_dev push && \
#   ssh -t $HOST_SSH "
#     cd /opt/streaming;
#     sudo sh run.sh dc pull;
#     sudo sh run.sh dc up -d;
#   "
# }

# deploy_legacy(){
#   dirUser=""
#   dirRoot=""
#   for service in "$@"
#   do
#       dirUser=/home/user/$service
#       dirRoot=/opt/streaming/$service/dist
#       # ssh -t $HOST_SSH sudo supervisorctl stop $group:*
#       scp -r ./$service/dist $HOST_SSH:$dirUser
#       ssh -t $HOST_SSH "
#         sudo rm -rf $dirRoot ;
#         echo removed $dirRoot;
#         sudo mkdir -p  $dirRoot ;
#         sudo mv $dirUser/* $dirRoot ;
#         sudo rm -rf $dirUser ;
#        "
#   done
# }


# stop_rtmp(){
#    ssh -t $HOST_SSH "
#     sudo $DIR_STREAMING/nginx/rtmp/sbin/nginx -s stop ;
#     echo second finished
#   "
# }

# copy2(){
#    scp -r ./hub/dist $HOST_SSH:/home/user/hub
# }






# size(){
#   git rev-list --objects --all \
# | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
# | awk '/^blob/ {print substr($0,6)}' \
# | sort --numeric-sort --key=2 \
# | cut --complement --characters=13-40 \
# | numfmt --field=2 --to=iec-i --suffix=B --padding=7 --round=nearest
# }



# kill(){
#    ssh -t $HOST_SSH "
#      sudo for pid in $(ps -ef | grep "$1" | awk '{print $2}'); do kill -9 $pid; done
#   "
# }
# sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -b:v 1200k -f m$pegts http://127.0.0.1:1840/publish/asd ;
#  sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -b:v 90k -f mpegts http://127.0.0.1:1840/publish/asd ;
# sudo ffmpeg  -y -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -s 1280x720 -f mpegts http://127.0.0.1:1840/publish/asd ;  ??

# sudo ffmpeg -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -framerate 60  -s 1280x720 -f mpegts http://127.0.0.1:1840/publish/asd ;
# sudo ffmpeg -rtsp_transport tcp -i  rtsp://host:554/57 -c:v libx264 -r 30 -s 1280x720 -pix_fmt yuv420p -f mpegts http://127.0.0.1:1840/publish/asd ;  // works but frame loss
# sudo ffmpeg -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i  rtsp://host:554/57 -c:v libx264 -r 30 -s 1280x720 -pix_fmt yuv420p -f mpegts http://127.0.0.1:1840/publish/asd ;
# sudo ffmpeg -rtsp_transport tcp -use_wallclock_as_timestamps 1  -i  rtsp://host:554/57 -b:v 90k -c libx264 -f mpegts http://127.0.0.1:1840/publish/asd ;

"$@"




