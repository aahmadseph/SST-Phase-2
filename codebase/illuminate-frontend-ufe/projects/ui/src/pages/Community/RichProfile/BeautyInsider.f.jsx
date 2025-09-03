import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import BeautyInsiderComp from 'components/RichProfile/BeautyInsider/BeautyInsider';

const BeautyInsider = props => {
    return (
        <div>
            <BeautyInsiderComp regions={props.regions} />
        </div>
    );
};

export default wrapFunctionalComponent(BeautyInsider, 'BeautyInsider');
