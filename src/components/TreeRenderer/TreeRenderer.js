import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clone from 'clone';
import { hierarchy, tree } from 'd3-hierarchy';
import { Container, Grid, Loader, Header } from 'semantic-ui-react';
import Tree from '../../utils/tree';
import { fetchData } from '../../utils/utils';
import { NodeObject } from '../../utils/types';
import Organization from '../Organization/Organization';
import './TreeRenderer.css';

const getChildren = (d) => d.children;

const TreeMap = (props) => {
    const { root, selectedNode, onNodeClick, isProcessing, width, height, margins } = props;
    const [data, setData] = useState({ nodes: null, links: null });
    useEffect(() => {
        const treeData = hierarchy(clone(root), getChildren);
        const map = tree().size([height, width])(treeData);
        const nodes = map.descendants();
        const links = map.links();
        nodes.forEach((node) => {
            node.y = node.depth * 100;
        });
        setData({ nodes, links });
    }, [root, width, height]);

    if (!data.nodes && !data.links) {
        return null;
    }

    return (
        <Organization
            links={data.links}
            nodes={data.nodes}
            selectedNode={selectedNode}
            onSelectNode={onNodeClick}
            isProcessing={isProcessing}
            getChildren={getChildren}
            margins={margins}
            height={height + margins.top + margins.bottom}
        />
    );
};

TreeMap.propTypes = {
    root: PropTypes.shape(NodeObject),
    selectedNode: PropTypes.number,
    onNodeClick: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    margins: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number,
    }),
};

const TreeRenderer = () => {
    const [isLoading, setLoading] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [isProcessing, setProcessing] = useState(false);
    const [root, setRoot] = useState({});
    const margins = { top: 40, right: 120, bottom: 20, left: 150 };
    const width = 960 - margins.left - margins.right;
    const height = 500 - margins.top - margins.bottom;
    const onNodeClick = async (id) => {
        const node = Tree.findNode(root, id);
        let newTree = Tree.createNewTreeWithNodeActive(root, id);
        setSelectedNodeId(id);
        if (!node.leaf && node.children.length === 0) {
            setProcessing(true);
            const children = await fetchData(
                `https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?manager=${id}`,
            );
            if (children.length > 0) {
                newTree = Tree.createNewTreeWithChildren(newTree, id, children);
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
                          React organization graph chart
                            <Header.Subheader>
                                <p>Visualize the organization hierarchy using a graph drawn with SVG and allows adding of nodes by calling an API after clicking in a node.</p>
                            </Header.Subheader>
                        </Header>
                        {!isLoading && (
                            <TreeMap
                                root={root}
                                selectedNode={selectedNodeId}
                                onNodeClick={onNodeClick}
                                isProcessing={isProcessing}
                                width={width}
                                height={height}
                                margins={margins}
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
