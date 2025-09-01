/* eslint-disable camelcase */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import RMNCarousel from 'components/Rmn/RMNCarousel';
import LazyLoad from 'components/LazyLoad/LazyLoad';
import { HOME_PAGE_AB_TEST } from 'constants/sponsoredProducts';
import store from 'Store';
import { TestTargetReady } from 'constants/events';

class RmnCarouselContent extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            showCarousel: false
        };
    }

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                if (
                    newOffers.testTarget.offers?.showRMNonHP?.RMNDisplay === HOME_PAGE_AB_TEST.SHOW_BOTH ||
                    newOffers.testTarget.offers?.showRMNonHP?.RMNDisplay === HOME_PAGE_AB_TEST.SHOW_CAROUSEL
                ) {
                    this.setState({ showCarousel: true });
                }
            });
        });
    }

    render() {
        const productId = 'web-homepage';
        const targets = { category: [productId] };
        const { showCarousel } = this.state;

        return showCarousel ? (
            <LazyLoad
                component={RMNCarousel}
                targets={targets}
                source={productId}
                currentProductId={productId}
                minProducts={6}
                maxProducts={18}
                isHomePage={true}
            />
        ) : null;
    }
}

export default wrapComponent(RmnCarouselContent, 'RmnCarouselContent', true);
