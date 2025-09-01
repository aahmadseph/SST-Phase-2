import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Text } from 'components/ui';
import { PICKUP, SAME_DAY, SHIP_TO_HOME } from 'constants/UpperFunnel';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import UpperFunnelTile from 'components/Catalog/UpperFunnel/UpperFunnelProductTiles/UpperFunnelTile';

const UpperFunnelProductTiles = ({
    curbsidePickupAvailable,
    curbsidePickupText,
    pickupTileEnabled,
    pickupTileSubTitle,
    pickupTileTitle,
    sameDayTileEnabled,
    sameDayShipMessage,
    sameDayTileSubTitle,
    sameDayTileTitle,
    showPickupTile,
    showSameDayTile,
    showShipToHomeTile,
    shipToHomeTileEnabled,
    shipToHomeTileTitle,
    shipToHomeTileShipMessage,
    isDeliveryFilterApplied
}) => (
    <Grid
        fontSize={['xs', 'sm']}
        gap={0}
        lineHeight='1.2'
        textAlign='left'
        marginTop='.5em'
    >
        {showShipToHomeTile && (
            <UpperFunnelTile
                key={SHIP_TO_HOME}
                enabled={shipToHomeTileEnabled}
                iconName='truck'
                title={shipToHomeTileTitle}
                subTitle={shipToHomeTileShipMessage}
                isDeliveryFilterApplied={isDeliveryFilterApplied}
            />
        )}
        {showPickupTile && (
            <UpperFunnelTile
                key={PICKUP}
                enabled={pickupTileEnabled}
                iconName='store'
                subTitle={pickupTileSubTitle}
                title={pickupTileTitle}
                dataAt='product_tile_pickup_store'
                isDeliveryFilterApplied={isDeliveryFilterApplied}
            >
                {curbsidePickupAvailable ? (
                    <CurbsidePickupIndicator
                        key='2'
                        fontSize={null}
                    >
                        {curbsidePickupText}
                    </CurbsidePickupIndicator>
                ) : null}
            </UpperFunnelTile>
        )}
        {showSameDayTile && (
            <UpperFunnelTile
                key={SAME_DAY}
                enabled={sameDayTileEnabled}
                iconName='bag'
                subTitle={sameDayTileSubTitle}
                title={sameDayTileTitle}
                isDeliveryFilterApplied={isDeliveryFilterApplied}
            >
                <Text
                    display='block'
                    color='gray'
                    dangerouslySetInnerHTML={{ __html: sameDayShipMessage }}
                />
            </UpperFunnelTile>
        )}
    </Grid>
);

UpperFunnelProductTiles.defaultProps = {
    isDeliveryFilterApplied: false
};

UpperFunnelProductTiles.propTypes = {
    curbsidePickupAvailable: PropTypes.bool.isRequired,
    curbsidePickupText: PropTypes.string.isRequired,
    pickupTileEnabled: PropTypes.bool.isRequired,
    pickupTileSubTitle: PropTypes.string.isRequired,
    pickupTileTitle: PropTypes.string.isRequired,
    sameDayTileEnabled: PropTypes.bool.isRequired,
    sameDayShipMessage: PropTypes.string.isRequired,
    sameDayTileSubTitle: PropTypes.string.isRequired,
    sameDayTileTitle: PropTypes.string.isRequired,
    showPickupTile: PropTypes.bool.isRequired,
    showSameDayTile: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(UpperFunnelProductTiles, 'UpperFunnelProductTiles');
