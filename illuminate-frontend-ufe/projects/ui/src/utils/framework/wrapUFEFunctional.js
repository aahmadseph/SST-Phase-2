/* eslint-disable no-param-reassign */
import wrapComponentRender from 'utils/framework/wrapComponentRender';
import React from 'react';

const wrapUFEFunctional = (comp, name = '') => {
    if (typeof name === 'string' && name.length && !comp.class) {
        comp.class = name;
    }

    comp.path = comp.componentName = comp.displayName = comp.class;
    comp.isFunctional = true;
    //copying backing up object props
    const objectProps = { ...comp };
    // wrapping up original functional component
    comp = wrapComponentRender().wrapComponentRender(comp);
    //it is important for testing proposes to keep here the display name, otherwise a lot of component would be
    // identified as renderWrapper
    comp.displayName = objectProps.displayName;
    // after wrap the component with React.memo it is important to copy the rest of the component properties
    // like defaultProps or components assigned to a comp prop like Dropdown.Menu
    comp = React.memo(comp, (prevProps, nextProps) => {
        return wrapComponentRender().shouldPreventRender(prevProps, nextProps, comp.shouldUpdatePropsOn);
    });
    Object.assign(comp, objectProps);
    comp.isComponent = true;

    return comp;
};

export default wrapUFEFunctional;
