import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import { getAccount, requestAccounts } from "./utils"
import './Popup.css';

const Popup = () => {
  const [account, setAccount] = React.useState("");
  const onClick = React.useCallback(() => {
    requestAccounts().then(accounts => {
      setAccount(accounts[0])
    })
  }, [])
  React.useEffect(() => {
    getAccount().then(accounts => {
      if (accounts && accounts[0]) {
        setAccount(accounts[0])
      }
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        {
          account ? <div className="App-Account">Metamask Account: {account}</div> : <button onClick={onClick}>Connect to Metamask</button>
        }
      </header>
    </div>
  );
};

export default Popup;
