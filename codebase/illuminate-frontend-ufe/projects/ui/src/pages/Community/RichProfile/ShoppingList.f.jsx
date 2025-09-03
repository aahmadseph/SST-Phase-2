import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import Loves from 'components/Loves';

const ShoppingList = () => {
    return (
        <div>
            <Loves compType={'LovedProducts'} />
        </div>
    );
};

export default wrapFunctionalComponent(ShoppingList, 'ShoppingList');
