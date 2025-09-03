/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Flex, Container, Box
} from 'components/ui';
import Header from 'components/FrictionlessCheckout/Header/Header';
import CompactFooter from 'components/Footer/CompactFooter';
import DeliverTo from 'components/FrictionlessCheckout/DeliverTo';
import FrictionlessCheckoutConstants from 'utils/FrictionlessCheckoutConstants';
import SddCard from 'components/FrictionlessCheckout/SddSection/SddCard';
import PickupInfoCard from 'components/FrictionlessCheckout/BopisSection/PickupInfoCard';
import CheckoutLayout from 'components/FrictionlessCheckout/CheckoutLayout/CheckoutLayout';
import TopContent from 'components/FrictionlessCheckout/TopContent';
import GiftCard from 'components/FrictionlessCheckout/GiftCard/GiftCard';
import CostSummary from 'components/FrictionlessCheckout/CostSummary';
import BIBenefits from 'components/FrictionlessCheckout/BIBenefits';
import ShippingMethods from 'components/FrictionlessCheckout/ShippingMethods';
import Payment from 'components/FrictionlessCheckout/Payment';
import GiftCardDeliverySection from 'components/FrictionlessCheckout/GiftCardDeliverySection';
import ZeroCheckoutItems from 'components/FrictionlessCheckout/ZeroCheckoutItems/ZeroCheckoutItems';
import creditCardUtils from 'utils/CreditCard';
import sessionExtensionService from 'services/SessionExtensionService';

const { loadChaseTokenizer } = creditCardUtils;

const {
    ORDER_TYPES: { GET_IT_SHIPPED }
} = FrictionlessCheckoutConstants;

class FrictionlessCheckout extends BaseClass {
    unsubscribe = null;
    state = {
        forcePaymentSectionRender: false
    };

    componentDidMount() {
        this.unsubscribe = this.props.basketUpdated();

        if (Sephora.configurationSettings.isChasePaymentEnabled) {
            loadChaseTokenizer();
        }

        sessionExtensionService.setExpiryTimer(this.props.requestCounter);
    }

