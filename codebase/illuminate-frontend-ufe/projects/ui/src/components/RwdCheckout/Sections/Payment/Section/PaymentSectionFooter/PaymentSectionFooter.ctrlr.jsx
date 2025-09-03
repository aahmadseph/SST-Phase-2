/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import AccordionButton from 'components/RwdCheckout/AccordionButton';
import GiftCardSection from 'components/RwdCheckout/Sections/Payment/GiftCardSection';
import FormsUtils from 'utils/Forms';
import CheckoutUtils from 'utils/Checkout';
import GuestSavePointsCheckbox from 'components/RwdCheckout/Shared/Guest';
import CheckoutTermsConditions from 'components/RwdCheckout/CheckoutTermsConditions';
import PlaceOrderButton from 'components/RwdCheckout/PlaceOrderButton';
import RrcPromo from 'components/Reward/RrcPromo';
import RewardList from 'components/CreditCard/Rewards/RewardList';
import RewardGroup from 'components/Reward/RewardGroup/RewardGroup';
import LoyaltyPromo from 'components/Reward/LoyaltyPromo';
import TestTarget from 'components/TestTarget/TestTarget';
import CreditCardBanner from 'components/CreditCard/CreditCardBanner';
import Debounce from 'utils/Debounce';
import Location from 'utils/Location';
import checkoutUtils from 'utils/Checkout';
import ErrorsUtils from 'utils/Errors';
import OrderUtils from 'utils/Order';
import { mediaQueries } from 'style/config';
import mediaUtils from 'utils/Media';
const { Media } = mediaUtils;

