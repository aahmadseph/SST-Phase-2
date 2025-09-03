import React from 'react';
import uiUtils from 'utils/UI';
import { space, site } from 'style/config';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import {
    Box, Text, Image, Link
} from 'components/ui';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { getLocaleResourceFile } = localeUtils;
const { wrapFunctionalComponent } = FrameworkUtils;
const getText = resourceWrapper(getLocaleResourceFile('components/SharedComponents/Stores/NoStores/locales', 'NoStores'));

const NoStores = ({ countryMismatch, currentLocation, close, withErrorLine2 = true }) => {
    const switchCountryTo = localeUtils.isUS()
        ? localeUtils.getCountryLongName(localeUtils.COUNTRIES.CA)
        : localeUtils.getCountryLongName(localeUtils.COUNTRIES.US);

    const renderCountryMismatch = (
        <Text
            marginTop={5}
            is='p'
            marginBottom={2}
        >
            {getText('localeError', false, switchCountryTo)}
            <Link
                onClick={() => {
                    close();
                    setTimeout(() => {
                        window.scrollTo({
                            top:
                                document.getElementById('regionAndLanguage').offsetTop -
                                ((uiUtils.getBreakpoint() === 'xs' ? site.headerHeight : 0) + space[5]),
                            behavior: 'smooth'
                        });
                    });
                }}
                color='blue'
                underline={true}
                paddingRight={1}
                children={getText('bottomOfSite')}
            />
            {getText('localeError2', false, switchCountryTo)}
            <br />
            <br />
            {withErrorLine2 && getText('localeErrorLine2', false, switchCountryTo)}
        </Text>
    );

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
            {countryMismatch ? (
                renderCountryMismatch
            ) : (
                <Text
                    data-at={Sephora.debug.dataAt('change_store_body_error_msg')}
                    is='p'
                    marginTop={5}
                    fontWeight='bold'
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: getText('noStoreNear', false, currentLocation)
                        }}
                    />
                    <br />
                    {getText('pleaseTryDifferentLocation')}
                </Text>
            )}
        </Box>
    );
};

export default wrapFunctionalComponent(NoStores, 'NoStores');
