import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import OktaJwtVerifier from '@okta/jwt-verifier';
import mongoose from 'mongoose'

import postsRouter from './routes/posts';
import usersRouter from './routes/users';

require('dotenv').config({ path: '.env.local' });

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

app.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error('Authorization header is required');

    const accessToken = req.headers.authorization.trim().split(' ')[1];
    await oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default');
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const atlasUri = process.env.ATLAS_URI;
mongoose.connect(atlasUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(Error, err.message);
  });
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});
/**const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
})**/

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

export default app;
