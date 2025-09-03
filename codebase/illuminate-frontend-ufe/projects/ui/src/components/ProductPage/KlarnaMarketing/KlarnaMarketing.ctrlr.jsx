import React from 'react';
import store from 'store/Store';
import Actions from 'actions/Actions';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import skuUtils from 'utils/Sku';
import { Text, Image, Link } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import klarnaUtils from 'utils/Klarna';
import orderUtils from 'utils/Order';
import helpersUtils from 'utils/Helpers';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import productPageSOTBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';
import { UserInfoReady } from 'constants/events';
import { PAYMENT_METHODS } from 'constants/PaymentMethods';
import skuHelpers from 'utils/skuHelpers';
import { colors, radii, space } from 'style/config';
import Markdown from 'components/Markdown/Markdown';

const { KLARNA, AFTERPAY, PAYPAL } = PAYMENT_METHODS;

const getText = localeUtils.getLocaleResourceFile('components/Klarna/locales', 'Klarna');
const { getProp, deferTaskExecution } = helpersUtils;

class KlarnaMarketing extends BaseClass {
    state = {
        showCreditCardOffer: false
    };

    // Pre-bind modal handler to avoid creating function instances on render
    constructor(props) {
        super(props);
        // Create bound methods once to avoid recreating functions on every render
        this.infoButtonClickHandlers = {};
        this.linkClickHandler = null;
    }

