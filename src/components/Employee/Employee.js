import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Dimmer, Loader } from 'semantic-ui-react';
import { fetchData } from '../../utils/utils';
import { NodeObject } from '../../utils/types';
import './Employee.css';
import TreeService from '../../utils/tree';

const Employee = (props) => {
    const { node, onSelectNode, selectedNode, onSubordinatesRender } = props;
    const [active, setActive] = useState(false);
    const [isLeaf, setLeaf] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [newNode, updateNode] = useState(node);
    const fetchChildren = async (id) => {
        if (!isLeaf && !newNode.children.length) {
            setProcessing(true);
            const subordinates = await fetchData(
                `https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?manager=${id}`,
            );
            if (subordinates.length > 0) {
                updateNode({ ...newNode, children: TreeService.createChildNodes(newNode, subordinates) });
            } else {
                setLeaf(true);
            }
            setProcessing(false);
        }
    };
    const { data } = newNode;
    const title = `${data.id} - ${data.first} ${data.last}`;
    const metadata = `Office: ${data.office || '-'} Department: ${data.department || '-'}`;
    const handleClick = () => {
        onSelectNode(data.id);
        fetchChildren(data.id);
        setActive(!active);
    };
    return (
        <Dimmer.Dimmable dimmed={isProcessing && selectedNode === data.id}>
            <Accordion styled>
                <Accordion.Title
                    active={active}
                    onClick={handleClick}
                >
                    <Icon name="dropdown" />
                    {`${title}: ${metadata}`}
                </Accordion.Title>
                <Accordion.Content active={active}>
                    {newNode.children.length > 0
                        ? onSubordinatesRender(newNode.children)
                        : <p>No subordinates</p>}
                </Accordion.Content>
            </Accordion>
            <Dimmer inverted active={isProcessing && selectedNode === data.id}>
                <Loader>Loading</Loader>
            </Dimmer>
        </Dimmer.Dimmable>
    );
};

Employee.propTypes = {
    selectedNode: PropTypes.number,
    node: PropTypes.shape(NodeObject).isRequired,
    onSubordinatesRender: PropTypes.func.isRequired,
    onSelectNode: PropTypes.func.isRequired,
};

export default Employee;
