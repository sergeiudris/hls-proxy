import * as React from 'react'
import styled from 'src/modules/styled-components'
import * as Hls from 'hls.js'
import { connect } from 'react-redux'
import * as videojs from 'video.js'
import { Store } from 'src/store'
import { Button } from 'antd'
import { ReadyState, Evt, FFmpeg, Cams, Pkg, Stream } from '@streaming/types'

declare var MediaRecorder

interface IProps {
  className?: string
  streamState: Stream.State
  streamInfo: Cams.CameraInfo
  store?: Store
}

interface IState {

  isRecording: boolean
}

export class HlsPlayer extends React.Component<IProps, IState> {

  video: VideoHls
  hls: Hls
  player: videojs.Player
  canvas: HTMLCanvasElement
  savedata: any

  mediaRecorder: any
  recording = []

  state = {
    isRecording: false
  }

  ondataavailable = (evt) => {
    this.recording.push(evt.data)
  }

  onstopmediarecorder = () => {
    this.setState({
      isRecording: false
    })
    const blob = new Blob(this.recording, { type: 'video/webm' })
    saveToDevice(blob)
  }

  onerror = () => {
    console.error('mediarecorde error');
  }

  onscreenshot = () => {
    const v = this.video.video
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d');
    const w = canvas.width = v.videoWidth
    const h = canvas.height = v.videoHeight
    context.fillRect(0, 0, w, h);
    context.drawImage(v, 0, 0, w, h);
    const screenshotUrl = canvas.toDataURL('image/png');
    window['fetch'](screenshotUrl).then(f => f.blob()).then((blob) => {
      saveToDevice(blob, 'test.png')
    })
  }

  onrecord = () => {
    const { isRecording } = this.state
    if (isRecording) {
      this.mediaRecorder.stop()
      return
    }
    const video = this.video.video
    const stream = video['captureStream']()
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    const mediaRecorder = this.mediaRecorder
    this.recording.splice(0)
    mediaRecorder.start()
    this.setState({
      isRecording: true
    })
    mediaRecorder.addEventListener('dataavailable', this.ondataavailable);
    mediaRecorder.addEventListener('stop', this.onstopmediarecorder);
    mediaRecorder.addEventListener('error', this.onerror);
    // const video = this.video
    // const stream = video.strea
  }


  render() {

    const { streamInfo, streamState, store } = this.props
    const { isRecording } = this.state
    if (!streamInfo) {
      return null
    }
    console.log(streamState)
    const { url_hls, url_src } = streamState.ffmpeg
    return (
      <div >
        <h5>{url_src}</h5>
        <h5>{streamInfo.title}</h5>
        <VideoHls ref={r => this.video = r} url_hls={streamState.ffmpeg.url_hls} readyState={streamState.readyState} />
        {/* <canvas style={{display: 'none'}} ref={r =>this.canvas = r}></canvas> */}
        <h5 >{streamState.readyState}</h5>
        <h5 >{url_hls}</h5>
        <Button type="primary" onClick={() => {
          // store.streams.sendPkgStream(url_src, Stream.Type.START)
        }
        }>
          start
                 </Button>
        <Button onClick={() => { this.hls.destroy() }}>
          stop
               </Button>
        <Button onClick={() => {
          // store.streams.sendPkgStream(url_src, Stream.Type.STOP)
        }
        }>
          terminate
                </Button>
        <Button onClick={this.onscreenshot}>
          screenshott
                </Button>
        <Button onClick={this.onrecord}>
          {isRecording ? 'stop recording' : 'start recording'}
        </Button>
      </div>

    );
  }


}


class VideoHls extends React.Component<{
  url_hls: string
  readyState: ReadyState
}, {}> {
  video: HTMLVideoElement
  hls: Hls
  player: videojs.Player
  savedata: any

  shouldComponentUpdate(np) {
    return np.readyState == ReadyState.OPEN && np.readyState != this.props.readyState
  }

  componentWillUpdate(np) {
    this.mount(np.url_hls)
  }

  componentDidMount() {

    if (this.props.url_hls) {
      this.mount(this.props.url_hls)
    }

  }
  mount(url: string) {
    console.warn('mount')
    if (this.hls) {
      console.warn('destroying hls')
      this.hls.destroy()
    }

    if (Hls.isSupported()) {
      var hls = this.hls = new Hls({
        // debug: true,
        manifestLoadingMaxRetry: 15,
        manifestLoadingMaxRetryTimeout: 1000,
        manifestLoadingTimeOut: 1000,
        enableWorker: true,
        autoStartLoad: true
      } as Hls.OptionalConfig);
      hls.attachMedia(this.video);
      hls.loadSource(url)
      // hls.loadSource('http://127.0.0.1:3040/play/hls/http/index.m3u8');
      // hls.loadSource('http://127.0.0.1:8080/play/hls/sintel/index.m3u8');

      hls.on(Hls.Events.ERROR, (event, data) => {
        // if (data.details === Hls.ErrorDetails.INTERNAL_EXCEPTION) {
        //   console.log('exception in ' + event + ',stack trace:' + JSON.stringify(data));
        // }
        if (data.type == Hls.ErrorTypes.MEDIA_ERROR && data.fatal) {
          // console.warn(data)
          console.warn('hls recovering after media error')
          hls.recoverMediaError()
        }
      })

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.warn('Hls.Events.MANIFEST_PARSED')
        this.video.play();
      });

      window['hls'] = hls
    }
  }


  render() {

    return (
      <video width="300" height="150" className="video-js vjs-default-skin" style={{ border: '1px solid black' }} ref={r => this.video = r} autoPlay controls />
    )

  }

}


function saveToDevice(blob, name = 'unknown') {
  // console.warn('save to device')
  const fileName = blob.name || name
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.click();
}
