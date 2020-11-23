import React from 'react';
import PropTypes from 'prop-types';
import InstanceHandler from './InstanceHandler';
import './Bezier.css';

class Bezier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startPoints: [],
            controlPoints: [],
            endPoints: [],
            currentCurve: null,
            draggingPointId: null,
        };
        this.createCurve = this.createCurve.bind(this);
        this.removeCurve = this.removeCurve.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderCurves = this.renderCurves.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.getPositions = this.getPositions.bind(this);
    }

    handleMouseDown(pointId) {
        this.setState({ draggingPointId: pointId });
    }

    handleMouseUp() {
        this.setState({ draggingPointId: null });
    }

    handleClick(e, index) {
        if (index > -1) {
            this.setState({ currentCurve: index });
        } else {
            this.setState({ currentCurve: null });
        }
        const event = !e ? window.event : e;
        event.cancelBubble = true;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    }

    handleMouseMove({ clientX, clientY }) {
        const { draggingPointId } = this.state;
        const { currentCurve } = this.state;
        const [viewBoxX, viewBoxY] = this.getPositions(clientX, clientY);
        if (draggingPointId === `startPoint ${currentCurve}`) {
            const { startPoints } = this.state;
            const items = [...startPoints];
            let item = items[currentCurve];
            item = { x: viewBoxX, y: viewBoxY };
            items[currentCurve] = item;
            this.setState({ startPoints: items });
        } else if (draggingPointId === `endPoint ${currentCurve}`) {
            const { endPoints } = this.state;
            const items = [...endPoints];
            let item = items[currentCurve];
            item = { x: viewBoxX, y: viewBoxY };
            items[currentCurve] = item;
            this.setState({ endPoints: items });
        } else if (draggingPointId === `controlPoint ${currentCurve}`) {
            const { controlPoints } = this.state;
            const items = [...controlPoints];
            let item = items[currentCurve];
            item = { x: viewBoxX, y: viewBoxY };
            items[currentCurve] = item;
            this.setState({ controlPoints: items });
        }
    }

    getPositions(clientX, clientY) {
        const { viewBoxWidth, viewBoxHeight } = this.props;
        const svgRect = this.node.getBoundingClientRect();
        const svgX = clientX - svgRect.left;
        const svgY = clientY - svgRect.top;
        // eslint-disable-next-line no-mixed-operators
        let viewBoxX = svgX * viewBoxWidth / svgRect.width;
        // eslint-disable-next-line no-mixed-operators
        let viewBoxY = svgY * viewBoxHeight / svgRect.height;

        if (viewBoxX > viewBoxWidth) viewBoxX = viewBoxWidth;
        else if (viewBoxX < 0) viewBoxX = 0;

        if (viewBoxY > viewBoxHeight) viewBoxY = viewBoxHeight;
        else if (viewBoxY < 0) viewBoxY = 0;

        return [viewBoxX, viewBoxY];
    }

    createCurve() {
        this.setState((prevState) => ({
            currentCurve: prevState.startPoints.length,
            startPoints: [...prevState.startPoints, { x: 100, y: 10 }],
            controlPoints: [...prevState.controlPoints, { x: 190, y: 100 }],
            endPoints: [...prevState.endPoints, { x: 100, y: 190 }],
        }));
    }

    removeCurve() {
        const { controlPoints, endPoints, startPoints, currentCurve } = this.state;
        const cntlpts = [...controlPoints];
        const endpts = [...endPoints];
        const strtpts = [...startPoints];
        if (currentCurve !== null) {
            cntlpts.splice(currentCurve, 1);
            endpts.splice(currentCurve, 1);
            strtpts.splice(currentCurve, 1);
            this.setState({
                startPoints: strtpts,
                controlPoints: cntlpts,
                endPoints: endpts,
                currentCurve: null,
            });
        }
    }

    renderCurves() {
        const inst = [];
        const { startPoints, controlPoints, endPoints, currentCurve } = this.state;
        for (let i = 0; i < startPoints.length; i += 1) {
            inst.push(
                <g onClick={(ev) => this.handleClick(ev, i)} key={i}>
                    <InstanceHandler
                        start={startPoints[i]}
                        control={controlPoints[i]}
                        end={endPoints[i]}
                        handleMouseDown={this.handleMouseDown}
                        show={(currentCurve === i)}
                        index={i}
                    />
                </g>);
        }
        return (inst);
    }

    render() {

        const { viewBoxWidth, viewBoxHeight, background } = this.props;

        return (
            <div
                onKeyDown={this.removeCurve}
                role='button'
                tabIndex='0'
            >
                <svg
                    /* eslint-disable-next-line no-return-assign */
                    ref={(node) => (this.node = node)}
                    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                    style={{ overflow: 'visible', width: viewBoxWidth, height: viewBoxHeight, border: '1px solid', backgroundImage: `url(${background})`, backgroundSize: `${viewBoxWidth}px ${viewBoxHeight}px` }}
                    onClick={(ev) => this.handleClick(ev, -1)}
                    onMouseMove={(ev) => this.handleMouseMove(ev)}
                    onMouseUp={() => this.handleMouseUp()}
                    onMouseLeave={() => this.handleMouseUp()}
                >
                    <this.renderCurves />
                </svg>
                <button
                    onClick={this.createCurve}
                    type='button'
                >
                    create
                </button>
                <button
                    onClick={this.removeCurve}
                    type='button'
                >
                    delete
                </button>
            </div>
        );
    }
}

Bezier.propTypes = {
    viewBoxWidth: PropTypes.number.isRequired,
    viewBoxHeight: PropTypes.number.isRequired,
    background: PropTypes.object.isRequired,
};

export default Bezier;
