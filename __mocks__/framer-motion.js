const React = require('react');

module.exports = {
    motion: {
        div: ({ children, ...props }) => React.createElement('div', props, children),
        section: ({ children, ...props }) => React.createElement('section', props, children),
        h1: ({ children, ...props }) => React.createElement('h1', props, children),
        p: ({ children, ...props }) => React.createElement('p', props, children),
        button: ({ children, ...props }) => React.createElement('button', props, children),
        // Add more as needed
    },
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, {}, children),
};
