/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import LayoutCard from 'components/FrictionlessCheckout/LayoutCard/LayoutCard';
import AccessPoint from 'components/FrictionlessCheckout/DeliverTo/AccessPoint';
import AddressDisplay from 'components/FrictionlessCheckout/DeliverTo/AddressDisplay';
import ShipToAccessPoint from 'components/FrictionlessCheckout/DeliverTo/ShipToAccessPoint';
import SDDInstructions from 'components/FrictionlessCheckout/DeliverTo/SDDInstructions';
import FrictionlessCheckoutConstants from 'utils/FrictionlessCheckoutConstants';
import ShipAddressSection from 'components/FrictionlessCheckout/DeliverTo/ShipAddress/Section';
import { Box } from 'components/ui';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import checkoutUtils from 'utils/Checkout';
import anaConsts from 'analytics/constants';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const {
    ORDER_TYPES: { GET_IT_SHIPPED }
} = FrictionlessCheckoutConstants;

const HAL_ADDRESS = 'HAL';

const ShippingAddressInformation = ({
    isHal,
    address,
    halOperatingHours,
    isHalAvailable,
    children,
    setIsEdit,
    holdAtLocation,
    showAccessPoint = true,
    showDisplayAddress = true
}) => (
    <Box paddingX={[4, 4, 5]}>
        {showDisplayAddress && (
            <AddressDisplay
                address={address}
                isHal={isHal}
                halOperatingHours={halOperatingHours}
                holdAtLocation={holdAtLocation}
            >
                {isHalAvailable && showAccessPoint && (
                    <AccessPoint
                        isHal={isHal}
                        accessPointCallback={setIsEdit}
                    />
                )}
            </AddressDisplay>
        )}
        {children}
    </Box>
);

class DeliverTo extends BaseClass {
    state = {
        isHal: false,
        isEditMode: false,
        isEditByChangeLink: false,
        isSddWithoutAddressMatch: false,
        loadingAddress: this.props.isSdd,
        isNewAddressAdded: false
    };

    getSubtitle = () => {
        const { localization, isSdd, isAutoReplenishBasket, isGis } = this.props;
        const { sDDAndGISOrders, gISAndAROrders, sDDAndAROrders, sDDAndGISAndAROrders } = localization;
        let subtitle = null;

        if (isSdd && isGis && isAutoReplenishBasket) {
            subtitle = sDDAndGISAndAROrders;
        } else if (isGis && isAutoReplenishBasket) {
            subtitle = gISAndAROrders;
        } else if (isSdd && isAutoReplenishBasket) {
            subtitle = sDDAndAROrders;
        } else if (isSdd && isGis) {
            subtitle = sDDAndGISOrders;
        }

        return subtitle;
    };

    componentDidMount() {
        this.props.getAddressBook(false).then(_ => {
            this.setState({ loadingAddress: false });
        });
        this.setState({ isHal: this.props.shippingGroup.address?.addressType === HAL_ADDRESS });
    }

    componentDidUpdate(prevProps) {
        const { shippingGroup: prevShippingGroup, addressByPreferredZipCode: prevAddressByPreferredZipCode } = prevProps;
        const { shippingGroup, addressByPreferredZipCode, isSdd } = this.props;

        if (prevShippingGroup.address?.addressType !== shippingGroup.address?.addressType) {
            this.setState({ isHal: shippingGroup.address?.addressType === HAL_ADDRESS });
        }

        if (prevAddressByPreferredZipCode !== addressByPreferredZipCode && addressByPreferredZipCode > 1) {
            this.setEditChangeLink(true, false);
        }

        if (
            isSdd &&
            !this.state.isSddWithoutAddressMatch &&
            !this.state.loadingAddress &&
            addressByPreferredZipCode === 0 &&
            !this.state.isNewAddressAdded
        ) {
            this.setState({ isSddWithoutAddressMatch: true, isEditMode: true });
        }
    }

    setIsEdit = isEditMode => {
        this.setState({ isEditMode });
    };

    setEditChangeLink = isEditMode => {
        this.setState({ isEditMode: isEditMode, isEditByChangeLink: isEditMode });

        if (isEditMode) {
            const isGuestCheckout = checkoutUtils.isGuestOrder();
            !isGuestCheckout && FrictionlessCheckoutBindings.setChangeLinkAnalytics(anaConsts.PAGE_TYPES.SHIPPING);
            this.props.setActiveSection(this.props.sectionName);
        }
    };

    setHalWhenChangeLink = isEditMode => {
        this.setState({ isEditMode: isEditMode, isEditByChangeLink: !isEditMode });
    };

    setIsSddWithoutAddressMatch = isSddWithoutAddressMatch => {
        this.setState({ isSddWithoutAddressMatch, isEditMode: isSddWithoutAddressMatch, isNewAddressAdded: true });
    };

