import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RecapItem from 'components/Content/Recap/RecapItem';
import RecapGrid from 'components/Content/Recap/RecapGrid/RecapGrid';

function RecapProductList(props) {
    const { skuList, shouldRender, ...rest } = props;

    if (!shouldRender) {
        return null;
    }

    return (
        <RecapItem {...rest}>
            <RecapGrid skuList={skuList} />
        </RecapItem>
    );
}

RecapProductList.propTypes = {
    shouldRender: PropTypes.bool
};

RecapProductList.defaultProps = {
    shouldRender: true
};

export default wrapFunctionalComponent(RecapProductList, 'RecapProductList');
