const Tree = {
    createNewTree(node) {
        return {
            ...node,
            children: [],
            depth: 0,
            height: 0,
        };
    },
    createNewTreeWithNodeAsLeaf(tree, nodeId) {
        return this.createNewTreeWithUpdate(tree, nodeId, (nodeFound) => { nodeFound.leaf = true; });
    },
    createNewTreeWithNodeActive(tree, nodeId) {
        return this.createNewTreeWithUpdate(tree, nodeId, (nodeFound) => { nodeFound.active = !nodeFound.active; });
    },
    createNewTreeWithChildren(tree, parentId, children) {
        return this.createNewTreeWithUpdate(tree, parentId, (nodeFound) => {
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
    createNewTreeWithUpdate(node, id, callback) {
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
};

export default Tree;
