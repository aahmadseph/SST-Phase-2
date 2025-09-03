import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import MyPointsComp from 'components/RichProfile/MyPoints/MyPoints';

const MyPoints = () => {
    return (
        <div>
            <MyPointsComp />
        </div>
    );
};

export default wrapFunctionalComponent(MyPoints, 'MyPoints');
