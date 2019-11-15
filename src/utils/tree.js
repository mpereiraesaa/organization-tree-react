class Node {
    parent = null;
    children = [];
    depth = 0;
    height = 0;
    data = null;
    constructor(data) {
        this.data = data;
    }
    add(node) {
        this.children.push(node);
    }
    setParent(node) {
        this.parent = node;
    }
    setDepth(value) {
        this.depth = value;
    }
}

class TreeService {
    static create(data) {
        return new Node(data);
    }
    static createChildNodes(node, children) {
        return children.map((child) => {
            const newNode = new Node(child);
            newNode.setDepth(node.depth + 1);
            newNode.setParent(node);
            return newNode;
        });
    }
    static findNode(tree, id) {
        const queue = [];
        queue.push(tree);
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.data.id === id) {
                return current;
            }
            if (current.children) {
                queue.push(...current.children);
            }
        }
        return null;
    }
}

export default TreeService;
