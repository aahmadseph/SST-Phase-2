import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { DebouncedResize } from 'constants/events';

import {
    Text, Flex, Grid, Link, Container, Icon
} from 'components/ui';
import CostSummary from 'components/RwdBasket/RwdBasketLayout/CostSummary/CostSummary';
import GiftCardQuickAdd from 'components/RwdBasket/RwdBasketLayout/GiftCardQuickAdd/GiftCardQuickAdd';
import BIBenefits from 'components/RwdBasket/RwdBasketLayout/BIBenefits';
import CustomerLimitBox from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentCustomerLimitMessage/CustomerLimitBox';
import isFunction from 'utils/functions/isFunction';
import mediaUtils from 'utils/Media';
import localeUtils from 'utils/LanguageLocale';
import agentAwareUtils from 'utils/AgentAware';
import RwdBasketUtils from 'utils/RwdBasket';
import { colors, breakpoints } from 'style/config';
import DiscountLimitBox from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentCustomerLimitMessage/DiscountLimitBox';

const { Media } = mediaUtils;

const INSIDE_MAIN_COLUMN = 'insideMainColumn';
const OUTSIDE_MAIN_COLUMN = 'outsideMainColumn';
const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/locales', 'RwdBasketLayout');

function BasketSwitch({ basketSwitchLabel, onBasketSwitch, mediaQuery }) {
    return (
        <Media {...mediaQuery}>
            <Link
                color='blue'
                onClick={onBasketSwitch}
                children={basketSwitchLabel}
            />
        </Media>
    );
}

function Header({ basketSwitchLabel, goToPreBasket, onBasketSwitch }) {
    return (
        <Flex
            alignItems='baseline'
            justifyContent='space-between'
            marginBottom={4}
            flexWrap='nowrap'
        >
            <Link
                arrowPosition='before'
                arrowDirection='left'
                onClick={goToPreBasket}
                children={getText('backButton')}
            />
            <BasketSwitch
                basketSwitchLabel={basketSwitchLabel}
                onBasketSwitch={onBasketSwitch}
                mediaQuery={{ at: 'xs' }}
            />
        </Flex>
    );
}

function TopOfBasketErrors({ topOfBasketErrors }) {
    if (!topOfBasketErrors.isAvailable) {
        return null;
    }

    return (
        <Grid
            gap={2}
            minWidth={'100%'}
        >
            {topOfBasketErrors.messages.map((message, i) => (
                <Flex
                    gap={4}
                    alignItems={'flex-start'}
                    backgroundColor={colors.lightRed}
                    color={colors.red}
                    borderRadius={2}
                    padding={3}
                    lineHeight='tight'
                    data-at={Sephora.debug.dataAt(i > 0 ? `items_error_message_${i + 1}` : 'items_error_message')}
                >
                    <Icon
                        size={16}
                        name={'alert'}
                    />
                    <Text
                        fontSize={'base'}
                        display={'inline-block'}
                    >
                        {message}
                    </Text>
                </Flex>
            ))}
        </Grid>
    );
}

