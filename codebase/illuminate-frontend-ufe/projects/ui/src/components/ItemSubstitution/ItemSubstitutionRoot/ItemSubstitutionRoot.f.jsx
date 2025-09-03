import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ItemSubstitution from 'components/ItemSubstitution';

function ItemSubstitutionRoot(props) {
    const { shouldRenderItemSubstitution, ...restProps } = props;

    return shouldRenderItemSubstitution ? <ItemSubstitution {...restProps} /> : null;
}

export default wrapFunctionalComponent(ItemSubstitutionRoot, 'ItemSubstitutionRoot');
