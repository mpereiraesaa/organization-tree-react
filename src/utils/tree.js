const treeService = {
    getBasicTree(node) {
        return {
            ...node,
            children: [],
            depth: 1,
        };
    },
    createInitialTreeForView(node) {
        return {
            ...node,
            active: false,
        };
    },
    createTreeForView(root, maxDepth) {
        const newTree = { ...root, depth: 1 };
        return this.traverseEachByBFS(newTree, (node) => {
            if (node.depth === maxDepth) {
                if (node.children && node.children.length > 0) {
                    node.stop = true;
                }
                node.children = null;
            }
            if (node.children) {
                node.children = node.children.map((child) => ({ ...child, depth: node.depth + 1 }));
            }
        });
    },
    createTreeFromNodeForView(root, maxDepth, activeNode) {
        const nodeInRoot = this.findNodeByBFS(root, activeNode);
        const newTree = { ...nodeInRoot, depth: nodeInRoot.depth >= maxDepth ? 1 : nodeInRoot.depth };
        return this.traverseEachByBFS(newTree, (node) => {
            if (node.depth === maxDepth) {
                if (node.children && node.children.length > 0) {
                    node.stop = true;
                }
                node.children = null;
            }
            if (node.children) {
                node.children = node.children.map((child) => ({ ...child, depth: node.depth + 1 }));
            }
        });
    },
    toggleActiveNodeAtView(node, nodeId) {
        return this.updateNodeByBFS(node, nodeId, (nodeFound) => { nodeFound.active = !nodeFound.active; });
    },
    getAncestorSubTree(node, root, maxDepth) {
        const realDepth = node.parent.depth + 1;
        if (realDepth - maxDepth <= 1) {
            return this.createTreeForView(root, maxDepth, root.id);
        }
        let i = 0;
        let current = { ...node, active: true, depth: maxDepth, children: null, stop: true };
        while (i < maxDepth) {
            if (current.parent) {
                current.parent.active = true;
                current.parent.depth = current.depth - 1;
                current = current.parent;
            }
            i += 1;
        }
        return current;
    },
    addChildrenToNode(node, parentId, children) {
        return this.updateNodeByBFS(node, parentId, (nodeFound) => {
            if (!children || children.length === 0) {
                nodeFound.leaf = true;
            } else {
                const childs = children.map((child) => ({ ...child, parent: nodeFound, depth: nodeFound.depth + 1 }));
                nodeFound.children = childs;
            }
        });
    },
    findNodeByBFS(root, id) {
        const queue = [];
        queue.push(root);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.id === id) {
                return current;
            }
            if (current.children) {
                queue.push(...current.children);
            }
        }
        return null;
    },
    updateNodeByBFS(node, id, callback) {
        const queue = [];
        const newNode = { ...node };
        queue.push(newNode);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.id === id) {
                if (typeof callback === 'function') {
                    callback(current);
                }
                break;
            }
            if (current.children) {
                queue.push(...current.children);
            }
        }
        return newNode;
    },
    traverseEachByBFS(root, callback) {
        const queue = [];
        const newNode = { ...root };
        queue.push(newNode);
        while (queue.length > 0) {
            const current = queue.shift();
            if (typeof callback === 'function') {
                callback(current);
            }
            if (current.children) {
                queue.push(...current.children);
            }
        }
        return newNode;
    },
};

export default treeService;
