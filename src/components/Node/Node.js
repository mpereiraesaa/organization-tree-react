import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Dimmer, Loader } from 'semantic-ui-react';
import { NodeObject } from '../../utils/types';
import './Node.css';

const Node = (props) => {
    const { node, onSelectNode, selectedNode, onChildrenRender, isProcessing } = props;
    const title = `${node.id} - ${node.first} ${node.last}`;
    const metadata = `Office: ${node.office || '-'} Department: ${node.department || '-'}`;
    const handleClick = () => {
        onSelectNode(node.id);
    };
    return (
        <Dimmer.Dimmable dimmed={isProcessing && selectedNode === node.id}>
            <Accordion styled>
                <Accordion.Title
                    active={node.active}
                    onClick={handleClick}
                >
                    <Icon name="dropdown" />
                    {`${title}: ${metadata}`}
                </Accordion.Title>
                <Accordion.Content active={node.active}>
                    {node.children && node.children.length > 0
                        ? onChildrenRender(node.children)
                        : <p>No subordinates</p>}
                </Accordion.Content>
            </Accordion>
            <Dimmer inverted active={isProcessing && selectedNode === node.id}>
                <Loader />
            </Dimmer>
        </Dimmer.Dimmable>
    );
};

Node.propTypes = {
    selectedNode: PropTypes.number,
    node: PropTypes.shape(NodeObject).isRequired,
    onChildrenRender: PropTypes.func.isRequired,
    onSelectNode: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool,
};

export default Node;
