import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Text } from 'components/ui';
import LanguageLocale from 'utils/LanguageLocale';

const AddReviewNote = () => {
    const getText = LanguageLocale.getLocaleResourceFile('components/AddReview/AddReviewNote/locales', 'AddReviewNote');

    return (
        <Text
            is='p'
            fontSize='sm'
            lineHeight='tight'
            marginTop={2}
            marginLeft={6}
            marginBottom={6}
        >
            <b>{getText('noteLabel')}: </b>
            {getText('noteText')}
        </Text>
    );
};

export default wrapFunctionalComponent(AddReviewNote, 'AddReviewNote');
