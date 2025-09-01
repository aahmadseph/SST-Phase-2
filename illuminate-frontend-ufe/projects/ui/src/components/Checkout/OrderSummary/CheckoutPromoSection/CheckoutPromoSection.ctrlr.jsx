/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Flex, Text, Link } from 'components/ui';
import IconCross from 'components/LegacyIcon/IconCross';
import PromoSection from 'components/Checkout/PromoSection';
import checkoutUtils from 'utils/Checkout';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import orderUtils from 'utils/Order';

class CheckoutPromoSection extends BaseClass {
    state = {
        showPromoSection: true,
        isErrorHidden: false,
        collapsePromoCodeInCheckout: true
    };

    componentDidMount() {
        //only need to setAndWatch on non desktop channels
        if (!Sephora.isDesktop()) {
            store.setAndWatch('order.orderDetails', this, data => {
                if (data.orderDetails && data.orderDetails.promotion) {
                    const { appliedPromotions = [] } = data.orderDetails.promotion;

                    //check for a promotionId in applied promotions and also
                    //check if promo was added to basket due to another item in basket
                    if (appliedPromotions.length > 0 && appliedPromotions[0].promotionId) {
                        this.setState({ showPromoSection: true });
                    } else if (orderUtils.getGlobalPromoCount(data.orderDetails.items.items)) {
                        this.setState({ showPromoSection: true });
                    }
                }
            });
        }
    }

    hideError = hideError => {
        this.setState({ isErrorHidden: hideError });
    };

    handleShowPromoSection = () => {
        this.setState({
            showPromoSection: true
        });
    };

    handleCollapsePromoCodeInCheckout = () => {
        this.setState({
            collapsePromoCodeInCheckout: false
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/CheckoutPromoSection/locales', 'CheckoutPromoSection');
        const { isBopis } = this.props;
        const { showPromoSection, collapsePromoCodeInCheckout } = this.state;
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const promoSectionTitle = isGuestCheckout ? getText('addPromoCode') : getText('enterPromoRewards');

        return collapsePromoCodeInCheckout ? (
            <Link
                color='blue'
                onClick={this.handleCollapsePromoCodeInCheckout}
                children={getText('addPromoOrRewardCode')}
            />
        ) : !Sephora.isDesktop() && !showPromoSection ? (
            <Flex
                onClick={this.handleShowPromoSection}
                alignItems='center'
                width='100%'
                paddingX={4}
                paddingY={3}
                borderWidth={1}
                borderColor='divider'
                borderRadius={2}
            >
                <IconCross />
                <Text
                    marginLeft={3}
                    fontWeight='bold'
                    children={promoSectionTitle}
                />
            </Flex>
        ) : (
            <PromoSection
                hideError={this.hideError}
                isErrorHidden={this.state.isErrorHidden}
                isBopis={isBopis}
                isCheckoutSection={true}
            />
        );
    }
}

export default wrapComponent(CheckoutPromoSection, 'CheckoutPromoSection');
