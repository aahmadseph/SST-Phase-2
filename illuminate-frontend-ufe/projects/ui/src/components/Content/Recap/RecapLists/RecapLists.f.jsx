import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RecapItem from 'components/Content/Recap/RecapItem';
import EmptyRecapItem from 'components/Content/Recap/EmptyRecapItem';
import RecapGrid from 'components/Content/Recap/RecapGrid/RecapGrid';

function RecapLists({ currentLoves, isCreateList, isLoveListsEmpty, ...props }) {
    return isCreateList || isLoveListsEmpty ? (
        <EmptyRecapItem
            isCreateList={!!isCreateList}
            {...props}
        >
            <RecapGrid skuList={(currentLoves || []).map(({ sku }) => sku)} />
        </EmptyRecapItem>
    ) : (
        <RecapItem {...props}>
            <RecapGrid skuList={(currentLoves || []).map(({ sku }) => sku)} />
        </RecapItem>
    );
}

RecapLists.propTypes = {
    currentLoves: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default wrapFunctionalComponent(RecapLists, 'RecapLists');
