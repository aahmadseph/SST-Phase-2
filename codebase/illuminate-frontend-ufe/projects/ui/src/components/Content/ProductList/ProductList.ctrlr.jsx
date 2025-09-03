/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Grid, Text, Link, Flex
} from 'components/ui';
import Action from 'components/Content/Action';
import uiUtils from 'utils/UI';
import basketUtils from 'utils/Basket';
import auth from 'utils/Authentication';
import contentConstants from 'constants/content';
import anaConsts from 'analytics/constants';
import { HEADER_VALUE } from 'constants/authentication';
import ProductListLayouts from 'components/Content/ProductListLayout';
import Markdown from 'components/Markdown/Markdown';
import Button from 'components/Button';
import AddToBasketButton from 'components/AddToBasketButton';

const {
    PRODUCT_LIST_GROUPING,
    CONTEXTS,
    COMPONENT_SPACING,
    PRODUCT_LIST_LAYOUT_VARIANTS,
    PRODUCT_LIST_CARD_SIZE_VARIANTS,
    PRODUCT_LIST_VARIANTS,
    COMPONENT_TYPES: { PRODUCT_LIST }
} = contentConstants;
const { SKELETON_TEXT } = uiUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;
const ActionLink = Action(Link);

class ProductList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            skus: props.skuList,
            title: props.title,
            targetUrl: props.action?.targetUrl,
            showSkeleton: props.showSkeleton || props.showSkeletonBDLP
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.skus !== prevProps.skus) {
            this.setState({ skus: this.props.skus });
        }

        if (this.props.skuList !== prevProps.skuList) {
            this.setState({ skus: this.props.skuList });
        }

        if (this.props.title !== prevProps.title) {
            this.setState({ title: this.props.title });
        }

        if (this.props.showSkeleton !== prevProps.showSkeleton) {
            this.setState({ showSkeleton: this.props.showSkeleton });
        }
    }

    signInHandler = analyticsContext => {
        return e => {
            e.preventDefault();
            e.stopPropagation();
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

    defaultRewardBiButton = ({ analyticsContext, sku }) => {
        const { localization, isAnonymous } = this.props;

        return (
            <Box
                marginTop='auto'
                paddingTop={3}
            >
                {isAnonymous ? (
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={this.signInHandler(analyticsContext)}
                    >
                        {localization.signInToAccess}
                    </Button>
                ) : (
                    <AddToBasketButton
                        variant={ADD_BUTTON_TYPE.SECONDARY}
                        isRewardItem={true}
                        analyticsContext={analyticsContext}
                        isAddButton={true}
                        size='sm'
                        sku={sku}
                        isBIRBReward={true}
                        containerTitle={anaConsts.CAROUSEL_NAMES.REWARD_BAZAAR}
                    />
                )}
            </Box>
        );
    };

    componentDidMount() {
        if (this.props.showSkeletonBDLP) {
            setTimeout(() => {
                this.setState({ showSkeleton: false });
            }, 1000);
        }

        if (this.props.isRewardProductList) {
            const skus = this.props.updateRougeExclusiveSkus(this.props.skuList);

            this.setState({ skus });
        }
    }

    render() {
        const {
            action,
            actionLabel,
            sid,
            grouping,
            showQuickLookOnMobile,
            ignoreTargetUrlForBox,
            context,
            localization,
            marginTop,
            marginBottom,
            variant,
            subtitle,
            podId,
            isBIRBReward,
            isAnonymous,
            isShowAddFullSize,
            isInBasket,
            renderBiButton,
            isBirthDayRewardList,
            secondSubtitle,
            titleMarginBottom,
            componentType,
            customStyles,
            customCardSize,
            analyticsContext,
            rougeBadgeText,
            showBasketGreyBackground,
            type,
            resultId,
            totalResults,
            isCarousel,
            gap,
            scrollPadding
        } = this.props;

        const showAddButton = grouping.includes(PRODUCT_LIST_GROUPING.SHOW_ADD_BUTTON);
        const showPrice = grouping.includes(PRODUCT_LIST_GROUPING.SHOW_PRICE);
        const showMarketingFlags = grouping.includes(PRODUCT_LIST_GROUPING.SHOW_MARKETING_FLAGS);
        const showRankingNumbers = grouping.includes(PRODUCT_LIST_GROUPING.SHOW_RANKING_NUMBERS);
        const showLovesButton = grouping.includes(PRODUCT_LIST_GROUPING.SHOW_LOVES_BUTTON);
        const showRatingWithCount = grouping.includes(PRODUCT_LIST_GROUPING.SHOW_RATING_WITH_TOTAL_COUNT);

        const { isMarkdownLabelsEnabled } = Sephora.configurationSettings;
        const showMarkdown = !!sid && type === PRODUCT_LIST && !!isMarkdownLabelsEnabled;

        const { skus, title, targetUrl, showSkeleton } = this.state || this.props;

        if (!showSkeleton && (!skus || skus?.length === 0)) {
            return null;
        }

        const isModal = context === CONTEXTS.MODAL;
        const ProductListLayout = ProductListLayouts[PRODUCT_LIST_LAYOUT_VARIANTS[variant]];

        return (
            <Box
                id={sid}
                marginTop={Array.isArray(customStyles?.marginTop) ? customStyles?.marginTop : marginTop}
                marginBottom={Array.isArray(customStyles?.marginBottom) ? customStyles?.marginBottom : marginBottom}
            >
                {(title || showSkeleton) && (
                    <Grid
                        alignItems='baseline'
                        columns='1fr auto'
                        lineHeight='tight'
                        gap={3}
                    >
                        <Grid
                            marginBottom={titleMarginBottom ? titleMarginBottom : isBIRBReward ? 5 : 4}
                            gap={0}
                        >
                            {isBirthDayRewardList && subtitle && (
                                <Text
                                    is='h3'
                                    fontSize={['base', 'md']}
                                    fontWeight='bold'
                                    color='gray'
                                    css={showSkeleton && [{ minWidth: 204 }, SKELETON_TEXT]}
                                    children={subtitle}
                                />
                            )}

                            {showMarkdown ? (
                                <Markdown
                                    fontSize={['md', 'lg']}
                                    fontWeight='bold'
                                    css={showSkeleton && [{ minWidth: 204 }, SKELETON_TEXT]}
                                    content={title}
                                />
                            ) : (
                                <Text
                                    is='h2'
                                    fontSize={customStyles?.title ? customStyles.title?.fontSize : ['md', 'lg']}
                                    fontWeight='bold'
                                    css={showSkeleton && [{ minWidth: 204 }, SKELETON_TEXT]}
                                    children={title}
                                />
                            )}

                            {showMarkdown ? (
                                <Markdown
                                    fontSize={['sm', 'md']}
                                    fontWeight='normal'
                                    css={showSkeleton && [{ minWidth: 204 }, SKELETON_TEXT]}
                                    content={subtitle}
                                />
                            ) : (
                                <Text
                                    is='p'
                                    fontSize={customStyles?.subtitle ? customStyles.subtitle?.fontSize : ['sm', 'md']}
                                    fontWeight='normal'
                                    css={showSkeleton && [{ minWidth: 204 }, SKELETON_TEXT]}
                                    children={!isBirthDayRewardList ? subtitle : null}
                                    dangerouslySetInnerHTML={isBirthDayRewardList && secondSubtitle ? { __html: secondSubtitle.inner } : null}
                                />
                            )}
                        </Grid>
                        {isBirthDayRewardList && (
                            <>
                                <Flex justifyContent='flex-end'>
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        color='blue'
                                        underline={true}
                                        target='_blank'
                                        href='/beauty/birthday-gift'
                                        children={localization.viewAll}
                                    />
                                </Flex>
                            </>
                        )}
                        {(action || targetUrl) && !showSkeleton && (
                            <ActionLink
                                sid={sid}
                                action={{
                                    ...action,
                                    ...targetUrl
                                }}
                                padding={2}
                                margin={-2}
                                color='blue'
                                children={actionLabel || action.title || localization.showMore}
                                analyticsNextPageData={{ linkData: `${title?.trim().toLowerCase()}:carousel:show more` }}
                            />
                        )}
                    </Grid>
                )}
                {showSkeleton || this.props.renderSubHeader?.()}
                <ProductListLayout
                    podId={podId}
                    sid={sid}
                    showSkeleton={showSkeleton}
                    isModal={isModal}
                    title={title}
                    rootContainerName={title}
                    showMarketingFlags={showMarketingFlags}
                    showRankingNumbers={showRankingNumbers}
                    showLovesButton={showLovesButton}
                    showRatingWithCount={showRatingWithCount}
                    showQuickLookOnMobile={showQuickLookOnMobile}
                    ignoreTargetUrlForBox={ignoreTargetUrlForBox}
                    skus={skus}
                    showPrice={showPrice}
                    showAddButton={showAddButton}
                    renderBiButton={renderBiButton}
                    defaultRewardBiButton={this.defaultRewardBiButton}
                    size={PRODUCT_LIST_CARD_SIZE_VARIANTS[variant]}
                    customCardSize={customCardSize}
                    isBIRBReward={isBIRBReward}
                    isAnonymous={isAnonymous}
                    isShowAddFullSize={isShowAddFullSize}
                    isInBasket={isInBasket}
                    componentType={componentType}
                    showErrorModal={true}
                    analyticsContext={analyticsContext}
                    rougeBadgeText={rougeBadgeText || localization.rougeBadgeText}
                    hideShadowsCover={showBasketGreyBackground}
                    resultId={resultId}
                    totalResults={totalResults}
                    isCarousel={isCarousel}
                    gap={gap}
                    scrollPadding={scrollPadding}
                />
            </Box>
        );
    }
}

ProductList.propTypes = {
    sid: PropTypes.string,
    componentName: PropTypes.string,
    componentType: PropTypes.number,
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]),
    enablePageRenderTracking: PropTypes.bool,
    enableTesting: PropTypes.bool,
    page: PropTypes.string,
    grouping: PropTypes.array,
    action: PropTypes.object,
    skuList: PropTypes.array,
    localization: PropTypes.object.isRequired,
    title: PropTypes.string,
    showQuickLookOnMobile: PropTypes.bool,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    variant: PropTypes.oneOf(Object.keys(PRODUCT_LIST_LAYOUT_VARIANTS))
};

ProductList.defaultProps = {
    sid: null,
    enablePageRenderTracking: false,
    showQuickLookOnMobile: false,
    grouping: [],
    marginTop: COMPONENT_SPACING.LG,
    marginBottom: COMPONENT_SPACING.LG,
    variant: PRODUCT_LIST_VARIANTS.SMALL_CAROUSEL
};

export default wrapComponent(ProductList, 'ProductList', true);
