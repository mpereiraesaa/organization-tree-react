import PropTypes from 'prop-types';
import React from 'react';
import './NodeLink.css';

const propTypes = {
    x1: PropTypes.number.isRequired,
    x2: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
    y2: PropTypes.number.isRequired,
};

function diagonal(x1, y1, x2, y2) {
    // return `M${y1},${x1}C${(y1 + y2) / 2},${x1} ${(y1 + y2) / 2},${x2} ${y2},${x2}`; -- Horizontal
    return `M${x1},${y1}C${x1},${(y1 + y2) / 2} ${x2}, ${(y1 + y2) / 2} ${x2}, ${y2}`;
}

const NodeLink = (props) => {
    const { x1, y1, x2, y2 } = props;
    const d = diagonal(
        x1,
        y1,
        x2,
        y2,
    );

    return <path className="link" d={d} />;
};

NodeLink.propTypes = propTypes;

export default NodeLink;
