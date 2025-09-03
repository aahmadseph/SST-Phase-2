import React from 'react';
import PropTypes from 'prop-types';

import { wrapComponent } from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

import BaseClass from 'components/BaseClass';
import { Box, Text } from 'components/ui';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GAdTag/locales', 'GAdTag');

class GAdTag extends BaseClass {
    static propTypes = {
        adId: PropTypes.string.isRequired,
        visible: PropTypes.bool
    };

    render() {
        const { adId, visible } = this.props;

        return (
            <Box
                margin={2}
                flexShrink={0}
                style={{ display: visible ? '' : 'none' }}
            >
                <Text
                    is='p'
                    fontSize='xs'
                    marginBottom={2}
                    children={getText('advertising')}
                />
                <div id={adId} />
            </Box>
        );
    }
}

export default wrapComponent(GAdTag, 'GAdTag');
