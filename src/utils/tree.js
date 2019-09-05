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
        const queue = [];
        const newTree = { ...root, depth: 1 };
        queue.push(newTree);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.depth === maxDepth) {
                if (current.children && current.children.length > 0) {
                    current.stop = true;
                }
                current.children = null;
            }
            if (current.children) {
                current.children = current.children.map((child) => ({ ...child, depth: current.depth + 1 }));
                queue.push(...current.children);
            }
        }
        return newTree;
    },
    createTreeFromNodeForView(root, maxDepth, activeNode) {
        const nodeInRoot = this.getNode(root, activeNode);
        const queue = [];
        const newTree = { ...nodeInRoot, depth: nodeInRoot.depth >= maxDepth ? 1 : nodeInRoot.depth };
        queue.push(newTree);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.depth === maxDepth) {
                if (current.children && current.children.length > 0) {
                    current.stop = true;
                }
                current.children = null;
            }
            if (current.children) {
                current.children = current.children.map((child) => ({ ...child, depth: current.depth + 1 }));
                queue.push(...current.children);
            }
        }
        return newTree;
    },
    toggleActiveNodeAtView(node, nodeId) {
        const queue = [];
        const newNode = { ...node };
        queue.push(newNode);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.id === nodeId) {
                current.active = !current.active;
                break;
            }
            if (current.children) {
                queue.push(...current.children);
            }
        }
        return newNode;
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
    getNode(root, nodeId) {
        const queue = [];
        let node = null;
        queue.push(root);
        if (nodeId === null || nodeId === undefined) {
            return node;
        }
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.id === nodeId) {
                node = current;
                break;
            }
            if (current.children) {
                queue.push(...current.children);
            }
        }
        return node;
    },
    addChildrenToNode(node, parentId, children) {
        const queue = [];
        const newNode = { ...node };
        queue.push(newNode);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.id === parentId) {
                if (!children || children.length === 0) {
                    current.leaf = true;
                } else {
                    const childs = children.map((child) => ({ ...child, parent: current, depth: current.depth + 1 }));
                    current.children = childs;
                }
                break;
            }
            if (current.children) {
                queue.push(...current.children);
            }
        }
        return newNode;
    },
};

export default treeService;
