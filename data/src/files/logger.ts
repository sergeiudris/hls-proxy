import * as winston from 'winston'
import 'winston-daily-rotate-file'
import * as fs from 'fs-extra'

const DIRNAME = 'logs/server/data'
const FILENAME = 'server.data.log'

fs.ensureDirSync(DIRNAME);

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.DailyRotateFile)({
      dirname: DIRNAME,
      filename: FILENAME,
      datePattern: 'yyyy-MM-dd.',
      level: 'silly',
      prepend: true,
      json: true,
      maxsize: 30242880,
      maxFiles: 90,
      colorize: true,
    }),
    new (winston.transports.Console)({
      json: false,
      colorize: true,
      prettyPrint: true,
    }),
  ],
  exitOnError: false,
})
