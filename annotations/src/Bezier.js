import React from 'react';
import InstanceHandler from './InstanceHandler.js';

class Bezier extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        startPoints: [],
        controlPoints: [],
        endPoints: [],
        current_curve: null,
        draggingPointId: null
      };
      this.createCurve = this.createCurve.bind(this);
      this.removeCurve = this.removeCurve.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.renderCurves = this.renderCurves.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
    }
  
    handleMouseDown(pointId) {
      this.setState({ draggingPointId: pointId });
    }
  
    handleMouseUp() {
      this.setState({ draggingPointId: null });
    }

    handleClick(e,index){
      if(index > -1)
        this.setState({current_curve: index});
      else 
        this.setState({current_curve: null});
      if (!e) var e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    }
  
    handleMouseMove({ clientX, clientY }) {
      const { viewBoxWidth, viewBoxHeight } = this.props;
      const { draggingPointId } = this.state;
      const index = this.state.current_curve;
      if (!draggingPointId || index === null) return;
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

      if(draggingPointId === 'startPoint ' + index){
        let items = [...this.state.startPoints];
        let item = items[index];
        item = { x: viewBoxX, y: viewBoxY };
        items[index] = item;
        this.setState({startPoints: items});
      } else if (draggingPointId === 'endPoint ' + index) {
        let items = [...this.state.endPoints];
        let item = items[index];
        item = { x: viewBoxX, y: viewBoxY };
        items[index] = item;
        this.setState({endPoints: items});
      } else if(draggingPointId === 'controlPoint ' + index){
        let items = [...this.state.controlPoints];
        let item = items[index];
        item = { x: viewBoxX, y: viewBoxY };
        items[index] = item;
        this.setState({controlPoints: items});
      }
    }

    createCurve(){
      this.setState( prevState => ({
        current_curve: this.state.startPoints.length,
        startPoints: [...prevState.startPoints, {x: 100, y: 10}],
        controlPoints: [...prevState.controlPoints, {x: 190, y: 100}],
        endPoints: [...prevState.endPoints, {x: 100, y: 190}],
      }));
    }

    removeCurve(){
      var cntlpts = [...this.state.controlPoints];
      var endpts = [...this.state.endPoints];
      var strtpts = [...this.state.startPoints];
      var index = this.state.current_curve;
      if(index !== null){
        cntlpts.splice(index,1);
        endpts.splice(index,1);
        strtpts.splice(index,1);
        this.setState({
          startPoints: strtpts,
          controlPoints: cntlpts,
          endPoints: endpts,
          current_curve: null
        });
      }
    }

    renderCurves(){
      const inst = [];
      for(const i in this.state.startPoints){
        inst.push(<g onClick={(ev) => this.handleClick(ev,i)} key = {i}>
          <InstanceHandler
            start = {this.state.startPoints[i]} 
            control = {this.state.controlPoints[i]} 
            end = {this.state.endPoints[i]} 
            handleMouseDown = {this.handleMouseDown}
            show={(this.state.current_curve === i) ? true : false}
            index={i}
          />
        </g>);
      }
      return(inst);
    }

    render() {

      const { viewBoxWidth, viewBoxHeight } = this.props;

      return (
        <div onKeyDown={this.removeCurve}>
          <svg
            ref={node => (this.node = node)}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
            style={{ overflow: 'visible', width: '33%',border: '2px solid'}}
            onClick={(ev) => this.handleClick(ev,-1)}
            onMouseMove={(ev) => this.handleMouseMove(ev)}
            onMouseUp={() => this.handleMouseUp()}
            onMouseLeave={() => this.handleMouseUp()}
          >
          <this.renderCurves/>
        </svg>
          <button onClick={this.createCurve}>create</button>
          <button onClick={this.removeCurve}>delete</button>
      </div>
      );
    }
  }

  export default Bezier;