import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import * as path from 'path'
import * as cors from 'cors'
import * as morgan from 'morgan'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as serveIndex from 'serve-index'

// import routeWebm from './route/webm'
import routeStream from './route/mjpeg'
// import routeHls from './route/hls'

import routeApi from './route/api'
import routeData from './route/data'
import routeMove from './route/move'


import { logger } from './logger';

const NODE_ENV = process.env.NODE_ENV;

const app = express();


app.use(cors());
app.use(morgan('combined', {
  stream: {
    write: (message, encoding) => {
      logger.info(message);
    }
  }
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('data/public', { index: false, extensions: ['html'] }))
app.use(express.static('dist/client', { extensions: ['html'] }))
app.use(express.static('dist/scripts'))
app.use('/logs', serveIndex('logs', { icons: true }))
app.use('/logs', express.static('logs'))

// app.use('/hls', routeHls);

app.use('/move', routeMove);
// app.use('/webm', routeWebm);
app.use('/api', routeApi);
app.use('/data', routeData);
app.use('/mjpeg', routeStream);


app.get('/', (req: express.Request, res: express.Response, next: Function) => {
  res.send('OK')
})

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: Function) => {

    // let err = new Error('Not Found');
    // res.status(404);
    // logger.debug('catching 404 error');
    // return next(err);

    // let err = new Error('Not Found');
    // res.status(404);
    logger.debug('catching 404 error');
    res.send("404 :( ")
});

export default app;
