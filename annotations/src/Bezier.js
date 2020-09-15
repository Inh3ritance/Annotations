import React from 'react';

class Bezier extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        // These are our 3 Bézier points, stored in state.
        startPoint: { x: 100, y: 10 },
        controlPoint: { x: 190, y: 100 },
        endPoint: { x: 100, y: 190 },
  
        // We keep track of which point is currently being dragged. By default, no point is.
        draggingPointId: null,
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
      if (!draggingPointId) {
        return;
      }

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
      const { viewBoxWidth, viewBoxHeight } = this.props;

      return (
        <svg
          ref={node => (this.node = node)}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} // controls box area for drawable stuff
          onMouseMove={ev => this.handleMouseMove(ev)}
          onMouseUp={() => this.handleMouseUp()}
          onMouseLeave={() => this.handleMouseUp()}
          style={{ overflow: 'visible', width: '33%',border: '2px solid'}}
        >
        <InstanceHandler startPoint endpoint controlPoint/>
        </svg>
      );
    }
  }
  
  // These helper stateless-functional-components allow us to reuse styles, and give each shape a meaningful name.
  
  const ConnectingLine = ({ from, to }) => (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="rgb(200, 200, 200)"
      strokeDasharray="5,5"
      strokeWidth={1}
    />
  );
  
  const Curve = ({ instructions }) => (
    <path
      d={instructions}
      fill="none"
      stroke="black"
      strokeWidth={1}
    />
  );
  
  const LargeHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
      cx={coordinates.x}
      cy={coordinates.y}
      rx={3}
      ry={3}
      fill="green"
      onMouseDown={onMouseDown}
      style={{ cursor: '-webkit-grab' }}
    />
  );
  
  const SmallHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
      cx={coordinates.x}
      cy={coordinates.y}
      rx={3}
      ry={3}
      fill="transparent"
      stroke="rgb(244, 0, 137)"
      strokeWidth={2}
      onMouseDown={onMouseDown}
      style={{ cursor: '-webkit-grab' }}
    />
  );

  function InstanceHandler() {
          // here
          const {
            startPoint,
            controlPoint,
            endPoint,
          } = this.state;
      
          // make function for multiple instructions
          const instructions = `
            M ${startPoint.x},${startPoint.y}
            Q ${controlPoint.x},${controlPoint.y}
              ${endPoint.x},${endPoint.y}
          `;
          // here
    return (
      <div>
          <ConnectingLine from={startPoint} to={controlPoint} />
          <ConnectingLine from={controlPoint} to={endPoint} />
          <Curve instructions={instructions} />
  
          <LargeHandle
            coordinates={startPoint}
            onMouseDown={() =>
              this.handleMouseDown('startPoint')
            }
          />
  
          <LargeHandle
            coordinates={endPoint}
            onMouseDown={() =>
              this.handleMouseDown('endPoint')
            }
          />
  
          <SmallHandle
            coordinates={controlPoint}
            onMouseDown={() =>
              this.handleMouseDown('controlPoint')
            }
          />
      </div>
    )
  }

  export default Bezier;