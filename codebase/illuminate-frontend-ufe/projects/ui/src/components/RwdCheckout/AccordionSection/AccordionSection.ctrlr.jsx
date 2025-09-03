/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Image, Text, Link, Grid, Icon, Flex
} from 'components/ui';
import Flag from 'components/Flag/Flag';
import IconLock from 'components/LegacyIcon/IconLock';
import ErrorMsg from 'components/ErrorMsg';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import checkoutUtils from 'utils/Checkout';
import store from 'store/Store';
import Actions from 'Actions';

const { CHECKOUT_SECTIONS } = checkoutUtils;

const ACCORDION_DATA_AT_TITLE = {
    giftCardShippingAddress: 'gift_card_shipping_address',
    giftCardDeliveryMessage: 'gift_card_delivery_and_message',
    shippingAddress: 'shipping_address',
    deliveryGiftOptions: 'delivery_and_gift_options',
    deliveryAutoReplenish: 'delivery',
    paymentMethod: 'payment_method',
    accountCreation: 'account_creation',
    reviewPlaceOrder: 'review_and_place_order',
    shippingDelivery: 'shipping_and_delivery',
    reviewSubmitEditsTitle: 'review_and_submit_edits',
    reviewSubmitSubscribeTitle: 'review_and_subscribe',
    giftMessage: 'gift_message'
};

class AccordionSection extends BaseClass {
    editCallback = e => {
        e.preventDefault();
        this.props.editCallback();
    };

    handleShowFreeReturnsModal = () => {
        store.dispatch(Actions.showFreeReturnsModal({ isOpen: true }));
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            index,
            isOpen,
            isDisabled,
            editCallback,
            name,
            dataAt,
            dataAtSectionTitle,
            dataAtMessage,
            title,
            message,
            isError,
            shouldShowSkeleton,
            children,
            shouldShowUpdatedBadge,
            note,
            orderHasReplen,
            hasSDUInBasket,
            creditCardRequiredMessage,
            creditCardMessageTypeError,
            localization
        } = this.props;

        const {
            updatedBadge, secure, edit, somePaymentCannotUsed, freeReturns, onAllPurchases, shippingTo
        } = localization;

        const { countryLongName, countryFlagImage } = userUtils.getShippingCountry();

        const isCanada = localeUtils.isCanada();
        const shouldDisplayPaymentRequiredSDUorAR =
            editCallback && creditCardRequiredMessage && name === CHECKOUT_SECTIONS.PAYMENT.name && (orderHasReplen || hasSDUInBasket);

        const isShippingAccordion = name === CHECKOUT_SECTIONS.SHIP_OPTIONS.name;
        const isPickupPersonAccordion = name === CHECKOUT_SECTIONS.PICKUP_ORDER_CONTACT_INFO.name;
        const shouldDisplayFreeReturnsCopy = isShippingAccordion || isPickupPersonAccordion;

