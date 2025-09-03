import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';

function PreferredStoreAndZipCode(props) {
    const { storeNameAndZipCode, ...restProps } = props;

    return (
        <Text
            fontSize='sm'
            display='block'
            paddingBottom={1}
            marginBottom={-1}
            {...restProps}
        >
            {storeNameAndZipCode}
        </Text>
    );
}

PreferredStoreAndZipCode.propTypes = {
    storeNameAndZipCode: PropTypes.string
};

PreferredStoreAndZipCode.defaultProps = {
    storeNameAndZipCode: ''
};

export default wrapFunctionalComponent(PreferredStoreAndZipCode, 'PreferredStoreAndZipCode');
