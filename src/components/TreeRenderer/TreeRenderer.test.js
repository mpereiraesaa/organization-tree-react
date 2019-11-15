import React from 'react';
import ReactDOM from 'react-dom';
import TreeRenderer from './TreeRenderer';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TreeRenderer />, div);
    ReactDOM.unmountComponentAtNode(div);
});
