import React from 'react';
import ReactDOM from 'react-dom/server';

const renderRootComponent = reactElement => {
    const {
        props,
        type: { displayName: rootid }
    } = reactElement;

    if (reactElement.props.children) {
        // eslint-disable-next-line no-console
        console.error(
            reactElement +
                ': Component should not use transclusion. It is not possible to pass this.props.children between server and client.\n' +
                rootid +
                ' at data-sephid=' +
                rootid +
                ' will not render with its props client side.'
        );
        reactElement.props = null;
    }

    Sephora.linkSPA[rootid] = props;
    Sephora.checkForRoot = reactElement;
    const componentHTML = ReactDOM.renderToString(reactElement);
    const compiledComponent = React.createElement('div', {
        rootid,
        style: { display: 'contents' },
        dangerouslySetInnerHTML: { __html: componentHTML }
    });
    Sephora.checkForRoot = null;

    return compiledComponent;
};

export default renderRootComponent;
