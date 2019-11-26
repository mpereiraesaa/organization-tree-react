import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { areNodesSame, areLinksSame, calculateNewValue } from '../../utils/svg';
import Node from '../Node/Node';
import NodeLink from '../NodeLink/NodeLink';
import './Organization.css';

const Organization = (props) => {
    const { onSelectNode, getChildren, margins, height } = props;
    const prevPropsRef = useRef();
    const animationRef = useRef();
    const steps = 20;
    const duration = 500;
    const initialX = props.nodes[0].x;
    const initialY = props.nodes[0].y;
    const [treeMap, setTreeMap] = useState({
        nodes: props.nodes.map((n) => ({ ...n, x: initialX, y: initialY })),
        links: props.links.map((l) => ({
            source: { ...l.source, x: initialX, y: initialY },
            target: { ...l.target, x: initialX, y: initialY },
        })),
    });


    useEffect(() => {
        const getClosestAncestor = (node, stateWithNode, stateWithoutNode) => {
            let oldParent = node;
            const isEqual = (n) => areNodesSame(oldParent, n);
            const childNodeIsSame = (n) => (getChildren(n) || []).some(isEqual);
            while (oldParent) {
                const newParent = stateWithoutNode.nodes.find(isEqual);
                if (newParent) {
                    return newParent;
                }
                oldParent = stateWithNode.nodes.find(childNodeIsSame);
            }
            return stateWithoutNode.nodes[0];
        };
        const getAnimationContext = () => {
            // Nodes/links that are in both states need to be moved from the old position to the new one
            // Nodes/links only in the initial state are being removed, and should be moved to the position
            // of the closest ancestor that still exists, or the new root
            // Nodes/links only in the new state are being added, and should be moved from the position of
            // the closest ancestor that previously existed, or the old root
            // The base determines which node/link the data (like classes and labels) comes from for rendering
            // We only run this once at the start of the animation, so optimization is less important
            const addedNodes = props.nodes
                .filter((n1) => treeMap.nodes.every((n2) => !areNodesSame(n1, n2)))
                .map((n1) => ({ base: n1, old: getClosestAncestor(n1, props, treeMap), new: n1 }));
            const changedNodes = props.nodes
                .filter((n1) => treeMap.nodes.some((n2) => areNodesSame(n1, n2)))
                .map((n1) => ({ base: n1, old: treeMap.nodes.find((n2) => areNodesSame(n1, n2)), new: n1 }));
            const removedNodes = treeMap.nodes
                .filter((n1) => props.nodes.every((n2) => !areNodesSame(n1, n2)))
                .map((n1) => ({ base: n1, old: n1, new: getClosestAncestor(n1, treeMap, props) }));
            const addedLinks = props.links
                .filter((l1) => treeMap.links.every((l2) => !areLinksSame(l1, l2)))
                .map((l1) => ({ base: l1, old: getClosestAncestor(l1.target, props, treeMap), new: l1 }));
            const changedLinks = props.links
                .filter((l1) => treeMap.links.some((l2) => areLinksSame(l1, l2)))
                .map((l1) => ({ base: l1, old: treeMap.links.find((l2) => areLinksSame(l1, l2)), new: l1 }));
            const removedLinks = treeMap.links
                .filter((l1) => props.links.every((l2) => !areLinksSame(l1, l2)))
                .map((l1) => ({ base: l1, old: l1, new: getClosestAncestor(l1.target, treeMap, props) }));

            return {
                nodes: changedNodes.concat(addedNodes).concat(removedNodes),
                links: changedLinks.concat(addedLinks).concat(removedLinks),
            };
        };
        const loadAnimations = () => {
            const animationContext = getAnimationContext();
            let counter = 0;
            clearInterval(animationRef.current);

            animationRef.current = setInterval(() => {
                counter += 1;
                if (counter === steps) {
                    clearInterval(animationRef.current);
                    animationRef.current = null;
                    setTreeMap({ nodes: props.nodes, links: props.links });
                    return;
                }
                const calculateNodePosition = (node, start, end, interval) => ({
                    ...node,
                    x: calculateNewValue(start.x, end.x, interval),
                    y: calculateNewValue(start.y, end.y, interval),
                });
                const calculateLinkPosition = (link, start, end, interval) => ({
                    source: {
                        ...link.source,
                        x: calculateNewValue(start.source ? start.source.x : start.x, end.source ? end.source.x : end.x, interval),
                        y: calculateNewValue(start.source ? start.source.y : start.y, end.source ? end.source.y : end.y, interval),
                    },
                    target: {
                        ...link.target,
                        x: calculateNewValue(start.target ? start.target.x : start.x, end.target ? end.target.x : end.x, interval),
                        y: calculateNewValue(start.target ? start.target.y : start.y, end.target ? end.target.y : end.y, interval),
                    },
                });
                setTreeMap({
                    nodes: animationContext.nodes.map((n) => calculateNodePosition(n.base, n.old, n.new, counter / steps)),
                    links: animationContext.links.map((l) => calculateLinkPosition(l.base, l.old, l.new, counter / steps)),
                });
            }, duration / steps);
        };
        if (prevPropsRef.current) {
            if (props.nodes !== prevPropsRef.current.nodes || props.links !== prevPropsRef.current.links) {
                loadAnimations();
            }
        }
    }, [props.nodes, props.links]);

    useEffect(() => {
        prevPropsRef.current = { nodes: props.nodes, links: props.links };
    }, [props.nodes, props.links]);

    return (
        <svg className="svg-container" height={height} width="100%">
            <g transform={`translate(${margins.left + margins.right},${margins.top})`}>
                {treeMap.links.map((link) => (
                    <NodeLink
                        key={link.target.data.id}
                        source={link.source}
                        target={link.target}
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}
                    />
                ))}
                {treeMap.nodes.map((node) => (
                    <Node
                        key={node.data.id}
                        keyProp={node.data.id}
                        labelProp={node.data.id}
                        data={node.data}
                        onNodeClick={onSelectNode}
                        offset={3.5}
                        radius={8}
                        x={node.x}
                        y={node.y}
                    />
                ))}
            </g>
        </svg>
    );
};

Organization.propTypes = {
    links: PropTypes.arrayOf(PropTypes.object).isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectNode: PropTypes.func.isRequired,
    selectedNode: PropTypes.number,
    isProcessing: PropTypes.bool,
    height: PropTypes.number,
    margins: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number,
    }),
    getChildren: PropTypes.func.isRequired,
};

export default Organization;