    componentDidUpdate(prevProps) {
        const forcePaymentSectionRender = this.props.creditCardsCount && this.props.isEfullfillmentOrder;

        if (prevProps.creditCardsCount !== this.props.creditCardsCount && forcePaymentSectionRender) {
            this.setState({ forcePaymentSectionRender: true });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    getCheckoutConfiguration = () => {
        const componentsToRender = [];
        let sectionNumber = 1;
        const {
            isBopisOrder,
            hardGoodShippingGroup,
            isZeroCheckout,
            isHalAvailable,
            isSdd,
            isAutoReplenishBasket,
            isGis,
            isGiftCardAvailable,
            orderId,
            giftMessagingStatus,
            hasRRC,
            isSDUOnlyOrder,
            isElectronicShippingGroup,
            hasSDUInBasket,
            sameDayShippingGroup,
            hardGoodOrGiftCardShippingGroup,
            contentData,
            physicalGiftCardShippingGroup,
            hasStandardItems,
            isChangePermittedForShippingMethods,
            isNewUserFlow,
            shouldRenderPayment,
            isShippableOrder,
            hasSDUOnlyInSddBasket,
            orderHasPhysicalGiftCard,
            isGuestCheckout,
            zeroDollarHigherRedeemPointsCVV,
            zeroDollarHigherRedeemPointsNotCVV,
            isEfullfillmentOrder
        } = this.props;

        const isPhysicalGiftCardOnly = physicalGiftCardShippingGroup && !hardGoodShippingGroup && !isSdd;
        const shouldRenderGiftCardDeliverySection = physicalGiftCardShippingGroup && !isZeroCheckout && !isSdd;

        if (isZeroCheckout && !isShippableOrder && !isSDUOnlyOrder) {
            componentsToRender.push(<ZeroCheckoutItems />);
        }

        if (shouldRenderGiftCardDeliverySection) {
            componentsToRender.push(
                <GiftCardDeliverySection
                    sectionNumber={sectionNumber}
                    orderType={GET_IT_SHIPPED}
                    shippingGroup={physicalGiftCardShippingGroup}
                    isZeroCheckout={isZeroCheckout}
                    isNewUserFlow={isNewUserFlow}
                    orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                    isGuestCheckout={isGuestCheckout}
                />
            );
            sectionNumber++;
        }

        if (
            (!isBopisOrder && hardGoodShippingGroup) ||
            (hasSDUInBasket && isSDUOnlyOrder === false) ||
            (isElectronicShippingGroup === false && !hasSDUInBasket && !isPhysicalGiftCardOnly) ||
            (isElectronicShippingGroup && isSdd)
        ) {
            componentsToRender.push(
                <DeliverTo
                    sectionNumber={sectionNumber}
                    orderType={GET_IT_SHIPPED}
                    shippingGroup={sameDayShippingGroup?.shippingGroup || hardGoodShippingGroup}
                    isZeroCheckout={isZeroCheckout}
                    isHalAvailable={isHalAvailable}
                    isSdd={isSdd}
                    hasSDUOnlyInSddBasket={hasSDUOnlyInSddBasket}
                    isAutoReplenishBasket={isAutoReplenishBasket}
                    isGis={isGis}
                    isNewUserFlow={isNewUserFlow}
                    isCollapsed={physicalGiftCardShippingGroup && !physicalGiftCardShippingGroup?.isComplete && !isSdd}
                    orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                    hasCmsContent={Object.keys(contentData).length > 0}
                />
            );
            sectionNumber++;
        }

        if ((isGiftCardAvailable && orderId && giftMessagingStatus && !isZeroCheckout) || (isZeroCheckout && isShippableOrder)) {
            componentsToRender.push(
                <GiftCard
                    orderId={orderId}
                    giftMessagingStatus={giftMessagingStatus}
                />
            );
        }

        if (
            (!isBopisOrder && !isSdd && (!isZeroCheckout || (isZeroCheckout && hasRRC) || isAutoReplenishBasket) && !isPhysicalGiftCardOnly) ||
            (isZeroCheckout && isShippableOrder)
        ) {
            componentsToRender.push(
                <ShippingMethods
                    sectionNumber={sectionNumber}
                    infoModalData={contentData?.fulfillmentTypeAutoReplenish}
                    isChangePermitted={isChangePermittedForShippingMethods}
                    isNewUserFlow={isNewUserFlow}
                    isPhysicalGiftCard={!isBopisOrder && physicalGiftCardShippingGroup}
                    middleZone={contentData.middleZone}
                />
            );
            sectionNumber++;
        }

        if (isSdd) {
            componentsToRender.push(
                <SddCard
                    sectionNumber={sectionNumber}
                    infoModalData={contentData?.fulfillmentTypeSameDayDelivery}
                    isNewUserFlow={isNewUserFlow}
                />
            );
            sectionNumber++;

            if (
                (hasSDUInBasket && !isSDUOnlyOrder && hardGoodOrGiftCardShippingGroup) ||
                (hasStandardItems && !hasSDUInBasket && !isPhysicalGiftCardOnly) ||
                isElectronicShippingGroup
            ) {
                componentsToRender.push(
                    <ShippingMethods
                        sectionNumber={sectionNumber}
                        infoModalData={contentData?.fulfillmentTypeAutoReplenish}
                        isChangePermitted={isChangePermittedForShippingMethods}
                        isNewUserFlow={isNewUserFlow}
                        isPhysicalGiftCard={!isBopisOrder && physicalGiftCardShippingGroup}
                        middleZone={contentData.middleZone}
                        isSdd
                    />
                );
                sectionNumber++;
            }
        }

        if (isBopisOrder) {
            componentsToRender.push(<PickupInfoCard sectionNumber={sectionNumber} />);
            sectionNumber++;
        }

        if (shouldRenderPayment || this.state.forcePaymentSectionRender) {
            const shippingGroup = sameDayShippingGroup?.shippingGroup || hardGoodShippingGroup;
            componentsToRender.push(
                <Payment
                    sectionNumber={!isEfullfillmentOrder && sectionNumber}
                    isNewUserFlow={isNewUserFlow && !isBopisOrder}
                    hasSavedAddress={isSDUOnlyOrder || !!shippingGroup?.address || isBopisOrder}
                    hasGiftCardInOrder={shouldRenderGiftCardDeliverySection}
                    isGuestCheckout={isGuestCheckout}
                    isShippableOrder={isShippableOrder}
                    zeroDollarHigherRedeemPointsCVV={zeroDollarHigherRedeemPointsCVV}
                    zeroDollarHigherRedeemPointsNotCVV={zeroDollarHigherRedeemPointsNotCVV}
                    isEfullfillmentOrder={isEfullfillmentOrder}
                    orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                    forcePaymentSectionRender={this.state.forcePaymentSectionRender}
                    renderSubTitle={hasSDUInBasket || isAutoReplenishBasket}
                />
            );
            sectionNumber++;
        }

        return componentsToRender;
    };

    getMainContent = () => {
        const { contentData, isShippableOrder } = this.props;

        return (
            <>
                <TopContent
                    content={contentData?.contentZone}
                    isZeroCheckout={this.props.isZeroCheckout}
                    isShippableOrder={isShippableOrder}
                />
                {this.getCheckoutConfiguration()}
            </>
        );
    };

    getSidebarContent = () => {
        const { biBenifits, biBenefitsModals, isBopisOrder, isZeroCheckout } = this.props;

        return (
            <Flex
                flexDirection={['column-reverse', 'column']}
                gap={[4, 4, 5]}
                position={[null, 'sticky']}
                top={[null, 0]}
            >
                <CostSummary isZeroCheckout={this.props.isZeroCheckout} />
                {!isZeroCheckout && biBenifits.length > 0 && (
                    <BIBenefits
                        biBenifits={biBenifits}
                        biBenefitsModals={biBenefitsModals}
                        isBopisOrder={isBopisOrder}
                    />
                )}
            </Flex>
        );
    };

    render() {
        const { isBopisOrder, localization } = this.props;

        return (
            <Box
                minHeight='100vh'
                display='flex'
                flexDirection='column'
            >
                <Header />
                <Container px={[4, 5, 4]}>
                    <Text
                        is='h1'
                        fontSize={['lg', 'lg', 'xl']}
                        paddingTop={[4, 4, 5]}
                        fontWeight='bold'
                        children={isBopisOrder ? localization.bopisTitle : localization.sadTitle}
                    />
                    <CheckoutLayout
                        mainContent={this.getMainContent()}
                        sidebarContent={this.getSidebarContent()}
                    />
                </Container>
                <Box marginTop='auto'>
                    <CompactFooter hideWebsiteFeedback />
                </Box>
            </Box>
        );
    }
}

export default wrapComponent(FrictionlessCheckout, 'FrictionlessCheckout', true);
