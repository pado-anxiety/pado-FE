/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');
const dotenv = require('dotenv');
const packageJson = require('./package.json');
// const z = require('zod');

const APP_ENV = process.env.APP_ENV ?? 'development';

const envPath = path.resolve(__dirname, `.env.${APP_ENV}`);
console.log('loading env from:', envPath);

dotenv.config({ path: envPath });

const NAME = '파도';
const VERSION = packageJson.version;
const SLUG = 'pado';
const SCHEME = [
  'pado',
  'com.googleusercontent.apps.462769921210-ocj5vrpss8iu7brqoh55amrq3bj76l4f',
];
const IOS_REDIRECT_URI =
  'com.googleusercontent.apps.462769921210-ocj5vrpss8iu7brqoh55amrq3bj76l4f:/oauth2redirect/google';
const IOS_GOOGLE_CLIENT_ID =
  '462769921210-ocj5vrpss8iu7brqoh55amrq3bj76l4f.apps.googleusercontent.com';
const IOS_BUNDLE_IDENTIFIER = 'com.taewoongheo.pado';
const ANDROID_PACKAGE = 'com.taewoongheo.pado';
const WEB_CLIENT_ID =
  '462769921210-uoli77o7e6u25cou915jusrmcfnfal83.apps.googleusercontent.com';

// // define env schema
// const client = z.object({
//   APP_ENV: z.enum(['development', 'production']),
//   NAME: z.string(),
//   VERSION: z.string(),
//   SLUG: z.string(),
//   SCHEME: z.array(z.string()),
//   IOS_REDIRECT_URI: z.string(),
//   IOS_GOOGLE_CLIENT_ID: z.string(),
//   IOS_BUNDLE_IDENTIFIER: z.string(),
//   ANDROID_PACKAGE: z.string(),
//   WEB_CLIENT_ID: z.string(),

//   // add client environment variables here
//   BASE_URL: z.string(),
//   IOS_WEBVIEW_URL: z.string(),
//   ANDROID_WEBVIEW_URL: z.string(),
// });

// const buildTime = z.object({
//   // add build environment variables here
// });

// define env values
const _clientEnv = {
  APP_ENV,
  NAME,
  VERSION,
  SLUG,
  SCHEME,
  IOS_REDIRECT_URI,
  IOS_GOOGLE_CLIENT_ID,
  IOS_BUNDLE_IDENTIFIER,
  ANDROID_PACKAGE,
  WEB_CLIENT_ID,

  // add client environment variables here
  BASE_URL: process.env.BASE_URL,
  IOS_WEBVIEW_URL: process.env.IOS_WEBVIEW_URL,
  ANDROID_WEBVIEW_URL: process.env.ANDROID_WEBVIEW_URL,
};

const _buildTimeEnv = {
  // add build environment variables here
};

// const ClientEnv = client.safeParse(_clientEnv);
// const BuildTimeEnv = buildTime.safeParse(_buildTimeEnv);

// if (!ClientEnv.success || !BuildTimeEnv.success) {
//   console.error('Invalid environment variables');
//   throw new Error('Invalid environment variables');
// }

// console.log('ClientEnv: ', ClientEnv.data);

// module.exports = {
//   ClientEnv: ClientEnv.data,
//   BuildTimeEnv: BuildTimeEnv.data,
// };

module.exports = {
  ClientEnv: _clientEnv,
  BuildTimeEnv: _buildTimeEnv,
};
