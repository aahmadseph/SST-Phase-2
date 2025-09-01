import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import languageLocale from 'utils/LanguageLocale';
import { Box, Grid, Icon } from 'components/ui';

const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

function OnlineOnly() {
    return (
        <Box
            lineHeight='tight'
            backgroundColor='nearWhite'
            borderRadius={2}
            padding={[3, 4]}
        >
            <Grid
                lineHeight='tight'
                columns='1fr auto'
                alignItems='center'
            >
                <div data-at={Sephora.debug.dataAt('pdp_marketing_flag')}>{getText('availableOnlineOnly')}</div>
                <Icon
                    css={{ alignSelf: 'flex-start' }}
                    color='gray'
                    name='online'
                />
            </Grid>
        </Box>
    );
}

export default wrapFunctionalComponent(OnlineOnly, 'OnlineOnly');
