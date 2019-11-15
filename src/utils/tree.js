const Tree = {
    getBasicTree(node) {
        return {
            ...node,
            children: [],
            depth: 0,
            height: 0,
        };
    },
    markNodeAsLeaf(tree, nodeId) {
        return this.updateTreeBFS(tree, nodeId, (nodeFound) => { nodeFound.leaf = true; });
    },
    toggleNodeActive(tree, nodeId) {
        return this.updateTreeBFS(tree, nodeId, (nodeFound) => { nodeFound.active = !nodeFound.active; });
    },
    appendChildren(tree, parentId, children) {
        return this.updateTreeBFS(tree, parentId, (nodeFound) => {
            const childs = children.map(
                (child) => ({ ...child, parent: nodeFound, depth: nodeFound.depth + 1 }),
            );
            nodeFound.children = childs;
        });
    },
    findNodeAtTree(root, id) {
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
    updateTreeBFS(node, id, callback) {
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

export default Tree;
