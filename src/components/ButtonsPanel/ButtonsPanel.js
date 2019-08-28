import React from 'react';
import PropTypes from 'prop-types';
import Octicon, { Dash, Plus } from '@primer/octicons-react';
import './ButtonsPanel.css';

const ButtonsPanel = (props) => (
    <div className="ButtonsPanel">
        <button title="Zoom in" type="button" className="btn btn-link" onClick={props.onZoomIn}>
            <Octicon icon={Plus} ariaLabel="Zoom in" size="large" />
        </button>
        <button title="Zoom out" type="button" className="btn btn-link" onClick={props.onZoomOut}>
            <Octicon icon={Dash} ariaLabel="Zoom out" size="large" />
        </button>
    </div>
);

ButtonsPanel.propTypes = {
    onZoomIn: PropTypes.func.isRequired,
    onZoomOut: PropTypes.func.isRequired,
};

export default ButtonsPanel;
