import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import LanguageLocaleUtils from 'utils/LanguageLocale';
import { Box, Link, Text } from 'components/ui';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = text => getLocaleResourceFile('components/ReCaptchaText/locales', 'ReCaptchaText')(text);

class ReCaptchaText extends BaseClass {
    render() {
        const { isRegisterModal, ...props } = this.props;

        return (
            <Box
                color='gray'
                fontSize='sm'
                lineHeight='tight'
                {...props}
            >
                <Text is='p'>
                    {getText(isRegisterModal ? 'sephoraReCaptchaTextRegister' : 'sephoraReCaptchaText')}{' '}
                    <Link
                        color='blue'
                        underline={true}
                        href='https://policies.google.com/privacy?hl=en'
                        target='_blank'
                        data-at={Sephora.debug.dataAt('privacy_policy_link')}
                        children={getText('googlePrivacyPolicyLink')}
                    />
                    {' & '}
                    <Link
                        color='blue'
                        underline={true}
                        href='https://policies.google.com/terms?hl=en'
                        target='_blank'
                        data-at={Sephora.debug.dataAt('terms_link')}
                        children={getText('googleTermsLink')}
                    />
                    .
                </Text>
            </Box>
        );
    }
}

export default wrapComponent(ReCaptchaText, 'ReCaptchaText');
