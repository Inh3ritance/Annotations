import React from 'react';
import Canon from './canonball.png';
import Bezier from './Bezier.js'
import './App.css';

function App() {

  return (
    <div>
      <Bezier viewBoxWidth={400} viewBoxHeight={400} background={Canon}></Bezier>
    </div>
  );
}

export default App;
