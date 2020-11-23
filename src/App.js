import React from 'react';
import Bezier from './Bezier';
import white from './white.jpg';
import './App.css';

function App() {

    return (
        <div>
            <Bezier viewBoxWidth={400} viewBoxHeight={400} background={white} />
        </div>
    );
}

export default App;
