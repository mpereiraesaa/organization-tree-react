import React from 'react';
import { Container, Grid, Loader, Header } from 'semantic-ui-react';
import treeService from '../../utils/tree';
import { fetchData } from '../../utils/utils';
import Organization from '../Organization/Organization';
import './App.css';

const maxNodesView = 3;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            root: {},
            nestedView: {},
            selectedNode: null,
            isLoading: true,
            isProcessing: false,
        };
    }

    componentDidMount() {
        this.loadRootNode();
    }

    setNodeProcessingFlag = (id) => {
        this.setState({
            isProcessing: true,
            selectedNode: id,
        });
    };

    loadRootNode = async () => {
        const root = await fetchData('https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?'
        + 'manager=0');
        if (root[0]) {
            const initialTree = treeService.getBasicTree(root[0]);
            const nestedView = treeService.createInitialTreeForView(initialTree);
            this.setState({
                nestedView,
                isLoading: false,
                root: initialTree,
            });
        }
    }

    onBackToPreviousSubTree = () => {
        const { nestedView, root } = this.state;
        this.setState({
            nestedView: treeService.getAncestorSubTree(nestedView, root, maxNodesView),
        });
    };

    onNodeSelection = async (id) => {
        const { root, nestedView } = this.state;
        const node = treeService.getNode(root, id);
        const subordinatesAlreadyAdded = node.children && node.children.length > 0;
        let subordinates = subordinatesAlreadyAdded ? [...node.children] : [];
        let newRootNode = { ...root };
        let newNestedView = null;
        if (!node.leaf && !subordinatesAlreadyAdded) {
            this.setNodeProcessingFlag(id);
            subordinates = await fetchData(
                `https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?manager=${id}`,
            );
            newRootNode = treeService.addChildrenToNode(newRootNode, id, subordinates);
        }
        newRootNode = treeService.toggleActiveNodeAtView(newRootNode, id);
        if (node.depth + 1 > maxNodesView && subordinates.length > 0) {
            newNestedView = treeService.createTreeFromNodeForView(newRootNode, maxNodesView, id);
        } else if (nestedView.parent) {
            newNestedView = treeService.createTreeFromNodeForView(newRootNode, maxNodesView, nestedView.id);
        } else {
            newNestedView = treeService.createTreeForView(newRootNode, maxNodesView);
        }
        this.setState({
            nestedView: newNestedView,
            root: newRootNode,
            isProcessing: false,
        });
    };

    render() {
        const { isLoading, isProcessing, nestedView, selectedNode } = this.state;
        return (
            <Container className="container">
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h2">
                              Big corp chart
                                <Header.Subheader>
                                Visualize the hierarchy inside this big corp by clicking members of this organization.
                                </Header.Subheader>
                            </Header>
                            {!isLoading && (
                                <Organization
                                    nestedView={nestedView}
                                    selectedNode={selectedNode}
                                    onBack={this.onBackToPreviousSubTree}
                                    onNodeSelection={this.onNodeSelection}
                                    isProcessing={isProcessing}
                                />
                            )}
                            <Loader active={isLoading} inline="centered" />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default App;
