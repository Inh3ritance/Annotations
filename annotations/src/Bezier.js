import React from 'react';
import {ConnectingLine, Curve, LargeHandle, SmallHandle} from './Helper-functions.js';

class Bezier extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        startPoints: [],
        controlPoints: [],
        endPoints: [],
        draggingPointId: null
      };
      this.createCurve = this.createCurve.bind(this);
      this.removeCurve = this.removeCurve.bind(this);
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
      console.log(this.state)
      if (!draggingPointId) return; // If we're not currently dragging a point, this is a no-op. Nothing needs to be done.

      const svgRect = this.node.getBoundingClientRect();
      const svgX = clientX - svgRect.left;
      const svgY = clientY - svgRect.top;

      var viewBoxX = svgX * viewBoxWidth / svgRect.width;
      var viewBoxY = svgY * viewBoxHeight / svgRect.height;

      if(viewBoxX > 250)
        viewBoxX = 250;
      else if(viewBoxX < 0)
        viewBoxX = 0;

      if(viewBoxY > 250)
        viewBoxY = 250;
      else if(viewBoxY < 0)
        viewBoxY = 0;

      this.setState({
        [draggingPointId]: [{ x: viewBoxX, y: viewBoxY }]
      });
      
    }

    createCurve(){
        this.setState( prevState => ({
          startPoints: [...prevState.startPoints, {x: 100, y: 10}],
          controlPoints: [...prevState.controlPoints, {x: 190, y: 100}],
          endPoints: [...prevState.endPoints, {x: 100, y: 190}]
        }))
    }

    removeCurve(event){
      var cntlpts = [...this.state.controlPoints];
      var endpts = [...this.state.endPoints];
      var strtpts = [...this.state.startPoints];
      var index = 0;
      if(index !== -1){
        cntlpts.splice(index,1);
        endpts.splice(index,1);
        strtpts.splice(index,1);
        this.setState({
          startPoints: strtpts,
          controlPoints: cntlpts,
          endPoints: endpts,
        });
      }
    }

    render() {
      
      const {
        startPoints,
        controlPoints,
        endPoints
      } = this.state;

      const { viewBoxWidth, viewBoxHeight } = this.props;

      return (
        <div onKeyDown={ev => this.removeCurve(ev)}>
            <svg
              ref={node => (this.node = node)}
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
              style={{ overflow: 'visible', width: '33%',border: '2px solid'}}
              onMouseMove={ev => this.handleMouseMove(ev)}
              onMouseUp={() => this.handleMouseUp()}
              onMouseLeave={() => this.handleMouseUp()}
            >
{
              startPoints.map(startPoint => (
                controlPoints.map(controlPoint => (
                  endPoints.map(endPoint => (
              <g>
              <InstanceHandler 
                start = {startPoint} 
                control = {controlPoint} 
                end = {endPoint} 
              />

              <LargeHandle
                coordinates={startPoint}
                onMouseDown={() =>
                this.handleMouseDown('startPoints')
              }/>
    
              <LargeHandle
                coordinates={endPoint}
                onMouseDown={() =>
                  this.handleMouseDown('endPoints')
              }/>
      
              <SmallHandle
                coordinates={controlPoint}
                onMouseDown={() =>
                  this.handleMouseDown('controlPoints')
              }/>
              </g>
              ))))))}
          </svg>
          <button onClick={this.createCurve}>create</button>
        </div>
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
      </g>
    )
  }

  export default Bezier;