import * as winston from 'winston'
import 'winston-daily-rotate-file'
import * as fs from 'fs-extra'

interface Options {
  dirname: string
  filename: string
}
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
export function createLogger(options: Options) {

  fs.ensureDirSync(options.dirname);

  return new (winston.Logger)({
    transports: [
      new (winston.transports.DailyRotateFile)({
        dirname: options.dirname,
        filename: options.filename,
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        json: true,
        level: 'silly',
        maxsize: 30242880,
        maxFiles: 90,
        handleExceptions: false,
        colorize: true,
      }),
      new (winston.transports.Console)({
        handleExceptions: false,
        json: false,
        colorize: true,
      }),
    ]
  })
}

