import React from 'react';
import {ConnectingLine, Curve, LargeHandle, SmallHandle} from './Helper-functions.js';

const InstanceHandler = ({start, control, end, handleMouseDown}) => {

    const instructions = `
      M ${start.x},${start.y}
      Q ${control.x},${control.y}
      ${end.x},${end.y} `;

    return (
      <g>
        <ConnectingLine from={start} to={control} />
        <ConnectingLine from={control} to={end} />
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
      
        <SmallHandle
          coordinates={control}
          onMouseDown={() =>
          handleMouseDown('controlPoints')
        }/>
      </g>
    )
}

export default InstanceHandler;