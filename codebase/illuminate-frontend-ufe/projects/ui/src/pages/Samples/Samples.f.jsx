import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import SamplesPage from 'components/SamplesPage/SamplesPage';

const Samples = props => {
    return (
        <div>
            <SamplesPage data={props} />
        </div>
    );
};

export default wrapFunctionalComponent(Samples, 'Samples');
