/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import contentConstants from 'constants/content';
import userUtils from 'utils/User';
import biUtils from 'utils/BiProfile';
import helpersUtils from 'utils/Helpers';
import skuUtils from 'utils/Sku';
import languageLocale from 'utils/LanguageLocale';
import birbActions from 'actions/BIRBActions';
import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import locationUtils from 'utils/Location';
import ADD_BUTTON_TYPE from 'utils/Basket';
import auth from 'utils/Authentication';
import anaConstants from 'analytics/constants';
import content from 'constants/content';
import {
    Container, Box, Flex, Text, Button
} from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import stringUtils from 'utils/String';
import Divider from 'components/Content/Divider';
import ProductList from 'components/Content/ProductList';
import AddToBasketButton from 'components/AddToBasketButton';
import ProfileBanner from 'components/ProfileBanner';
import RougeRewardsCarousel from 'components/RougeRewardsCarousel';
import rewardsBazaarPageBindings from 'analytics/bindingMethods/pages/rewardsBazaar/rewardsBazaarPageBindings';
import UI from 'utils/UI';
import Chiclet from 'components/Chiclet';
import { mediaQueries } from 'style/config';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import LazyLoad from 'components/LazyLoad';
import skuHelpers from 'utils/skuHelpers';
import { HEADER_VALUE } from 'constants/authentication';
import localeUtils from 'utils/LanguageLocale';

const { PRODUCT_LIST_GROUPING, PRODUCT_LIST_VARIANTS } = content;
const { embedHTML } = stringUtils;
const { isAnonymous } = userUtils;
const {
    CONTEXTS,
    COMPONENT_TYPES: { PRODUCT_LIST }
} = contentConstants;
const getText = languageLocale.getLocaleResourceFile('components/RewardsBazaar/locales', 'RewardsBazaar');

const styles = {
    listVariant: {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'nowrap',
            [mediaQueries.smMax]: {
                justifyContent: 'space-between'
            }
        },
        list: {
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            padding: 0,
            margin: 0,
            listStyleType: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            '& li:first-child': {
                paddingLeft: '4px'
            }
        },
        chiclet: {
            padding: '4px 0',
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            overflow: 'visible',
            textOverflow: 'clip',
            flexShrink: 0,
            flexGrow: 0
        }
    }
};

class LayoutRewardsBazaar extends BaseClass {
    rewardsBazaar = React.createRef();

