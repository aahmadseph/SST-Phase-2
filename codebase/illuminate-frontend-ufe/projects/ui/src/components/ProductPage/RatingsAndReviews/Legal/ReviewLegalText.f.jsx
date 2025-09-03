import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Text } from 'components/ui';
import GuidelinesModalLink from 'components/ProductPage/RatingsAndReviews/GuidelinesModalLink';

import localeUtils from 'utils/LanguageLocale';

const ReviewLegalText = () => {
    const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/Legal/locales', 'ReviewLegalText');

    return (
        <Text
            is='p'
            marginTop={[4, 5]}
            lineHeight='tight'
            fontSize='sm'
            maxWidth={[null, '36em']}
        >
            {getText('legalMessage')} <GuidelinesModalLink />
        </Text>
    );
};

export default wrapFunctionalComponent(ReviewLegalText, 'ReviewLegalText');
