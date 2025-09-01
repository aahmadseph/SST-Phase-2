/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Image, Text, Flex, Box, Icon, Divider, Link
} from 'components/ui';
import { space, modal } from 'style/config';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import termsOfUseConstants from 'constants/TermsOfUse';
import Reward from 'components/CreditCard/Rewards/Reward';
import RewardSection from 'components/Reward/RewardSection/RewardSection';
import OrderUtils from 'utils/Order';
import basketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import actions from 'Actions';
import TermsAndConditionsActions from 'actions/TermsAndConditionsActions';
import userUtils from 'utils/User';
import promoUtils from 'utils/Promos';
import basketConstants from 'constants/Basket';
import BCC from 'utils/BCC';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import rewardsBindings from 'analytics/bindingMethods/components/rewards/RewardsBindings';
import { globalModals, renderModal } from 'utils/globalModals';

const { TERMS_OF_SERVICE } = globalModals;
const { SEPHORA_CARD_EXCLUSIONS, CLICK_HERE_FOR_DETAILS } = termsOfUseConstants;
const { CONTEXT } = basketConstants;

class RewardList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            creditCardPromoDetails: null,
            isFirstPurchaseDiscountApplied: false,
            isDisabled: false,
            rewardCertificates: [],
            rewardsToShow: [],
            currentPage: 0,
            basketSubTotal: '',
            basketRawSubTotal: '',
            appliedRewards: [],
            appliedRewardsTotal: 0,
            availableRewardsTotal: 0,
            showRewardList: false, // isExpanded
            errorMessage: null,
            hasError: false,
            isMaxCCRewardsLimitReached: false,
            toggledByUser: false
        };
        this.NUMBER_OF_REWARDS_TO_SHOW = this.props.isModal ? Number.MAX_SAFE_INTEGER : 3;
    }

    componentDidMount() {
        store.setAndWatch('user', this, value => {
            this.setCreditCardRewards(value);
        });

        store.setAndWatch('order.orderDetails', this, value => {
            this.setCreditCardRewards(value);
        });

        store.setAndWatch('basket', this, value => {
            this.setCreditCardRewards(value);
            const basket = basketUtils.getCurrentBasketData({ basket: value.basket });
            const basketLevelMessages = basket.basketLevelMessages || [];
            const rwRemainingBalanceWarning = basketLevelMessages.filter(message => message.messageContext === CONTEXT.RW_REMAINING_BALANCE);

            rwRemainingBalanceWarning.length > 0 ? this.setErrorMessage(rwRemainingBalanceWarning[0].messages) : this.setState({ hasError: false });
        });

        store.setAndWatch('promo', this, value => {
            const error = promoUtils.extractError(value.promo, [promoUtils.CTA_TYPES.CCR]);
            error && error.errorMessages && error.errorMessages.length
                ? this.setErrorMessage(error.errorMessages)
                : this.setState({ hasError: false });
        });
    }

    setCreditCardRewards = ({ basket = {}, user = {} }) => {
        const bankRewards = user.ccRewards?.bankRewards || userUtils.getBankRewards();
        let basketData = basketUtils.getCurrentBasketData({ basket });
        const appliedRewards = promoUtils.getAppliedPromotions(promoUtils.PROMO_TYPES.CCR);
        const creditCardPromoDetails = promoUtils.getCCPromoDetails();

        const isFirstPurchaseDiscountApplied =
            creditCardPromoDetails && appliedRewards.some(reward => reward.couponCode === promoUtils.FIRST_INCENTIVE_DISCOUNT);

        const rewardCertificates = this.addStatusAndSort(bankRewards, appliedRewards);

        creditCardPromoDetails &&
            rewardCertificates.unshift({
                ...creditCardPromoDetails,
                isFirstPurchaseDiscount: true,
                isApplied: !!isFirstPurchaseDiscountApplied,
                certificateNumber: creditCardPromoDetails.creditCardCouponCode,
                rewardAmount: 0
            });

        if (basketData.subtotal === undefined) {
            basketData = basketUtils.getCurrentBasketData();
        }

        const basketSubTotal = basketData.subtotal;
        const basketRawSubTotal = basketData.rawSubTotal;

        const isMaxCCRewardsLimitReached = basketData.isMaxCCRewardsLimitReached || false;

        const rewardsToShow =
            rewardCertificates.length && this.props.isCarousel
                ? rewardCertificates
                : rewardCertificates.slice(0, this.NUMBER_OF_REWARDS_TO_SHOW) || [];

        const appliedRewardsTotal = this.addAppliedRewards(rewardCertificates);
        const availableRewardsTotal = userUtils.getRewardsAmount(bankRewards) - appliedRewardsTotal;

        this.setState({
            creditCardPromoDetails,
            isFirstPurchaseDiscountApplied,
            rewardCertificates,
            rewardsToShow,
            appliedRewards,
            appliedRewardsTotal,
            availableRewardsTotal,
            basketSubTotal,
            basketRawSubTotal,
            currentPage: 0,
            isMaxCCRewardsLimitReached
        });
    };

    addStatusAndSort = (bankRewards = {}, appliedRewards = []) => {
        return (
            (bankRewards.rewardCertificates &&
                bankRewards.rewardCertificates
                    .map(reward => {
                        const newReward = Object.assign({}, reward);
                        appliedRewards.forEach(appliedReward => {
                            if (reward.certificateNumber.toLowerCase() === appliedReward.couponCode.toLowerCase()) {
                                newReward.isApplied = true;
                            }

                            return newReward;
                        });

                        return newReward;
                    })
                    .sort((a, b) => (a.isApplied === b.isApplied ? 0 : a.isApplied ? -1 : 1))) ||
            []
        );
    };

    addAppliedRewards = rewardCertificates => {
        return rewardCertificates.reduce((total, amount) => {
            if (amount.isApplied) {
                return total + amount.rewardAmount;
            }

            return total;
        }, 0);
    };

    setErrorMessage = errorMessages => {
        const errorMessage = errorMessages.join('.');
        errorMessage &&
            this.setState({
                errorMessage,
                hasError: true,
                showRewardList: true
            });
    };

    showMore = () => {
        const { currentPage, rewardCertificates } = this.state;

        this.setState({
            rewardsToShow: rewardCertificates.slice(0, this.NUMBER_OF_REWARDS_TO_SHOW * (currentPage + 2)),
            currentPage: currentPage + 1
        });
    };

    showLess = () => {
        this.setState({
            rewardsToShow: this.state.rewardCertificates.slice(0, this.NUMBER_OF_REWARDS_TO_SHOW),
            currentPage: 0
        });
    };

    applyToBasket = certificateNumber => {
        rewardsBindings.applyCreditCardRewards({ promoId: certificateNumber });
        this.setState({ hasError: false }, () => promoUtils.applyPromo(certificateNumber.toLowerCase(), null, promoUtils.CTA_TYPES.CCR));
    };

    removeFromBasket = certificateNumber => {
        promoUtils.removePromo(certificateNumber.toLowerCase(), promoUtils.CTA_TYPES.CCR);
        this.setState({ hasError: false });
    };

    openMediaModal = () => {
        renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
            const mediaId = BCC.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS;
            store.dispatch(TermsAndConditionsActions.showModal(true, mediaId, ''));
        });
    };

    fireAnalytics = () => {
        const { CREDIT_CARD_REWARDS } = anaConsts.PAGE_DETAIL;
        const { BASKET } = anaConsts.PAGE_TYPES;
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${BASKET}:${CREDIT_CARD_REWARDS}:n/a:*`,
                pageType: BASKET,
                pageDetail: CREDIT_CARD_REWARDS
            }
        });
    };

    expandRewardSection = isOpen => {
        const onExpand = this.props.onExpand;
        isOpen && onExpand && onExpand();
        this.setState({
            showRewardList: isOpen,
            toggledByUser: true
        });
    };

    openModal = () => {
        store.dispatch(actions.showApplyRewardsModal(true, promoUtils.PROMO_TYPES.CCR));
        this.fireAnalytics();
    };

    handleGotItClick = () => {
        this.setState({ hasError: false });
    };

    handleShowMoreClick = showMore => () => {
        showMore ? this.showMore() : this.showLess();
    };

    renderDisabledMessage = getText => {
        const basketLevelRWMessage = OrderUtils.getBasketLevelRewardMessage();
        const paymentError = basketLevelRWMessage ? basketLevelRWMessage : getText('paymentMethodErrorMessage');

        return this.props.isDisabled ? (
            <Flex
                lineHeight='tight'
                backgroundColor='nearWhite'
                marginY={3}
                paddingX={3}
                paddingY={2}
                borderRadius={2}
            >
                <Icon
                    name='alert'
                    color='midGray'
                    marginRight={2}
                    size={18}
                />
                <Text
                    is='p'
                    color='red'
                    flex={1}
                    alignSelf='center'
                >
                    {paymentError}
                </Text>
            </Flex>
        ) : null;
    };

    renderErrorMessage = getText => {
        return (
            <Flex
                role='alert'
                lineHeight='tight'
                backgroundColor='nearWhite'
                marginY={3}
                paddingX={3}
                paddingY={2}
                borderRadius={2}
            >
                <Icon
                    name='alert'
                    color='midGray'
                    marginRight={2}
                    size={18}
                />
                <Text
                    is='p'
                    flex={1}
                    alignSelf='center'
                >
                    {this.state.errorMessage}{' '}
                    <Link
                        color='blue'
                        underline={true}
                        onClick={this.handleGotItClick}
                        children={getText('gotIt')}
                    ></Link>
                </Text>
            </Flex>
        );
    };

    renderAsList = getText => {
        const {
            rewardCertificates, rewardsToShow, basketSubTotal, currentPage, hasError, isMaxCCRewardsLimitReached
        } = this.state;

        const basketSubTotalInt = basketSubTotal ? Number(basketUtils.removeCurrency(basketSubTotal)) : 0;

        const { isDisabled, isModal } = this.props;

        const totalRewards = rewardCertificates.length;
        const showMore = (currentPage + 1) * this.NUMBER_OF_REWARDS_TO_SHOW < totalRewards;
        const showLess = totalRewards > this.NUMBER_OF_REWARDS_TO_SHOW && !showMore;

        const divider = <Divider marginY={3} />;

        return (
            <React.Fragment>
                {this.renderDisabledMessage(getText)}
                {isModal && (
                    <Divider
                        marginX={modal.outdentX}
                        marginBottom={3}
                    />
                )}
                {rewardsToShow.map(
                    option =>
                        (option.isFirstPurchaseDiscount || option.isApplied) && (
                            <React.Fragment key={option.certificateNumber}>
                                <Reward
                                    applyToBasket={this.applyToBasket}
                                    removeFromBasket={this.removeFromBasket}
                                    basketSubTotal={basketSubTotalInt}
                                    option={option}
                                    isDisabled={isDisabled}
                                />
                                {divider}
                            </React.Fragment>
                        )
                )}

                {hasError && this.renderErrorMessage(getText)}

                {rewardsToShow.map(
                    option =>
                        !option.isFirstPurchaseDiscount &&
                        !option.isApplied && (
                            <React.Fragment key={option.certificateNumber}>
                                <Reward
                                    applyToBasket={this.applyToBasket}
                                    removeFromBasket={this.removeFromBasket}
                                    basketSubTotal={basketSubTotalInt}
                                    isDisabled={isDisabled}
                                    isMaxCCRewardsLimitReached={isMaxCCRewardsLimitReached}
                                    option={option}
                                />
                                {divider}
                            </React.Fragment>
                        )
                )}

                {isModal || this.renderTermsText()}

                {(showMore || showLess) && (
                    <React.Fragment>
                        {divider}
                        <Link
                            paddingY={2}
                            marginY={-2}
                            onClick={this.handleShowMoreClick(showMore)}
                            display='block'
                            textAlign='center'
                            width='100%'
                            arrowDirection={showMore ? 'down' : 'up'}
                            children={getText(showMore ? 'showMore' : 'showLess')}
                        />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    };

    getSubtotalLine = getText => {
        const { basketSubTotal, basketRawSubTotal } = this.state;

        const isDiscountedTotal = basketRawSubTotal && basketRawSubTotal !== basketSubTotal;

        return (
            <LegacyGrid
                gutter={2}
                alignItems='baseline'
                fontWeight='bold'
            >
                <LegacyGrid.Cell
                    width='fill'
                    children={getText('orderSubtotal')}
                />
                {isDiscountedTotal && (
                    <LegacyGrid.Cell
                        width='fit'
                        fontWeight='normal'
                        color='gray'
                        css={{ textDecoration: 'line-through' }}
                    >
                        {basketRawSubTotal}
                    </LegacyGrid.Cell>
                )}
                <LegacyGrid.Cell width='fit'>{basketSubTotal || ''}</LegacyGrid.Cell>
            </LegacyGrid>
        );
    };

    renderTermsText = () => {
        const isModal = this.props.isModal;

        return (
            <Text
                is='p'
                {...(isModal
                    ? {
                        marginTop: 'auto',
                        paddingTop: 5,
                        paddingBottom: 3,
                        fontSize: 'sm',
                        color: 'gray'
                    }
                    : {
                        fontSize: 'xs',
                        textAlign: 'center'
                    })}
            >
                {`${SEPHORA_CARD_EXCLUSIONS} `}
                <Link
                    onClick={this.openMediaModal}
                    color='blue'
                    underline={true}
                    children={CLICK_HERE_FOR_DETAILS}
                />
            </Text>
        );
    };

    renderAsCarousel = getText => {
        const {
            rewardsToShow, basketSubTotal, errorMessage, hasError, isMaxCCRewardsLimitReached
        } = this.state;

        const { isDisabled } = this.props;

        const PAYMENT_METHOD_ERROR = getText('paymentMethodErrorMessage');

        const displayCount = 3;
        const isCCPaymentMethodError = errorMessage === PAYMENT_METHOD_ERROR;
        const basketSubTotalInt = basketSubTotal ? Number(basketUtils.removeCurrency(basketSubTotal)) : 0;

        return (
            <React.Fragment>
                <Divider marginBottom={4} />
                {this.renderDisabledMessage(getText)}
                <LegacyCarousel
                    gutter={space[4]}
                    displayCount={displayCount}
                    totalItems={rewardsToShow.length}
                    showArrows={rewardsToShow.length > displayCount}
                    showTouts={true}
                >
                    {rewardsToShow.map(option => (
                        <Reward
                            key={option.certificateNumber}
                            applyToBasket={this.applyToBasket}
                            removeFromBasket={this.removeFromBasket}
                            basketSubTotal={basketSubTotalInt}
                            isMaxCCRewardsLimitReached={isMaxCCRewardsLimitReached}
                            option={option}
                            isCarousel={true}
                            isDisabled={isDisabled}
                        />
                    ))}
                </LegacyCarousel>

                {hasError && !isCCPaymentMethodError && this.renderErrorMessage(getText)}

                <Text
                    is='p'
                    marginTop={4}
                    fontSize='sm'
                    textAlign='center'
                >
                    {`${SEPHORA_CARD_EXCLUSIONS} `}
                    <Link
                        onClick={this.openMediaModal}
                        color='blue'
                        underline={true}
                        children={CLICK_HERE_FOR_DETAILS}
                    />
                </Text>
            </React.Fragment>
        );
    };

    renderIndicatiors = getText => {
        const { isCarousel, isModal } = this.props;

        const { creditCardPromoDetails, isFirstPurchaseDiscountApplied, availableRewardsTotal, appliedRewardsTotal } = this.state;

        const isMobile = Sephora.isMobile();
        const separator = isMobile ? ' · ' : isCarousel ? ', ' : <br />;
        const indicators = [];

        if (creditCardPromoDetails) {
            indicators.push([creditCardPromoDetails.shortDisplayName, getText(isFirstPurchaseDiscountApplied ? 'applied' : 'available')]);
        }

        if (appliedRewardsTotal > 0) {
            indicators.push([localeUtils.getFormattedPrice(appliedRewardsTotal, false, false), getText('applied')]);
        }

        /* show availableRewardsTotal only if nothing was applied OR for modal */
        const isAvailableRewardsVisible = isModal || !appliedRewardsTotal;

        if (availableRewardsTotal > 0 && isAvailableRewardsVisible) {
            indicators.push([localeUtils.getFormattedPrice(availableRewardsTotal, false, false), getText('available')]);
        }

        return indicators.length > 0 ? (
            <Box
                display={isCarousel ? 'inline' : null}
                fontSize={isMobile || isCarousel ? 'base' : 'sm'}
            >
                {indicators.map((indicator, index) => (
                    <React.Fragment key={index.toString()}>
                        {index > 0 && separator}
                        <b>{indicator[0]}</b> {indicator[1]}
                    </React.Fragment>
                ))}
            </Box>
        ) : null;
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/CreditCard/Rewards/locales', 'RewardList');

        const {
            isHeaderOnly,
            isBodyOnly,
            isCollapsible,
            isCheckout,
            isCarousel,
            forceCollapse,
            isModal,
            onExpand,
            isDisabled,
            availableBiPoints,
            ...props
        } = this.props;

        /* eslint-disable prefer-const */
        let { rewardsToShow, showRewardList, appliedRewards, toggledByUser } = this.state;
        /* eslint-enable prefer-const */

        const hasRewardBox = rewardsToShow.length > 0;

        // collapsed by parent component
        if (forceCollapse) {
            showRewardList = false;
        } else {
            const expandedIfAppliedOnBasket = isCheckout && appliedRewards.length > 0 && !toggledByUser;

            if (expandedIfAppliedOnBasket) {
                showRewardList = true;
            }
        }

        const headContent = (
            <React.Fragment>
                <Text
                    className={isCollapsible ? 'Collapse-target' : ''}
                    fontSize={isModal ? 'md' : 'base'}
                    fontWeight='bold'
                >
                    {getText('applyRewards')}
                </Text>
                {isCarousel && ': '}
                {this.renderIndicatiors(getText)}
            </React.Fragment>
        );

        const [imgW, imgH] = isCheckout || isModal ? [38, 32] : [32, 27];
        const headImage = (
            <Image
                marginX='auto'
                display='block'
                width={imgW}
                height={imgH}
                marginBottom={isModal && 2}
                src='/img/ufe/credit-card/front-back.svg'
            />
        );

        return hasRewardBox ? (
            <RewardSection
                isCollapsible={isCollapsible}
                isExpanded={showRewardList}
                isHeaderOnly={isHeaderOnly}
                isBodyOnly={isBodyOnly}
                headContent={headContent}
                headImage={headImage}
                isCarousel={isCarousel}
                data-at={Sephora.debug.dataAt('cc_reward_block')}
                availableBiPoints={availableBiPoints}
                onHeadClick={isModal ? null : isHeaderOnly ? this.openModal : this.expandRewardSection}
                {...props}
            >
                {isHeaderOnly || (isCarousel ? this.renderAsCarousel(getText) : this.renderAsList(getText))}
                {isModal && (
                    <React.Fragment>
                        {this.getSubtotalLine(getText)}
                        {this.renderTermsText()}
                    </React.Fragment>
                )}
            </RewardSection>
        ) : null;
    }
}

export default wrapComponent(RewardList, 'RewardList', true);
