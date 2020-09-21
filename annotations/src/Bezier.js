import React from 'react';
import {ConnectingLine, Curve, LargeHandle, SmallHandle} from './Helper-functions.js';

class Bezier extends React.Component {
    constructor(props) {
      super(props);
  
      // These are our 3 Bézier points, stored in state.
      this.state = {
        startPoint: { x: 100, y: 10 },
        controlPoint: { x: 190, y: 100 },
        endPoint: { x: 100, y: 190 },
  
        // We keep track of which point is currently being dragged. By default, no point is.
        draggingPointId: null
      };
    }
  
    handleMouseDown(pointId) {
      this.setState({ draggingPointId: pointId });
    }
  
    handleMouseUp() {
      this.setState({ draggingPointId: null });
    }
  
    handleMouseMove({ clientX, clientY }) {
      const { viewBoxWidth, viewBoxHeight } = this.props;
      const { draggingPointId } = this.state;
      // If we're not currently dragging a point, this is a no-op. Nothing needs to be done.
      if (!draggingPointId) return;

      // eg. `<svg viewBox="0 0 250 250"
      const svgRect = this.node.getBoundingClientRect();
      const svgX = clientX - svgRect.left;
      const svgY = clientY - svgRect.top;

      var viewBoxX = svgX * viewBoxWidth / svgRect.width;
      var viewBoxY = svgY * viewBoxHeight / svgRect.height;

      if(viewBoxX > 250){
        viewBoxX = 250;
      } else if(viewBoxX < 0){
        viewBoxX = 0;
      }

      if(viewBoxY > 250){
        viewBoxY = 250;
      } else if(viewBoxY < 0){
        viewBoxY = 0;
      }

      this.setState({
        [draggingPointId]: { x: viewBoxX, y: viewBoxY },
      });
    }
  
    render() {
      const {
        startPoint,
        controlPoint,
        endPoint
      } = this.state;

      const { viewBoxWidth, viewBoxHeight } = this.props;

      return (
        <svg
          ref={node => (this.node = node)}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} // controls box area for drawable stuff
          style={{ overflow: 'visible', width: '33%',border: '2px solid'}}
          onMouseMove={ev => this.handleMouseMove(ev)}
          onMouseUp={() => this.handleMouseUp()}
          onMouseLeave={() => this.handleMouseUp()}
        >

        <InstanceHandler 
          start = {startPoint} 
          control = {controlPoint} 
          end = {endPoint} 
          onMouseDown={this.handleMouseDown}
          onMouseMove={ev => this.handleMouseMove(ev)}
          onMouseUp={() => this.handleMouseUp()}
          onMouseLeave={() => this.handleMouseUp()}
        />

        </svg>
      );
    }
  }

  const InstanceHandler = ({start, control, end}) => {

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
              this.handleMouseDown('startPoint')
            }
          />
  
          <LargeHandle
            coordinates={end}
            onMouseDown={() =>
              this.handleMouseDown('endPoint')
            }
          />
  
          <SmallHandle
            coordinates={control}
            onMouseDown={() =>
              this.handleMouseDown('controlPoint')
            }
          />
      </g>
    )
  }

  export default Bezier;