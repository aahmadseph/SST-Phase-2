/* eslint-disable camelcase */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import RmnBanner from 'components/Rmn/RmnBanner';
import LazyLoad from 'components/LazyLoad/LazyLoad';
import RMN_BANNER_TYPES from 'components/Rmn/constants';
import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import { HOME_PAGE_AB_TEST } from 'constants/sponsoredProducts';
import RmnUtils from 'utils/rmn';
import { TestTargetReady } from 'constants/events';

class RmnBannerContent extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            showBanner: false
        };
    }

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                if (
                    newOffers.testTarget.offers?.showRMNonHP?.RMNDisplay === HOME_PAGE_AB_TEST.SHOW_BOTH ||
                    newOffers.testTarget.offers?.showRMNonHP?.RMNDisplay === HOME_PAGE_AB_TEST.SHOW_BANNER
                ) {
                    this.setState({ showBanner: true });
                }
            });
        });
    }

    render() {
        const productId = RmnUtils.RMN_SOURCES.HOMEPAGE;
        const targets = { category: [productId] };
        const isUsa = localeUtils.isUS();
        const slotPrefix = isUsa ? '25' : '26';
        const { showBanner } = this.state;

        return showBanner ? (
            <>
                <LazyLoad
                    component={RmnBanner}
                    type={RMN_BANNER_TYPES.SUPER_LEADERBOARD.NAME}
                    isCentered={true}
                    marginBottom={5}
                    contextId={productId}
                    slot={`${slotPrefix}01123`}
                    targets={targets}
                    section='main'
                />
                <LazyLoad
                    component={RmnBanner}
                    type={RMN_BANNER_TYPES.MOBILE_LEADERBOARD.NAME}
                    isCentered={true}
                    marginBottom={4}
                    contextId={productId}
                    slot={`${slotPrefix}01223`}
                    targets={targets}
                    section='main'
                />
            </>
        ) : null;
    }
}

export default wrapComponent(RmnBannerContent, 'RmnBannerContent', true);
