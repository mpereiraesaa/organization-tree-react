import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Dimmer, Loader } from 'semantic-ui-react';
import { NodeObject } from '../../utils/types';
import './Employee.css';

const Employee = (props) => {
    const { data, onClick, isProcessing, selectedNode, onSubordinatesRender, isTopLevel } = props;
    const title = `${data.id} - ${data.first} ${data.last}`;
    const metadata = `Office: ${data.office || '-'} Department: ${data.department || '-'}`;
    const active = !isTopLevel ? (!data.stop && data.active) : data.active;
    const handleClick = () => {
        onClick(data.id);
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
                    {data.children
                        ? onSubordinatesRender(data.children)
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
    data: PropTypes.shape(NodeObject).isRequired,
    onSubordinatesRender: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    isTopLevel: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Employee;
