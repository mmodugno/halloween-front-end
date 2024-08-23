import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Splash from './pages/Splash';
import './App.css';

function App() {
  const [passphrase, setPassphrase] = useState('')
  const [userID, setUserID] = useState(0)
  
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

  if (passphrase) return (<Home userID={userID}/>)
  return (
    <div className="App" >
      <Splash setPassphrase={setPassphrase} setUserID={setUserID}/>
    </div>
  );
}

export default App;

