import React from 'react';
import {ConnectingLine, Curve, LargeHandle, SmallHandle} from './Helper-functions.js';

const InstanceHandler = ({start, control, end, handleMouseDown, show, index}) => {

    const instructions = `
      M ${start.x},${start.y}
      Q ${control.x},${control.y}
      ${end.x},${end.y} `;

    const showLines = () => {
        if(show) return (
            <g>
                <ConnectingLine from={start} to={control}/>
                <ConnectingLine from={control} to={end} />
                <SmallHandle
                  coordinates={control}
                  onMouseDown={() =>
                  handleMouseDown('controlPoint '+ index)
                }/>
            </g>
        ); return(<span></span>);
    }

    return (
      <g>
        {showLines()}
        <Curve instructions={instructions} />
        <LargeHandle
          coordinates={start}
          onMouseDown={() =>
          handleMouseDown('startPoint '+ index)
        }/>
    
        <LargeHandle
          coordinates={end}
          onMouseDown={() =>
          handleMouseDown('endPoint '+ index)
        }/>
      </g>
    )
}

export default InstanceHandler;