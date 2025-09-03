/* eslint-disable camelcase */
/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';
import {
    CONSTRUCTOR_PODS, RESULTS_COUNT, PRICE_RANGE, BRANDS
} from 'constants/constructorConstants';
import constants from 'constants/content';
import { Fragment } from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { getCmsComponent } from 'constants/cmsComponentsMapping';
import ConstructorCarousel from 'components/ConstructorCarousel';
import Empty from 'constants/empty';
import LazyLoad from 'components/LazyLoad';
import cookieUtils from 'utils/Cookies';
import { SKIN_ANALYSIS_TOOL } from 'constants/arSkincare';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import cmsComponentActions from 'actions/CmsComponentActions';
import dynamicComponentActions from 'actions/dynamicComponentActions';
import { getCurrentEnv } from 'utils/Env';

const {
    COMPONENT_TYPES: {
        BANNER_LIST,
        BANNER,
        COPY,
        DIVIDER,
        PRODUCT_LIST,
        PROMOTION_LIST,
        RECAP,
        REWARD_LIST,
        SECTION_HEADING,
        SOFT_LINKS,
        SMS_OPTIN,
        SECTION,
        CUSTOM_RENDERING,
        UGC_WIDGET,
        LOVES_LIST
    },
    CONTEXTS,
    COMPONENT_SPACING
} = constants;

// Build SID buckets by env
function buildSidBuckets(env) {
    if (env === 'qa4') {
        // QA4 only, minimal seeds
        return {
            A: new Set(['homepage_recaplist_PickUpWhereYouLeftOff_us_app1']),
            B: new Set(['homepage_productlist_ChosenForYou_us_rwd_092022']),
            C: new Set(['homepage_productlist_JustDropped_us_rwd_092022']),
            D: new Set(['homepage_productlist_SellingFast_us_rwd_092022]'])
        };
    }

    // Default to Production
    return {
        A: new Set(['homepage_recaplist_PickUpWhereYouLeftOff_us_ufe_092022', 'homepage_recaplist_PickUpWhereYouLeftOff_ca_ufe_092022']),
        B: new Set(['homepage_productlist_ChosenForYou_us_rwd_092022', 'homepage_productlist_ChosenForYou_ca_ufe_092022']),
        C: new Set(['homepage_productlist_newarrivals_us_ca_ufe_092022']),
        D: new Set(['homepage_productlist_SellingFast_us_ufe_092022', 'homepage_productlist_SellingFast_ca_ufe_092022'])
    };
}

const SID_BUCKETS = buildSidBuckets(getCurrentEnv());
const CHALLENGER_ORDERS = {
    challengerOne: ['A', 'B', 'D', 'C'],
    challengerTwo: ['A', 'C', 'B', 'D'],
    challengerThree: ['A', 'C', 'D', 'B'],
    challengerFour: ['A', 'D', 'B', 'C'],
    challengerFive: ['A', 'D', 'C', 'B']
};

// Map an item to its section A/B/C/D based on SID
function getSectionBySid(item) {
    const sid = item?.sid;

    if (!sid) {
        return null;
    }

    if (SID_BUCKETS.A.has(sid)) {
        return 'A';
    }

    if (SID_BUCKETS.B.has(sid)) {
        return 'B';
    }

    if (SID_BUCKETS.C.has(sid)) {
        return 'C';
    }

    if (SID_BUCKETS.D.has(sid)) {
        return 'D';
    }

    return null;
}

function pickActiveChallenger(showReorderCarousel) {
    const active = Object.entries(showReorderCarousel || {})
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k);

    return active.length === 1 ? active[0] : null;
}

// Reorders only the first A/B/C/D among their original slots
function reorderHomeCarousels(items, showReorderCarousel) {
    if (!Array.isArray(items) || items.length === 0) {
        return items;
    }

    const activeKey = pickActiveChallenger(showReorderCarousel);

    if (!activeKey) {
        return items;
    }

    const pattern = CHALLENGER_ORDERS[activeKey];

    if (!pattern) {
        return items;
    }

    const firstIndex = { A: undefined, B: undefined, C: undefined, D: undefined };
    const firstItem = { A: undefined, B: undefined, C: undefined, D: undefined };
    let found = 0;

    for (let i = 0; i < items.length; i++) {
        const sec = getSectionBySid(items[i]);

        if (sec && firstIndex[sec] === undefined) {
            firstIndex[sec] = i;
            firstItem[sec] = items[i];

            if (++found === 4) {
                break;
            }
        }
    }

    const presentSecs = pattern.filter(sec => firstIndex[sec] !== undefined);

    if (presentSecs.length < 2) {
        return items;
    }

    const targetSlots = presentSecs.map(sec => firstIndex[sec]).sort((a, b) => a - b);

    const out = items.slice();

    for (let i = 0; i < presentSecs.length; i++) {
        const sec = presentSecs[i];
        const toIndex = targetSlots[i];
        out[toIndex] = firstItem[sec];
    }

    return out;
}

