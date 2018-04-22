import {EventEmitter} from 'fbemitter';
import URI from 'urijs';

const RPC = new EventEmitter();
const emit = RPC.emit.bind(RPC);
export default RPC;

var localStorage = window.localStorage;
const KEY_TOKEN = 'accessToken';

const URL_PRE = "/admin";


let token = null;

export function getToken() {
  return token;
}

export function saveToken(_token) {
  token = _token;
  return localStorage.setItem(KEY_TOKEN, token);
}

export async function loadToken() {
  token = await localStorage.getItem(KEY_TOKEN);
  return token;
}

export async function clearToken() {
  await localStorage.removeItem(KEY_TOKEN);
  token = null;
}

async function request(url, _options) {
  const uri = new URI(URL_PRE + url);
  if (token) {
    uri.addQuery('Authorize', token);
  }

  const options = _options || {};
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

  if (__DEV__) {
    console.log(`${options.method} ${uri}`);
    if (options.body) {
      console.log(options.body);
    }
  }

  const resp = await fetch(uri.toString(), options);
  const text = await resp.text();
  console.log('RESP:', text);
  const json = JSON.parse(text);

  return json;
}

export function get(url, options) {
  return request(url, options);
}

export function post(url, data, options) {
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    ...options,
  });
}