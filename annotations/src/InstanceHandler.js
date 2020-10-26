import React from 'react';
import {ConnectingLine, Curve, LargeHandle, SmallHandle} from './Helper-functions.js';

const InstanceHandler = ({start, control, end, handleMouseDown, show}) => {

    const instructions = `
      M ${start.x},${start.y}
      Q ${control.x},${control.y}
      ${end.x},${end.y} `;

    const showLines = () => {
        if(show) return (
            <g>
                <ConnectingLine from={start} to={control}/>
                <ConnectingLine from={control} to={end} />
            </g>
        ); return(<span></span>);
    }

    const showHandle = () => {
        if(show) return (
            <SmallHandle
                coordinates={control}
                onMouseDown={() =>
                handleMouseDown('controlPoints')
            }/>
        ); return(<span></span>)
    }

    return (
      <g>
        {showLines()}
        <Curve instructions={instructions} />
        <LargeHandle
          coordinates={start}
          onMouseDown={() =>
          handleMouseDown('startPoints')
        }/>
    
        <LargeHandle
          coordinates={end}
          onMouseDown={() =>
          handleMouseDown('endPoints')
        }/>
        {showHandle()}
      </g>
    )
}

export default InstanceHandler;