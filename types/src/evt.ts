
export interface Evt<T = any> {
  timestamp: number
  from?: string
  topic: 'streaming'
  data: T
}

export enum EvtType {
  CMD = 'CMD',
  QRY = 'QRY',
  ECHO = 'ECHO'
}