        return (
            <Box
                borderTop={2}
                data-at={Sephora.debug.dataAt('checkout_' + ACCORDION_DATA_AT_TITLE[dataAt])}
                borderColor={isDisabled ? 'midGray' : isError ? 'error' : 'black'}
                paddingTop={5}
                paddingBottom={[5, null, 6]}
            >
                <Grid
                    alignItems='center'
                    columns={shouldDisplayFreeReturnsCopy && isDisabled ? ['unset', '1fr auto'] : '1fr auto'}
                    lineHeight='none'
                >
                    <Text
                        is='h2'
                        fontWeight='bold'
                        fontSize={['md', null, 'xl']}
                        color={isDisabled ? 'midGray' : 'black'}
                        onClick={editCallback && !isDisabled ? this.editCallback : null}
                        data-at={dataAtSectionTitle}
                    >
                        {title}
                        {note ? (
                            <Text
                                display='block'
                                color='gray'
                                fontWeight='normal'
                                paddingTop={4}
                                fontSize='sm'
                            >
                                {note}
                            </Text>
                        ) : null}
                        {shouldShowUpdatedBadge && (
                            <Flag
                                marginLeft={2}
                                children={updatedBadge}
                            />
                        )}
                    </Text>

                    {name === CHECKOUT_SECTIONS.PAYMENT.name && !isDisabled && !editCallback && (
                        <Text color='gray'>
                            <IconLock
                                fontSize='1.25em'
                                marginRight='.5em'
                            />
                            {secure}
                        </Text>
                    )}
                    {editCallback && !isDisabled && (
                        <Link
                            aria-controls={'checkout_section' + index + '_body'}
                            padding={3}
                            margin={-3}
                            color='blue'
                            onClick={this.editCallback}
                            data-at={Sephora.debug.dataAt('checkout_edit_button')}
                            children={edit}
                        />
                    )}
                    {name === CHECKOUT_SECTIONS.PAYMENT.name && (orderHasReplen || hasSDUInBasket) && (
                        <Text
                            is='span'
                            color='gray'
                            fontSize='sm'
                            marginTop={-1}
                            lineHeight='tight'
                        >
                            {somePaymentCannotUsed}
                        </Text>
                    )}

                    {isDisabled && shouldDisplayFreeReturnsCopy && (
                        <Flex
                            gap={1}
                            marginBottom={isPickupPersonAccordion ? 4 : 0}
                            display={['block', 'none']}
                        >
                            <Link
                                color='blue'
                                underline={true}
                                onClick={this.handleShowFreeReturnsModal}
                                display='inline-block'
                            >
                                {freeReturns}
                            </Link>
                            &nbsp;
                            <Text
                                is='p'
                                display='inline-block'
                            >
                                {onAllPurchases}
                            </Text>
                        </Flex>
                    )}
                </Grid>
                {!isDisabled && shouldDisplayFreeReturnsCopy && (
                    <Flex
                        gap={1}
                        marginTop={3}
                        marginBottom={isPickupPersonAccordion ? 4 : 0}
                        display={['block', 'none']}
                    >
                        <Link
                            color='blue'
                            underline={true}
                            onClick={this.handleShowFreeReturnsModal}
                            display='inline-block'
                        >
                            {freeReturns}
                        </Link>
                        &nbsp;
                        <Text
                            is='p'
                            display='inline-block'
                        >
                            {onAllPurchases}
                        </Text>
                    </Flex>
                )}
                {isOpen && !isDisabled && (
                    <Box
                        id={'checkout_section' + index + '_body'}
                        marginTop={
                            shouldDisplayFreeReturnsCopy && isPickupPersonAccordion
                                ? 3
                                : shouldDisplayFreeReturnsCopy
                                    ? 1
                                    : shouldDisplayPaymentRequiredSDUorAR
                                        ? 3
                                        : 5
                        }
                    >
                        {message && (
                            <Text
                                is='p'
                                marginBottom={4}
                                children={message}
                                data-at={dataAtMessage}
                            />
                        )}
                        {name === CHECKOUT_SECTIONS.SHIP_ADDRESS.name && isCanada && countryFlagImage && countryLongName && (
                            <Box
                                lineHeight='tight'
                                data-at={Sephora.debug.dataAt('shipping_to_label')}
                                marginBottom={4}
                            >
                                <Image
                                    alt={`${shippingTo} ${countryLongName}`}
                                    disableLazyLoad={true}
                                    src={countryFlagImage}
                                    marginRight={2}
                                    width={24}
                                    height={16}
                                    verticalAlign='text-bottom'
                                />
                                {shippingTo} {countryLongName}
                            </Box>
                        )}
                        {shouldDisplayPaymentRequiredSDUorAR && (
                            <ErrorMsg
                                backgroundColor='nearWhite'
                                padding={3}
                                color={creditCardMessageTypeError ? 'red' : 'black'}
                                borderRadius={2}
                                display='flex'
                            >
                                {creditCardMessageTypeError && (
                                    <Icon
                                        name='alert'
                                        size={16}
                                        marginRight={2}
                                    />
                                )}
                                <span>{creditCardRequiredMessage}</span>
                            </ErrorMsg>
                        )}
                        {!children && shouldShowSkeleton ? <Box minHeight={403} /> : children}
                    </Box>
                )}
            </Box>
        );
    }
}

export default wrapComponent(AccordionSection, 'AccordionSection');
