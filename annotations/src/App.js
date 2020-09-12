import React from 'react';
import logo from './logo.svg';
import Bezier from './Bezier.js'
import './App.css';

function App() {

  return (
    <div>
      <Bezier viewBoxWidth={250} viewBoxHeight={250}></Bezier>
    </div>
  );
}

export default App;
