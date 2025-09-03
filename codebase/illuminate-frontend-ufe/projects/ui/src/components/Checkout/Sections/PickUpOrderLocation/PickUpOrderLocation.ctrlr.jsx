import React from 'react';
import PropTypes from 'prop-types';
import localeUtils from 'utils/LanguageLocale';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Text, Box, Grid, Icon, Link
} from 'components/ui';
import store from 'store/Store';
import actions from 'Actions';
import checkoutApi from 'services/api/checkout';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import PickupMethodOption from 'components/Checkout/Sections/PickUpMethodOption';
import storeUtils from 'utils/Store';

const getText = (...args) =>
    localeUtils.getLocaleResourceFile('components/Checkout/Sections/PickUpOrderLocation/locales', 'PickUpOrderLocation')(...args);
const STORE_PICKUP_METHOD_ID = '0';
const CONCIERGE_PICKUP_ID = '1';

class PickUpOrderLocation extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            inStorePickupActive: false,
            curbsideConciergePickupActive: false
        };
    }

    componentDidMount() {
        const { pickupMethodId } = this.props;

        if (pickupMethodId) {
            this.setState({
                inStorePickupActive: pickupMethodId === STORE_PICKUP_METHOD_ID,
                curbsideConciergePickupActive: pickupMethodId === CONCIERGE_PICKUP_ID
            });
        }
    }

    setPickupMethodOption = pickupMethodId => {
        const pickupMethodData = {
            pickupMethodId,
            vendorName: 'Brookfield'
        };

        checkoutApi
            .setPickupMethod(pickupMethodData)
            .then(data => {
                this.setState({
                    inStorePickupActive: data?.pickupMethods?.filter(method => method?.pickupMethodId === STORE_PICKUP_METHOD_ID)[0]?.isSelected,
                    curbsideConciergePickupActive: data?.pickupMethods?.filter(method => method?.pickupMethodId === CONCIERGE_PICKUP_ID)[0]
                        ?.isSelected
                });
            })
            .catch(e => {
                store.dispatch(
                    actions.showInfoModal({
                        isOpen: true,
                        title: getText('errorTitle'),
                        message: e?.errorMessages[0],
                        buttonText: getText('ok'),
                        isHtml: true
                    })
                );
            });
    };

    handleSetPickupMethod = pickupMethodId => () => {
        this.setPickupMethodOption(pickupMethodId);
    };

    render() {
        const { storeDetails, pickupOrderHoldDaysMessage } = this.props;
        const { inStorePickupActive, curbsideConciergePickupActive } = this.state;
        const curbsidePickupFlag = storeUtils.isCurbsideEnabled(storeDetails);
        const showConciergeCurbsidePickupIndicator = storeUtils.isConciergeCurbsideEnabled(storeDetails);
        const showCurbsidePickupIndicator = curbsidePickupFlag && !showConciergeCurbsidePickupIndicator;
        const { isConciergePurchaseEnabled } = Sephora?.configurationSettings;

        return (
            <React.Fragment>
                <Grid
                    columns='auto 1fr auto'
                    alignItems='start'
                    pb={4}
                    gap={4}
                >
                    <Icon name='store' />
                    <div>
                        <Text
                            numberOfLines={1}
                            fontWeight='bold'
                            data-at={Sephora.debug.dataAt('store_info')}
                            children={storeUtils.getStoreDisplayName(storeDetails)}
                        />
                        {showCurbsidePickupIndicator && (
                            <CurbsidePickupIndicator
                                marginTop={'0.25em'}
                                dataAt='curbside_indicator_label'
                            />
                        )}
                        {showConciergeCurbsidePickupIndicator && (
                            <ConciergeCurbsidePickupIndicator
                                dataAt={
                                    Sephora.isMobile()
                                        ? 'concierge_curbside_indicator_stores_modal_label'
                                        : 'concierge_curbside_indicator_flyout_label'
                                }
                                marginTop={'0.75em'}
                            />
                        )}
                    </div>
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={function () {
                            store.dispatch(
                                actions.showFindInStoreMapModal({
                                    isOpen: true,
                                    currentProduct: null,
                                    selectedStore: storeDetails
                                })
                            );
                        }}
                        data-at={Sephora.debug.dataAt('store_details_btn')}
                        children={getText('storeDetails')}
                    />
                </Grid>
                <Grid>
                    {isConciergePurchaseEnabled && showConciergeCurbsidePickupIndicator && (
                        <>
                            <Text>{getText('choosePickupMethod')}</Text>
                            <PickupMethodOption
                                label={getText('inStorePickup')}
                                isActive={inStorePickupActive}
                                onClick={this.handleSetPickupMethod(STORE_PICKUP_METHOD_ID)}
                            />
                            <PickupMethodOption
                                label={getText('curbsideConcierge')}
                                isActive={curbsideConciergePickupActive}
                                onClick={this.handleSetPickupMethod(CONCIERGE_PICKUP_ID)}
                                content={storeDetails?.content?.regions?.content}
                                isCurbsideConcierge
                            />
                        </>
                    )}
                </Grid>
                {pickupOrderHoldDaysMessage && (
                    <Box
                        is='p'
                        backgroundColor='nearWhite'
                        paddingY={2}
                        paddingX={3}
                        marginTop={isConciergePurchaseEnabled && showConciergeCurbsidePickupIndicator && 4}
                        borderRadius={2}
                        data-at={Sephora.debug.dataAt('pickup_location_section_info_message')}
                        children={pickupOrderHoldDaysMessage}
                    />
                )}
            </React.Fragment>
        );
    }
}

PickUpOrderLocation.propTypes = {
    storeDetails: PropTypes.object.isRequired,
    pickupOrderHoldDaysMessage: PropTypes.string.isRequired,
    pickupMethodId: PropTypes.string.isRequired
};

export default wrapComponent(PickUpOrderLocation, 'PickUpOrderLocation', true);
