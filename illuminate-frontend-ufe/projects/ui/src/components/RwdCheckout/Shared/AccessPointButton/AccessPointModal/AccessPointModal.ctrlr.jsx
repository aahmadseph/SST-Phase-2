import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import {
    Grid, Button, Box, Divider
} from 'components/ui';
import { modal } from 'style/config';
import ExperienceLocation from 'components/Happening/ExperienceLocation';
import AccessPointItem from 'components/RwdCheckout/Shared/AccessPointButton/AccessPointModal/AccessPointItem';
import AccessPointDetailsModal from 'components/RwdCheckout/Shared/AccessPointButton/AccessPointModal/AccessPointDetailsModal';
import AccessPointsNoResults from 'components/RwdCheckout/Shared/AccessPointButton/AccessPointModal/AccessPointsNoResults';
import Loader from 'components/Loader';
import checkoutApi from 'services/api/checkout';
import { getZipCode, getUserInputRequestParams } from 'utils/AccessPoints';
import scriptUtils from 'utils/LoadScripts';
import userLocation from 'utils/userLocation/UserLocation';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import CheckoutBindings from 'analytics/bindingMethods/pages/checkout/CheckoutBindings';

const { getAccessPoints } = checkoutApi;

class AccessPointModal extends BaseClass {
    state = {
        isHidden: false,
        accessPointList: [],
        selectedAccessPoint: null,
        currentLocation: null,
        accessPointDetails: null,
        isSearching: false,
        errorCode: null
    };