    // eslint-disable-next-line complexity
    renderCardBody = () => {
        const {
            localization,
            isZeroCheckout,
            addressList,
            isHalAvailable,
            isNewUserFlow,
            halOperatingHours,
            shippingGroup,
            orderHasPhysicalGiftCard,
            isSdd,
            isCollapsed
        } = this.props;

        const { address, isComplete, shippingGroupId, shippingMethod } = shippingGroup;

        const { isHal, isEditMode, isEditByChangeLink, isSddWithoutAddressMatch } = this.state;
        const isGuestCheckout = checkoutUtils.isGuestOrder();

        return (
            <>
                {isEditByChangeLink && (addressList.length > 0 || address) && (
                    <Box
                        paddingX={[4, 4, 5]}
                        minHeight={133}
                    >
                        <ShipAddressSection
                            isNewUserFlow={isNewUserFlow}
                            shippingAddress={address}
                            profileAddresses={addressList || []}
                            shippingGroupId={shippingGroupId}
                            isComplete={isComplete}
                            orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                            isZeroCheckout={isZeroCheckout}
                            isGuestCheckout={isGuestCheckout}
                            shippingMethod={shippingMethod}
                            setAccessPoint={this.setEditChangeLink}
                            isHalAvailable={isHalAvailable}
                            isSdd={isSdd}
                            isCollapsed={isCollapsed}
                        >
                            {isHalAvailable && (
                                <AccessPoint
                                    isHal={isHal}
                                    accessPointCallback={this.setHalWhenChangeLink}
                                    full
                                />
                            )}
                        </ShipAddressSection>
                    </Box>
                )}
                {!isSddWithoutAddressMatch && address && isComplete ? (
                    <ShippingAddressInformation
                        isHal={isHal}
                        address={address}
                        halOperatingHours={halOperatingHours}
                        isHalAvailable={isHalAvailable}
                        setIsEdit={this.setIsEdit}
                        showAccessPoint={isEditMode || (!isEditMode && !isHal)}
                        holdAtLocation={localization.holdAtLocation}
                        showDisplayAddress={!isEditByChangeLink}
                    >
                        {isHal && !isEditByChangeLink && (
                            <ShipToAccessPoint
                                isComplete={isComplete}
                                shippingAddress={address}
                                editMode={isEditMode}
                                shippingGroupId={shippingGroupId}
                                callback={this.setIsEdit}
                                isGuestCheckout={isGuestCheckout}
                            />
                        )}
                    </ShippingAddressInformation>
                ) : (
                    <Box paddingX={[4, 4, 5]}>
                        {isHal ? (
                            <ShippingAddressInformation
                                isHal={isHal}
                                address={address}
                                halOperatingHours={halOperatingHours}
                                isHalAvailable={isHalAvailable}
                                setIsEdit={this.setIsEdit}
                                holdAtLocation={localization.holdAtLocation}
                            >
                                <ShipToAccessPoint
                                    isComplete={isComplete}
                                    shippingAddress={address}
                                    editMode={isEditMode}
                                    shippingGroupId={shippingGroupId}
                                    callback={this.setIsEdit}
                                    isGuestCheckout={isGuestCheckout}
                                />
                            </ShippingAddressInformation>
                        ) : (
                            <ShipAddressSection
                                isNewUserFlow={isNewUserFlow && !addressList.length}
                                shippingAddress={isSddWithoutAddressMatch && isEditMode ? null : address}
                                profileAddresses={isSddWithoutAddressMatch && isEditMode ? [] : addressList || []}
                                shippingGroupId={shippingGroupId}
                                isComplete={isComplete}
                                orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                                isZeroCheckout={isZeroCheckout}
                                isGuestCheckout={isGuestCheckout}
                                shippingMethod={shippingMethod}
                                setAccessPoint={isSddWithoutAddressMatch ? this.setIsSddWithoutAddressMatch : this.setEditChangeLink}
                                isHalAvailable={isHalAvailable}
                                isSdd={isSdd}
                                isCollapsed={isCollapsed}
                            >
                                {isHalAvailable && (
                                    <AccessPoint
                                        isHal={isHal}
                                        accessPointCallback={this.setIsEdit}
                                        full
                                    />
                                )}
                            </ShipAddressSection>
                        )}
                    </Box>
                )}
            </>
        );
    };

    render() {
        const {
            orderType, localization, sectionNumber, isSdd, isNewUserFlow, isCollapsed, hasSDUOnlyInSddBasket, sectionLevelError, hasCmsContent
        } =
            this.props;
        const { isEditMode, loadingAddress, isEditByChangeLink } = this.state;

        let title;

        if (orderType === GET_IT_SHIPPED) {
            title = localization.getItShippedTitle;
        }

        const subTitle = isCollapsed ? null : this.getSubtitle();

        return (
            <LayoutCard
                sectionInfo={{
                    sectionNumber: !sectionLevelError && sectionNumber,
                    title,
                    subTitle,
                    hasDivider: true,
                    isChangePermitted: !isEditMode,
                    onChangeClick: this.setEditChangeLink,
                    sectionLevelError,
                    sectionName: SECTION_NAMES.DELIVER_TO
                }}
                {...(hasCmsContent && { marginTop: [4, 4, 5] })}
                hasPaddingForChildren={false}
                isEditMode={(isEditMode || isNewUserFlow) && !isCollapsed}
                buttonCustomStyle={styles}
                isNewUserFlow={isNewUserFlow}
                isCollapsed={isCollapsed}
                ariaLabel={localization.deliveryAndPickupInformation}
                role='region'
            >
                {loadingAddress && isSdd ? (
                    <Box
                        paddingX={[4, 4, 5]}
                        minHeight={133}
                    />
                ) : (
                    <>
                        {this.renderCardBody()}
                        {isSdd && !hasSDUOnlyInSddBasket && !isEditMode && !isEditByChangeLink && <SDDInstructions />}
                    </>
                )}
            </LayoutCard>
        );
    }
}

const styles = {
    button: {
        width: '48%'
    }
};

export default wrapComponent(DeliverTo, 'DeliverTo', true);
