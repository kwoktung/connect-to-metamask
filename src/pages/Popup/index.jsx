import React from 'react';
import { render } from 'react-dom';
import pump from "pump";
import { JsonRpcEngine } from "json-rpc-engine";
import PortStream  from "extension-port-stream"
import { createStreamMiddleware } from "json-rpc-middleware-stream";


import { setupMultiplex, initJsonRpc, checkForError } from "./utils"
import Popup from './Popup';
import './index.css';

const metamaskID = "nkbihfbeogaeaoehlefnkodbefgpgknn"

chrome.management.get(metamaskID, (info) => {
  if (!info) {
    render(<div className="cont">
      <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-GB" target="_blank">Please install Metemask</a>
    </div>, window.document.querySelector('#app-container'));
  } else if (!info.enabled) {
    render(<div className="cont">Please Enable Metemask</div>, window.document.querySelector('#app-container'));
  } else {
    const port = chrome.runtime.connect(metamaskID);
    const portStream = new PortStream(port);
    const mux = setupMultiplex(portStream);
    const controllerStream = mux.createStream("metamask-provider");

    const engine = new JsonRpcEngine();
    initJsonRpc(engine);
    const jsonRpcConnection = createStreamMiddleware();
    engine.push(jsonRpcConnection.middleware);

    const clientSideStream = jsonRpcConnection.stream;
    pump(clientSideStream, controllerStream, clientSideStream, () => {
      console.warn("connection Disconnect");
    });
    render(<Popup />, window.document.querySelector('#app-container'));
  }
})



if (module.hot) module.hot.accept();
