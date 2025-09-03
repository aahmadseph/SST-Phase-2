import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RecapItem from 'components/Content/Recap/RecapItem';
import RecapGrid from 'components/Content/Recap/RecapGrid/RecapGrid';

function RecapLoves({ currentLoves, ...props }) {
    return (
        <RecapItem {...props}>
            <RecapGrid skuList={(currentLoves || []).map(({ sku }) => sku)} />
        </RecapItem>
    );
}

RecapLoves.propTypes = {
    currentLoves: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default wrapFunctionalComponent(RecapLoves, 'RecapLoves');