    componentDidMount() {
        if (typeof window === 'object') {
            window?.addEventListener('hashchange', this.scrollTo);
        }

        if (isAnonymous(this.props.auth)) {
            this.updateBiRewards();
        }

        rewardsBazaarPageBindings.setPageLoadAnalytics();
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.scrollTo);
    }

    componentDidUpdate(prevProps) {
        const { user, basket } = this.props;
        const { isInitialized, defaultSACountryCode, defaultSAZipCode } = user;
        const { isAccessTokenPresent = false } = this.props;
        const defaultSADataChanged =
            prevProps.user.defaultSACountryCode !== defaultSACountryCode || prevProps.user.defaultSAZipCode !== defaultSAZipCode;

        if (this.props.user.isInitialized) {
            if (prevProps.basket.netBeautyBankPointsAvailable !== basket.netBeautyBankPointsAvailable) {
                bindingMethods.setUserPropsWithCurrentData();
            }
        }

        // defaultSA data is available after User logged in or refreshed
        if (isInitialized && isAccessTokenPresent && defaultSADataChanged) {
            this.updateBiRewards();
        }

        this.scrollTo();
    }

    updateBiRewards() {
        const { user } = this.props;
        const options = {
            userId: this.props.isAnonymous ? undefined : user?.beautyInsiderAccount?.biAccountId || 'current'
        };
        store.dispatch(birbActions.fetchBiRewards(options));
    }

    getTranslatedDaysToRedeem = () => {
        const lastDateToRedeem = userUtils.getGiftLastDateToRedeem();

        if (!localeUtils.isFrench()) {
            return lastDateToRedeem;
        }

        const daysLeft = lastDateToRedeem.match(/\d+/);

        return daysLeft ? getText('daysToRedeem', [daysLeft[0]]) : '';
    };

    getBiRewards = () => {
        const initialBiRewardGroups = this.props.beautyInsider?.biRewardGroups || {};

        const biRewardGroups = rougeExclusiveUtils.updateRougeExclusiveBiRewardGroups(initialBiRewardGroups, this.props.basket);
        const { rewardsLabels } = userUtils;

        const { REWARD_GROUPS } = biUtils;

        const { [REWARD_GROUPS.CELEBRATION]: celebrationGifts, [REWARD_GROUPS.BIRTHDAY]: birthdayGifts } = biRewardGroups;

        const rewardsGridsNames = [
            '50 Points',
            '100 Points',
            '250-499 Points',
            '500-749 Points',
            '750-2999 Points',
            '3000-4999 Points',
            '5000-19999 Points',
            '20000+ Points'
        ];

        const biRewardsCarrousels = [];
        const biRewardsGrids = [];

        Object.keys(biRewardGroups).forEach(key => {
            if (rewardsGridsNames.indexOf(key) >= 0 && biRewardGroups[key].length > 0) {
                biRewardsGrids.push({
                    items: biRewardGroups[key].map(item => {
                        return { ...item, threshold: key };
                    }),
                    anchor: key.replace(/\s/g, '').toLowerCase(),
                    title: getText(key),
                    isAnonymous: this.props.isAnonymous,
                    isBIRBReward: true
                });
            }
        });

        if (celebrationGifts && !this.props.isAnonymous) {
            biRewardsCarrousels.push({
                anchor: 'complimentary',
                items: celebrationGifts.map(item => {
                    return { ...item, threshold: rewardsLabels.CELEBRATION_GIFT.TITLE };
                }),
                title: getText('chooseYour', [rewardsLabels.CELEBRATION_GIFT.TITLE]),
                subtitle: rewardsLabels.CELEBRATION_GIFT.SUBTITLE.replace('{0}', userUtils.getRealTimeBiStatus())
            });
        }

        if (birthdayGifts) {
            const { user } = this.props;

            const innerText = embedHTML(/(\d*)/, this.getTranslatedDaysToRedeem(), 'strong');

            biRewardsCarrousels.push({
                isBirthDayRewardList: true,
                anchor: 'birthdaygifts',
                items: birthdayGifts.map(item => {
                    return { ...item, threshold: rewardsLabels.BIRTHDAY_GIFT.TITLE };
                }),
                title: rewardsLabels.BIRTHDAY_GIFT.TITLE,
                subtitle: rewardsLabels.BIRTHDAY_GIFT.SUBTITLE.replace('{0}', user.firstName),
                secondSubtitle: { inner: innerText }
            });
        }

        return {
            biRewardsCarrousels: biRewardsCarrousels,
            biRewardsGrids: biRewardsGrids
        };
    };

    scrollTo = () => {
        const { current } = this.rewardsBazaar;
        const { hash } = locationUtils.getWindowLocation();

        if (current && hash) {
            helpersUtils.scrollTo(current, `[id='${hash.replace('#', '')}']`, 100, 0);
        }
    };

    getEnhancedContent = poorContent => {
        return Array.isArray(poorContent)
            ? poorContent.map(item => {
                // Skip any enhancement that's not related to a product list
                if (item.type !== PRODUCT_LIST) {
                    return item;
                }

                return Array.isArray(item.skuList)
                    ? {
                        ...item,
                        skuList: item.skuList.map(sku => {
                            return { ...sku, threshold: item.title };
                        })
                    }
                    : item;
            })
            : null;
    };

    render() {
        const {
            content: { topContent, bottomContent },
            enablePageRenderTracking = false
        } = this.props;

        const enhancedTopContent = this.getEnhancedContent(topContent);
        const enhancedBottomContent = this.getEnhancedContent(bottomContent);

        return (
            <Container>
                <ProfileBanner origin='rewardsBazaar' />
                <Container
                    marginTop={[4, 5]}
                    paddingX={0}
                >
                    {enhancedTopContent && (
                        <ComponentList
                            items={enhancedTopContent}
                            context={CONTEXTS.CONTAINER}
                            removeLastItemMargin={true}
                            removeFirstItemMargin={true}
                            enablePageRenderTracking={enablePageRenderTracking}
                        />
                    )}

                    {this.renderRewardsCarousels()}
                    {this.renderRougeRewardsCarousel()}
                    {this.renderRewardsGrids()}

                    {enhancedBottomContent && (
                        <ComponentList
                            items={enhancedBottomContent}
                            context={CONTEXTS.CONTAINER}
                            removeLastItemMargin={true}
                            enablePageRenderTracking={enablePageRenderTracking}
                        />
                    )}
                </Container>
            </Container>
        );
    }

    renderRewardsGrids = () => {
        const { biRewardsGrids } = this.getBiRewards();

        return (
            biRewardsGrids && (
                <Box marginTop={[6, null, 7]}>
                    <Flex
                        id='all-rewards'
                        flexDirection='column'
                        marginBottom={5}
                    >
                        <Text
                            is='h2'
                            fontWeight={'bold'}
                            children={this.props.localization.allRewards}
                            fontSize='xl-bg'
                            marginBottom={this.props.showOmniRewardsNotice || 4}
                        />
                        {this.props.showOmniRewardsNotice && (
                            <Text
                                is='h3'
                                children={this.props.localization.omniRewardsNotice}
                                marginBottom={4}
                            />
                        )}
                        {this.renderJumpLinks(biRewardsGrids)}
                    </Flex>
                    <Flex flexDirection='column'>
                        {biRewardsGrids.map((grid, index) => (
                            <React.Fragment key={`Rewards-grid-${index.toString()}`}>
                                <div id={grid.anchor}>
                                    <ProductList
                                        skuList={grid.items}
                                        variant={PRODUCT_LIST_VARIANTS.SMALL_GRID}
                                        isBIRBReward={true}
                                        isShortButton={true}
                                        renderBiButton={this.renderBiButton()}
                                        grouping={[
                                            PRODUCT_LIST_GROUPING.SHOW_ADD_BUTTON,
                                            PRODUCT_LIST_GROUPING.SHOW_PRICE,
                                            PRODUCT_LIST_GROUPING.SHOW_MARKETING_FLAGS
                                        ]}
                                        marginBottom={0}
                                        marginTop={0}
                                        rougeBadgeText={getText('rougeBadge')}
                                        {...grid}
                                    />

                                    <Divider
                                        marginTop={[6, null, 7]}
                                        marginBottom={[6, null, 7]}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </Flex>
                </Box>
            )
        );
    };

    renderJumpLinks = biRewardsGrids => {
        const clickHandler = (e, scrollTo, title) => {
            e.preventDefault();
            this.props.fireLinkTrackingAnalytics({
                actionInfo: `jump-link_${title}`, //prop55
                linkName: 'D=c55'
            });
            UI.scrollTo({ elementId: scrollTo });
        };

        const jumplinksTitle = input => input.replace(/(\d+)(?:-(\d+))?points/i, (match, p1, p2) => (p2 ? `${p1}+ points` : `${p1} points`));

        return (
            <div css={styles.listVariant.container}>
                <ul css={styles.listVariant.list}>
                    {biRewardsGrids.map((grid, index) => {
                        const title = jumplinksTitle(grid.anchor);

                        return (
                            <li
                                key={`jumplinks-${index.toString()}`}
                                css={styles.listVariant.chiclet}
                            >
                                <Chiclet
                                    onClick={e => clickHandler(e, grid.anchor, title)}
                                    children={title}
                                    variant='shadow'
                                    marginRight={2}
                                    minWidth={6}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    getCtaText = sku => {
        const { localization, isShowAddFullSize, basket, isInBasket } = this.props;
        const isAppExclusive = skuUtils.isAppExclusive(sku);
        const isBiExclusive = skuUtils.isBiExclusive(sku);
        const { calculateIsInBasketFlagOnChannel } = Sephora.configurationSettings;
        const isSkuInBasket = calculateIsInBasketFlagOnChannel ? skuHelpers.isInBasket(sku.skuId, basket) : isInBasket;

        if (isAppExclusive || (isBiExclusive && !skuHelpers.isBiQualify(sku))) {
            return `${skuUtils.getExclusiveText(sku)} ${localization.exclusive}`;
        }

        if (isShowAddFullSize) {
            return localization.addFullSize;
        }

        if (!isSkuInBasket) {
            return localization.addToBasketShort;
        }

        return localization.remove;
    };

    renderBiButton = () => {
        return ({ analyticsContext, sku }) => {
            return (
                <>
                    <Box
                        marginTop='auto'
                        paddingTop={3}
                    >
                        {this.props.isAnonymous ? (
                            <Button
                                variant='secondary'
                                size='sm'
                                onClick={this.signInHandler(analyticsContext)}
                            >
                                {this.props.localization.signInToAccess}
                            </Button>
                        ) : (
                            <AddToBasketButton
                                isRewardItem
                                analyticsContext={analyticsContext || anaConstants.CONTEXT.BASKET_REWARDS}
                                variant={ADD_BUTTON_TYPE.SECONDARY}
                                isAddButton={true}
                                size='sm'
                                sku={sku}
                                isBIRBReward={true}
                                onlyUseTextProp={this.getCtaText(sku)}
                                containerTitle={anaConstants.CAROUSEL_NAMES.REWARD_BAZAAR}
                            />
                        )}
                    </Box>
                </>
            );
        };
    };

    signInHandler = analyticsContext => {
        return e => {
            e.stopPropagation();
            e.preventDefault();
            digitalData.page.attributes.previousPageData.linkData = 'rewards bazaar:sign in';
            auth.requireAuthentication(
                null,
                null,
                {
                    context: analyticsContext,
                    nextPageContext: analyticsContext
                },
                null,
                false,
                HEADER_VALUE.USER_CLICK
            ).catch(() => {});
        };
    };

    renderRougeRewardsCarousel = () => {
        if (!rougeExclusiveUtils.isRougeExclusive()) {
            return null;
        }

        return (
            <>
                <Divider
                    marginTop={[6, null, 7]}
                    marginBottom={[6, null, 7]}
                />
                <LazyLoad
                    component={RougeRewardsCarousel}
                    renderBiButton={this.renderBiButton()}
                    analyticsContext={anaConstants.CONTEXT.BASKET_REWARDS}
                    scrollToAnchor
                />
            </>
        );
    };

    renderRewardsCarousels = () => {
        const { biRewardsCarrousels } = this.getBiRewards();

        return (
            !!biRewardsCarrousels &&
            biRewardsCarrousels?.length > 0 &&
            biRewardsCarrousels.map((carousel, index) => (
                <React.Fragment key={`Reward-carousel${index.toString()}`}>
                    <ProductList
                        skuList={carousel.items}
                        variant={PRODUCT_LIST_VARIANTS.SMALL_CAROUSEL}
                        isBIRBReward={true}
                        isBirthDayRewardList={carousel.isBirthDayRewardList}
                        renderBiButton={this.renderBiButton()}
                        isShortButton={true}
                        grouping={[
                            PRODUCT_LIST_GROUPING.SHOW_ADD_BUTTON,
                            PRODUCT_LIST_GROUPING.SHOW_PRICE,
                            PRODUCT_LIST_GROUPING.SHOW_MARKETING_FLAGS
                        ]}
                        marginBottom={[6, 7]}
                        marginTop={[6, 7]}
                        rougeBadgeText={getText('rougeBadge')}
                        {...carousel}
                    />
                    <Divider
                        marginTop={0}
                        marginBottom={0}
                    />
                </React.Fragment>
            ))
        );
    };
}

export default wrapComponent(LayoutRewardsBazaar, 'LayoutRewardsBazaar', true);
