
export namespace FFmpeg {

  export enum Cmd {
    START = 'START',
    STARTED = 'STARTED',
    TERMINATE = 'TERMINATE',
    TERMINATED = 'TERMINATED',
    ERROR = 'ERROR',
    EXISTS = 'EXISTS'
  }

  export interface Data {
    id: string
    cmd: Cmd
    url: string
    url_hls?: string
    url_mpd?: string
    cmdLine?: string
    msg?: string
  }
}
