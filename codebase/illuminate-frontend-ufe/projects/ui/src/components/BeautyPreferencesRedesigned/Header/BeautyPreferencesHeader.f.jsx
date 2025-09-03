import React from 'react';
import { Box, Text } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import languageLocale from 'utils/LanguageLocale';
const getText = languageLocale.getLocaleResourceFile('components/BeautyPreferencesRedesigned/Header/locales', 'BeautyPreferencesHeader');

function BeautyPreferencesHeader() {
    return (
        <Box
            marginTop={[4, null, 5]}
            marginBottom={4}
        >
            <Text
                is='h1'
                fontWeight='bold'
                fontSize={['lg', null, 'xl']}
                children={getText('beautyPreferencesTitle')}
            />
            <Text fontSize={[null, null, 'md']}>{getText('beautyPreferencesHeaderDescription')}</Text>
        </Box>
    );
}

export default wrapFunctionalComponent(BeautyPreferencesHeader, 'BeautyPreferencesHeader');
