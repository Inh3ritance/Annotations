import React from 'react';
import PropTypes from 'prop-types';
import { ConnectingLine, Curve, LargeHandle, SmallHandle } from './HelperFunctions';

const InstanceHandler = ({ start, control, end, handleMouseDown, show, index }) => {

    const instructions = `
      M ${start.x},${start.y}
      Q ${control.x},${control.y}
      ${end.x},${end.y} `;

    const showLines = () => {
        if (show) {
            return (
                <g>
                    <ConnectingLine from={start} to={control} />
                    <ConnectingLine from={control} to={end} />
                    <SmallHandle
                        coordinates={control}
                        onMouseDown={() => handleMouseDown(`controlPoint ${index}`)}
                    />
                </g>
            );
        } return (<span />);
    };

    return (
        <g>
            {showLines()}
            <Curve instructions={instructions} />
            <LargeHandle
                coordinates={start}
                onMouseDown={() => handleMouseDown(`startPoint ${index}`)}
            />

            <LargeHandle
                coordinates={end}
                onMouseDown={() => handleMouseDown(`endPoint ${index}`)}
            />
        </g>
    );
};

InstanceHandler.propTypes = {
    start: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    control: PropTypes.object.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
};

export default InstanceHandler;
