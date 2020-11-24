import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InstanceHandler from './InstanceHandler';
import './Bezier.css';

const Bezier = (props) => {

    const [startPoints, setStartPoints] = useState([]);
    const [controlPoints, setControlPoints] = useState([]);
    const [endPoints, setEndPoints] = useState([]);
    const [currentCurve, setCurrentCurve] = useState(null);
    const [draggingPointId, setDraggingPointId] = useState(null);
    const [node, setNode] = useState(null);
    const { viewBoxWidth, viewBoxHeight, background } = props;

    const handleMouseDown = (pointId) => {
        setDraggingPointId(pointId);
    };

    const handleMouseUp = () => {
        setDraggingPointId(null);
    };

    const handleClick = (e, index) => {
        console.log(`clicked on ${index}`);
        const curve = index > -1 ? index : null;
        setCurrentCurve(curve);
    };

    const getPositions = (clientX, clientY) => {
        const svgRect = node.getBoundingClientRect();
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
    };

    const handleMouseMove = ({ clientX, clientY }) => {
        const [viewBoxX, viewBoxY] = getPositions(clientX, clientY);
        if (draggingPointId === `startPoint ${currentCurve}`) {
            const items = [...startPoints];
            items[currentCurve] = {
                x: viewBoxX,
                y: viewBoxY,
            };
            setStartPoints(items);
        } else if (draggingPointId === `endPoint ${currentCurve}`) {
            const items = [...endPoints];
            items[currentCurve] = {
                x: viewBoxX,
                y: viewBoxY,
            };
            setEndPoints(items);
        } else if (draggingPointId === `controlPoint ${currentCurve}`) {
            const items = [...controlPoints];
            items[currentCurve] = {
                x: viewBoxX,
                y: viewBoxY,
            };
            setControlPoints(items);
        }
    };

    const createCurve = () => {
        setCurrentCurve(startPoints.length);
        setStartPoints([...startPoints, { x: 100, y: 10 }]);
        setControlPoints([...controlPoints, { x: 190, y: 100 }]);
        setEndPoints([...endPoints, { x: 100, y: 190 }]);
    };

    const removeCurve = () => {
        const cntlpts = [...controlPoints];
        const endpts = [...endPoints];
        const strtpts = [...startPoints];
        if (currentCurve !== null) {
            cntlpts.splice(currentCurve, 1);
            endpts.splice(currentCurve, 1);
            strtpts.splice(currentCurve, 1);
            setStartPoints(strtpts);
            setControlPoints(cntlpts);
            setEndPoints(endpts);
            setCurrentCurve(null);
        }
    };

    const renderCurves = () => {
        const inst = [];
        for (let i = 0; i < startPoints.length; i += 1) {
            inst.push(
                <g onMouseDown={(ev) => handleClick(ev, i)} key={i}>
                    <InstanceHandler
                        start={startPoints[i]}
                        control={controlPoints[i]}
                        end={endPoints[i]}
                        handleMouseDown={handleMouseDown}
                        show={(currentCurve === i)}
                        index={i}
                    />
                </g>,
            );
        }
        return (inst);
    };

    return (
        <div>
            <svg
                /* eslint-disable-next-line no-return-assign,react/no-this-in-sfc */
                ref={(node) => (setNode(node))}
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                style={{ overflow: 'visible', width: viewBoxWidth, height: viewBoxHeight, border: '1px solid', backgroundImage: `url(${background})`, backgroundSize: `${viewBoxWidth}px ${viewBoxHeight}px` }}
                onClick={(ev) => handleClick(ev, -1)}
                onMouseMove={(ev) => handleMouseMove(ev)}
                onMouseUp={() => handleMouseUp()}
                onMouseLeave={() => handleMouseUp()}
            >
                {renderCurves()}
            </svg>
            <button
                onClick={createCurve}
                type='button'
            >
                    create
            </button>
            <button
                onClick={removeCurve}
                type='button'
            >
                    delete
            </button>
        </div>
    );
};

Bezier.propTypes = {
    viewBoxWidth: PropTypes.number.isRequired,
    viewBoxHeight: PropTypes.number.isRequired,
    background: PropTypes.string.isRequired,
};

export default Bezier;