    componentDidMount() {
        const { order, user } = this.props;

        if (!window.google) {
            scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE], () => {});
        }

        const zipCode = getZipCode({
            order,
            user
        });

        const prevHalAddressId = order?.halAddress?.addressId;

        if (zipCode) {
            this.setState({ isSearching: true });
            getAccessPoints({ zipCode })
                .then(locations => {
                    const accessPointList = locations.data;
                    this.setState({
                        accessPointList,
                        currentLocation: zipCode,
                        isSearching: false,
                        selectedAccessPoint: accessPointList.find(address => address.locationId === prevHalAddressId),
                        errorCode: null
                    });
                })
                .catch(error => {
                    this.setState({
                        accessPointList: [],
                        isSearching: false,
                        errorCode: error?.responseStatus || null
                    });
                });
        } else {
            userLocation.determineLocation(locationObj => {
                this.updateCurrentLocation(locationObj);
            });
        }
    }

    componentDidUpdate() {
        if (this.props.isOpen && this.state.errorCode && !this.state.isHidden) {
            this.fireAnalytics('modal.openWithErrors');
        }

        if (this.props.isOpen && !this.state.errorCode && !this.state.isHidden) {
            this.fireAnalytics('modal.singleOpen');
        }
    }

    handleConfirmButton = accessPoint => {
        const { callback } = this.props;

        // Close modal
        this.handleOnDismiss(accessPoint);

        // Pass selected FedEx locationId to callback function
        if (typeof callback === 'function') {
            callback(accessPoint);
        }
    };

    updateCurrentLocation = locationObj => {
        this.setState({
            isSearching: true,
            currentLocation: locationObj?.display
        });

        getAccessPoints(getUserInputRequestParams(locationObj))
            .then(locations =>
                this.setState({
                    accessPointList: locations.data,
                    isSearching: false,
                    errorCode: null
                })
            )
            .catch(error => {
                this.setState({
                    accessPointList: [],
                    isSearching: false,
                    errorCode: error?.responseStatus || null
                });
            });
    };

    handleSelectAccessPoint = accessPoint => () => {
        this.setState({ selectedAccessPoint: accessPoint });
    };

    handleOnDismiss = accessPoint => {
        const { onDismiss } = this.props;

        this.setState(
            {
                ...(accessPoint && { selectedAccessPoint: accessPoint }),
                accessPointDetails: null,
                isHidden: false
            },
            onDismiss
        );
    };

    openAccessPointDetails = accessPointDetails => {
        this.setState({
            isHidden: true,
            accessPointDetails: accessPointDetails
        });
    };

    fireAnalytics = type => {
        const { order } = this.props;

        const isGuestOrder = order?.orderDetails?.header?.isGuestOrder;

        const { errorCode } = this.state;

        const eventData = {};

        const morePageInfo = {
            oneTagPageType: 'fedex'
        };

        let currentDetail;

        eventData.pageType = anaConsts.PAGE_TYPES.GENERIC_MODAL;

        switch (type) {
            case 'modal.viewLocationDetails':
                currentDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_LOCATION_DETAILS;
                morePageInfo.oneTagPageName = `fedex:${currentDetail}:n/a:*`;
                morePageInfo.oneTagPreviousActionType = `${currentDetail} click`;
                morePageInfo.oneTagPageDetail = currentDetail;
                eventData.pageDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_FEDEX_LOCATION_DETAILS;
                eventData.linkData = `${isGuestOrder ? 'guest checkout:' : ''}${anaConsts.LinkData.ACCESS_POINT_LOCATION_DETAILS_CLICK}`;
                eventData.pageName = `${eventData.pageType}:${eventData.pageDetail}:n/a:*`;
                eventData.morePageInfo = morePageInfo;

                break;
            case 'modal.openWithErrors':
                if (errorCode && errorCode >= 400) {
                    if (errorCode <= 499) {
                        currentDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL_NO_RESULTS_EXTRA_DATA;
                        eventData.pageDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL_NO_RESULTS;
                    } else {
                        currentDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL_UNAVAILABLE;
                        eventData.pageDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL_UNAVAILABLE;
                    }

                    morePageInfo.oneTagPageName = `fedex:${currentDetail}:n/a:*`;
                    morePageInfo.oneTagPageDetail = currentDetail;

                    eventData.morePageInfo = morePageInfo;
                }

                eventData.pageName = `${eventData.pageType}:${eventData.pageDetail}:n/a:*`;

                break;
            case 'modal.singleOpen':
                eventData.pageDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL_OPEN;
                eventData.linkData = `${isGuestOrder ? 'guest checkout:' : ''}${anaConsts.LinkData.ACCESS_POINT_MODAL_OPEN_CLICK}`;
                eventData.pageName = `${eventData.pageType}:${eventData.pageDetail}:n/a:*`;
                currentDetail = anaConsts.EVENT_NAMES.CHECKOUT.ACCESS_POINT;

                morePageInfo.oneTagPageName = `fedex:${currentDetail}:n/a:*`;
                morePageInfo.oneTagPageDetail = currentDetail;
                morePageInfo.oneTagPreviousActionType = anaConsts.EVENT_NAMES.CHECKOUT.ACCESS_POINTS_ENTRY;

                eventData.morePageInfo = morePageInfo;

                break;
            default:
                return;
        }

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
    };

    clearAccessPointDetails = () => {
        this.setState({
            isHidden: false,
            accessPointDetails: null
        });
    };

    handleAccessPointItemDetails = accessPoint => () => {
        this.openAccessPointDetails(accessPoint);
        this.fireAnalytics('modal.viewLocationDetails');
    };

    renderItems = () => {
        const { accessPointList, currentLocation, isSearching, errorCode } = this.state;
        const {
            fedexOnsite, openUntil, away, getText, enterSearchParams, unableToFindResults, pleaseTryAgain
        } = this.props;

        if (isSearching) {
            return <Loader isShown={true} />;
        }

        if (accessPointList.length > 0) {
            const components = accessPointList.map((accessPoint, index) => {
                const { selectedAccessPoint } = this.state;
                const checked = selectedAccessPoint?.locationId === accessPoint?.locationId;

                return (
                    <React.Fragment key={accessPoint?.locationId || index}>
                        {index > 0 && (
                            <Divider
                                marginY={4}
                                marginX={modal.outdentX}
                            />
                        )}
                        <AccessPointItem
                            openDetails={this.handleAccessPointItemDetails(accessPoint)}
                            data={accessPoint}
                            onChange={this.handleSelectAccessPoint(accessPoint)}
                            checked={checked}
                            fedexOnsite={fedexOnsite}
                            openUntil={openUntil}
                            away={away}
                            distanceText={getText(accessPoint.distance?.units === 'MI' ? 'miles' : 'kilometers')}
                        />
                    </React.Fragment>
                );
            });

            return components;
        } else {
            if (errorCode && errorCode >= 400) {
                CheckoutBindings.unavailableAccessPointSelection();
            }

            return (
                <AccessPointsNoResults
                    noStoresFound={getText('noStoresFound', [currentLocation])}
                    errorCode={errorCode}
                    enterSearchParams={enterSearchParams}
                    unableToFindResults={unableToFindResults}
                    pleaseTryAgain={pleaseTryAgain}
                />
            );
        }
    };

    modalFooter = accessPoint => {
        const { confirmButton } = this.props;

        return (
            <Modal.Footer hasBorder={true}>
                <Grid columns={1}>
                    <Button
                        variant='primary'
                        disabled={!accessPoint}
                        onClick={() => this.handleConfirmButton(accessPoint)}
                        children={confirmButton}
                    />
                </Grid>
            </Modal.Footer>
        );
    };

    render() {
        const {
            isOpen, onDismiss, modalTitle, fedexOnsite, openUntil, away, detailsModalTitle, getDirections, loactionHours, getText
        } = this.props;
        const {
            isHidden, currentLocation, accessPointDetails, selectedAccessPoint, isSearching
        } = this.state;

        return (
            <>
                <Modal
                    width={0}
                    onDismiss={onDismiss}
                    isOpen={isOpen}
                    isHidden={isHidden}
                    isDrawer={true}
                    hasBodyScroll
                >
                    <Modal.Header>
                        <Modal.Title children={modalTitle} />
                    </Modal.Header>
                    <Modal.Body>
                        <ExperienceLocation
                            showInitialUseMyLocation
                            clearOnFocus
                            isShowSearchIcon={false}
                            currentLocation={currentLocation}
                            updateCurrentLocation={this.updateCurrentLocation}
                        />
                        <Box
                            pt={5}
                            minHeight={isSearching ? '250px' : 0}
                        >
                            {this.renderItems()}
                        </Box>
                    </Modal.Body>
                    {this.modalFooter(selectedAccessPoint)}
                </Modal>
                {accessPointDetails && (
                    <AccessPointDetailsModal
                        data={accessPointDetails}
                        onDismiss={this.handleOnDismiss}
                        onBack={this.clearAccessPointDetails}
                        footer={() => this.modalFooter(accessPointDetails)}
                        fedexOnsite={fedexOnsite}
                        openUntil={openUntil}
                        away={away}
                        getDirections={getDirections}
                        loactionHours={loactionHours}
                        detailsModalTitle={detailsModalTitle}
                        distanceText={getText(accessPointDetails.distance?.units === 'MI' ? 'miles' : 'kilometers')}
                    />
                )}
            </>
        );
    }
}

AccessPointModal.propTypes = {
    callback: PropTypes.func
};

export default wrapComponent(AccessPointModal, 'AccessPointModal', true);
