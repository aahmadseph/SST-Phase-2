import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Image, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Checkout/Shared/AccessPointButton/AccessPointModal/locales', 'AccessPointModal');

function AccessPointsNoResults({ location, errorCode }) {
    const halCompany = getText(localeUtils.isCanada() ? 'canadaPostLocations' : 'fedexLocations');

    return (
        <Box
            marginY={7}
            textAlign='center'
        >
            <Image
                display='block'
                src='/img/ufe/no-result.svg'
                size={128}
                marginX='auto'
            />
            <Text
                is='p'
                marginTop={5}
                fontWeight='bold'
            >
                {errorCode && errorCode >= 500 && (
                    <React.Fragment>
                        <span>{getText('unableToFindResults', [halCompany])}</span>
                        <br />
                        <br />
                        <span>{getText('pleaseTryAgain')}</span>
                    </React.Fragment>
                )}
                {errorCode && errorCode >= 400 && errorCode < 500 && getText('noStoresFound', [location])}
                {!errorCode && getText('enterSearchParams', [halCompany])}
            </Text>
        </Box>
    );
}

AccessPointsNoResults.defaultProps = {
    location: '',
    errorCode: null
};

export default wrapFunctionalComponent(AccessPointsNoResults, 'AccessPointsNoResults');
