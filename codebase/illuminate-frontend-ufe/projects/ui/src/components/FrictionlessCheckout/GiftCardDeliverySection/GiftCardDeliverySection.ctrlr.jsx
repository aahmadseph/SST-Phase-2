/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import LayoutCard from 'components/FrictionlessCheckout/LayoutCard/LayoutCard';
import ShipAddressSection from 'components/FrictionlessCheckout/DeliverTo/ShipAddress/Section';
import AddressDisplay from 'components/FrictionlessCheckout/DeliverTo/AddressDisplay';
import CheckoutItemsList from 'components/FrictionlessCheckout/CheckoutItemsList';
import { Box, Divider, Text } from 'components/ui';
import dateUtils from 'utils/Date';
import BasketConstants from 'constants/Basket';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { BasketType } = BasketConstants;

const ShippingAddressInformation = ({ address, onChangeClick }) => (
    <Box paddingX={[4, 4, 5]}>
        <AddressDisplay
            address={address}
            showEdit={true}
            onChangeClick={onChangeClick}
        />
    </Box>
);

class GiftCardDeliverySection extends BaseClass {
    state = {
        isEditMode: false,
        isEditByChangeLink: false
    };

    componentDidMount() {
        this.props.getAddressBook(false);
    }

    componentDidUpdate(prevProps) {
        const { addressByPreferredZipCode: prevAddressByPreferredZipCode } = prevProps;
        const { addressByPreferredZipCode } = this.props;

        if (prevAddressByPreferredZipCode !== addressByPreferredZipCode && addressByPreferredZipCode > 1) {
            this.setEditChangeLink(true);
        }
    }

    setIsEdit = isEditMode => {
        this.setState({ isEditMode });
    };

    setEditChangeLink = isEditMode => {
        this.setState({ isEditMode: isEditMode, isEditByChangeLink: isEditMode });
    };

    renderCardBody = () => {
        const {
            isZeroCheckout, addressList, isNewUserFlow, shippingGroup, localization, isGuestCheckout, orderHasPhysicalGiftCard
        } = this.props;

        const { address, isComplete, shippingGroupId, shippingMethod } = shippingGroup;
        const { promiseDate, promiseDateLabel, shippingMethodType } = shippingMethod;
        const { free } = localization;

        const { isEditByChangeLink } = this.state;

        return (
            <>
                {address && isComplete && !isEditByChangeLink ? (
                    <>
                        <ShippingAddressInformation
                            address={address}
                            setIsEdit={this.setIsEdit}
                            onChangeClick={this.setEditChangeLink}
                        />
                        <Box marginX={[4, 4, 5]}>
                            <Divider marginY={4} />
                            <Text
                                is='p'
                                fontWeight='bold'
                                children={`${free} ${shippingMethodType}`}
                            />
                            {promiseDate && (
                                <Text
                                    is='p'
                                    color='green'
                                    fontWeight='bold'
                                    children={`${promiseDateLabel} ${dateUtils.getPromiseDate(promiseDate)} `}
                                />
                            )}
                            <Divider marginY={4} />
                            <CheckoutItemsList
                                shouldDisplayTitle={true}
                                giftCardsOnly
                                basketType={BasketType.Standard}
                            />
                        </Box>
                    </>
                ) : (
                    <Box paddingX={[4, 4, 5]}>
                        <ShipAddressSection
                            isNewUserFlow={isNewUserFlow}
                            shippingAddress={address}
                            profileAddresses={addressList || []}
                            shippingGroupId={shippingGroupId}
                            isComplete={isComplete}
                            isZeroCheckout={isZeroCheckout}
                            isGuestCheckout={isGuestCheckout}
                            shippingMethod={shippingMethod}
                            setAccessPoint={this.setEditChangeLink}
                            orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                            isGiftCardSection={true}
                        />
                    </Box>
                )}
            </>
        );
    };

    render() {
        const { localization, sectionNumber, isNewUserFlow } = this.props;
        const { isEditMode } = this.state;
        const title = localization.giftCardTitle;

        return (
            <LayoutCard
                sectionInfo={{
                    sectionNumber,
                    title,
                    hasDivider: true,
                    isChangePermitted: false,
                    sectionName: SECTION_NAMES.GIFT_CARD_DELIVERY
                }}
                marginTop={[4, 4, 5]}
                hasPaddingForChildren={false}
                isEditMode={isEditMode || isNewUserFlow}
                buttonCustomStyle={styles}
                isNewUserFlow={isNewUserFlow}
                ariaLabel={localization.giftCardTitle}
                role='region'
            >
                {this.renderCardBody()}
            </LayoutCard>
        );
    }
}

const styles = {
    button: {
        width: '48%'
    }
};

export default wrapComponent(GiftCardDeliverySection, 'GiftCardDeliverySection', true);
