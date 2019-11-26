const Tree = {
    createNewTree(node) {
        return {
            ...node,
            children: [],
            depth: 0,
        };
    },
    createNewTreeWithNodeAsLeaf(tree, nodeId) {
        return this.createNewTreeWithUpdate(tree, nodeId, (nodeFound) => { nodeFound.leaf = true; });
    },
    createNewTreeWithNodeActive(tree, nodeId) {
        return this.createNewTreeWithUpdate(tree, nodeId, (nodeFound) => { nodeFound.active = !nodeFound.active; });
    },
    createNewTreeWithChildren(tree, parentId, children) {
        return this.createNewTreeWithUpdate(tree, parentId, (parent) => {
            const childs = children.map(
                (child) => ({ ...child, children: [], parent, depth: parent.depth + 1 }),
            );
            parent.children = childs;
        });
    },
    findNode(tree, id) {
        const queue = [];
        queue.push(tree);
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
    createNewTreeWithUpdate(tree, id, callback) {
        const queue = [];
        const newTree = { ...tree };
        queue.push(newTree);
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
        return newTree;
    },
};

export default Tree;
