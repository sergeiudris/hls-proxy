import * as winston from 'winston'
import 'winston-daily-rotate-file'
import * as fs from 'fs-extra'

const DIRNAME = 'logs/server/root'
const FILENAME = 'root.log'

fs.ensureDirSync(DIRNAME);

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.DailyRotateFile)({
      handleExceptions: true,
      dirname: DIRNAME,
      filename: FILENAME,
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'silly',
      json: true,
      maxsize: 30242880,
      maxFiles: 90,
      colorize: true,
    } as winston.DailyRotateFileTransportOptions),
    new (winston.transports.Console)({
      handleExceptions: true,
      json: false,

      colorize: true,
      prettyPrint: true,
    } /*as winston.GenericTransportOptions*/),
  ],
  exitOnError: false,
})
