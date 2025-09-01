/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import cookieUtils from 'utils/Cookies';
import rmnUtils from 'utils/rmn';
import sponsoredProductsAPI from 'services/api/sponsoredProducts/sponsoredProducts';
import localeUtils from 'utils/LanguageLocale';
import ProductCardCarousel from 'components/ProductPage/ProductCardCarousel/ProductCardCarousel';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';
import rmnAndPlas from 'utils/rmnAndPla';
const { getLocaleResourceFile, isUS } = localeUtils;
const { transformSponsoredProductsResponse } = rmnUtils;
const getText = getLocaleResourceFile('components/Rmn/locales', 'RmnBanner');

class RMNCarousel extends BaseClass {
    state = {
        sponsorProducts: [],
        loaded: false
    };

    mountPIQPlas() {
        const { targets, maxProducts, isHomePage } = this.props;
        const slotPrefix = isUS() ? '25' : '26';
        const slotType = isHomePage ? '01' : '04';
        const slotDevice = Sephora.isDesktop() ? '112' : '212';
        const slot = `${slotPrefix}${slotType}${slotDevice}`;
        const requestParams = {
            targets,
            slot,
            count: maxProducts,
            count_fill: maxProducts
        };

        if (cookieUtils.read(cookieUtils.KEYS.SEPH_SESSION)) {
            sponsoredProductsAPI(requestParams)
                .then(response => {
                    if (response.responseStatus === 200) {
                        // Fires the On-Load tracking event
                        rmnAndPlas.fireAdPlacementOnLoadEvent(response);

                        const sponsorProducts = this.transform(transformSponsoredProductsResponse(response));
                        this.setState({ loaded: true, sponsorProducts });
                    } else {
                        this.setState({ loaded: true });
                    }
                })
                .catch(() => {
                    this.setState({ loaded: true });
                });
        } else {
            this.setState({ loaded: true });
        }
    }

    mountPlas() {
        const { sponsoredProducts } = this.props;

        if (sponsoredProducts?.products?.length) {
            this.setState({ loaded: true, sponsorProducts: this.transform(sponsoredProducts?.products) });
        } else {
            this.setState({ loaded: true });
        }
    }

    componentDidMount() {
        if (isRmnCombinedCallFeatureEnabled()) {
            this.mountPlas();
        } else {
            this.mountPIQPlas();
        }
    }

    transform = sponsorProducts => {
        const { currentProductId } = this.props;

        const parseSponsorProducts = sponsorProducts
            .filter(({ productId }) => productId !== currentProductId)
            .filter(sku => sku?.currentSku?.gridImageURL)
            .map(sponsorProduct => ({
                ...sponsorProduct,
                ...sponsorProduct.currentSku,
                productName: sponsorProduct.displayName,
                starRatings: Number(sponsorProduct.rating),
                productReviewCount: Number(sponsorProduct.reviews)
            }));

        return parseSponsorProducts;
    };

    onClick = ({ event, product, index }) => {
        const { fireSponsoredProductClickTracking, source } = this.props;
        fireSponsoredProductClickTracking({
            product,
            source: source ? source : 'product',
            _event: event,
            index
        });
    };

    render() {
        const { loaded, sponsorProducts } = this.state;
        const { minProducts, source } = this.props;

        if (!loaded) {
            return null;
        }

        if (loaded && sponsorProducts.length < minProducts) {
            return null;
        }

        return (
            <ProductCardCarousel
                carouselContextId='rmn-carousel'
                title={getText('featuredProduct')}
                skus={sponsorProducts}
                subTitle={getText('sponsored')}
                onClick={this.onClick}
                source={source}
                urlImage={true}
            />
        );
    }
}

RMNCarousel.defaultProps = {
    minProducts: 5,
    maxProducts: 12,
    isHomePage: false
};

RMNCarousel.propTypes = {
    fireSponsoredProductClickTracking: PropTypes.func.isRequired,
    currentProductId: PropTypes.string,
    targets: PropTypes.object,
    minProducts: PropTypes.number,
    maxProducts: PropTypes.number,
    isHomePage: PropTypes.bool
};

export default wrapComponent(RMNCarousel, 'RMNCarousel', true);
