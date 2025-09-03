import React from 'react';
import { Box, Text } from 'components/ui';
import mediaUtils from 'utils/Media';
import { wrapFunctionalComponent } from 'utils/framework';
import languageLocale from 'utils/LanguageLocale';

const { Media } = mediaUtils;
const { getLocaleResourceFile } = languageLocale;

const BUGBOUNTY_IFRAME_URL = 'https://hackerone.com/7979ac83-6e29-44dc-9f5d-af0b0ff984c0/embedded_submissions/new';

const BugBounty = () => {
    const getText = getLocaleResourceFile('components/Content/BugBounty/locales', 'BugBounty');

    return (
        <Box
            width='100%'
            height='100%'
        >
            <Media lessThan='md'>
                <Text
                    is='h2'
                    fontSize='xl'
                    textAlign='center'
                >
                    {getText('mobileNotOptimalExperienceWarning')}
                </Text>
            </Media>
            <Media greaterThan='sm'>
                <iframe
                    src={BUGBOUNTY_IFRAME_URL}
                    title={getText('submitVulnerabilityReport')}
                    style={{
                        width: '100%',
                        height: '1000px'
                    }}
                />
            </Media>
        </Box>
    );
};

export default wrapFunctionalComponent(BugBounty, 'BugBounty');
