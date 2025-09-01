/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Flex, Text, Link } from 'components/ui';
import IconCross from 'components/LegacyIcon/IconCross';
import PromoSection from 'components/RwdCheckout/PromoSection';
import checkoutUtils from 'utils/Checkout';
import orderUtils from 'utils/Order';
import MediaUtils from 'utils/Media';
const { Media } = MediaUtils;

class CheckoutPromoSection extends BaseClass {
    state = {
        showPromoSection: true,
        isErrorHidden: false,
        collapsePromoCodeInCheckout: true
    };

    componentDidMount() {
        const { appliedPromotions, items } = this.props;

        if (appliedPromotions.length > 0 && appliedPromotions[0].promotionId) {
            this.setState({ showPromoSection: true });
        } else if (orderUtils.getGlobalPromoCount(items)) {
            this.setState({ showPromoSection: true });
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
        const { isBopis, addPromoOrRewardCodeLabel, addPromoCodeLabel, enterPromoRewardsLabels } = this.props;
        const { showPromoSection, collapsePromoCodeInCheckout } = this.state;
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const promoSectionTitle = isGuestCheckout ? addPromoCodeLabel : enterPromoRewardsLabels;

        return collapsePromoCodeInCheckout ? (
            <Link
                color='blue'
                onClick={this.handleCollapsePromoCodeInCheckout}
                children={addPromoOrRewardCodeLabel}
            />
        ) : !showPromoSection ? (
            <Media lessThan='sm'>
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
            </Media>
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
