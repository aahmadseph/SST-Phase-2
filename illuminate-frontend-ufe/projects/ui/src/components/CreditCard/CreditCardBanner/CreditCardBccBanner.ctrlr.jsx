/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box } from 'components/ui';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import localeUtils from 'utils/LanguageLocale';
import anaUtils from 'analytics/utils';
import bccUtils from 'utils/BCC';
import store from 'store/Store';

const { COMPONENT_NAMES } = bccUtils;
const TT_SHOW_LEFT_NAV_BANNER_OFFER = 'ShowLeftNavBccCreditCardBanner';

class CreditCardBccBanner extends BaseClass {
    state = {
        ccTargeters: {},
        offers: null
    };

    componentDidMount() {
        store.setAndWatch('creditCard.ccTargeters', this, data => {
            this.setState({ ccTargeters: data.ccTargeters });
        });
        store.setAndWatch('testTarget.offers', this, null, true);
    }

    getStoredBccBasketBanner = () => {
        const { testTarget = {} } = this.props;
        const { ccTargeters } = this.state;

        if (testTarget[TT_SHOW_LEFT_NAV_BANNER_OFFER] && ccTargeters.CCDynamicMessagingLeftNavTargeter) {
            // return the entire BCC components list
            return ccTargeters.CCDynamicMessagingLeftNavTargeter;
        } else {
            return null;
        }
    };

    render() {
        const { testTarget = null, ...props } = this.props;

        if (!localeUtils.isUS()) {
            return null;
        }

        const { isGlobalEnabled, isMarketingEnabled } = Sephora.fantasticPlasticConfigurations;

        if (!isGlobalEnabled || !isMarketingEnabled) {
            return null;
        }

        if (testTarget && testTarget[TT_SHOW_LEFT_NAV_BANNER_OFFER]) {
            const bccComps = this.getStoredBccBasketBanner();

            if (bccComps && bccComps.length) {
                return (
                    <Box {...props}>
                        <BccComponentList
                            isContained={false}
                            items={bccComps}
                            propsCallback={compType => {
                                switch (compType) {
                                    case COMPONENT_NAMES.LINK:
                                        return {
                                            bannerCallback: ctaText => {
                                                anaUtils.setNextPageData({
                                                    navigationInfo: anaUtils.buildNavPath(['left nav', ctaText])
                                                });
                                            }
                                        };
                                    default:
                                        return null;
                                }
                            }}
                        />
                    </Box>
                );
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

export default wrapComponent(CreditCardBccBanner, 'CreditCardBccBanner');
