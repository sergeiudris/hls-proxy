

ffmpeg -re -y -use_wallclock_as_timestamps 1 -i http://host:6400 -c:v libx264 -f flv http://127.0.0.1:3055/hls/http

