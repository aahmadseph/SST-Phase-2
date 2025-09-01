import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';

import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/SignInModal/SignInFormTerms/locales', 'SignInFormTerms');

function SignInFormTerms(props) {
    return (
        <Text
            is='p'
            lineHeight='tight'
            fontSize='xs'
            color='gray'
            my={4}
            {...props}
        >
            {getText('termsAndConditions')}
            <Link
                color='blue'
                underline={true}
                href='/terms-of-use'
                fontWeight='bold'
            >
                {getText('termsOfUse')}
            </Link>
            {getText('termsAndConditionsRest')}
            <Link
                color='blue'
                underline={true}
                href='/privacy-policy'
            >
                {getText('privacyPolicy')}
            </Link>
        </Text>
    );
}

export default wrapFunctionalComponent(SignInFormTerms, 'SignInFormTerms');
