import React from 'react';
import Home from './pages/Home';
import Splash from './pages/Splash';
import './App.css';

function App() {
  if (false) {
    return (
      <div className="App" >
        <Splash />
      </div>
    );
  }
  return (<Home />)
}

export default App;