function MainColumn({
    cartSections,
    topContentMessageComponentList,
    messageInfo: { topOfBasketErrors },
    title,
    basketSwitchLabel,
    onBasketSwitch,
    isNavigationAvailable,
    bottomContentComponentList,
    cmsComponentListPosition,
    refreshBasketClick,
    showBasketGreyBackground,
    sedClosePromoMessages,
    promoErrorMessages
}) {
    let styledCartSections = cartSections;
    let styledTopContentMessages = topContentMessageComponentList.messages;
    let styledBottomContentMessages = bottomContentComponentList.items;

    if (showBasketGreyBackground) {
        styledCartSections = RwdBasketUtils.applyTopLevelBackground(cartSections, showBasketGreyBackground);

        if (topContentMessageComponentList.isAvailable) {
            styledTopContentMessages = RwdBasketUtils.applyTopLevelBackground(topContentMessageComponentList.messages, showBasketGreyBackground);
        }

        if (bottomContentComponentList.isAvailable) {
            styledBottomContentMessages = RwdBasketUtils.applyShowBasketGreyBackgroundToProductLists(
                bottomContentComponentList.items,
                showBasketGreyBackground
            );
        }
    }

    return (
        <Flex
            flexDirection='column'
            gap={[4, Sephora.isAgent ? 4 : 5]}
        >
            <Flex
                alignItems='baseline'
                justifyContent='space-between'
                flexWrap='nowrap'
            >
                <Text
                    is='h2'
                    fontSize={['lg', 'xl']}
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('basket_header')}
                    children={title}
                />
                {isNavigationAvailable && (
                    <BasketSwitch
                        basketSwitchLabel={basketSwitchLabel}
                        onBasketSwitch={onBasketSwitch}
                        mediaQuery={{ greaterThan: 'xs' }}
                    />
                )}
            </Flex>
            {Sephora.isAgent && (
                <div
                    style={{ display: 'none' }}
                    className={agentAwareUtils.applyShowAgentAwareClass()}
                >
                    <div
                        id='agent-aware-basket-search'
                        style={{ width: '100%' }}
                    ></div>
                    <button
                        id='agent-aware-refresh-basket'
                        style={{ display: 'none' }}
                        onClick={refreshBasketClick}
                    />
                </div>
            )}

            {(topOfBasketErrors.isAvailable || topContentMessageComponentList.isAvailable) && (
                <Flex
                    gap={2}
                    flexDirection={'column'}
                    alignItems={'flex-start'}
                >
                    {sedClosePromoMessages && <CustomerLimitBox error={sedClosePromoMessages} />}

                    {promoErrorMessages && promoErrorMessages?.errorMessages?.length > 0 && <DiscountLimitBox error={promoErrorMessages} />}

                    <TopOfBasketErrors topOfBasketErrors={topOfBasketErrors} />
                    {topContentMessageComponentList.isAvailable && <>{styledTopContentMessages}</>}
                </Flex>
            )}
            {styledCartSections}
            {bottomContentComponentList.isAvailable && cmsComponentListPosition === INSIDE_MAIN_COLUMN && styledBottomContentMessages}
        </Flex>
    );
}

function SecondaryColumn({
    paymentInfo,
    addMarginTop,
    biBenefitsInfo,
    giftCardInfo,
    onBasketSwitch,
    swapGiftCardBiBenefitBasket,
    showBasketGreyBackground,
    basketType, //TS-3142 - showApplyPointsForBazaarItems
    toggleCostSummary,
    costSummaryCollapsed,
    isSmallView
}) {
    const isEmptyBasket = paymentInfo.totalItems === 0;
    const summaryDropdownDisplay = localeUtils.isCanada() && !isSmallView && !isEmptyBasket;
    const summaryDoubleDisplay = localeUtils.isUS() && !isSmallView && !isEmptyBasket;

    return (
        <Flex
            flexDirection='column'
            gap={[4, 5]}
            marginTop={[null, null, null, addMarginTop && 2]}
        >
            <CostSummary
                paymentInfo={paymentInfo}
                showBasketGreyBackground={showBasketGreyBackground}
                summaryDropdownDisplay={summaryDropdownDisplay}
                summaryDoubleDisplay={summaryDoubleDisplay}
                {...(summaryDoubleDisplay && {
                    summaryDoubleDisplay: true,
                    hideSummary: true
                })}
                {...(summaryDropdownDisplay && {
                    toggleCostSummary,
                    costSummaryCollapsed,
                    summaryDropdownDisplay
                })}
                {...(showBasketGreyBackground && { backgroundColor: colors.white })}
            />
            {giftCardInfo.isAvailable && (
                <GiftCardQuickAdd
                    order={swapGiftCardBiBenefitBasket ? [2] : [1, 2]}
                    showBasketGreyBackground={showBasketGreyBackground}
                    {...(showBasketGreyBackground && { backgroundColor: colors.white })}
                />
            )}
            <BIBenefits
                biBenefitsInfo={biBenefitsInfo}
                onBasketSwitch={onBasketSwitch}
                {...(swapGiftCardBiBenefitBasket && { order: [1] })}
                showBasketGreyBackground={showBasketGreyBackground}
                {...(showBasketGreyBackground && { backgroundColor: colors.white, ...altStyles.boxShadow })}
                basketType={basketType} //TS-3142 - showApplyPointsForBazaarItems
            />
            {summaryDoubleDisplay && (
                <CostSummary
                    paymentInfo={paymentInfo}
                    showBasketGreyBackground={showBasketGreyBackground}
                    {...(summaryDoubleDisplay && {
                        hideCheckoutButton: true,
                        summaryDoubleDisplay: true
                    })}
                    {...(showBasketGreyBackground && { backgroundColor: colors.white })}
                />
            )}
        </Flex>
    );
}

