import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InstanceHandler from './InstanceHandler';
import './Bezier.css';

const Bezier = (props) => {

    const [drawing, setDrawing] = useState(false);
    const [startPoints, setStartPoints] = useState([]);
    const [controlPoints, setControlPoints] = useState([]);
    const [endPoints, setEndPoints] = useState([]);
    const [currentCurve, setCurrentCurve] = useState(null);
    const [draggingPointId, setDraggingPointId] = useState(null);
    const [node, setNode] = useState(null);
    const [drawStart, setDrawStart] = useState(null);
    const [drawControl, setDrawControl] = useState(null);
    const [drawEnd, setDrawEnd] = useState(null);
    const { viewBoxWidth, viewBoxHeight, background } = props;

    const handleMouseDown = (pointId) => {
        setDraggingPointId(pointId);
    };

    // Unselects dragging point
    const handleMouseUp = () => {
        setDraggingPointId(null);
    };

    const handleClick = (e, index) => {
        const curve = index > -1 ? index : null;
        setCurrentCurve(curve);
    };

    const getPositions = (clientX, clientY) => {
        const svgRect = node.getBoundingClientRect();
        const svgX = clientX - svgRect.left;
        const svgY = clientY - svgRect.top;
        let viewBoxX = svgX * viewBoxWidth / svgRect.width;
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

    const startDrawing = (ev) => {
        if (!drawing) {
            const { clientX, clientY } = ev;
            handleClick(ev, -1); // Clicked on outside so unselect curve
            const [viewBoxX, viewBoxY] = getPositions(clientX, clientY);
            setDrawStart(
                {
                    x: viewBoxX,
                    y: viewBoxY,
                },
            );
        }

    };

    const handleDrawing = ({ clientX, clientY }) => {
        if (drawStart == null) {
            // End if no drawing start point
            return;
        }
        const [viewBoxX, viewBoxY] = getPositions(clientX, clientY);
        if ((viewBoxX !== drawStart.x && viewBoxY !== drawStart.y) || drawing) {
            // Drawing will start on next move update
            // Set end point
            setDrawEnd(
                {
                    x: viewBoxX,
                    y: viewBoxY,
                },
            );
            // Center the control point
            setDrawControl(
                {
                    x: (viewBoxX + drawStart.x) / 2.0,
                    y: (viewBoxY + drawStart.y) / 2.0,
                },
            );
            setDrawing(true);
        }

    };

    const endDrawing = ({ clientX, clientY }) => {
        // Always unselect dragging point
        handleMouseUp();
        const [viewBoxX, viewBoxY] = getPositions(clientX, clientY);
        if (drawing) {
            // Set end point
            setDrawEnd(
                {
                    x: viewBoxX,
                    y: viewBoxY,
                },
            );
            // Center the control point
            setDrawControl(
                {
                    x: (viewBoxX + drawStart.x) / 2.0,
                    y: (viewBoxY + drawStart.y) / 2.0,
                },
            );
            // Add new points to sets
            setStartPoints([...startPoints, drawStart]);
            setControlPoints([...controlPoints, drawControl]);
            setEndPoints([...endPoints, drawEnd]);
            // Reset drawing vars
            setDrawing(false);
            setDrawEnd(null);
            setDrawStart(null);
            setDrawControl(null);
        } else {
            // Single click. Didn't drag to draw
            setDrawStart(null);
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

    // Render the drawing curve when user is dragging to draw
    const renderDrawCurve = drawing ? (
        <g>
            <InstanceHandler
                start={drawStart}
                control={drawControl}
                end={drawEnd}
                handleMouseDown={handleMouseDown}
                show
                index={startPoints.length + 1}
            />
        </g>
    ) : null;

    return (
        <div>
            <svg
                ref={(node) => (setNode(node))}
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                style={
                    {
                        overflow: 'visible',
                        width: viewBoxWidth,
                        height: viewBoxHeight,
                        border: '1px solid',
                        backgroundImage: `url(${background})`,
                        backgroundSize: `${viewBoxWidth}px ${viewBoxHeight}px`,
                    }
                }
                onMouseMove={(ev) => handleMouseMove(ev)}
                onMouseUp={(ev) => endDrawing(ev)}
                onMouseLeave={() => handleMouseUp()}
            >
                <rect
                    x='0'
                    y='0'
                    height={`${viewBoxHeight}`}
                    width={`${viewBoxWidth}`}
                    fill='#ffffff00'
                    onMouseDown={(ev) => startDrawing(ev)}
                    onMouseMove={(ev) => handleDrawing(ev)}
                    onClick={(ev) => endDrawing(ev)}
                />
                {renderCurves()}
                {renderDrawCurve}
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
