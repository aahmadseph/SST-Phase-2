import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import MyCustomList from 'components/RichProfile/MyLists/MyCustomList';

const CustomList = () => {
    return <MyCustomList />;
};

export default wrapFunctionalComponent(CustomList, 'CustomList');
