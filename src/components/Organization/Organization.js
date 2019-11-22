import React from 'react';
import PropTypes from 'prop-types';
import { NodeObject } from '../../utils/types';
import Node from '../Node/Node';
import './Organization.css';

const Organization = (props) => {
    const { root, selectedNode, onSelectNode, isProcessing } = props;
    const renderChildren = (children) => children.map((child) => (
        <Node
            key={child.id}
            onChildrenRender={renderChildren}
            selectedNode={selectedNode}
            isProcessing={isProcessing}
            node={child}
            onSelectNode={onSelectNode}
        />
    ));
    return (
        <div className="tree-container">
            <Node
                key={root.id}
                onChildrenRender={renderChildren}
                node={root}
                isProcessing={isProcessing}
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
    isProcessing: PropTypes.bool,
};

export default Organization;