class RwdBasketLayout extends BaseClass {
    state = {
        cmsComponentListPosition: null,
        costSummaryCollapsed: true,
        isSmallView: null
    };

    calculateCMSComponentListPosition = () => {
        const isLG = window.matchMedia(breakpoints.lgMin).matches;

        this.setState({
            cmsComponentListPosition: isLG ? OUTSIDE_MAIN_COLUMN : INSIDE_MAIN_COLUMN
        });
    };

    componentWillMount() {
        this.handleResize();
    }

    componentDidMount() {
        this.calculateCMSComponentListPosition();

        window.addEventListener(DebouncedResize, this.calculateCMSComponentListPosition);
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    toggleCostSummary = () => {
        this.setState({ costSummaryCollapsed: false });
    };

    handleResize = () => {
        const showSmallView = window.matchMedia(breakpoints.smMax).matches;

        if (this.state.isSmallView !== showSmallView) {
            this.setState({ isSmallView: showSmallView });
        }
    };

    render = () => {
        const {
            title,
            basketSwitchLabel,
            onBasketSwitch,
            goToPreBasket,
            cartSections,
            paymentInfo,
            messageInfo,
            biBenefitsInfo,
            giftCardInfo,
            topContentMessageComponentList,
            bottomContentComponentList,
            refreshBasketClick,
            swapGiftCardBiBenefitBasket,
            showBasketGreyBackground,
            sedClosePromoMessages,
            promoErrorMessages,
            basketType, //TS-3142 - showApplyPointsForBazaarItems
            showMoveBasketCheckoutButton
        } = this.props;

        const isNavigationAvailable = isFunction(onBasketSwitch) && isFunction(goToPreBasket);
        window.dispatchEvent(new CustomEvent('AgentAwareContainerRendered', { detail: { id: 'agent-aware-basket-search' } }));

        return (
            <Container
                paddingX={0}
                paddingTop={4}
                {...(showBasketGreyBackground && { css: altStylesGreyBackground })}
            >
                {isNavigationAvailable && (
                    <Header
                        basketSwitchLabel={basketSwitchLabel}
                        goToPreBasket={goToPreBasket}
                        onBasketSwitch={onBasketSwitch}
                    />
                )}
                <Grid
                    columns={[null, null, null, 'auto 400px']}
                    gap={[4, 5]}
                >
                    <MainColumn
                        cartSections={cartSections}
                        title={title}
                        basketSwitchLabel={basketSwitchLabel}
                        onBasketSwitch={onBasketSwitch}
                        messageInfo={messageInfo}
                        topContentMessageComponentList={topContentMessageComponentList}
                        isNavigationAvailable={isNavigationAvailable}
                        bottomContentComponentList={bottomContentComponentList}
                        cmsComponentListPosition={this.state.cmsComponentListPosition}
                        refreshBasketClick={refreshBasketClick}
                        showBasketGreyBackground={showBasketGreyBackground}
                        sedClosePromoMessages={sedClosePromoMessages}
                        promoErrorMessages={promoErrorMessages}
                    />
                    <SecondaryColumn
                        paymentInfo={paymentInfo}
                        addMarginTop={!isNavigationAvailable}
                        biBenefitsInfo={biBenefitsInfo}
                        giftCardInfo={giftCardInfo}
                        onBasketSwitch={onBasketSwitch}
                        swapGiftCardBiBenefitBasket={swapGiftCardBiBenefitBasket}
                        showBasketGreyBackground={showBasketGreyBackground}
                        basketType={basketType} //TS-3142 - showApplyPointsForBazaarItems
                        showMoveBasketCheckoutButton={showMoveBasketCheckoutButton}
                        isSmallView={this.state.isSmallView}
                        toggleCostSummary={this.toggleCostSummary}
                        costSummaryCollapsed={this.state.costSummaryCollapsed}
                    />
                </Grid>
                {bottomContentComponentList.isAvailable &&
                    this.state.cmsComponentListPosition === OUTSIDE_MAIN_COLUMN &&
                    bottomContentComponentList.items}
            </Container>
        );
    };
}

const altStyles = {
    boxShadow: {
        boxShadow: 'light'
    }
};

const altStylesGreyBackground = {
    '&::before': {
        content: '\'\'',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: colors.nearWhite,
        zIndex: -1
    }
};

export default wrapComponent(RwdBasketLayout, 'RwdBasketLayout', true);
