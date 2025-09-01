import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { modal } from 'style/config';
import {
    Box, Divider, Text, Grid, Link
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import GoogleMap from 'components/GoogleMap/GoogleMap';
import accessPointConstants from 'components/RwdCheckout/Shared/AccessPointButton/constants';
import urlUtils from 'utils/Url';
import { hasOpeningTimes, computeOperatingHours, getOpensTillTime } from 'utils/AccessPoints';

const AccessPointDetailsModal = ({
    data,
    onDismiss,
    onBack,
    footer,
    fedexOnsite,
    openUntil,
    away,
    detailsModalTitle,
    getDirections,
    loactionHours,
    distanceText
}) => {
    const isFedexOnsite = data.pickupLocationType === accessPointConstants.FEDEX_ONSITE;
    const {
        companyName, addressLine1, city, state, zipCode, phoneNumber, distance, operatingHours, geoPositionalCoordinates
    } = data;
    const operatingHoursRows = computeOperatingHours(operatingHours);

    return (
        <Modal
            isOpen={true}
            showDismiss={true}
            hasBodyScroll={true}
            width={0}
            focusDialog={true}
            onDismiss={onDismiss}
            isDrawer={true}
        >
            <Modal.Header>
                <Modal.Title>{detailsModalTitle}</Modal.Title>
                <Modal.Back onClick={onBack} />
            </Modal.Header>
            <Modal.Body paddingTop={0}>
                <Box
                    marginX={modal.outdentX}
                    marginBottom={4}
                >
                    <GoogleMap
                        ratio={3 / 4}
                        selectedStore={{
                            latitude: geoPositionalCoordinates?.latitude,
                            longitude: geoPositionalCoordinates?.longitude
                        }}
                        isFindInStore={true}
                    />
                </Box>
                <Text
                    display='block'
                    fontWeight='bold'
                    mb='.25em'
                >
                    {companyName}
                    {isFedexOnsite && (
                        <Text
                            is='span'
                            color='gray'
                            fontWeight='normal'
                            ml={2}
                        >
                            {fedexOnsite}
                        </Text>
                    )}
                </Text>
                <Text color='gray'>
                    {distance && `${Number(distance?.value).toFixed(1)} ${distanceText} ${away}`}
                    {distance && hasOpeningTimes(operatingHours) && ' • '}
                    {hasOpeningTimes(operatingHours) && `${openUntil} ${getOpensTillTime(operatingHours)}`}
                </Text>
                <Divider marginY={4} />
                <Grid
                    columns='1fr auto'
                    marginBottom={4}
                >
                    <Text>
                        {addressLine1}
                        <Text display='block'>{`${city}, ${state} ${zipCode}`}</Text>
                    </Text>
                    <Link
                        color='blue'
                        onClick={() => {
                            // needed to work properly for mobile devices
                            urlUtils.openLinkInNewTab(
                                urlUtils.getAccessPointDirectionsUrl({
                                    addressLine1,
                                    city,
                                    state,
                                    zipCode
                                })
                            );

                            return false;
                        }}
                    >
                        {getDirections}
                    </Link>
                    {phoneNumber && (
                        <Link
                            color='blue'
                            href={`tel:${phoneNumber.replace(/[^0-9]+/g, '')}`}
                        >
                            {phoneNumber}
                        </Link>
                    )}
                </Grid>
                {hasOpeningTimes(operatingHours) && (
                    <React.Fragment>
                        <Text
                            display='block'
                            fontWeight='bold'
                            mb={1}
                        >
                            {loactionHours}
                        </Text>
                        <Grid
                            columns='1fr auto'
                            gap={1}
                        >
                            {operatingHoursRows.map(row => {
                                return (
                                    <React.Fragment key={row.label}>
                                        <span>{row.label}</span>
                                        <span>{row.value}</span>
                                    </React.Fragment>
                                );
                            })}
                        </Grid>
                    </React.Fragment>
                )}
            </Modal.Body>
            {footer()}
        </Modal>
    );
};

export default wrapFunctionalComponent(AccessPointDetailsModal, 'AccessPointDetailsModal');
