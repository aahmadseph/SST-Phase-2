import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { fontSizes } from 'style/config';

const FormSubmittedStep = () => {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

    return (
        <>
            <Box css={styles.container}>
                <Text
                    is='h2'
                    fontWeight='bold'
                    marginBottom={4}
                    fontSize={fontSizes.xl}
                >
                    {getText('formSubmittedStepSubtitle')}
                </Text>
                <Text
                    is='p'
                    marginTop={4}
                    fontSize={fontSizes.md}
                >
                    {getText('formSubmittedStepCopy')}
                </Text>
            </Box>
        </>
    );
};

const styles = {
    container: {
        height: '30vh'
    }
};

export default wrapFunctionalComponent(FormSubmittedStep, 'FormSubmittedStep');
