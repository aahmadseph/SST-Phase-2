import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { mediaQueries } from 'style/config';
import Medallia from 'components/Medallia';
import {
    Box, Text, Link, Container
} from 'components/ui';
import TermsConditionsModal from 'components/GlobalModals/TermsConditionsModal/TermsConditionsModal';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

function CompactFooter(hideWebsiteFeedback) {
    const getText = getLocaleResourceFile('components/Footer/locales', 'Footer');

    return (
        <Box marginTop={[6, 7]}>
            {!Sephora.isAgent && !hideWebsiteFeedback ? <Medallia /> : null}
            <Box
                is='footer'
                flex='none'
                textAlign='center'
                fontSize='sm'
                color='white'
                backgroundColor='black'
                paddingTop={[5, 7]}
                paddingBottom={[114, null, 7]}
            >
                <Container>
                    <Text
                        is='p'
                        marginBottom={[3, 0]}
                    >
                        {`© ${new Date().getFullYear()} ${getText('allRightReserved')}`}
                        <br css={{ [mediaQueries.sm]: { display: 'none' } }} />
                        <Link
                            href='/terms-of-use'
                            marginLeft={[null, 2]}
                            children={getText('termsOfUse')}
                            fontWeight='bold'
                        />
                        <Text
                            marginX={2}
                            children='|'
                        />
                        <Link
                            href='/privacy-policy'
                            children={getText('privacyPolicy')}
                            fontWeight='bold'
                        />
                    </Text>
                    <Text is='p'>
                        <Link
                            href='tel:18777374672'
                            children='1-877-737-4672'
                        />
                        <Text
                            marginX={2}
                            children='|'
                        />
                        <br css={{ [mediaQueries.sm]: { display: 'none' } }} />
                        <Link
                            href='mailto:customerservice@sephora.com'
                            children='customerservice@sephora.com'
                        />
                    </Text>
                </Container>
            </Box>
            <TermsConditionsModal />
        </Box>
    );
}

export default wrapFunctionalComponent(CompactFooter, 'CompactFooter');
