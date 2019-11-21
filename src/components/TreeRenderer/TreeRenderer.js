import React, { useState, useEffect } from 'react';
import { Container, Grid, Loader, Header } from 'semantic-ui-react';
import Tree from '../../utils/tree';
import { fetchData } from '../../utils/utils';
import Organization from '../Organization/Organization';
import './TreeRenderer.css';

const TreeRenderer = () => {
    const [isLoading, setLoading] = useState(true);
    const [isProcessing, setProcessing] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [root, setRoot] = useState({});
    const setNodeProcessing = (id) => {
        setProcessing(true);
        setSelectedNodeId(id);
    };
    const onNodeSelection = async (id) => {
        const node = Tree.findNodeAtTree(root, id);
        const subordinatesAlreadyAdded = node.children && node.children.length > 0;
        let subordinates = subordinatesAlreadyAdded ? [...node.children] : [];
        let newTree = Tree.createNewTreeWithNodeActive(root, id);
        if (!node.leaf && !subordinatesAlreadyAdded) {
            setNodeProcessing(id);
            subordinates = await fetchData(
                `https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?manager=${id}`,
            );
            if (subordinates.length > 0) {
                newTree = Tree.createNewTreeWithChildren(newTree, id, subordinates);
            } else {
                newTree = Tree.createNewTreeWithNodeAsLeaf(newTree, id);
            }
        }
        setRoot(newTree);
        setProcessing(false);
    };
    const fetchRoot = async () => {
        const data = await fetchData(
            'https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?manager=0',
        );
        if (data[0]) {
            setRoot(Tree.createNewTree(data[0]));
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRoot();
    }, []);
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
                                tree={root}
                                selectedNode={selectedNodeId}
                                onNodeSelection={onNodeSelection}
                                isProcessing={isProcessing}
                            />
                        )}
                        <Loader active={isLoading} inline="centered" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default TreeRenderer;
