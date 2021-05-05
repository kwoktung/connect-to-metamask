// @ts-ignore
import ObjectMultiplex from 'obj-multiplex';
import pump from 'pump';
import { JsonRpcEngine } from 'json-rpc-engine';
/**
 * Sets up stream multiplexing for the given stream
 * @param {any} connectionStream - the stream to mux
 * @returns {stream.Stream} the multiplexed stream
 */

export function setupMultiplex(connectionStream: any) {
  const mux = new ObjectMultiplex();
  pump(connectionStream, mux, connectionStream, (err: any) => {
    if (err) {
      console.error(err);
    }
  });
  return mux;
}

let uid = 1;

export let JsonEngine: JsonRpcEngine;
export function initJsonRpc(engine: JsonRpcEngine) {
  JsonEngine = engine;
}

export function getAccount() {
  return new Promise((resolve, reject) => {
    if (!JsonEngine) return reject('Has not been initialized yet');
    JsonEngine.handle(
      { id: uid++, method: 'eth_accounts', jsonrpc: '2.0' },
      (err, res: any) => {
        if (err) return reject(err);
        return resolve(res.result);
      }
    );
  });
}

export function requestAccounts() {
  return new Promise((resolve, reject) => {
    if (!JsonEngine) return reject('Has not been initialized yet');
    JsonEngine.handle(
      { id: uid++, method: 'eth_requestAccounts', jsonrpc: '2.0' },
      (err, res: any) => {
        if (err) return reject(err);
        return resolve(res.result);
      }
    );
  });
}

export function checkForError() {
  const { lastError } = chrome.runtime;
  if (!lastError) {
    return undefined;
  }
  if (lastError && lastError.message) {
    return lastError;
  }
  return new Error(lastError.message);
}
