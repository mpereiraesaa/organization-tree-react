import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { d3Utils, getTemplate, margins } from '../../utils/utils';

const nodeWidth = 323;
const nodeHeight = 145;
const backgroundColor = '#fafafa';
const duration = 600;

class Svg extends React.Component {
    svgD3Instance = null;
    chartD3Instance = null;
    centerGroupD3Instance = null;
    lastTransform = null;
    treeData = null;
    depth = nodeHeight + 100;
    layouts = { treemap: null };

    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.chartRef = React.createRef();
        this.centerGRef = React.createRef();
    }
    componentDidMount() {
        this.bindRefsToD3();
        this.setBackground();
        this.d3Draw();
    }
    bindRefsToD3 = () => {
        this.svgD3Instance = d3.select(this.svgRef.current);
        this.chartD3Instance = d3.select(this.chartRef.current);
        this.centerGroupD3Instance = d3.select(this.centerGRef.current);
    };
    setBackground = () => {
        const zoom = d3.zoom().on("zoom", this.onZoom);
        const behaviors = { zoom };
        this.svgD3Instance.call(behaviors.zoom)
            .attr('cursor', 'move')
            .style('background-color', backgroundColor);

        if (this.lastTransform) {
            behaviors.zoom.scaleBy(this.chartD3Instance, this.lastTransform.k)
                .translateTo(this.chartD3Instance, this.lastTransform.x, this.lastTransform.y);
        }
    };
    d3Draw() {
        this.layouts.treemap = d3.tree()
            .size([this.props.width, this.props.height])
            .nodeSize([nodeWidth + 100, nodeHeight + this.depth]);

        const stratify = d3.stratify().id(d => d.id).parentId(d => d.manager === 0 ? undefined : d.manager);
        this.rootNode = stratify(this.props.data);

        this.rootNode.x0 = 0;
        this.rootNode.y0 = 0;

        const allNodes = this.layouts.treemap(this.rootNode).descendants();
        allNodes.forEach(d => {
            const orgRelation = {
                directSubordinates: d.children ? d.children.length : 0,
                totalSubordinates: d.descendants().length - 1
            };
            return { ...d.data, ...orgRelation };
        });

        this.d3Update(this.rootNode);
    };
    d3Update = (source) => {
        this.treeData = this.layouts.treemap(this.rootNode);
        this.renderAndUpdateNodes(source);
        this.renderAndUpdateLinksBetweenNodes(source);
    };
    renderAndUpdateNodes = (source) => {
        const nodes = this.treeData.descendants().map(d => {
            const borderColor = '#ccc';
            const backgroundColor = 'rgba(51, 182, 208, 1)';
            return Object.assign(d, {
                borderColor,
                backgroundColor,
            });
        });
        nodes.forEach(d => d.y = d.depth * this.depth);

        const nodesSelection = this.centerGroupD3Instance
            .selectAll('g.node')
            .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = nodesSelection
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr("transform", d => "translate(" + source.x0 + "," + source.y0 + ")")
            .attr('cursor', 'pointer');

        // Add rectangle for the nodes
        d3Utils.patternify(nodeEnter, { tag: 'rect', selector: 'node-rect', data: d => [d] })
            .attr('width', nodeWidth)
            .attr('height', nodeHeight)
            .style("fill", d => d._children ? "lightsteelblue" : "#fff");

        const foreignObject = d3Utils.patternify(
            nodeEnter, { tag: 'foreignObject', selector: 'node-foreign-object', data: d => [d] })
            .attr('width', nodeWidth)
            .attr('height', nodeHeight)
            .attr('x', -nodeWidth / 2)
            .attr('y', -nodeHeight / 2);

        d3Utils.patternify(foreignObject, { tag: 'xhtml:div', selector: 'node-foreign-object-div', data: d => [d] })
            .style('width', nodeWidth + 'px')
            .style('height', nodeHeight + 'px')
            .style('color', 'white')
            .html(d => getTemplate(d.data));

        // Node button circle group
        const nodeButtonGroups = d3Utils.patternify(nodeEnter, { tag: 'g', selector: 'node-button-g', data: d => [d] })
            .on('click', this.onClick);

        // Add button circle
        d3Utils.patternify(nodeButtonGroups, { tag: 'circle', selector: 'node-button-circle', data: d => [d] });
        d3Utils.patternify(nodeButtonGroups, { tag: 'text', selector: 'node-button-text', data: d => [d] })
            .attr('pointer-events', 'none');

        const nodeUpdate = nodeEnter
            .merge(nodesSelection)
            .style('font', '12px sans-serif');

        nodeUpdate
            .transition()
            .attr('opacity', 0)
            .duration(duration)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .attr('opacity', 1);

        nodeUpdate
            .select('.node-rect')
            .attr('x', -nodeWidth / 2)
            .attr('y', -nodeHeight / 2)
            .attr('rx', d => d.data.borderRadius || 0)
            .attr('stroke-width', 3)
            .attr('cursor', 'pointer')
            .attr('stroke', d => d.borderColor)
            .style("fill", d => d.backgroundColor);

        nodeUpdate
            .select('.node-button-g')
            .attr('transform', d => `translate(0,${nodeHeight/2})`)

        nodeUpdate
            .select('.node-button-circle')
            .attr('r', 16)
            .attr('stroke-width', 3)
            .attr('fill', backgroundColor)
            .attr('stroke', d => d.borderColor);

        // Restyle texts
        nodeUpdate
            .select('.node-button-text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', '#2C3E50')
            .attr('font-size', d => (d.children) ? 40 : 26)
            .text(d => (d.children) ? '-' : '+');

        // Remove any exiting nodes
        const nodeExitTransition = nodesSelection
            .exit()
            .attr('opacity', 1)
            .transition()
            .duration(duration)
            .attr("transform", d => "translate(" + source.x + "," + source.y + ")")
            .on('end', function () { d3.select(this).remove() })
            .attr('opacity', 0);

        // On exit reduce the node rects size to 0
        nodeExitTransition
            .selectAll('.node-rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('x', 0)
            .attr('y', 0);

        // Store the old positions for transition.
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    };
    renderAndUpdateLinksBetweenNodes = (source) => {
        const links = this.treeData.descendants().slice(1);

        const linkSelection = this.centerGroupD3Instance
            .selectAll('path.link')
            .data(links, d => d.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = linkSelection
            .enter()
            .insert('path', "g")
            .attr("class", "link")
            .attr('d', () => {
                const o = { x: source.x0, y: source.y0 }
                return d3Utils.getDiagonalPath(o, o);
            });

        const linkUpdate = linkEnter.merge(linkSelection);

        // Styling links
        linkUpdate
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr('stroke', '#ccc')
            .attr('stroke-dasharray', '');

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d) {
                return d3Utils.getDiagonalPath(d, d.parent);
            });

        // Remove any exiting links
        linkSelection
            .exit()
            .transition()
            .duration(duration)
            .attr('d', () => {
                const o = {x: source.x, y: source.y };
                return d3Utils.getDiagonalPath(o, o);
            })
            .remove();
    };
    onClick = async (d) => {
        if (!d.isLeaf && d.children === undefined) {
            const childrens = await this.props.onGetChildrenNode(d);
            if (childrens && childrens.length > 0) {
                d3Utils.addChildrensNode(d, childrens);
            } else {
                d.isLeaf = true;
            }
        } else {
            d3Utils.toggleCollapse(d);
        }
        this.d3Update(d);
    };
    onZoom = () => {
        const transform = d3.event.transform;
        this.lastTransform = transform;
        this.chartD3Instance.attr('transform', transform);
    };
    render() {
        const chartTransform = `translate(${margins.left},${margins.top})`;
        const centerTransform = `translate(${this.props.centerX},${nodeHeight/2}) scale(${this.props.initialZoom})`;
        return (
            <svg ref={this.svgRef} width={this.props.width} height={this.props.height}>
                <g ref={this.chartRef} transform={chartTransform}>
                    <g ref={this.centerGRef} transform={centerTransform} />
                </g>
            </svg>
        );
    }
}

Svg.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    centerX: PropTypes.number,
    data: PropTypes.array,
    onGetChildrenNode: PropTypes.func,
    initialZoom: PropTypes.number,
}

export default Svg;
