/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Box, Text, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

class BIPointsDisclaimer extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/PointsNSpendBank/locales', 'BIPointsDisclaimer')
        );

        return (
            <Box
                color='gray'
                fontSize='sm'
                lineHeight='tight'
                marginTop={4}
            >
                <Text
                    is='p'
                    marginBottom='.75em'
                >
                    {getText('firstDisclaimer')}
                </Text>
                <Text
                    is='p'
                    marginBottom='.75em'
                >
                    {getText(
                        'secondDisclaimer',
                        false,
                        <Link
                            color='blue'
                            underline={true}
                            href='/profile/Lists'
                        >
                            {getText('listsText')}
                        </Link>
                    )}
                </Text>
                <Text is='p'>{getText('thirdDisclaimer')}</Text>
            </Box>
        );
    }
}

export default wrapComponent(BIPointsDisclaimer, 'BIPointsDisclaimer');
