/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import MyLists from 'components/RichProfile/MyLists';

const Lists = () => {
    return <MyLists />;
};

export default wrapFunctionalComponent(Lists, 'Lists');
