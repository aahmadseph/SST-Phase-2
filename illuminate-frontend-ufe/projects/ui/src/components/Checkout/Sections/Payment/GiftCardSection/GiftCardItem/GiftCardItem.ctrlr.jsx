/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Flex, Image, Text, Link
} from 'components/ui';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import Debounce from 'utils/Debounce';
import orderUtils from 'utils/Order';
import ErrorsUtils from 'utils/Errors';
import checkoutApi from 'services/api/checkout';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';

class GiftCardItem extends BaseClass {
    removeGiftCard = () => {
        const { giftCard } = this.props;
        decorators
            .withInterstice(checkoutApi.removeGiftCard, INTERSTICE_DELAY_MS)(orderUtils.getOrderId(), giftCard.paymentGroupId)
            .then(() => {
                this.updateOrder();
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    updateOrder = () => {
        checkoutApi
            .getOrderDetails(orderUtils.getOrderId())
            .then(orderData => store.dispatch(OrderActions.updateOrder(orderData)))
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    toggleRemoveGiftCardModal = () => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');
        const title = getText('removeGiftCard');
        const message = getText('areYouSureMessage');
        const confirmButtonText = getText('removeLink');
        const callback = this.removeGiftCard;
        const hasCancelButton = true;
        const hasCloseButton = true;
        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: title,
                message: message,
                buttonText: confirmButtonText,
                callback: callback,
                showCancelButton: hasCancelButton,
                showCloseButton: hasCloseButton
            })
        );
    };

    toggleRemoveGiftCardModalDebounce = Debounce.preventDoubleClick(this.toggleRemoveGiftCardModal);

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');
        const isMobile = Sephora.isMobile();
        const { giftCard, isDisplay } = this.props;
        const cardNumberLastDigits = giftCard.giftCardNumber.substr(giftCard.giftCardNumber.length - 4);

        return (
            <Flex
                marginTop={isMobile && !isDisplay ? 4 : 5}
                lineHeight='tight'
                alignItems='center'
                data-at={Sephora.debug.dataAt('applied_gift_card_item')}
            >
                {isDisplay || <IconCheckmark marginRight={4} />}
                <Image
                    disableLazyLoad={true}
                    marginRight={4}
                    height={32}
                    width={50}
                    src='/img/ufe/payments/giftCard.svg'
                />
                <div>
                    <Text
                        is='b'
                        data-at={Sephora.debug.dataAt('applied_gift_card')}
                    >
                        {getText('giftCardEndingIn')} {cardNumberLastDigits}
                    </Text>
                    {isMobile ? <br /> : ' '}
                    {getText('hasBeenApplied')}
                    <Link
                        onClick={this.toggleRemoveGiftCardModalDebounce}
                        color='blue'
                        padding={2}
                        marginY={-2}
                        children={getText('removeLink')}
                    />
                </div>
            </Flex>
        );
    }
}

export default wrapComponent(GiftCardItem, 'GiftCardItem');
