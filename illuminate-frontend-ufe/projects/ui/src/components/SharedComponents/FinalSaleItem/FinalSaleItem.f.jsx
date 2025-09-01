import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function FinalSaleItem({ isReturnable, finalSaleItemText }) {
    return isReturnable === false ? (
        <Text
            is='p'
            marginTop={2}
            color='red'
            fontSize='xs'
            lineHeight='tight'
        >
            {finalSaleItemText}
        </Text>
    ) : null;
}

FinalSaleItem.propTypes = {
    isReturnable: PropTypes.bool,
    finalSaleItemText: PropTypes.string.isRequired
};

FinalSaleItem.defaultProps = {
    isReturnable: true
};

export default wrapFunctionalComponent(FinalSaleItem, 'FinalSaleItem');
