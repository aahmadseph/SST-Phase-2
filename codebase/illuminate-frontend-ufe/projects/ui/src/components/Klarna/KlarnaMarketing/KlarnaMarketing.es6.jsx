import React from 'react';
import store from 'store/Store';
import Actions from 'actions/Actions';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import skuHelpers from 'utils/skuHelpers';
import { Text, Image } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import languageLocale from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import klarnaUtils from 'utils/Klarna';
import helpersUtils from 'utils/Helpers';
import orderUtils from 'utils/Order';
import Location from 'utils/Location';
import agentAwareUtils from 'utils/AgentAware';
import { PAYMENT_METHODS } from 'constants/PaymentMethods';

const { KLARNA, AFTERPAY, PAYPAL } = PAYMENT_METHODS;

const { hasHalAddress } = orderUtils;
const { getProp } = helpersUtils;
const getText = languageLocale.getLocaleResourceFile('components/Klarna/locales', 'Klarna');

class KlarnaMarketing extends BaseClass {
    triggerAsyncPageLoadEvent = () => {
        const { analyticsContext, analyticsPageType, isAfterpayEnabled, isKlarnaEnabled } = this.props;
        const contextEvent = analyticsContext ? anaUtils.getLastAsyncPageLoadData({ pageType: analyticsContext }) : {};
        const pageType = analyticsPageType;
        const pageDetail = klarnaUtils.getPageDetail(isAfterpayEnabled, isKlarnaEnabled);
        const eventStrings = [];

        if (Location.isCheckout()) {
            /// Analytics https://jira.sephora.com/browse/ET-398
            eventStrings.push(anaConsts.Event.SC_CHECKOUT);

            if (hasHalAddress()) {
                eventStrings.push(anaConsts.Event.EVENT_247);
            }
        }

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageType,
                pageDetail,
                eventStrings,
                previousPageName: contextEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName')
            }
        });
    };

    showModal = (installmentValue, totalAmount, selectedPaymentMethod) => {
        const { isAfterpayEnabled, isKlarnaEnabled, isPayPalPayLaterEligibleEnabled } = this.props;

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

        this.triggerAsyncPageLoadEvent();
    };

    infoButton = (installmentValue, totalAmount, paymentMethod) => (
        <InfoButton
            size={14}
            aria-label={getText('learnMore')}
            onClick={() => this.showModal(installmentValue, totalAmount, paymentMethod)}
            data-at={Sephora.debug.dataAt('info_icon')}
        />
    );
    buildBuyNowPayLater = (installmentValue, totalAmount) => {
        const { isAfterpayEnabled, isKlarnaEnabled, isPayPalPayLaterEligibleEnabled } = this.props;

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
                    {this.infoButton(installmentValue, totalAmount, KLARNA)}
                </>
            ),
            afterpayLogo: languageLocale.isCanada() ? (
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
                    {this.infoButton(installmentValue, totalAmount, AFTERPAY)}
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
                    {this.infoButton(installmentValue, totalAmount, AFTERPAY)}
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
                    {this.infoButton(installmentValue, totalAmount, PAYPAL)}
                </>
            )
        };

        const [firstPaymentLogo, secondPaymentLogo, thirdPaymentLogo] = orderUtils.getAvailablePaymentLogos(
            isAfterpayEnabled,
            isKlarnaEnabled,
            isPayPalPayLaterEligibleEnabled
        );

        return (
            <>
                {firstPaymentLogo ? (
                    <>
                        {paymentLogos[firstPaymentLogo]}
                        <span css={{ whiteSpace: 'nowrap' }}>
                            {secondPaymentLogo && (
                                <>
                                    {` ${getText('or')} `}
                                    {paymentLogos[secondPaymentLogo]}
                                </>
                            )}
                        </span>
                        {thirdPaymentLogo && (
                            <span css={{ whiteSpace: 'nowrap' }}>
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
            </>
        );
    };

    render() {
        const {
            sku, subtotal, firstBuyDiscountTotal, isAfterpayEnabled, isKlarnaEnabled, ...props
        } = this.props;

        const [installmentValue, totalAmount] = sku
            ? skuHelpers.getInstallmentValue(sku)
            : subtotal
                ? skuHelpers.formatInstallmentValue(subtotal)
                : [];

        if (!installmentValue) {
            return null;
        }

        return (
            <Text
                className={agentAwareUtils.applyHideAgentAwareClass()}
                is='p'
                fontSize='sm'
                lineHeight='tight'
                {...props}
                data-at={Sephora.debug.dataAt('klarna_info_block')}
                marginTop={[0, '-3px']}
            >
                <span
                    dangerouslySetInnerHTML={{ __html: getText('installmentsWithAfterpayAndKlarna', [installmentValue.replace(' ', '&nbsp;')]) }}
                    data-at={Sephora.debug.dataAt('klarna_info_message')}
                />{' '}
                {this.buildBuyNowPayLater(installmentValue, totalAmount)}
            </Text>
        );
    }
}

export default wrapComponent(KlarnaMarketing, 'KlarnaMarketing');
