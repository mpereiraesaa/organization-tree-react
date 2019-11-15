import PropTypes from 'prop-types';

export const NodeObject = {
    id: PropTypes.number.isRequired,
    first: PropTypes.string.isRequired,
    last: PropTypes.string.isRequired,
    manager: PropTypes.number.isRequired,
    department: PropTypes.number,
    office: PropTypes.number,
    depth: PropTypes.number,
    active: PropTypes.bool,
    parent: PropTypes.shape(this),
    children: PropTypes.arrayOf(
        PropTypes.shape(this),
    ),
};