class ComponentList extends BaseClass {
    componentDidMount() {
        const { page, items } = this.props;
        cmsComponentActions.updateComsComponentPageData({
            page,
            items
        });

        if (this.props.userId) {
            dynamicComponentActions.processDynamicComponents(this.props.items);
        }
    }

    componentDidUpdate(prevProps) {
        // Re-run dynamic components when user logs in
        if (prevProps.userId !== this.props.userId) {
            dynamicComponentActions.processDynamicComponents(this.props.items);
        }
    }

    render() {
        const {
            context,
            enablePageRenderTracking,
            items,
            page,
            trackingCount,
            removeFirstItemMargin,
            removeLastItemMargin,
            trackSoftLink,
            customStyles,
            customCardSize,
            params,
            showReorderCarouselHPSO,
            showReorderCarouselHPSI,
            isAnonymous
        } = this.props;

        let renderedComponentsCounter = 0;
        let lazyLoadEnabled = false;
        let numberOfComponentsToRenderWithoutLazyLoad = 0;

        let reorderedItems = items;

        if (isAnonymous && Object.values(showReorderCarouselHPSO).some(Boolean)) {
            reorderedItems = reorderHomeCarousels(items, showReorderCarouselHPSO);
        } else if (!isAnonymous && Object.values(showReorderCarouselHPSI).some(Boolean)) {
            reorderedItems = reorderHomeCarousels(items, showReorderCarouselHPSI);
        }

        return (
            <>
                {reorderedItems.map((item, index) => {
                    const constructorItem = {};
                    const isLastItem = index === items.length - 1;

                    switch (item.type) {
                        case BANNER:
                            item.shouldTriggerImpression = true;

                            if (item?.action?.page?.slug === SKIN_ANALYSIS_TOOL) {
                                const isIllinoisUser = cookieUtils.read(cookieUtils.KEYS.ILLINOIS_YES) === 'true';

                                if (isIllinoisUser) {
                                    return null;
                                }
                            }

                            if (!isLastItem && items[index + 1].type === SECTION_HEADING) {
                                item.marginBottom = null;
                            }

                            break;
                        case BANNER_LIST:
                            if (!isLastItem && items[index + 1].type === BANNER) {
                                item.marginBottom = COMPONENT_SPACING.SM;
                            }

                            break;
                        case SECTION_HEADING:
                            if (!isLastItem && items[index + 1]) {
                                items[index + 1].marginTop = null;
                            }

                            break;
                        case PRODUCT_LIST:
                            if (item.skipTypeOverride) {
                                break;
                            }

                            /*
                            Introduced in INFL-1952: overrides the Contentful component type based
                            on targetUrl. A new type should have been created, the CustomRendering
                            type used, or the SID leveraged instead.

                            As a workaround to avoid breaking the Loves List on the Basket page,
                            I’m bypassing this logic using the validation above.

                            In Shop Your Store, we have a ProductList with a /shopping-list targetUrl,
                            and we need it to behave according to its declared type, rather than
                            the synthetic type created below.
                            */
                            if (item.action?.targetUrl === '/shopping-list') {
                                item.type = LOVES_LIST;
                            }

                            break;
                        default:
                            break;
                    }

                    if (!isLastItem && items[index + 1].type === DIVIDER) {
                        item.marginBottom = null;
                    }

                    if (removeFirstItemMargin && index === 0) {
                        item.marginTop = null;
                    }

                    if (removeLastItemMargin && isLastItem) {
                        item.marginBottom = null;
                    }

                    const enableRenderTracking = enablePageRenderTracking && index < trackingCount;
                    const { type, features, ...restItemProps } = constructorItem.type ? constructorItem : item;
                    let ComponentToRender = getCmsComponent({ type, features });

                    if (!ComponentToRender) {
                        return null;
                    }

                    let propsToRender = {};

                    function preparePropsToRender(props, componentToRender) {
                        const commonPropsToRender = {
                            type,
                            context,
                            enablePageRenderTracking: enableRenderTracking,
                            page,
                            customStyles,
                            customCardSize,
                            ...restItemProps
                        };

                        if (componentToRender) {
                            ComponentToRender = componentToRender;
                        }

                        propsToRender = {
                            ...commonPropsToRender,
                            ...props
                        };
                    }

                    if (item.ctorPodId) {
                        const podIdConfigurations = {
                            [CONSTRUCTOR_PODS.RFY_BASKET]: {
                                condition: params?.itemIds?.length > 0,
                                config: {
                                    params,
                                    podId: CONSTRUCTOR_PODS.RFY_BASKET
                                }
                            },
                            [CONSTRUCTOR_PODS.BOPIS_BASKET]: {
                                condition: params?.itemIds?.length > 0,
                                config: {
                                    params,
                                    podId: CONSTRUCTOR_PODS.BOPIS_BASKET
                                }
                            },
                            [CONSTRUCTOR_PODS.UNDER_20_LOYALTY]: {
                                config: {
                                    params: {
                                        filters: {
                                            Price: PRICE_RANGE.UNDER_TWENTY
                                        }
                                    },
                                    podId: CONSTRUCTOR_PODS.UNDER_20_LOYALTY
                                }
                            },
                            [CONSTRUCTOR_PODS.SALE_LOYALTY]: {
                                config: {
                                    params: {
                                        filters: {
                                            on_sale: true
                                        }
                                    },
                                    podId: CONSTRUCTOR_PODS.SALE_LOYALTY
                                }
                            },
                            [CONSTRUCTOR_PODS.BASKET_QUICK_ADDS]: {
                                condition: params?.itemIds?.length > 0,
                                config: {
                                    params: {
                                        ...params,
                                        numResults: RESULTS_COUNT.BASKET_QUICK_ADDS,
                                        filters: {
                                            Price: PRICE_RANGE.UNDER_FIFTEEN,
                                            Brand: BRANDS.SEPHORA_COLLECTION
                                        }
                                    },
                                    podId: CONSTRUCTOR_PODS.BASKET_QUICK_ADDS
                                }
                            },
                            [CONSTRUCTOR_PODS.AUTO_REPLENISH_SEPHORA_COLLECTION]: {
                                config: {
                                    params: {
                                        filters: {
                                            Brand: BRANDS.SEPHORA_COLLECTION
                                        }
                                    },
                                    podId: CONSTRUCTOR_PODS.AUTO_REPLENISH_SEPHORA_COLLECTION
                                }
                            },
                            default: {
                                config: {
                                    params: {},
                                    podId: item.ctorPodId
                                }
                            }
                        };

                        const podIdKey = item.ctorPodId in podIdConfigurations ? item.ctorPodId : 'default';
                        const { condition = true, config } = podIdConfigurations[podIdKey];

                        if (condition) {
                            preparePropsToRender(config, ConstructorCarousel);
                        }
                    } else {
                        preparePropsToRender({
                            ...restItemProps,
                            trackSoftLink
                        });
                    }

                    // Strategy for enabling LazyLoad
                    switch (page) {
                        // On home page we start wrapping components with LazyLoad after rendering 2 components.
                        // Also we skip counting the following components: DIVIDER, ANCHOR.
                        case 'home':
                        case 'buying-guide':
                        case 'offers': {
                            lazyLoadEnabled = true;

                            // 2 components for Home page
                            // 3 components for Offers page - to pre-render the first 3 before the fold
                            numberOfComponentsToRenderWithoutLazyLoad = page === 'home' ? 2 : 3;

                            switch (type) {
                                case BANNER_LIST:
                                case BANNER:
                                case COPY:
                                case PRODUCT_LIST:
                                case PROMOTION_LIST:
                                case RECAP:
                                case REWARD_LIST:
                                case SECTION_HEADING:
                                case SOFT_LINKS:
                                case SMS_OPTIN:
                                case SECTION:
                                case CUSTOM_RENDERING: {
                                    renderedComponentsCounter++;

                                    break;
                                }
                                case UGC_WIDGET:
                                default: {
                                    break;
                                }
                            }

                            break;
                        }
                        default: {
                            break;
                        }
                    }

                    const renderLazyLoad = lazyLoadEnabled && renderedComponentsCounter > numberOfComponentsToRenderWithoutLazyLoad;

                    return (
                        <Fragment key={`${item.sid || item.type}_${index}`}>
                            {renderLazyLoad ? (
                                <LazyLoad
                                    component={ComponentToRender}
                                    title={item.title}
                                    {...propsToRender}
                                />
                            ) : (
                                <ComponentToRender {...propsToRender} />
                            )}

                            {enableRenderTracking && <PageRenderReport />}
                        </Fragment>
                    );
                })}
            </>
        );
    }
}

ComponentList.propTypes = {
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]).isRequired,
    enablePageRenderTracking: PropTypes.bool,
    trackingCount: PropTypes.number,
    items: PropTypes.array,
    page: PropTypes.string,
    removeFirstItemMargin: PropTypes.bool,
    removeLastItemMargin: PropTypes.bool,
    isAnonymous: PropTypes.bool
};

ComponentList.defaultProps = {
    enablePageRenderTracking: false,
    trackingCount: 2,
    items: Empty.Array,
    page: null,
    removeFirstItemMargin: null,
    removeLastItemMargin: null,
    isAnonymous: true
};

export default wrapComponent(ComponentList, 'ComponentList', true);
