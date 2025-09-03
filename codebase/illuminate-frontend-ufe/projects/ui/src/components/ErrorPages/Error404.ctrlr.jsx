/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import { Image, Text, Button } from 'components/ui';
import SetPageAnalyticsProps from 'components/Analytics';
import AnaConst from 'analytics/constants';
import localeUtils from 'utils/LanguageLocale';

class Error404 extends BaseClass {
    constructor() {
        super();
    }

    render() {
        const isMobile = Sephora.isMobile();
        const getText = localeUtils.getLocaleResourceFile('components/ErrorPages/locales', 'Error404');

        return (
            <LegacyContainer
                textAlign='center'
                marginTop={isMobile ? 7 : 8}
                lineHeight='tight'
            >
                <Text
                    is='h1'
                    fontFamily='serif'
                    fontSize={isMobile ? 'xl' : '2xl'}
                >
                    {getText('sorry')}
                </Text>
                <Image
                    src='/img/ufe/inactive.svg'
                    display='block'
                    marginX='auto'
                    marginY={isMobile ? 5 : 6}
                    size={128}
                    disableLazyLoad={true}
                />
                <Text
                    is='p'
                    marginBottom={isMobile ? 5 : 6}
                >
                    {getText('try')}
                </Text>
                <Button
                    href='/'
                    marginX='auto'
                    variant='primary'
                >
                    {getText('home')}
                </Button>
                <SetPageAnalyticsProps
                    pageType={AnaConst.PAGE_TYPES.ERROR_PAGE}
                    pageName='404'
                />
            </LegacyContainer>
        );
    }
}

export default wrapComponent(Error404, 'Error404');
