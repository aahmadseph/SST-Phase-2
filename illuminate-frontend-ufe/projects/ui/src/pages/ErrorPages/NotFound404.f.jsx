import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import ErrorPage404 from 'components/ErrorPages/Error404';

const NotFound404 = () => {
    return <ErrorPage404 />;
};

export default wrapFunctionalComponent(NotFound404, 'NotFound404');
