
/**
* creates a  websocket connection, will receive evt.data as Blob,
* uses <img>  to show images as mjpeg stream and record
* them using  <canvas> ( canvas.captureStream() w/ MediaRecorder)
*
*/
export class StreamWebMjepg {

    socket: WebSocket
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    image: HTMLImageElement
    mediaRecorder: any // MediaRecorder
    recording: Blob[] = []
    canvasStream: MediaStream
    error: any
    mimeType: string
    timeoutIDSocket: number = 0
    intervalIDTimer: number = 0
    isRecording: boolean = false
    isRecordingPossible: boolean = false
    isMessageDirty: boolean = false
    timeRecordingStarted: number = 0
    timeRecordingCurrent: number = 0
    timerRecordingDuration: number = 0
    timeOutSelfDestruct: number



    constructor(image: HTMLImageElement, canvas?: HTMLCanvasElement, canvasWidth?: number, canvasHeight?: number, timeOutSelfDestruct: number = 7000, mimeType: string = 'video/webm') {
      this.image = image;
      this.mimeType = mimeType
      this.timeOutSelfDestruct = timeOutSelfDestruct
      this.isRecordingPossible = this.addRecordingCapabilities(canvas, canvasWidth, canvasHeight)

    }


    addRecordingCapabilities(canvas: HTMLCanvasElement, canvasWidth?: number, canvasHeight?: number): boolean {
      this.canvas = canvas;

      const MediaRecorder = window['MediaRecorder']
      if (!MediaRecorder) {
        console.warn('Mediarecorder is not supported in your browser: stream will not be able to record');
        return false
      }
      if (!MediaRecorder.isTypeSupported(this.mimeType)) {
        console.warn('mimeType ' + this.mimeType + ' is not supported');
        return false
      }
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');

        this.canvas.style.position = 'fixed'
        this.canvas.style.bottom = '0'
        this.canvas.style.right = '0'
        // this.canvas.style.zIndex = '111111';
        this.canvas.style.transform = 'translateX(100%) translateY(100%)'
        try {
          document.body.appendChild(this.canvas)
        } catch (err) {
          // console.error(err)
        }
      }
      if (!this.canvas['captureStream']) {
        console.warn('cannot call canvas.captureStream() - try using Chrome or Firefox');
        return false
      }

      this.canvas.width = canvasWidth ? canvasWidth : this.image.width;
      this.canvas.height = canvasHeight ? canvasHeight : this.image.height
      this.context = this.canvas.getContext('2d');
      this.canvas.addEventListener('error', this.onError);
      this.canvasStream = this.canvas['captureStream']();

      this.mediaRecorder = new MediaRecorder(this.canvasStream, { mimeType: this.mimeType })
      this.mediaRecorder.addEventListener('dataavailable', this.onDataAvailableMediaRecorder);
      this.mediaRecorder.addEventListener('stop', this.onStopMediaRecorder);
      this.mediaRecorder.addEventListener('error', this.onError);

