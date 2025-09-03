import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function BopisKohlsItem({
    isKohlsStore, bopisKohlsItemText, is, marginTop, marginBottom
}) {
    return isKohlsStore ? (
        <Text
            is={is}
            marginTop={marginTop}
            marginBottom={marginBottom}
            color='gray'
            fontSize={['xs', 'sm']}
            lineHeight='tight'
        >
            {bopisKohlsItemText}
        </Text>
    ) : null;
}

BopisKohlsItem.defaultProps = {
    is: 'p',
    marginTop: 1,
    marginBottom: null
};

BopisKohlsItem.propTypes = {
    isKohlsStore: PropTypes.bool.isRequired,
    bopisKohlsItemText: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(BopisKohlsItem, 'BopisKohlsItem');
