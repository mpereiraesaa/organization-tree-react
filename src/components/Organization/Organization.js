import React from 'react';
import PropTypes from 'prop-types';
import { NodeObject } from '../../utils/types';
import Employee from '../Employee/Employee';
import './Organization.css';

const Organization = (props) => {
    const { tree, selectedNode, onNodeSelection, isProcessing } = props;
    const onClick = (id) => {
        onNodeSelection(id);
    };
    const renderSubordinates = (subordinates) => subordinates.map((subordinate) => (
        <Employee
            key={subordinate.id}
            onSubordinatesRender={renderSubordinates}
            isTopLevel={false}
            selectedNode={selectedNode}
            isProcessing={isProcessing}
            data={subordinate}
            onClick={onClick}
        />
    ));
    return (
        <div className="tree-container">
            <Employee
                key={tree.id}
                isTopLevel
                onSubordinatesRender={renderSubordinates}
                data={tree}
                isProcessing={isProcessing}
                selectedNode={selectedNode}
                onClick={onClick}
            />
        </div>
    );
};

Organization.propTypes = {
    tree: PropTypes.shape(NodeObject),
    onNodeSelection: PropTypes.func.isRequired,
    selectedNode: PropTypes.number,
    isProcessing: PropTypes.bool.isRequired,
};

export default Organization;
