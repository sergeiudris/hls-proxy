
# rtsp://host:554/16   4.73

# rtsp://host:554/18

# rtsp://host:554/77  4.72


ffmpeg -re -rtsp_transport tcp -i rtsp://host:554/77 -c libx264 -f mpegts http://127.0.0.1:8080/publish/rtsp
