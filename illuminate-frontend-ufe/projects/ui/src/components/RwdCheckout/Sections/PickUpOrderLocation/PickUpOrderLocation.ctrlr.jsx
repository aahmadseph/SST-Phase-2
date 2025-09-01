import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Text, Box, Grid, Icon, Link
} from 'components/ui';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import storeUtils from 'utils/Store';

const STORE_PICKUP_METHOD_ID = '0';

class PickUpOrderLocation extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            inStorePickupActive: false
        };
    }

    componentDidMount() {
        const { pickupMethodId } = this.props;

        if (pickupMethodId) {
            this.setState({
                inStorePickupActive: pickupMethodId === STORE_PICKUP_METHOD_ID
            });
        }
    }

    handleStoreDetailsClick = event => {
        event.stopPropagation();
        const { showFindInStoreMapModal, storeDetails } = this.props;
        showFindInStoreMapModal({
            isOpen: true,
            currentProduct: null,
            selectedStore: storeDetails
        });
    };

    render() {
        const { storeDetails, pickupOrderHoldDaysMessage, localization } = this.props;
        const showCurbsidePickupIndicator = storeUtils.isCurbsideEnabled(storeDetails);

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
                    </div>
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={this.handleStoreDetailsClick}
                        data-at={Sephora.debug.dataAt('store_details_btn')}
                        children={localization.storeDetails}
                    />
                </Grid>
                {pickupOrderHoldDaysMessage && (
                    <Box
                        is='p'
                        backgroundColor='nearWhite'
                        paddingY={2}
                        paddingX={3}
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
