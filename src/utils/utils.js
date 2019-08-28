import { hierarchy } from 'd3';

export const margins = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
};

export const getTemplate = (data) => {
    return `<div>
    <div style="margin-left:70px;margin-top:10px;font-size:26px;font-weight:bold;">${data.first} ${data.last}</div>
    <div style="margin-left:70px;margin-top:3px;font-size:18px;">office: ${data.office ? data.office : ''}</div>
    <div style="margin-left:70px;margin-top:3px;font-size:18px;">department: ${data.department ? data.department: ''}</div>
    </div>`;
};

export const fetchData = async url => {
    const response = await window.fetch(url);
    return response.json();
};

export const d3Utils = {
    toggleCollapse: (parent) => {
        if (parent.children) {
            parent._children = parent.children;
            parent.children = null;
        } else {
            parent.children = parent._children;
            parent._children = null;
        }
    },
    addChildrensNode: (parent, childrens) => {
        parent.height = parent.height + 1;
        parent.children = [];
        childrens.forEach(node => {
            const obj = hierarchy(node);
            obj.backgroundColor = "rgba(51, 182, 208, 1)";
            obj.borderColor = "#ccc";
            obj.parent = parent;
            obj.depth = parent.depth + 1;
            obj.id = `${node.id}`;
            parent.children.push(obj);
        });
    },
    getDiagonalPath: (s, t) => {
        const x = s.x;
        const y = s.y;
        const ex = t.x;
        const ey = t.y;

        let xrvs = ex - x < 0 ? -1 : 1;
        let yrvs = ey - y < 0 ? -1 : 1;

        let rdef = 35;
        let r = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;

        r = Math.abs(ey - y) / 2 < r ? Math.abs(ey - y) / 2 : r;

        let h = Math.abs(ey - y) / 2 - r;
        let w = Math.abs(ex - x) - r * 2;
        return (
            `M ${x} ${y}
            L ${x} ${y+h*yrvs}
            C  ${x} ${y+h*yrvs+r*yrvs} ${x} ${y+h*yrvs+r*yrvs} ${x+r*xrvs} ${y+h*yrvs+r*yrvs}
            L ${x+w*xrvs+r*xrvs} ${y+h*yrvs+r*yrvs}
            C ${ex}  ${y+h*yrvs+r*yrvs} ${ex}  ${y+h*yrvs+r*yrvs} ${ex} ${ey-h*yrvs}
            L ${ex} ${ey}`
        );
    },
    patternify: (rootSelector, params) => {
        var selector = params.selector;
        var elementTag = params.tag;
        var data = params.data || [selector];

        // Pattern in action
        var selection = rootSelector.selectAll('.' + selector).data(data, (d, i) => {
            if (typeof d === 'object') {
                if (d.id) {
                    return d.id;
                }
            }
            return i;
        });
        selection.exit().remove();
        selection = selection.enter().append(elementTag).merge(selection);
        selection.attr('class', selector);
        return selection;
    }
};
