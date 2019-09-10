import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { NodeObject } from '../../utils/types';
import Employee from '../Employee/Employee';
import './Organization.css';

class Organization extends React.Component {
    onClick = (id) => {
        const { onNodeSelection } = this.props;
        onNodeSelection(id);
    };

    renderSubordinates = (subordinates) => subordinates.map((subordinate) => (
        <Employee
            key={subordinate.id}
            onSubordinatesRender={this.renderSubordinates}
            selectedNode={this.props.selectedNode}
            isProcessing={this.props.isProcessing}
            data={subordinate}
            onClick={this.onClick}
        />
    ));

    render() {
        const { nestedView, selectedNode, onBack } = this.props;
        return (
            <div className="tree-container">
                {nestedView.parent
                    && (
                        <Button onClick={onBack} icon labelPosition="left">
                            Back
                            <Icon name="left arrow" />
                        </Button>
                    )}
                <Employee
                    key={nestedView.id}
                    isTopLevel
                    onSubordinatesRender={this.renderSubordinates}
                    data={nestedView}
                    isProcessing={this.props.isProcessing}
                    selectedNode={selectedNode}
                    onClick={this.onClick}
                />
            </div>
        );
    }
}

Organization.propTypes = {
    nestedView: PropTypes.shape(NodeObject).isRequired,
    onBack: PropTypes.func.isRequired,
    onNodeSelection: PropTypes.func.isRequired,
    selectedNode: PropTypes.number,
    isProcessing: PropTypes.bool.isRequired,
};

export default Organization;
