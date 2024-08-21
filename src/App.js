import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Splash from './pages/Splash';
import './App.css';

function App() {
  const [passphrase, setPassphrase] = useState('')
  
  useEffect(() => {
    const pw = JSON.parse(localStorage.getItem('halloween-passphrase'));
    if (pw) {
      setPassphrase(pw)
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('halloween-passphrase', JSON.stringify(passphrase));
  }, [passphrase]);

  if (passphrase) return (<Home />)
  return (
    <div className="App" >
      <Splash setPassphrase={setPassphrase} />
    </div>
  );
}

export default App;