      return true
    }

    connect(url: string, protocols?: string | string[]): Promise<boolean> {
      if (this.socket) {
        this.socket.close();
      }
      this.socket = new WebSocket(url, protocols);
      this.socket.addEventListener('open', this.onOpenSocket)
      this.socket.addEventListener('close', this.onCloseSocket)
      this.socket.addEventListener('error', this.onError)

      return new Promise<boolean>((resolve, reject) => {
        const onSocketMessageOnce = (evt) => {
          this.isMessageDirty = true
          this.socket.removeEventListener('message', onSocketMessageOnce)
          resolve(true)
        }
        this.socket.addEventListener('message', onSocketMessageOnce)
      })
    }

    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }

    resume() {
      // console.warn('stream resume')
      this.socket.addEventListener('message', this.onMessageSocket)
      // this.image.addEventListener('load', this.onLoadImage);
    }

    pause() {
      this.socket.removeEventListener('message', this.onMessageSocket)
      // this.image.removeEventListener('load', this.onLoadImage);
    }

    unmount() {
      // console.info('removing stream');
      if (this.socket) {
        this.socket.close();
        this.socket.removeEventListener('open', this.onOpenSocket)
        this.socket.removeEventListener('close', this.onCloseSocket)
        this.socket.removeEventListener('message', this.onMessageSocket)
      }
      if (this.image) {
        this.image.removeEventListener('load', this.onLoadImage);
      }
      if (this.canvas) {
        document.body.removeChild(this.canvas)
      }
      this.isRecording = false;
      this.image = undefined;
      this.canvas = undefined;
      this.mediaRecorder = undefined;
    }

    onOpenSocket = (evt) => {
      const socket = evt.target as WebSocket;
      this.timeoutIDSocket = window.setTimeout(() => {
        this.socket.close()
      }, this.timeOutSelfDestruct)
      // console.info('connected to stream server');
    }

    onMessageSocketOnce = (evt) => {
      this.isMessageDirty = true;
      this.socket.removeEventListener('message', this.onMessageSocketOnce)
    }

    onMessageSocket = (evt) => {
      window.clearTimeout(this.timeoutIDSocket)
      this.timeoutIDSocket = window.setTimeout(() => {
        this.socket.close()
      }, this.timeOutSelfDestruct)
      const socket = evt.target as WebSocket;
      const blob = evt.data as Blob
      if (this.image) {
        const src = this.image.src
        this.image.src = window.URL.createObjectURL(blob)
        window.URL.revokeObjectURL(src)
      } else {
        console.warn('stream-mjpeg has no image to draw to: was it unmounted?')
      }

    }

    onError = (evt) => {
      console.error('critical error in stream-mjpeg, no stream url?');
      this.error = evt;
      this.unmount();
    }

    onCloseSocket = (evt) => {
      const socket = evt.target as WebSocket;
      // console.warn('disconnected from stream server');
    }

    onLoadImage = (evt) => {
      // console.log('load image')
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    onStopMediaRecorder = (evt) => {
      // console.log('onstop', evt);
      // console.info('recording stopped')
      // this.recordingStop()
      // var blob = new Blob(this.recording, { type: 'video/webm' })
      // console.log('blob')
      // this.recording.splice(0);
      // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    onDataAvailableMediaRecorder = (evt) => {
      // console.log(evt.data);
      // console.log('ondataavailable');
      this.recording.push(evt.data);
    }

    recordingStop() {
      // console.info('stoping recording after');
      this.mediaRecorder.stop()
      this.isRecording = false
      window.clearInterval(this.intervalIDTimer)
      this.image.removeEventListener('load', this.onLoadImage);
    }

    screenshot(): Promise<Blob> {
      // console.log(this.canvas.width, this.canvas.height)
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
      const screenshotUrl = this.canvas.toDataURL('image/png');
      return window['fetch'](screenshotUrl).then(f => f.blob())
    }

    recordingStart(time?: number): Promise<Blob> {
      // this.canvas.width = 640;//this.image.width;
      // this.canvas.height = 480;//this.image.height
      this.recording.splice(0);
      return new Promise((resolve, reject) => {
        if (!this.isRecordingPossible) {
          const message = 'recording not possible'
          // console.warn(message)
          reject(message)
        }
        if (this.isRecording) {
          const message = 'recording is in progress'
          // console.warn(message)
          reject(message)
        }
        const onStop = () => {
          // console.log(this.recording)
          const blob = new Blob(this.recording, { type: 'video/webm' })
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          // this.image.removeEventListener('load', this.onLoadImage);
          this.mediaRecorder.removeEventListener('stop', onStop)
          resolve(blob)
        }

        this.mediaRecorder.addEventListener('stop', onStop)
        this.image.addEventListener('load', this.onLoadImage);
        this.mediaRecorder.start()

        this.isRecording = true

        this.timeRecordingStarted = Date.now()

        this.intervalIDTimer = window.setInterval(() => {
          if (!this.isRecording) {
            window.clearInterval(this.intervalIDTimer)
            this.timeRecordingStarted = 0
            this.timeRecordingCurrent = 0
            this.timerRecordingDuration = 0
            return
          }
          this.timeRecordingCurrent = Date.now()
          this.timerRecordingDuration = this.timeRecordingCurrent - this.timeRecordingStarted
        }, 1000)


        if (time) {
          setTimeout(() => {
            this.recordingStop()
          }, time)
        }

      })
    }


    saveToDevice(blob, name = 'unknown') {
      // console.warn('save to device')
      const fileName = blob.name || name
      const downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.click();
    }

  }

