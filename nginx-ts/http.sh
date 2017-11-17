

ffmpeg -re -y -use_wallclock_as_timestamps 1 -i http://host:6400 -c libx264 -f mpegts http://127.0.0.1:3040/publish/http

