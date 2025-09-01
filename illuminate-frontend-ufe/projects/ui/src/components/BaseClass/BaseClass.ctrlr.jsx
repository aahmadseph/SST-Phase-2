import React from 'react';
import wrapComponentRender from 'utils/framework/wrapComponentRender';

class BaseClass extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = wrapComponentRender().shouldComponentUpdate;
}

BaseClass.class = 'BaseClass';

export default BaseClass;
