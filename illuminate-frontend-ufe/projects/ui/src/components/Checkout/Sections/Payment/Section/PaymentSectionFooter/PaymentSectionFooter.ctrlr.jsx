/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import AccordionButton from 'components/Checkout/AccordionButton';
import GiftCardSection from 'components/Checkout/Sections/Payment/GiftCardSection';
import FormsUtils from 'utils/Forms';
import CheckoutUtils from 'utils/Checkout';
import GuestSavePointsCheckbox from 'components/Checkout/Shared/Guest/GuestSavePointsCheckbox';
import CheckoutTermsConditions from 'components/Checkout/CheckoutTermsConditions';
import PlaceOrderButton from 'components/Checkout/PlaceOrderButton/PlaceOrderButton';
import RrcPromo from 'components/Reward/RrcPromo';
import RewardList from 'components/CreditCard/Rewards/RewardList';
import RewardGroup from 'components/Reward/RewardGroup/RewardGroup';
import LoyaltyPromo from 'components/Reward/LoyaltyPromo';
import TestTarget from 'components/TestTarget/TestTarget';
import CreditCardBanner from 'components/CreditCard/CreditCardBanner';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import checkoutApi from 'services/api/checkout';
import Debounce from 'utils/Debounce';
import Location from 'utils/Location';
import checkoutUtils from 'utils/Checkout';
import ErrorsUtils from 'utils/Errors';
import OrderUtils from 'utils/Order';
import UtilActions from 'utils/redux/Actions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';

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

        if (
            parent &&
            parent.refs &&
            parent.refs.creditCardsList &&
            parent.refs.creditCardsList.refs &&
            parent.refs.creditCardsList.refs.securityCodeInput
        ) {
            componentsToValidate.push(parent.refs.creditCardsList.refs.securityCodeInput);
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

                decorators
                    .withInterstice(checkoutApi.updateCreditCardOnOrder, INTERSTICE_DELAY_MS)(newCreditCard, 'select')
                    .then(data => {
                        if (data) {
                            store.dispatch(UtilActions.merge('order', 'bankRewardsValidPaymentsMessage', data.bankRewardsValidPaymentsMessage));
                        }

                        store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname, this));

                        const { defaultPayment } = this.props;
                        processEvent.process(anaConsts.ADD_PAYMENTINFO_EVENT, {
                            data: {
                                paymentType: defaultPayment
                            }
                        });
                    })
                    .catch(errorData => {
                        if (Sephora.isAgent) {
                            //If it is Sephora mirror and the new credit card is expired then specific error is displayed for agents
                            const isCreditCardExpired = errorData.errorMessages.includes('Expired credit card.');

                            if (isCreditCardExpired) {
                                const selectedCreditCard = this.props.creditCardOptions.find(
                                    card => card.creditCardId === newCreditCard.creditCard.creditCardId
                                );
                                this.props.showEditCreditCardForm({
                                    ...selectedCreditCard,
                                    isExpired: true,
                                    expirationMonth: '',
                                    expirationYear: ''
                                });
                            } else {
                                ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                            }
                        } else {
                            ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                        }
                    });
            } else if (this.props.isPayWithPayPal && !this.props.isPayPalSelected) {
                //make select paypal api call only if paypal has been selected and
                //wasn't already selected as the order payment group
                const payload = { details: { email: this.props.paypalOption.email } };
                decorators
                    .withInterstice(checkoutApi.updatePayPalCheckout, INTERSTICE_DELAY_MS)(payload, 'select')
                    .then(() => {
                        store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname, this));

                        processEvent.process(anaConsts.ADD_PAYMENTINFO_EVENT, {
                            data: {
                                paymentType: 'paypal'
                            }
                        });
                    });
            } else {
                //need to check if order is complete since user could be paying with
                //store credit, gift card, paypal, or apple pay which would not require
                //a selected credit card
                //no need to update order because everything is applied, so save the section but pass
                //in flag to stop api from being called
                const isUpdateOrder = false;
                const isPaymentSectionComplete = checkoutUtils.isPaymentSectionComplete();

                if (isPaymentSectionComplete) {
                    store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname, this, isUpdateOrder, isPaymentSectionComplete));
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

    // The arguments should be isApplePayFlow, isKlarnaFlow, isAfterpayFlow and isPazeFlow. Its values are either true
    // or false/undefined. The function returns the value from the first true it finds
    getPaymentType = (...args) => {
        const paymentTypes = {
            isApplePayFlow: 'Apple Pay',
            isKlarnaFlow: 'Klarna',
            isAfterpayFlow: 'Afterpay',
            isPazeFlow: 'Paze'
        };

        // Find the first active flag (true)
        for (const flag in paymentTypes) {
            if (args[0][flag]) {
                return paymentTypes[flag];
            }
        }

        return ''; // Fallback if none of the flags are true
    };

    /* eslint-disable-next-line complexity */
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Section/locales', 'PaymentSection');
        const {
            isGiftCardShow,
            isApplePayFlow,
            isKlarnaFlow,
            isAfterpayFlow,
            isPazeFlow,
            isPayWithPayPal,
            isBopis,
            isSddOrder,
            creditCardOptions = [],
            selectedCreditCardId,
            hasAutoReplenishItemInBasket,
            hasSDUInBasket
        } = this.props;

        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();
        const isGuestCheckout = CheckoutUtils.isGuestOrder();
        const { isGlobalEnabled } = Sephora.fantasticPlasticConfigurations;
        const isCashBackRewardsEnabled = Sephora.configurationSettings.isCashBackRewardsEnabled;

        const isRewardsListDisabled =
            isPayWithPayPal || isKlarnaFlow || isAfterpayFlow || this.isNonSephoraCardSelected(creditCardOptions, selectedCreditCardId);
        const renderCCBanner = (isMobile && !isBopis) || isBopis;

        const ccBannerProps = {
            testEnabled: true,
            ...(isMobile
                ? {
                    padding: 4
                }
                : {
                    variant: 'row',
                    paddingX: 5,
                    paddingY: 4,
                    marginBottom: 3,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: 'midGray'
                })
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
                    isCarousel={isDesktop}
                    marginTop={isMobile ? 4 : 5}
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
                                marginTop={isDesktop ? 4 : 3}
                                children={getText('giftCardsNotCombinableText', [
                                    this.getPaymentType({ isApplePayFlow, isKlarnaFlow, isAfterpayFlow, isPazeFlow })
                                ])}
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
                {isGuestCheckout && <GuestSavePointsCheckbox />}
                {!isDesktop && isGuestCheckout && <CheckoutTermsConditions />}
                {isGuestCheckout ? (
                    <Box marginTop={isDesktop && 6}>
                        <PlaceOrderButton
                            block={!isDesktop}
                            isBopis={isBopis}
                        />
                    </Box>
                ) : isApplePayFlow || isKlarnaFlow || isAfterpayFlow || isPazeFlow ? null : (
                    <AccordionButton onClick={this.saveAndContinue} />
                )}
                {renderCCBanner && (
                    <TestTarget
                        testName='creditCardBanners'
                        source='checkout'
                        isMobile={isMobile}
                        testEnabled
                        testComponent={CreditCardBanner}
                        isBopis={isBopis}
                        {...ccBannerProps}
                        marginTop={5}
                        gap={16}
                        marginX={isMobile ? -4 : -1}
                    />
                )}

                {isDesktop && isGuestCheckout && <CheckoutTermsConditions />}
            </div>
        );
    }
}

export default wrapComponent(PaymentSectionFooter, 'PaymentSectionFooter');
