import React, { useState, useEffect } from 'react';
import { Container, Grid, Loader, Header } from 'semantic-ui-react';
import TreeService from '../../utils/tree';
import { fetchData } from '../../utils/utils';
import Organization from '../Organization/Organization';
import './TreeRenderer.css';

const TreeRenderer = () => {
    const [isLoading, setLoading] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [root, setRoot] = useState({});
    const handleNodeSelect = (id) => {
        setSelectedNodeId(id);
    };
    const fetchRoot = async () => {
        const data = await fetchData(
            'https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?manager=0',
        );
        if (data[0]) {
            setRoot(TreeService.create(data[0]));
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
                        {!isLoading && root.data && (
                            <Organization
                                root={root}
                                selectedNode={selectedNodeId}
                                onSelectNode={handleNodeSelect}
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