    triggerAsyncPageLoadEvent = () => {
        const { showCreditCardOffer } = this.state;
        const { analyticsContext, isAfterpayEnabled, isKlarnaEnabled } = this.props;
        const contextEvent = analyticsContext ? anaUtils.getLastAsyncPageLoadData({ pageType: analyticsContext }) : {};
        const pageType = anaConsts.PAGE_TYPES.PRODUCT;
        const pageDetail = showCreditCardOffer
            ? anaConsts.PAGE_DETAIL.SEPHORA_CC_INFO
            : klarnaUtils.getPageDetail(isAfterpayEnabled, isKlarnaEnabled);

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageType,
                pageDetail,
                previousPageName: contextEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName')
            }
        });
    };

    // Get (or create) a memoized click handler for a payment method
    getClickHandlerFor = (paymentMethod, installmentValue, totalAmount) => {
        const key = `${paymentMethod}_${installmentValue}_${totalAmount}`;

        if (!this.infoButtonClickHandlers[key]) {
            this.infoButtonClickHandlers[key] = () => {
                this.showModal(installmentValue, totalAmount, paymentMethod);
            };
        }

        return this.infoButtonClickHandlers[key];
    };

    // Handle link click without creating inline function in render
    getLinkClickHandler = (installmentValue, totalAmount) => {
        if (!this.linkClickHandler) {
            this.linkClickHandler = () => this.showModal(installmentValue, totalAmount);
        }

        return this.linkClickHandler;
    };

    showModal = (installmentValue, totalAmount, selectedPaymentMethod) => {
        const { showCreditCardOffer } = this.state;
        const { isAfterpayEnabled, isKlarnaEnabled, isPayPalPayLaterEligibleEnabled } = this.props;

        // Show the modal immediately - this is the critical UI update
        if (showCreditCardOffer) {
            store.dispatch(Actions.showCreditCardOfferModal({ isOpen: true }));
        } else {
            store.dispatch(
                Actions.showBuyNowPayLaterModal({
                    isOpen: true,
                    installmentValue,
                    totalAmount,
                    isAfterpayEnabled,
                    isKlarnaEnabled,
                    selectedPaymentMethod,
                    isPayPalPayLaterEligibleEnabled
                })
            );
        }

        // Defer non-critical operations to avoid blocking the main thread
        // This ensures the modal appears immediately (< 200ms)
        deferTaskExecution(() => {
            this.triggerAsyncPageLoadEvent();
            productPageSOTBindings.seeDetails();
        });
    };

    buildMessage = showCreditCardOffer => {
        const [installmentValue] = skuHelpers.getInstallmentValue(this.props.sku);

        const offerTextKey = showCreditCardOffer ? 'testCardDiscount' : 'installmentsWithAfterpayAndKlarna';

        const reducedAmount = showCreditCardOffer ? this.state.discountValue : [installmentValue.replace(' ', '&nbsp;')];

        let klarnaInfoMessageHtml = getText(offerTextKey, reducedAmount);

        if (offerTextKey === 'installmentsWithAfterpayAndKlarna') {
            klarnaInfoMessageHtml = getText('boldInstallmentsWithAfterpayAndKlarna', reducedAmount);

            return (
                <Markdown
                    is={'div'}
                    content={klarnaInfoMessageHtml}
                    css={styles.paymentsBadge}
                    data-at={Sephora.debug.dataAt('klarna_info_message')}
                />
            );
        }

        return (
            <Text
                color={showCreditCardOffer && 'gray'}
                data-at={Sephora.debug.dataAt('klarna_info_message')}
                dangerouslySetInnerHTML={{ __html: klarnaInfoMessageHtml }}
            />
        );
    };

    /* eslint-disable-next-line complexity */
    render() {
        // Productionalize only for US and small UI according to CRMTS-170
        const [installmentValue, totalAmount] = skuHelpers.getInstallmentValue(this.props.sku);

        if (!installmentValue) {
            return null;
        }

        const { showCreditCardOffer } = this.state;

        const {
            isAfterpayEnabled,
            isKlarnaEnabled,
            isPayPalPayLaterEligibleEnabled,
            summaryDropdownDisplay,
            summaryDoubleDisplay,
            showHighlightBnplOnPdp,
            displayBnplAsContents
        } = this.props;

        const infoButton = paymentMethod => (
            <InfoButton
                size={14}
                aria-label={getText('learnMore')}
                onClick={this.getClickHandlerFor(paymentMethod, installmentValue, totalAmount)}
                data-at={Sephora.debug.dataAt('info_icon')}
            />
        );

        const paymentLogos = {
            klarnaLogo: (
                <>
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/logo-klarna.svg'
                        alt='Klarna'
                        width={42}
                        height={10}
                        css={{
                            position: 'relative'
                        }}
                    />{' '}
                    {infoButton(KLARNA)}
                </>
            ),
            afterpayLogo: localeUtils.isCanada() ? (
                <>
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/logo-afterpay.svg'
                        alt='afterpay'
                        width={66}
                        height={12}
                        css={{
                            position: 'relative',
                            top: 3
                        }}
                    />{' '}
                    {infoButton(AFTERPAY)}
                </>
            ) : (
                <>
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/logo-afterpay-us.svg'
                        alt='afterpay'
                        width={66}
                        height={16.25}
                        css={{
                            position: 'relative',
                            top: 3
                        }}
                    />{' '}
                    {infoButton(AFTERPAY)}
                </>
            ),
            paypalLogo: (
                <>
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/logo-paypal.svg'
                        alt='paypal'
                        width={53}
                        height={15}
                        css={{
                            position: 'relative',
                            top: 3
                        }}
                    />{' '}
                    {infoButton(PAYPAL)}
                </>
            )
        };

        const [firstPaymentLogo, secondPaymentLogo, thirdPaymentLogo] = orderUtils.getAvailablePaymentLogos(
            isAfterpayEnabled,
            isKlarnaEnabled,
            isPayPalPayLaterEligibleEnabled
        );

        const isDisplayContents = !displayBnplAsContents;

        return (
            <Text
                fontSize='sm'
                data-at={Sephora.debug.dataAt('klarna_info_block')}
                // prevent flashing of different messages until we get this boolean
                style={isKlarnaEnabled === undefined ? { visibility: 'hidden' } : null}
                {...(isDisplayContents && { display: 'contents' })}
            >
                {this.buildMessage(showCreditCardOffer)}{' '}
                {showCreditCardOffer && (
                    <Link
                        color='blue'
                        underline={true}
                        onClick={this.getLinkClickHandler(installmentValue, totalAmount)}
                        children={getText('testSeeDetails')}
                    />
                )}
                {!showCreditCardOffer && firstPaymentLogo ? (
                    <>
                        {paymentLogos[firstPaymentLogo]}
                        <span css={!summaryDropdownDisplay && !summaryDoubleDisplay && !showHighlightBnplOnPdp && { whiteSpace: 'nowrap' }}>
                            {secondPaymentLogo && (
                                <>
                                    {` ${getText('or')} `}
                                    {paymentLogos[secondPaymentLogo]}
                                </>
                            )}
                        </span>
                        {thirdPaymentLogo && (
                            <span css={!summaryDropdownDisplay && !summaryDoubleDisplay && !showHighlightBnplOnPdp && { whiteSpace: 'nowrap' }}>
                                {thirdPaymentLogo && (
                                    <>
                                        {` ${getText('or')} `}
                                        {paymentLogos[thirdPaymentLogo]}
                                    </>
                                )}
                            </span>
                        )}
                    </>
                ) : null}
            </Text>
        );
    }

    shouldShowCreditCardMessaging = updatedProps => {
        const { isSmallView } = this.props;
        const updatedIsSmallView = updatedProps ? updatedProps.isSmallView : isSmallView;
        const userAudience = (updatedIsSmallView && userUtils.isRouge()) || (!updatedIsSmallView && userUtils.isUserAtleastRecognized());

        this.setState({
            showCreditCardOffer: localeUtils.isUS() && userAudience && !userUtils.isSephoraCreditCardHolder()
        });
    };

    componentWillReceiveProps(updatedProps) {
        const { isSmallView } = this.props;

        if (isSmallView !== updatedProps?.isSmallView) {
            this.shouldShowCreditCardMessaging(updatedProps);
        }
    }

    componentDidMount() {
        skuUtils.getDiscountValue(this.props.sku).then(discountValue => {
            this.setState({ discountValue });
        });

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            store.setAndWatch('user', this, () => {
                this.shouldShowCreditCardMessaging();
            });
        });
    }
}

const styles = {
    paymentsBadge: {
        display: 'inline-flex',
        backgroundColor: colors.lightBlue,
        borderRadius: radii[2],
        padding: `2px ${space[2]}px`,
        marginRight: '3px'
    }
};

export default wrapComponent(KlarnaMarketing, 'KlarnaMarketing', true);
