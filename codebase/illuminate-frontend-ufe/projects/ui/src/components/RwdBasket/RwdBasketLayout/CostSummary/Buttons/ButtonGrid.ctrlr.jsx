/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import agentAwareUtils from 'utils/AgentAware';

import { Flex } from 'components/ui';
import CheckoutButton from 'components/RwdBasket/RwdBasketLayout/CostSummary/Buttons/CheckoutButton';
import PayPalButton from 'components/PayPalButton/PayPalButton';
import ApplePayButton from 'components/ApplePayButton/ApplePayButton';
import VenmoExpressButton from 'components/VenmoExpressButton/VenmoExpressButton';

import { mediaQueries, lineHeights } from 'style/config';

class ButtonGrid extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { isApplePayPayment: false };
    }

    componentDidMount() {
        this.props.getApplePaymentStatus().then(isApplePayPayment => this.setState({ isApplePayPayment }));
    }

    componentDidUpdate() {
        this.props.getApplePaymentStatus().then(isApplePayPayment => {
            if (isApplePayPayment !== this.state.isApplePayPayment) {
                this.setState({ isApplePayPayment });
            }
        });
    }

    render() {
        const {
            isBopis,
            isPaypalPayment,
            isVenmoEligible,
            isCheckoutDisabled,
            isSignedIn,
            isSDDBasketAvailable,
            isSDUOnlyInBasket,
            isRougeRewardsApplied,
            hideCheckoutButton
        } = this.props;

        const { isApplePayPayment } = this.state;
        const hasSDDItem = isSDDBasketAvailable && !isSDUOnlyInBasket;

        const checkoutButtonStyle = {
            lineHeight: lineHeights.tight,
            [mediaQueries.xsMax]: {
                display: 'flex',
                width: '100%',
                order: 0
            }
        };

        const checkoutButtonStyleWithOrder = {
            lineHeight: lineHeights.tight,
            order: -1,
            [mediaQueries.xsMax]: {
                display: 'flex',
                flex: 1,
                order: 1
            }
        };

        const updateCheckoutButtonStyle = (count) => {
            return count === 1 ? checkoutButtonStyleWithOrder : checkoutButtonStyle;
        };

        const containerStyle = {
            display: 'flex',
            flexDirection: 'column', // on large screens
            gap: 12,
            [mediaQueries.xsMax]: {
                flexDirection: 'row', // on small screens
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                width: '100%'
            }
        };

        const buttonStyle = {
            [mediaQueries.xsMax]: {
                display: 'flex',
                flex: 1
            }
        };

        const applepaySvg = {
            src: '/img/ufe/rwd-basket/apple-pay-logo.svg',
            width: 59,
            height: 28
        };

        if (hideCheckoutButton) {
            return null;
        }

        const buttonCount = [isPaypalPayment, isVenmoEligible, isApplePayPayment].filter(Boolean).length;

        return (
            <Flex css={containerStyle}>
                <CheckoutButton
                    isBopis={isBopis}
                    isCheckoutDisabled={isCheckoutDisabled}
                    isSignedIn={isSignedIn}
                    hasSDDItem={hasSDDItem}
                    isRougeRewardsApplied={isRougeRewardsApplied}
                    css={updateCheckoutButtonStyle(buttonCount)}
                />
                {isApplePayPayment && (
                    <ApplePayButton
                        isBopis={isBopis}
                        isApplePayPayment={isApplePayPayment}
                        customSvg={applepaySvg}
                        css={buttonStyle}
                    />
                )}
                {isPaypalPayment && (
                    <PayPalButton
                        className={agentAwareUtils.applyHideAgentAwareClass()}
                        isBopis={isBopis}
                        isPaypalPayment={isPaypalPayment}
                        css={buttonStyle}
                    />
                )}
                {isVenmoEligible && (
                    <VenmoExpressButton
                        className={agentAwareUtils.applyHideAgentAwareClass()}
                        isBopis={isBopis}
                        isVenmoEligible={isVenmoEligible}
                        css={buttonStyle}
                    />
                )}
            </Flex>
        );
    }
}

export default wrapComponent(ButtonGrid, 'ButtonGrid', true);
