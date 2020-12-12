/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Bezier from './Bezier';
import white from './white.jpg';
import './App.css';

function App() {

    const [startpoints, setstart] = useState([]);
    const [midpoints, setmid] = useState([]);
    const [endpoints, setend] = useState([]);

    console.log(startpoints);
    console.log(midpoints);
    console.log(endpoints);

    return (
        <div>
            <Bezier viewBoxWidth={400} viewBoxHeight={400} background={white} onStartPoints={setstart} onMidPoints={setmid} onEndPoints={setend}/>
        </div>
    );
}

export default App;
/* eslint-disable */