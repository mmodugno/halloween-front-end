import React, { useState, useEffect } from 'react';
import './App.css';
import { detectIncognito } from "detectincognitojs";

import Home from './pages/Home';
import Splash from './pages/Splash';
import Winner from './pages/Winner';

function App() {
  const [isIncognito, setIncognito] = useState(false);
  const [passphrase, setPassphrase] = useState('')
  const [userID, setUserID] = useState(0)
  const [voteFinished, setVoteFinished] = useState(false)

  useEffect(() =>
  (async function () {
    const isIncognito = await detectIncognito()
    setIncognito(isIncognito.isPrivate)
  }), [])

  useEffect(() => {
    const pw = JSON.parse(localStorage.getItem('halloween-passphrase'));
    const userID = JSON.parse(localStorage.getItem('halloween-user'));
    if (pw) {
      setUserID(userID)
      setPassphrase(pw)
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('halloween-passphrase', JSON.stringify(passphrase));
  }, [passphrase]);

  useEffect(() => {
    if (passphrase === 'winner') setVoteFinished(true)
  }, [passphrase])

  if (isIncognito) {
    document.body.style = 'background-color:#2f2c36;';
    return (
      <div class="shall-not-pass">
        <img src={require('./assets/not-pass.gif')} alt="you can't pass" />
      </div>
    )
  }
  // Hack for showing winner
  if (voteFinished) return (<Winner />)
  if (passphrase) return (<Home passphrase={passphrase} userID={userID} />)
  return (
    <div className="App" >
      <Splash setPassphrase={setPassphrase} setUserID={setUserID} />
    </div>
  );
}

export default App;

