import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Flex, Grid, Link, Text, Icon, Image, Button, Divider
} from 'components/ui';
import skuUtils from 'utils/Sku';
import BasketMsg from 'components/BasketMsg';
import Markdown from 'components/Markdown/Markdown';
import BasketItem from 'components/InlineBasket/BasketDesktop/BasketItem';
import ErrorMsg from 'components/ErrorMsg';
import CreditCardBanner from 'components/CreditCard/CreditCardBanner';
import TestTarget from 'components/TestTarget/TestTarget';
import basketConstants from 'constants/Basket';
import basketUtils from 'utils/Basket';
import { getBiFreeShippingText } from 'utils/getBiFreeShippingText';
import AddToBasketActions from 'actions/AddToBasketActions';
import store from 'store/Store';
import actions from 'actions/Actions';

const { BASKET_TYPES } = AddToBasketActions;

const Header = ({ localization, hasItems, onBasketClick }) => (
    <Flex justifyContent='space-between'>
        <Text
            fontWeight='bold'
            css={{ textTransform: 'capitalize' }}
            children={localization.basket}
        />
        {hasItems && (
            <Link
                href='/basket'
                color='blue'
                padding={2}
                margin={-2}
                onClick={onBasketClick}
                children={localization.viewAll}
            />
        )}
    </Flex>
);

const FreeShipMessage = ({
    shouldDisplayBiFreeShippingText, messageLogo, messageContext, messages, localization
}) => {
    if (
        /*
         * messageLogo === freeShipLogo is true for
         * basket.thresholdFreeShipping
         * basket.freeship
         */
        !(messageLogo === 'freeShipLogo' || shouldDisplayBiFreeShippingText) ||
        !messageContext ||
        !messages ||
        (messages && !messages.length)
    ) {
        return null;
    }

    return (
        <Grid
            columns='auto 1fr'
            fontSize='sm'
            gap={3}
        >
            <Icon
                name='truck'
                size={20}
            />
            {shouldDisplayBiFreeShippingText ? (
                <span
                    data-at={Sephora.debug.dataAt('inline_basket_msg')}
                    children={getBiFreeShippingText()}
                    css={{ alignSelf: 'center' }}
                />
            ) : (
                <span
                    data-at={Sephora.debug.dataAt('inline_basket_msg')}
                    css={{ alignSelf: 'center' }}
                >
                    {messageContext === basketConstants.FREE_SHIPPING_THRESHOLD && (
                        <strong css={{ textTransform: 'uppercase' }}>{localization.freeShipping}.&nbsp;</strong>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: messages[0] }} />
                </span>
            )}
        </Grid>
    );
};

const Footer = ({ localization, nonErrorMsg = {}, onBasketClick }) => {
    const shouldDisplayBiFreeShippingText = basketUtils.shouldDisplayBiFreeShippingText();

    return (
        <>
            <Grid
                columns='auto 1fr'
                alignItems='center'
                marginTop={3}
                gap={3}
            >
                <Image
                    src='/img/ufe/icons/rewards-bazaar.svg'
                    size={20}
                />
                <Text
                    is='p'
                    fontSize='sm'
                    data-at={Sephora.debug.dataAt('inline_basket_promo_message')}
                >
                    {`${localization.seeSamplesRewardsPromotions} `}
                    <Link
                        href='/basket'
                        color='blue'
                        underline={true}
                        padding={2}
                        margin={-2}
                        onClick={onBasketClick}
                    >
                        {localization.basket}
                    </Link>
                    .
                </Text>
            </Grid>
            <Divider
                marginY={3}
                marginX={-4}
            />
            <FreeShipMessage
                shouldDisplayBiFreeShippingText={shouldDisplayBiFreeShippingText}
                messageLogo={nonErrorMsg.messageLogo}
                messageContext={nonErrorMsg.messageContext}
                messages={nonErrorMsg.messages}
                localization={localization}
            />
            {nonErrorMsg?.messageLogo !== 'freeShipLogo' && !shouldDisplayBiFreeShippingText && (
                <BasketMsg
                    fontSize='sm'
                    data-at={Sephora.debug.dataAt('inline_basket_msg')}
                />
            )}
            <TestTarget
                testName='creditCardBanners'
                source='inline'
                testEnabled
                testComponent={CreditCardBanner}
                isInlineBasket
            />
        </>
    );
};

