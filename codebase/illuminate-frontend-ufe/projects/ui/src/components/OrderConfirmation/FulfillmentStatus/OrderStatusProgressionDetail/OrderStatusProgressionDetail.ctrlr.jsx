/* eslint-disable complexity */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Grid, Text, Box, Flex, Icon, Link, Button, Divider, Image
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import BopisSddSmsSignupButton from 'components/RichProfile/MyAccount/BopisSddSmsSignupButton';
import helpersUtils from 'utils/Helpers';
import orderUtils from 'utils/Order';
import storeUtils from 'utils/Store';
import UI from 'utils/UI';
import { SEE_CURBSIDE_CONCIERGE_LOCATION_LINK } from 'utils/OrderDetails';
import { CURBSIDE_PICKUP_ID } from 'utils/CurbsidePickup';
import { SMS_NOTIFICATION_STATUS } from 'constants/orderStatus';

const { isConciergePurchaseEnabled } = Sephora?.configurationSettings;

const { replaceDoubleAsterisks } = helpersUtils;
const { ROPIS_CONSTANTS } = orderUtils;
const { ORDER_STATUS } = ROPIS_CONSTANTS;

class OrderStatusProgressionDetail extends BaseClass {
    state = {
        smsNotificationFlag: 0
    };

    clickHandlerCurbsidePickup = e => {
        e.preventDefault();

        UI.scrollTo({ elementId: CURBSIDE_PICKUP_ID });
    };

    clickHandlerConciergeCurbsidePickup = e => {
        e.preventDefault();

        UI.scrollTo({ elementId: SEE_CURBSIDE_CONCIERGE_LOCATION_LINK });
    };

    handleConciergeLocationLinkClick = () => {
        UI.scrollTo({ elementId: SEE_CURBSIDE_CONCIERGE_LOCATION_LINK });
    };

    handleCurbsidePickupClick = isCurbsideAvailable => () => {
        this.props.openCurbsideModal(this.props.isCurbsideConciergePickup || isCurbsideAvailable);
    };

    getFaqLink = isBopisOrder => {
        const { seeFAQ } = this.props;

        return (
            <Link
                href='/beauty/in-store-pick-up-faq'
                padding={!isBopisOrder && 2}
                margin={!isBopisOrder && -2}
                data-at={isBopisOrder ? Sephora.debug.dataAt('see_faqs_link') : Sephora.debug.dataAt('ready_for_pickup_see_faqs_link')}
                children={seeFAQ}
                color='blue'
            />
        );
    };

    getInStorePickupAddressLink = address => {
        return (
            <Link
                padding={2}
                margin={-2}
                onClick={this.props.openInStoreAddressLinkModal}
                data-at={Sephora.debug.dataAt('store_address_btn')}
                color='blue'
            >
                {address.address1}, {address.city}, {address.state} {address.postalCode}
            </Link>
        );
    };

    getConciergeCurbsideLocationRedirectText = () => {
        const { seeCurbsideConciergeLocation } = this.props;

        return (
            <Link
                padding={2}
                margin={-2}
                color='blue'
                onClick={this.handleConciergeLocationLinkClick}
            >
                {seeCurbsideConciergeLocation}
            </Link>
        );
    };

    renderSddTrackingFaqLinks = (trackingUrl, showModal) => {
        const { trackYourOrder, seeFAQ } = this.props;

        return (
            <Box marginTop={1}>
                <Link
                    href={trackingUrl}
                    color='blue'
                    target='_blank'
                    children={trackYourOrder}
                />
                <Text
                    color='gray'
                    children={' | '}
                />
                <Link
                    onClick={showModal}
                    color='blue'
                    target='_blank'
                    children={seeFAQ}
                />
            </Box>
        );
    };

    componentDidMount() {
        const callback = flag => {
            this.setState({
                smsNotificationFlag: flag
            });
        };

        this.props.getSmsNotificationFlag(callback);
    }

