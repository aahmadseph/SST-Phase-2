import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Carousel from 'components/Carousel';
import { CARD_GAP, CARD_WIDTH } from 'constants/productCard';
import { Box, Text } from 'components/ui';
import RecapProductList from 'components/Content/Recap/RecapProductList';
import RecapProductListBestSellers from 'components/Content/Recap/RecapProductListBestSellers';
import RecapProductListJustArrived from 'components/Content/Recap/RecapProductListJustArrived';
import RecapProductListSale from 'components/Content/Recap/RecapProductListSale';
import Empty from 'constants/empty';
import ShopYourStoreBindings from 'analytics/bindingMethods/pages/ShopYourStore/ShopYourStoreBindings';

const RECAP_COMPONENTS_MAP = {
    RecapProductListBestSellers: RecapProductListBestSellers,
    RecapProductListJustArrived: RecapProductListJustArrived,
    RecapProductListSale: RecapProductListSale
};

class RecapSYSHandler extends BaseClass {
    buildCarouselCards = (items = [], sectionTitle) => {
        // TODO: Delete this when the 6 RecapProductList are completed
        const CONFIG = {
            'shop-store-bestsellers-at-productlist': {
                component: 'RecapProductListBestSellers'
            },
            'shop-store-just-arrived-productlist': {
                shouldRender: true,
                component: 'RecapProductListJustArrived'
            },
            'shop-store-sale-at-productlist': {
                shouldRender: true,
                component: 'RecapProductListSale'
            },
            'shop-sameday-bestsellers-at-productlist': {
                component: 'RecapProductListBestSellers',
                shouldRender: true
            },
            'shop-sameday-just-arrived-productlist': {
                shouldRender: true,
                component: 'RecapProductListJustArrived'
            },
            'shop-sameday-sale-at-productlist': {
                shouldRender: true,
                component: 'RecapProductListSale'
            }
        };

        const cards = [];

        for (const item of items) {
            const sid = item?.sid;
            const componentConfig = CONFIG[sid] || {};
            const shouldRender = componentConfig.shouldRender ?? true;

            if (shouldRender) {
                const { component } = componentConfig;
                const RecapProductComponent = component ? RECAP_COMPONENTS_MAP[component] : RecapProductList;
                const icid2 = ShopYourStoreBindings.buildInternalCampaignString(item, sectionTitle);

                cards.push(
                    <RecapProductComponent
                        icid2={icid2}
                        useActionWrapper
                        {...item}
                    />
                );
            }
        }

        return cards;
    };

    fetchData() {
        const { fetchJustArrived, fetchBestsellers, fetchSale } = this.props;

        fetchBestsellers();
        fetchJustArrived();
        fetchSale();
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.contextKey !== prevProps.contextKey) {
            this.fetchData();
        }
    }

    render() {
        const {
            sid, title, subtitle, marginTop, marginBottom, shouldRender, items
        } = this.props;

        if (!shouldRender || !items.length) {
            return null;
        }

        return (
            <Box
                id={sid}
                marginTop={marginTop}
                marginBottom={marginBottom}
            >
                {title && (
                    <Text
                        is='h2'
                        lineHeight='tight'
                        marginBottom={subtitle ? '.25em' : 4}
                        fontSize={['md', 'lg']}
                        fontWeight='bold'
                        children={title}
                    />
                )}
                {subtitle && (
                    <Text
                        is='p'
                        lineHeight='tight'
                        marginBottom={4}
                        marginRight='auto'
                        children={subtitle}
                    />
                )}
                <Carousel
                    gap={CARD_GAP}
                    paddingY={4}
                    marginX='-container'
                    scrollPadding={[2, 'container']}
                    itemWidth={CARD_WIDTH}
                    items={this.buildCarouselCards(items, title)}
                    hasShadowHack={true}
                />
            </Box>
        );
    }
}

RecapSYSHandler.propTypes = {
    shouldRender: PropTypes.bool,
    marginTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    marginBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    fetchData: PropTypes.func,
    fetchBestsellers: PropTypes.func,
    fetchJustArrived: PropTypes.func,
    fetchSale: PropTypes.func
};

RecapSYSHandler.defaultProps = {
    shouldRender: true,
    marginTop: [6, 7],
    marginBottom: [6, 7],
    fetchData: Empty.Function,
    fetchBestsellers: Empty.Function,
    fetchJustArrived: Empty.Function,
    fetchSale: Empty.Function
};

export default wrapComponent(RecapSYSHandler, 'RecapSYSHandler', true);