class BasketItems extends React.Component {
    // eslint-disable-next-line complexity
    renderItems = isPickup => {
        const {
            basket,
            basket: { itemsByBasket = [], pickupBasket = {}, appliedPromotions = [] },
            localization
        } = this.props;

        if (isPickup && !(pickupBasket.itemCount > 0)) {
            return null;
        }

        const hasBothItems = basket.itemCount > 0 && pickupBasket.itemCount > 0;
        let dataAt = isPickup ? 'buy_online_header' : 'get_it_shipped_header';
        let basketToRender;
        let sddBasket;
        let standardAndAutoreplenishBasket;
        let standardOnlyBasket;
        let standardBasket;
        let autoreplenishBasket;
        let hasSddItems = false;
        let hasStandardItems = false;
        let hasAutoreplenishItems = false;
        let hasAutoreplenishItemsAndSomethingElse = false;
        let hasSddAndStandardItems = false;

        if (isPickup) {
            dataAt = 'buy_online_header';
            basketToRender = pickupBasket;
        } else {
            dataAt = 'get_it_shipped_header';
            basketToRender = basket;
            sddBasket = itemsByBasket.find(item => item.basketType === BASKET_TYPES.SAMEDAY_BASKET) || {};
            standardAndAutoreplenishBasket = itemsByBasket.find(item => item.basketType === BASKET_TYPES.STANDARD_BASKET) || {};

            standardOnlyBasket = { items: (standardAndAutoreplenishBasket?.items || []).filter(item => !item.isReplenishment) } || {};

            standardBasket = standardOnlyBasket;

            autoreplenishBasket = { items: (standardAndAutoreplenishBasket?.items || []).filter(item => item.isReplenishment) } || {};

            hasSddItems = (sddBasket.items || []).length > 0;
            hasStandardItems = (standardBasket.items || []).length > 0;
            hasSddAndStandardItems = hasSddItems && hasStandardItems;
            hasAutoreplenishItems = (autoreplenishBasket?.items || []).length > 0;
            hasAutoreplenishItemsAndSomethingElse = hasAutoreplenishItems && (hasStandardItems || hasSddItems);
        }

        return (
            <>
                {hasBothItems && (
                    <Text
                        backgroundColor='nearWhite'
                        data-at={Sephora.debug.dataAt(dataAt)}
                        fontWeight='bold'
                        is='p'
                        lineHeight='tight'
                        paddingX={4}
                        paddingY={2}
                    >
                        {isPickup
                            ? pickupBasket.storeDetails?.isBopisable
                                ? localization.bopisHeader
                                : localization.reserveHeader
                            : localization.basketHeader}
                        {` (${basketToRender.itemCount})`}
                    </Text>
                )}
                {isPickup &&
                    (basketToRender.items || []).map((item, index) => (
                        <BasketItem
                            index={index}
                            isRopis={isPickup}
                            item={item}
                            key={item.commerceId || `${isPickup ? 'pickup' : 'basket'}Item_${index}`}
                            appliedPromotions={appliedPromotions}
                        />
                    ))}
                {!isPickup && (
                    <>
                        {hasSddItems && (
                            <>
                                <Text
                                    color='gray'
                                    fontSize='xs'
                                    is='p'
                                    marginLeft={4}
                                    marginTop={3}
                                >
                                    {localization.sameDayDelivery}
                                </Text>
                                {sddBasket.items.map((item, index) => (
                                    <BasketItem
                                        index={index}
                                        isRopis={isPickup}
                                        item={item}
                                        key={item.commerceId || `${isPickup ? 'pickup' : 'basket'}Item_${index}`}
                                        appliedPromotions={appliedPromotions}
                                    />
                                ))}
                            </>
                        )}
                        {hasSddAndStandardItems && <Divider thick />}
                        {hasStandardItems && (
                            <>
                                <Text
                                    color='gray'
                                    fontSize='xs'
                                    is='p'
                                    marginLeft={4}
                                    marginTop={3}
                                >
                                    {localization.standardDelivery}
                                </Text>
                                {standardBasket.items.map((item, index) => (
                                    <BasketItem
                                        index={index}
                                        isRopis={isPickup}
                                        item={item}
                                        key={item.commerceId || `${isPickup ? 'pickup' : 'basket'}Item_${index}`}
                                        appliedPromotions={appliedPromotions}
                                    />
                                ))}
                            </>
                        )}
                        {
                            <>
                                {hasAutoreplenishItemsAndSomethingElse && <Divider thick />}
                                {hasAutoreplenishItems && (
                                    <>
                                        <Text
                                            color='gray'
                                            fontSize='xs'
                                            is='p'
                                            marginLeft={4}
                                            marginTop={3}
                                        >
                                            {localization.autoreplenish}
                                        </Text>
                                        {autoreplenishBasket.items.map((item, index) => (
                                            <BasketItem
                                                index={index}
                                                isRopis={false}
                                                item={item}
                                                key={item.commerceId || `basketItem_${index}`}
                                                appliedPromotions={appliedPromotions}
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        }
                    </>
                )}
            </>
        );
    };

    renderTotal = isPickup => {
        const {
            basket,
            basket: { pickupBasket = {} },
            localization
        } = this.props;

        if ((isPickup && !(pickupBasket.itemCount > 0)) || (!isPickup && !(basket?.itemCount > 0))) {
            return null;
        }

        let basketToRender;
        let label;
        let type = 'dc';
        let dataAt = '';
        const getItShippedOnly = basket.itemCount > 0 && pickupBasket?.itemCount === 0;

        if (isPickup) {
            basketToRender = pickupBasket;

            if (pickupBasket.storeDetails?.isBopisable) {
                label = 'bopisTotal';
                type = 'bopis';
                dataAt = 'bopis_';
            } else {
                label = 'reserveTotal';
                type = 'ropis';
            }
        } else {
            basketToRender = basket;

            if (getItShippedOnly) {
                label = 'basketTotal';
            } else {
                label = 'dcTotal';
            }
        }

        const itemsCountText = `${basketToRender.itemCount} ${localization.item}${basketToRender.itemCount === 1 ? '' : 's'}`;

        return (
            <Grid
                columns='1fr auto'
                data-at={Sephora.debug.dataAt(`inline_basket_${dataAt}total_message`)}
                marginY={2}
            >
                <span>
                    <strong children={localization[label]} />
                    {getItShippedOnly ? (
                        <span>{` (${itemsCountText})`}</span>
                    ) : (
                        <Link
                            color='blue'
                            underline={true}
                            href={`/basket?type=${type}`}
                        >
                            {` (${itemsCountText})`}
                        </Link>
                    )}
                </span>
                <strong children={basketToRender.rawSubTotal} />
            </Grid>
        );
    };

    render() {
        const { localization, onCheckoutClick, scrollRef } = this.props;

        return (
            <>
                <Box
                    ref={scrollRef}
                    overflowY='auto'
                    minHeight={104}
                    marginX={-4}
                >
                    {this.renderItems(true)}
                    {this.renderItems(false)}
                </Box>
                <Divider marginX={-4} />
                <Box marginY={2}>
                    {this.renderTotal(true)}
                    {this.renderTotal(false)}
                </Box>
                <Button
                    block={true}
                    variant='special'
                    onClick={onCheckoutClick}
                >
                    {localization.checkout}
                </Button>
            </>
        );
    }
}

const EmptyBasket = ({ localization, isAnonymous, signInHandler }) => (
    <>
        <Box
            textAlign='center'
            paddingTop={5}
        >
            {!isAnonymous ? (
                <>
                    <Text
                        is='p'
                        fontWeight='bold'
                        marginBottom={4}
                        children={localization.emptyBasket}
                    />
                    <Button
                        href='/new-beauty-products'
                        variant='primary'
                        hasMinWidth={true}
                        size='sm'
                    >
                        {localization.shopNewArrivals}
                    </Button>
                </>
            ) : (
                <>
                    <Text
                        is='p'
                        fontWeight='bold'
                        paddingX={5}
                        marginBottom={4}
                        children={localization.sigInToSeeItems}
                    />
                    <Grid
                        gap={3}
                        columns={2}
                    >
                        <Button
                            variant='primary'
                            size='sm'
                            block={true}
                            onClick={signInHandler}
                            children={localization.signIn}
                        />
                        <Button
                            variant='secondary'
                            size='sm'
                            block={true}
                            onClick={() => store.dispatch(actions.showRegisterModal({ isOpen: true }))}
                            children={localization.createAccount}
                        />
                    </Grid>
                </>
            )}
        </Box>
        <Divider
            marginX={-4}
            marginTop={6}
        />
    </>
);

class BasketDesktop extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { isMounted: false };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
    }

    addMessageToItem = (basketItems, msg) => {
        const itemLevelMessages = [msg];

        basketItems.forEach(item => {
            if (item.sku.skuId === skuUtils.VIB_CURTAINS_UP_FREE_SHIPPING) {
                Object.assign(item, { itemLevelMessages });
            }
        });

        return basketItems;
    };

    render() {
        if (!this.state.isMounted) {
            return null;
        }

        const {
            localization, isAnonymous, basket, onBasketClick, onCheckoutClick, scrollRef, signInHandler
        } = this.props;

        const { error = {} } = basket;
        const { errorMessages = [] } = error;

        if (errorMessages.length) {
            return (
                <ErrorMsg
                    marginBottom='0'
                    data-at={Sephora.debug.dataAt('inline_basket_error_message')}
                >
                    <Markdown content={errorMessages[0]} />
                </ErrorMsg>
            );
        }

        let nonErrorMsg = {};

        if (basket.basketLevelMessages) {
            nonErrorMsg = basket.basketLevelMessages.filter(item => item.type === 'message').pop();
        }

        const hasItems = (basket && basket.itemCount > 0) || (basket.pickupBasket && basket.pickupBasket.itemCount > 0);

        return (
            <Flex
                flexDirection='column'
                lineHeight='tight'
                maxHeight='inherit'
                paddingBottom={5}
                paddingTop={4}
                paddingX={4}
            >
                <Header
                    localization={localization}
                    hasItems={hasItems}
                    onBasketClick={onBasketClick}
                />
                <Divider
                    marginTop={4}
                    marginX={-4}
                />
                {hasItems ? (
                    <BasketItems
                        basket={basket}
                        localization={localization}
                        onCheckoutClick={onCheckoutClick}
                        scrollRef={scrollRef}
                    />
                ) : (
                    <EmptyBasket
                        localization={localization}
                        isAnonymous={isAnonymous}
                        signInHandler={signInHandler}
                    />
                )}
                {hasItems && (
                    <Divider
                        marginTop={4}
                        marginX={-4}
                    />
                )}
                <Footer
                    localization={localization}
                    nonErrorMsg={nonErrorMsg}
                    onBasketClick={onBasketClick}
                />
            </Flex>
        );
    }
}

BasketDesktop.propTypes = {
    localization: PropTypes.object.isRequired,
    isAnonymous: PropTypes.bool.isRequired,
    basket: PropTypes.object.isRequired
};

export default wrapComponent(BasketDesktop, 'BasketDesktop', true);