    render() {
        const {
            isLast,
            state,
            status,
            storeDetails = {},
            stateMessages,
            isCheckout,
            hrefForFaq,
            address,
            isReadyToPickUp,
            isProcessing,
            isBopisOrder,
            showCurbsidePickupIndicator,
            canceledItems,
            isInStorePickup,
            isCurbsideConciergePickup,
            index,
            isSameDayOrder,
            isSDDOrderDelivered = false,
            trackingUrl,
            showModal,
            canceledItemsText,
            storeDetailsText,
            curbsidePickUpFirstLine,
            curbsidePickUpParagraphPrefix,
            seeBelow,
            curbsidePickUpParagraphSufix,
            curbsideConciergeInstructionsTitle,
            conciergePickupPrefix,
            describedBelow,
            conciergePickupSuffix,
            curbsidePickup,
            curbsideConciergePickupRequirement,
            callStore,
            pickupBarcodeMsg,
            openInStoreAddressLinkModal,
            smsNotificationFlag
        } = this.props;

        const isPending = status === ORDER_STATUS.PENDING;
        const isActive = status === ORDER_STATUS.ACTIVE;
        const isProcessingActive = isProcessing && isActive;
        const isReadyForPickupActive = isReadyToPickUp && isActive;
        const isSddNotDelivered = isActive && !isSDDOrderDelivered;
        const isSddDelivered = isActive && isSDDOrderDelivered;
        const smsFlag = smsNotificationFlag ? smsNotificationFlag : this.state.smsNotificationFlag;
        const showSmsButton = smsFlag !== SMS_NOTIFICATION_STATUS.NOT_AVAILABLE;

        let messages = stateMessages || [];

        if (canceledItems) {
            messages = [...messages, { errorMessage: canceledItemsText }];
        }

        const sortStateMessages = messages.sort(function sortStateMessages(item) {
            return item.errorMessage ? -1 : 0;
        });

        const storePhoneNumber = storeDetails?.address?.phone;
        const curbsideEnabled = storeUtils.isCurbsideEnabled(storeDetails, { isBopisOrder });
        const conciergeCurbsideEnabled = storeUtils.isConciergeCurbsideEnabled(storeDetails, { isBopisOrder });
        const showInStorePickupInstructions = curbsideEnabled && conciergeCurbsideEnabled && isInStorePickup;
        const showCallStoreButton = curbsideEnabled && storePhoneNumber;
        const dataAt = ['preparing_your_order', 'ready_for_pickup', 'order_picked_up'];
        const isEveryMessageIsAnError = item => item?.errorMessage;
        const isCurbsideAvailable = !sortStateMessages.every(isEveryMessageIsAnError);

        return (
            <Grid
                columns='20px 1fr'
                gap={4}
                fontSize='sm'
            >
                <Flex
                    flexDirection='column'
                    alignItems='center'
                >
                    <Flex
                        size={isPending ? 12 : 20}
                        marginY={isPending && 1}
                        borderColor='transparent'
                        backgroundColor={isActive ? 'green' : isPending ? 'midGray' : 'gray'}
                        borderRadius='full'
                    >
                        {isPending || (
                            <Icon
                                color='white'
                                name='checkmark'
                                size={12}
                                margin='auto'
                                data-at={Sephora.debug.dataAt(`${dataAt[index]}_checkmark_icon`)}
                            />
                        )}
                    </Flex>
                    {isLast || (
                        <Box
                            width='2px'
                            flex={1}
                            marginY={1}
                            backgroundColor='gray'
                        />
                    )}
                </Flex>
                <Box paddingBottom={isLast || 5}>
                    <Text
                        data-at={Sephora.debug.dataAt(`${dataAt[index]}_title`)}
                        is='p'
                        fontSize='base'
                        fontWeight={isActive && 'bold'}
                        marginTop={isActive || '.125em'}
                        marginBottom={isActive && 1}
                        color={isActive ? 'green' : isPending ? 'gray' : 'black'}
                        children={state}
                    />
                    {isReadyForPickupActive && (
                        <div>
                            {isBopisOrder ? (
                                <>
                                    {(isInStorePickup || !isCurbsideConciergePickup) && this.getInStorePickupAddressLink(address)}
                                    {isCurbsideConciergePickup && isConciergePurchaseEnabled && this.getConciergeCurbsideLocationRedirectText()}
                                </>
                            ) : (
                                <div data-at={Sephora.debug.dataAt('ready_for_pickup_store_location_label')}>
                                    {address.address1}, {address.city}, {address.state} {address.postalCode}
                                    <br />
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        onClick={openInStoreAddressLinkModal}
                                        data-at={Sephora.debug.dataAt('ready_for_pickup_store_details_link')}
                                        children={storeDetailsText}
                                        color='blue'
                                    />
                                    <Text
                                        color='midGray'
                                        marginX='1em'
                                        children='|'
                                    />
                                    {this.getFaqLink()}
                                </div>
                            )}
                        </div>
                    )}
                    {isActive &&
                        sortStateMessages.map((item, i) => {
                            const { statusMessageComponent, errorMessage, message } = item;

                            if (errorMessage) {
                                return (
                                    <Grid
                                        key={i}
                                        columns='auto 1fr'
                                        marginY={3}
                                        padding={2}
                                        gap={2}
                                        backgroundColor='white'
                                        border={1}
                                        borderColor='lightGray'
                                        borderRadius={2}
                                    >
                                        <Icon
                                            name='alert'
                                            size={20}
                                            color='red'
                                        />
                                        <span css={{ alignSelf: 'center' }}>{errorMessage}</span>
                                    </Grid>
                                );
                            } else {
                                if (statusMessageComponent) {
                                    const StatusMessage = statusMessageComponent;

                                    return (
                                        <StatusMessage
                                            hrefForFaq={hrefForFaq}
                                            key={i}
                                        />
                                    );
                                } else {
                                    const statusMessageDataAt = isReadyForPickupActive
                                        ? Sephora.debug.dataAt('ready_for_pickup_status_message')
                                        : Sephora.debug.dataAt('preparing_your_order_status_message');

                                    return (
                                        <Markdown
                                            content={replaceDoubleAsterisks(message)}
                                            data-at={statusMessageDataAt}
                                            key={i}
                                            marginTop={(isReadyForPickupActive || i > 0) && '1em'}
                                        />
                                    );
                                }
                            }
                        })}
                    {isReadyForPickupActive && showCurbsidePickupIndicator && !showInStorePickupInstructions && (
                        <>
                            {isActive && !isCurbsideConciergePickup && showSmsButton && (
                                <BopisSddSmsSignupButton
                                    marginBottom={4}
                                    smsNotificationFlag={smsNotificationFlag}
                                />
                            )}
                            <Divider marginY={3} />
                            <Grid
                                columns='52px auto'
                                marginY={3}
                                padding={2}
                                gap={2}
                            >
                                <Image
                                    src='/img/ufe/order/curbsideConfirmation.svg'
                                    width={40}
                                    height={40}
                                />
                                <div>
                                    {isActive && !isCurbsideConciergePickup && (
                                        <>
                                            <Text
                                                is='p'
                                                fontWeight='bold'
                                            >
                                                {curbsidePickUpFirstLine}
                                            </Text>
                                            <Text is='p'>
                                                {curbsidePickUpParagraphPrefix}
                                                <Link
                                                    color='blue'
                                                    underline={true}
                                                    onClick={this.clickHandlerCurbsidePickup}
                                                >
                                                    {' '}
                                                    {seeBelow}{' '}
                                                </Link>
                                                {curbsidePickUpParagraphSufix}
                                            </Text>
                                        </>
                                    )}
                                    {isActive && isCurbsideConciergePickup && isConciergePurchaseEnabled && (
                                        <>
                                            <Text
                                                is='p'
                                                fontWeight='bold'
                                            >
                                                {curbsideConciergeInstructionsTitle}
                                            </Text>
                                            <Text is='p'>
                                                {conciergePickupPrefix}
                                                <Link
                                                    color='blue'
                                                    underline={true}
                                                    onClick={this.clickHandlerConciergeCurbsidePickup}
                                                >
                                                    {' '}
                                                    {describedBelow}{' '}
                                                </Link>
                                                {conciergePickupSuffix}
                                            </Text>
                                        </>
                                    )}
                                    <Button
                                        key='curbsidePickup'
                                        marginTop={3}
                                        size='sm'
                                        minWidth='10em'
                                        variant='secondary'
                                        onClick={this.handleCurbsidePickupClick(isCurbsideAvailable)}
                                        children={curbsidePickup}
                                    />
                                    {isCurbsideConciergePickup && isConciergePurchaseEnabled && (
                                        <>
                                            <Text
                                                is='p'
                                                paddingTop={2}
                                            >
                                                {curbsideConciergePickupRequirement}
                                            </Text>
                                            {showSmsButton && (
                                                <BopisSddSmsSignupButton
                                                    marginBottom={null}
                                                    smsNotificationFlag={smsNotificationFlag}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </Grid>
                            {isCurbsideConciergePickup && isConciergePurchaseEnabled && <Divider marginBottom={4} />}
                        </>
                    )}
                    {isReadyForPickupActive && !isCheckout && (
                        <>
                            {showCallStoreButton && !showCurbsidePickupIndicator && (
                                <Button
                                    key='callStore'
                                    marginTop={3}
                                    size='sm'
                                    minWidth='10em'
                                    variant='secondary'
                                    href={'tel:' + storePhoneNumber}
                                    children={callStore}
                                />
                            )}
                            <Box marginY={3}>
                                {isBopisOrder ? (
                                    <>
                                        {!showCurbsidePickupIndicator && showSmsButton && (
                                            <BopisSddSmsSignupButton smsNotificationFlag={smsNotificationFlag} />
                                        )}
                                        {this.getFaqLink(true)}
                                    </>
                                ) : (
                                    <Text
                                        is='p'
                                        display={['none', 'block']}
                                        data-at={Sephora.debug.dataAt('barcode_disclaimer_label')}
                                        children={pickupBarcodeMsg}
                                    />
                                )}
                            </Box>
                        </>
                    )}
                    {isProcessingActive && !isCheckout && (
                        <>
                            {showSmsButton && <BopisSddSmsSignupButton smsNotificationFlag={smsNotificationFlag} />}
                            {this.getFaqLink(isBopisOrder)}
                        </>
                    )}
                    {isCheckout && (isBopisOrder || isSameDayOrder) && isActive && showSmsButton && (
                        <BopisSddSmsSignupButton
                            isCheckout={isCheckout}
                            marginBottom={isBopisOrder ? 3 : 1}
                            smsNotificationFlag={smsNotificationFlag}
                        />
                    )}
                    {isProcessingActive && isCheckout && isBopisOrder && this.getFaqLink(isBopisOrder)}
                    {!isCheckout && isSameDayOrder && isSddNotDelivered && showSmsButton && (
                        <BopisSddSmsSignupButton
                            marginBottom={1}
                            smsNotificationFlag={smsNotificationFlag}
                        />
                    )}
                    {!isCheckout && isSameDayOrder && isSddDelivered && this.renderSddTrackingFaqLinks(trackingUrl, showModal)}
                </Box>
            </Grid>
        );
    }
}

export default wrapComponent(OrderStatusProgressionDetail, 'OrderStatusProgressionDetail', true);
