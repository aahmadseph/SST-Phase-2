/* eslint-disable no-shadow */
import React from 'react';
import Framework from 'utils/framework';

function getBaseComponent({ elementType, isBasicElement = true, useRef = false }) {
    let BaseComponent;

    if (isBasicElement) {
        return elementType;
    } else if (useRef) {
        BaseComponent = ({ is: Type = elementType, __ref, ...props }) => (
            <Type
                ref={__ref}
                {...props}
            />
        );
    } else {
        BaseComponent = ({ is: Type = elementType, ...props }) => <Type {...props} />;
    }

    BaseComponent = Framework.wrapFunctionalComponent(BaseComponent, 'BaseComponent');

    return BaseComponent;
}

export default getBaseComponent;
