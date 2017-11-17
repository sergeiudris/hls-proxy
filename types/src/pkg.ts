
export interface Pkg<D = any> {
  timestamp: number
  channel: string
  type: Pkg.Type
  topic: Pkg.Topic
  data: D
}

export namespace Pkg {

  export enum Topic {
    STREAMING = 'STREAMING'
  }

  export enum Type {
    CMD = 'CMD',
    QRY = 'QRY',
    ECHO = 'ECHO'
  }
}
