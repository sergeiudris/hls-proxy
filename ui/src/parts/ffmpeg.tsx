import * as React from 'react'
import styled from 'src/styled-components'

import { Box } from 'src/comps/grid'
import { AppContent, AppHeader, AppSidebar, AppFooter } from 'src/parts/layout'

import { AppBar, Toolbar, IconButton, Typography, Button, withStyles, WithStyles, Grid } from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'
import { inject, observer } from 'mobx-react'
import * as Hls from 'hls.js'
import * as videojs from 'video.js'
import { AppStore } from 'src/store'
import { ReadyState, Evt, FFmpeg, Cams, Pkg, Stream } from '@streaming/types'


interface IProps {
  className?: string
  streamState: FFmpeg.State
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

export const FFmpegStream =
  decorate(
    inject(({ store }) => ({ store }))(
      observer(
        class extends React.Component<IProps & WithStyles<"root" | "button" | "status">, IState> {

          video: HTMLVideoElement
          hls: Hls
          player: videojs.Player
          savedata: any

          componentWillUpdate(np: IProps) {
            console.warn('will update')
            if (np.streamState.url_hls) {
              this.mount(np.streamState.url_hls)
            }
          }

          componentDidMount() {

            if (this.props.streamState.url_hls) {
              this.mount(this.props.streamState.url_hls)
            }

          }

          mount(url: string) {
            console.warn('mount')
            // this.player = videojs(this.video, {
            //   autoplay: true,
            //   html5: {
            //     hlsjsConfig: {
            //       debug: true
            //     }
            //   },
            //   src: url
            // } as videojs.PlayerOptions, function onPlayerReady() {
            //   console.log('onPlayerReady', this)
            // });
            if (this.hls) {
              console.warn('destroying hls')
              this.hls.destroy()
            }


            //   var savedata =  this.savedata = { 'audio': new (Uint8Array as any)(), 'video': new (Uint8Array as any)() }
            //   function concatenate(...arrays) {
            //     let totalLength = 0;
            //     for (let arr of arrays) {
            //         totalLength += arr.length;
            //     }
            //     let result = new Uint8Array(totalLength);
            //     let offset = 0;
            //     for (let arr of arrays) {
            //         result.set(arr, offset);
            //         offset += arr.length;
            //     }
            //     return result;
            // }

            //   function onBufferAppending(data) {
            //     savedata[data.type] = concatenate(savedata[data.type], data.data);

            //     console['addSaveLinksToDOM'] = function () {
            //       var blob;
            //       blob = new Blob([savedata.audio], { type: 'application/octet-stream' });
            //       document.body['append']('<a download="generated-audio.mp4" href="' + window.URL.createObjectURL(blob) + '">Download mp4 audio track</a><br>');
            //       blob = new Blob([savedata.video], { type: 'application/octet-stream' });
            //       document.body['append']('<a download="generated-video.mp4" href="' + window.URL.createObjectURL(blob) + '">Download mp4 video track</a><br>');
            //     };
            //   }

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
                // console.warn(err,data)
                // hls.startLoad()
                if (data.details === Hls.ErrorDetails.INTERNAL_EXCEPTION) {
                  console.log('exception in ' + event + ',stack trace:' + JSON.stringify(data));
                }
              })

              hls.on(Hls.Events.MANIFEST_PARSED, function () {
                console.warn('Hls.Events.MANIFEST_PARSED')
                this.video.play();
              });

              window['hls'] = hls
              // let count = 50

              // hls.on(Hls.Events.ERROR,(...args) => {
              //   console.warn(args[1])
              //   if(count < 1){
              //     return
              //   }
              //   count--
              //   setTimeout(()=>{
              //     hls.loadSource(url)
              //   },1000)
              // })

              // hls.on(Hls.Events.BUFFER_APPENDING, (data) => {
              //   console.warn(data)
              //   onBufferAppending(data)
              // })

            }
          }

          onrecord() {
            // const video = this.video
            // const stream = video.strea
          }


          render() {
            const { streamInfo, streamState, store, classes } = this.props

            return (
              <Grid item xs={3} >
                <Typography>{streamState.url_src}</Typography>
                <Typography>{streamInfo.title}</Typography>
                <video width="300" height="150" className="video-js vjs-default-skin" style={{ border: '1px solid black' }} ref={r => this.video = r} autoPlay controls />
                <Typography className={classes.status}>{streamState.readyState}</Typography>
                <Typography >{streamState.url_hls}</Typography>
                <Button raised dense color="primary" className={classes.button} onClick={() => {
                  store.ffmpeg.sendPkgFfmpeg(streamState.url_src, FFmpeg.Type.START)
                }
                }>
                  start
                 </Button>
                <Button raised dense className={classes.button} onClick={() => { this.hls.destroy() }}>
                  stop
               </Button>
                <Button raised dense color="accent" className={classes.button} onClick={() => {
                  store.ffmpeg.sendPkgFfmpeg(streamState.url_src, FFmpeg.Type.STOP)
                }
                }>
                  terminate
                </Button>
                <Button raised dense className={classes.button}>
                  screenshot
                </Button>
                <Button raised dense className={classes.button} onClick={this.onrecord}>
                  record
                </Button>
              </Grid>

            );
          }


        }
      )
    )
  )