class PaymentSectionFooter extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {};
    }

    saveAndContinue = e => {
        e.preventDefault();
        ErrorsUtils.clearErrors();
        const newCreditCard = this.props.newCreditCard;

        const componentsToValidate = [this.props.parentToValidate, this.giftCardSection];

        const parent = this.props.parentToValidate;

        if (parent?.creditCardsList?.refs?.securityCodeInput) {
            componentsToValidate.push(parent.creditCardsList.refs.securityCodeInput);
        }

        ErrorsUtils.collectClientFieldErrors(componentsToValidate);

        if (!ErrorsUtils.validate()) {
            //if no securityCode then either
            //creditCard selected has been preApproved
            //or user hasn't entered required securityCode
            if (this.props.securityCode) {
                newCreditCard.creditCard.securityCode = this.props.securityCode;
            }

            const creditCardDataReady = this.props.selectedCreditCardId;

            if (creditCardDataReady) {
                if (newCreditCard) {
                    // delete property as it is not required for updateCreditCardOnOrder API
                    delete newCreditCard.creditCard?.isCVVValidationRequired;
                }

                this.props.newCreaditCardWithInterstice(newCreditCard, 'select', this);
            } else if (this.props.isPayWithPayPal && !this.props.isPayPalSelected) {
                //make select paypal api call only if paypal has been selected and
                //wasn't already selected as the order payment group
                this.updatePayPalCheckoutWithInterstice('select', this);
            } else {
                //need to check if order is complete since user could be paying with
                //store credit, gift card, paypal, or apple pay which would not require
                //a selected credit card
                //no need to update order because everything is applied, so save the section but pass
                //in flag to stop api from being called
                const isUpdateOrder = false;
                const isPaymentSectionComplete = checkoutUtils.isPaymentSectionComplete();

                if (isPaymentSectionComplete) {
                    this.props.sectionSaveAction(Location.getLocation().pathname, this, isUpdateOrder, isPaymentSectionComplete);
                }
            }
        }
    };

    saveAndContinueDebounce = Debounce.preventDoubleClick(this.saveAndContinue);

    isNonSephoraCardSelected = (creditCardOptions, selectedCreditCardId) => {
        if (selectedCreditCardId) {
            const selectedCreditCard = creditCardOptions.find(card => card.creditCardId === selectedCreditCardId);

            return selectedCreditCard && !OrderUtils.isSephoraCardType(selectedCreditCard);
        }

        return false;
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            isGiftCardShow,
            isApplePayFlow,
            isKlarnaFlow,
            isAfterpayFlow,
            isPazeFlow,
            isVenmoFlow,
            isPayWithPayPal,
            isBopis,
            isSddOrder,
            creditCardOptions = [],
            selectedCreditCardId,
            hasAutoReplenishItemInBasket,
            hasSDUInBasket,
            paymentType
        } = this.props;

        const isGuestCheckout = CheckoutUtils.isGuestOrder();
        const { isGlobalEnabled } = Sephora.fantasticPlasticConfigurations;
        const isCashBackRewardsEnabled = Sephora.configurationSettings.isCashBackRewardsEnabled;

        const isRewardsListDisabled =
            isPayWithPayPal || isKlarnaFlow || isAfterpayFlow || this.isNonSephoraCardSelected(creditCardOptions, selectedCreditCardId);

        const ccBannerProps = {
            testEnabled: true,
            ...styles.banner
        };

        return (
            <div>
                <RrcPromo
                    isBopis={isBopis}
                    isSddOrder={isSddOrder}
                    marginTop={[4, 5]}
                />
                <RewardGroup
                    isCheckout={true}
                    isCarousel={[false, true]}
                    marginTop={[4, 5]}
                >
                    {isGlobalEnabled && (
                        <RewardList
                            isBopis={isBopis}
                            forceCollapse={isKlarnaFlow}
                            isBodyOnly={true}
                            isDisabled={isRewardsListDisabled}
                        />
                    )}
                    {isCashBackRewardsEnabled && <LoyaltyPromo isBopis={isBopis} />}
                </RewardGroup>
                {isGiftCardShow && (
                    <React.Fragment>
                        {isApplePayFlow || isKlarnaFlow || isAfterpayFlow || isPazeFlow ? (
                            <Text
                                is='p'
                                lineHeight='tight'
                                marginTop={[4, 3]}
                                children={paymentType}
                            />
                        ) : (
                            <GiftCardSection
                                hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                                editSectionName={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.GIFT_CARD_FORM)}
                                hasSDUInBasket={hasSDUInBasket}
                                ref={comp => (this.giftCardSection = comp)}
                            />
                        )}
                    </React.Fragment>
                )}
                {isGuestCheckout && (
                    <>
                        <GuestSavePointsCheckbox />
                        <Media lessThan='sm'>
                            <CheckoutTermsConditions />
                        </Media>
                    </>
                )}
                {isGuestCheckout ? (
                    <Box
                        marginTop={[null, 6]}
                        width={['15em', null]}
                    >
                        <PlaceOrderButton isBopis={isBopis} />
                    </Box>
                ) : isApplePayFlow || isKlarnaFlow || isAfterpayFlow || isPazeFlow || isVenmoFlow ? null : (
                    <AccordionButton onClick={this.saveAndContinue} />
                )}
                {isBopis ? (
                    <TestTarget
                        testName='creditCardBanners'
                        source='checkout'
                        isMobile={[true, false]}
                        testEnabled
                        testComponent={CreditCardBanner}
                        isBopis={isBopis}
                        {...ccBannerProps}
                        marginTop={5}
                        gap={16}
                        marginX={[-4, -1]}
                    />
                ) : (
                    <Media lessThan='sm'>
                        <TestTarget
                            testName='creditCardBanners'
                            source='checkout'
                            isMobile={[true, false]}
                            testEnabled
                            testComponent={CreditCardBanner}
                            isBopis={isBopis}
                            {...ccBannerProps}
                            marginTop={5}
                            gap={16}
                            marginX={[-4, -1]}
                        />
                    </Media>
                )}

                {isGuestCheckout && (
                    <Media greaterThan='xs'>
                        <CheckoutTermsConditions />
                    </Media>
                )}
            </div>
        );
    }
}

const styles = {
    banner: {
        variant: 'row',
        paddingX: 5,
        paddingY: 4,
        marginBottom: 3,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'midGray',

        [mediaQueries.sm]: {
            padding: 4
        }
    }
};

export default wrapComponent(PaymentSectionFooter, 'PaymentSectionFooter');
