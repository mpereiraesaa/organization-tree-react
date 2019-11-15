import React from 'react';
import PropTypes from 'prop-types';
import { NodeObject } from '../../utils/types';
import Employee from '../Employee/Employee';
import './Organization.css';

const Organization = (props) => {
    const { root, selectedNode, onSelectNode } = props;
    const renderSubordinates = (subordinates) => subordinates.map((subordinate) => (
        <Employee
            key={subordinate.data.id}
            onSubordinatesRender={renderSubordinates}
            selectedNode={selectedNode}
            node={subordinate}
            onSelectNode={onSelectNode}
        />
    ));
    return (
        <div className="tree-container">
            <Employee
                key={root.id}
                onSubordinatesRender={renderSubordinates}
                node={root}
                selectedNode={selectedNode}
                onSelectNode={onSelectNode}
            />
        </div>
    );
};

Organization.propTypes = {
    root: PropTypes.shape(NodeObject),
    onSelectNode: PropTypes.func.isRequired,
    selectedNode: PropTypes.number,
};

export default Organization;
