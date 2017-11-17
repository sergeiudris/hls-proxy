import * as React from 'react'
import styled from 'src/styled-components'

import { Box } from 'src/comps/grid'
import { AppContent, AppHeader, AppSidebar, AppFooter } from 'src/parts/layout'

import { AppBar, Toolbar, IconButton, Typography, Button, withStyles, WithStyles, Grid } from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'
import { inject, observer } from 'mobx-react'
import * as Hls from 'hls.js'
import {observable} from 'mobx'
import * as videojs from 'video.js'
import { AppStore } from 'src/store'
import { ReadyState, Evt, FFmpeg, Cams, Pkg, Stream } from '@streaming/types'

declare var MediaRecorder

interface IProps {
  className?: string
  streamState: Stream.State
  streamInfo: Cams.CameraInfo
  store?: AppStore
}

interface IState {


}

const decorate = withStyles(theme => ({
  root: {

  },
  button: {
    margin: theme.spacing.unit,
  },
  status: {
    fontWeight: 'bolder' as any
  }
}));

export const StreamStream =
  decorate(
    inject(({ store }) => ({ store }))(
      observer(
        class extends React.Component<IProps & WithStyles<"root" | "button" | "status">, IState> {

          video: VideoHls
          hls: Hls
          player: videojs.Player
          canvas: HTMLCanvasElement
          savedata: any

          mediaRecorder: any
          recording = []
          isRecording = observable(false)


          ondataavailable = (evt) =>{
            this.recording.push(evt.data)
          }

          onstopmediarecorder = () =>{
            this.isRecording.set(false)
            const blob = new Blob(this.recording, {type: 'video/webm'})
            saveToDevice(blob)
          }

          onerror = () =>{
            console.error('mediarecorde error');
          }

          onscreenshot = () =>{
            const v = this.video.video
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d');
            const w = canvas.width = v.videoWidth
            const h = canvas.height = v.videoHeight
            context.fillRect(0, 0, w, h);
            context.drawImage(v, 0, 0, w, h);
            const screenshotUrl = canvas.toDataURL('image/png');
            window['fetch'](screenshotUrl).then(f => f.blob()).then((blob)=>{
              saveToDevice(blob, 'test.png')
            })
          }

          onrecord = () => {
            if(this.isRecording.get()){
              this.mediaRecorder.stop()
              return
            }
            const video = this.video.video
            const stream = video['captureStream']()
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
            const mediaRecorder = this.mediaRecorder
            this.recording.splice(0)
            mediaRecorder.start()
            this.isRecording.set(true)
            mediaRecorder.addEventListener('dataavailable', this.ondataavailable);
            mediaRecorder.addEventListener('stop', this.onstopmediarecorder);
            mediaRecorder.addEventListener('error', this.onerror);
            // const video = this.video
            // const stream = video.strea
          }


          render() {

            const { streamInfo, streamState, store, classes } = this.props
            const { url_hls, url_src } = streamState.ffmpeg
            return (
              <Grid item xs={3} >
                <Typography>{url_src}</Typography>
                <Typography>{streamInfo.title}</Typography>
                <VideoHls ref={r => this.video = r} url_hls={streamState.ffmpeg.url_hls} readyState={streamState.readyState} />
                {/* <canvas style={{display: 'none'}} ref={r =>this.canvas = r}></canvas> */}
                <Typography className={classes.status}>{streamState.readyState}</Typography>
                <Typography >{url_hls}</Typography>
                <Button raised dense color="primary" className={classes.button} onClick={() => {
                  store.streams.sendPkgStream(url_src, Stream.Type.START)
                }
                }>
                  start
                 </Button>
                <Button raised dense className={classes.button} onClick={() => { this.hls.destroy() }}>
                  stop
               </Button>
                <Button raised dense color="accent" className={classes.button} onClick={() => {
                  store.streams.sendPkgStream(url_src, Stream.Type.STOP)
                }
                }>
                  terminate
                </Button>
                <Button raised dense className={classes.button} onClick={this.onscreenshot}>
                  screenshot
                </Button>
                <Button raised dense className={classes.button} onClick={this.onrecord}>
                  {this.isRecording.get() ? 'stop recording': 'start recording' }
                </Button>
              </Grid>

            );
          }


        }
      )
    )
  )


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
        if (data.details === Hls.ErrorDetails.INTERNAL_EXCEPTION) {
          console.log('exception in ' + event + ',stack trace:' + JSON.stringify(data));
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
