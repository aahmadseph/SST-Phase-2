/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import { Flex } from 'components/ui';
import CreditCardList from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCardList';
import AddCardHeader from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/AddCardHeader';
import CreditCardForm from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCardForm';

import formsUtils from 'utils/Forms';
import localeUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';

const { getLocaleResourceFile } = localeUtils;

const maxCreditCards = Sephora.configurationSettings.maxCreditCards;

class PaymentInfo extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            showAddNewCardForm: false,
            creditCardToEdit: null
        };

        this.getText = getLocaleResourceFile('components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/locales', 'PaymentInfo');
    }

    handleSetShowAddNewCardForm = showAddNewCardForm => () => {
        const { showInfoModal, userCreditCards, clearErrors } = this.props;

        if (showAddNewCardForm && userCreditCards.length === maxCreditCards) {
            showInfoModal({
                isOpen: true,
                title: this.getText('removeCreditCard'),
                message: this.getText('maxCreditCardsMessage', [maxCreditCards]),
                buttonText: this.getText('continue')
            });
        } else {
            this.setState({ showAddNewCardForm });
            clearErrors && clearErrors();
        }
    };

    handleSetCreditCardToEdit = creditCardToEdit => () => this.setState({ creditCardToEdit });

    handleAddOrEditCreditCard = (userCardIdToUse, tempCreditCardInfo) => {
        const { creditCardToEdit } = this.state;

        this.props.succesCallback(userCardIdToUse, tempCreditCardInfo);

        creditCardToEdit && this.handleSetCreditCardToEdit(null)();
    };

    formatCreditCardExpMonthYear = creditCardToEdit => {
        return {
            ...creditCardToEdit,
            expirationMonth: creditCardToEdit?.expirationMonth?.padStart(2, '0'),
            expirationYear: creditCardToEdit?.expirationYear?.slice(-2)
        };
    };

    render() {
        const {
            billingCountries,
            userCreditCards,
            setSelectedCreditCard,
            removeSelectedCreditCard,
            newCreditCard,
            userDefaultAddress,
            setCreditCardApiErrorMsg
        } = this.props;

        const { showAddNewCardForm, creditCardToEdit } = this.state;

        return (
            <>
                {showAddNewCardForm && (
                    <CreditCardForm
                        editStore={formsUtils.getStoreEditSectionName(formsUtils.FORMS.CHECKOUT.CREDIT_CARD)}
                        creditCard={newCreditCard}
                        isFirstCreditCard={false}
                        isDefault={false}
                        billingCountries={billingCountries}
                        cancelCallback={this.handleSetShowAddNewCardForm(false)}
                        shippingAddress={userDefaultAddress}
                        isUseShippingAddressAsBilling={!!userDefaultAddress}
                        succesCallback={this.handleAddOrEditCreditCard}
                        setCreditCardApiErrorMsg={setCreditCardApiErrorMsg}
                    />
                )}

                {creditCardToEdit && (
                    <CreditCardForm
                        editStore={formsUtils.getStoreEditSectionName(formsUtils.FORMS.CHECKOUT.CREDIT_CARD)}
                        creditCard={this.formatCreditCardExpMonthYear(creditCardToEdit)}
                        cardType={orderUtils.getThirdPartyCreditCard(creditCardToEdit)}
                        isFirstCreditCard={userCreditCards.length <= 1}
                        isDefault={creditCardToEdit ? creditCardToEdit.isDefault : false}
                        isEditMode={!!creditCardToEdit}
                        billingCountries={billingCountries}
                        cancelCallback={this.handleSetCreditCardToEdit(null)}
                        shippingAddress={creditCardToEdit ? creditCardToEdit.address : userDefaultAddress}
                        isUseShippingAddressAsBilling={!!creditCardToEdit?.address || !!userDefaultAddress}
                        succesCallback={this.handleAddOrEditCreditCard}
                        setCreditCardApiErrorMsg={setCreditCardApiErrorMsg}
                    />
                )}

                {!showAddNewCardForm && !creditCardToEdit && (
                    <Flex
                        flexDirection={'column'}
                        gap={4}
                    >
                        <CreditCardList
                            userCreditCards={userCreditCards}
                            removeSelectedCreditCard={removeSelectedCreditCard}
                            setSelectedCreditCard={setSelectedCreditCard}
                            setCreditCardToEdit={this.handleSetCreditCardToEdit}
                        />
                        <AddCardHeader
                            handleSetShowAddNewCardForm={this.handleSetShowAddNewCardForm}
                            hasDivider
                        />
                    </Flex>
                )}
            </>
        );
    }
}

PaymentInfo.defaultProps = {
    showInfoModal: () => {}
};

export default wrapComponent(PaymentInfo, 'PaymentInfo');
