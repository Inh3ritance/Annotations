// These helper stateless-functional-components allow us to reuse styles, and give each shape a meaningful name.
import React from 'react';
import PropTypes from 'prop-types';

export const ConnectingLine = ({ from, to }) => (
    <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke='rgb(200, 200, 200)'
        strokeDasharray='5,5'
        strokeWidth={1}
    />
);

export const Curve = ({ instructions }) => (
    <path
        d={instructions}
        fill='none'
        stroke='black'
        strokeWidth={1}
    />
);

export const LargeHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
        cx={coordinates.x}
        cy={coordinates.y}
        rx={3}
        ry={3}
        fill='green'
        onMouseDown={onMouseDown}
        style={{ cursor: '-webkit-grab' }}
    />
);

export const SmallHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
        cx={coordinates.x}
        cy={coordinates.y}
        rx={3}
        ry={3}
        fill='transparent'
        stroke='rgb(244, 0, 137)'
        strokeWidth={2}
        onMouseDown={onMouseDown}
        style={{ cursor: '-webkit-grab' }}
    />
);

ConnectingLine.propTypes = {
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
};

Curve.propTypes = {
    instructions: PropTypes.string.isRequired,
};

LargeHandle.propTypes = {
    coordinates: PropTypes.object.isRequired,
    onMouseDown: PropTypes.func.isRequired,
};

SmallHandle.propTypes = {
    coordinates: PropTypes.object.isRequired,
    onMouseDown: PropTypes.func.isRequired,
};
