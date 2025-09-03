/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import localeUtils from 'utils/LanguageLocale';
import {
    Box, Image, Text, Button
} from 'components/ui';
import cmsApi from 'services/api/cms';
import anaConsts from 'analytics/constants';
import urlUtils from 'utils/Url';

const { isLandingPageEnabled } = Sephora.fantasticPlasticConfigurations;
const MEDIA_ID = '49500020';

class MarketingPage extends BaseClass {
    state = {
        bccContent: null
    };

    componentDidMount() {
        if (isLandingPageEnabled) {
            if (localeUtils.isUS()) {
                cmsApi.getMediaContent(MEDIA_ID).then(data => {
                    this.setState({ bccContent: data.regions && data.regions.content });
                });
            }

            // Analytics - ILLUPH-106836
            digitalData.page.pageInfo.pageName = this.props.title;
            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CREDIT_CARD;
        } else {
            urlUtils.redirectTo('/');
        }
    }

    render() {
        const isMobile = Sephora.isMobile();
        const getText = localeUtils.getLocaleResourceFile('components/CreditCard/MarketingPage/locales', 'MarketingPage');

        return (
            <div>
                {localeUtils.isUS() ? (
                    this.state.bccContent ? (
                        <BccComponentList
                            items={this.state.bccContent}
                            disableLazyLoadCount={this.state.bccContent.length > 1 ? 2 : 1}
                            enablePageRenderTracking={true}
                        />
                    ) : null
                ) : (
                    <Box textAlign='center'>
                        <Text
                            is='h1'
                            fontFamily='serif'
                            lineHeight='tight'
                            marginTop='2em'
                            fontSize={isMobile ? 'xl' : '2xl'}
                        >
                            {getText('usOnly')}
                        </Text>
                        <Image
                            display='block'
                            marginX='auto'
                            marginY={isMobile ? 5 : 6}
                            size={128}
                            src='/img/ufe/credit-card/empty-box.svg'
                        />
                        <Button
                            variant='primary'
                            href='/'
                        >
                            {getText('continue')}
                        </Button>
                    </Box>
                )}
            </div>
        );
    }
}

export default wrapComponent(MarketingPage, 'MarketingPage');
