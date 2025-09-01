/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import storeUtils from 'utils/Store';
import InfoButton from 'components/InfoButton/InfoButton';
import userLocation from 'utils/userLocation/UserLocation';
import scriptUtils from 'utils/LoadScripts';
import withInnerModal from 'components/withInnerModal/withInnerModal';
import FindInStoreMapModal from 'components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal';
import ExperienceLocation from 'components/Happening/ExperienceLocation/ExperienceLocation';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import localeUtils from 'utils/LanguageLocale';
import NoStores from 'components/SharedComponents/Stores/NoStores/NoStores';
import LOCATION from 'utils/userLocation/Constants';
import Loader from 'components/Loader/Loader';
import BopisKohlsItem from 'components/SharedComponents/BopisKohlsItem';
import { modal } from 'style/config';
import {
    Box, Grid, Divider, Button, Text
} from 'components/ui';

import PropTypes from 'prop-types';
import HapenningFilters from 'utils/happeningFilters';
import store from 'store/Store';

const { getLocaleResourceFile } = localeUtils;
const { FILTERS_KEY } = HapenningFilters;
const getText = text => getLocaleResourceFile('components/GlobalModals/LocationAndStoresModal/locales', 'LocationAndStoresModal')(text);
const getDefaultText = (text, vars) => getLocaleResourceFile('components/Header/StoresContent/locales', 'StoresContent')(text, vars);

class LocationAndStoresModal extends BaseClass {
    constructor(props) {
        super(props);

        const selectedStoreList = props.storesList.map(item => ({
            ...item,
            isChecked: props.appliedFilters[FILTERS_KEY.LOCATION_AND_STORES].includes(item.storeId)
        }));

        this.state = {
            currentLocation: props.currentLocation.display,
            storeList: selectedStoreList,
            isLoaded: !!props.currentLocation.display
        };
    }

    render() {
        const {
            currentLocation, isLoaded, storeList, showNoStoreResults, countryMismatch
        } = this.state;

        const { isOpen } = this.props;

        return !this.state.isShowChangeAlertModal ? (
            <Modal
                isOpen={isOpen}
                width={0}
                onDismiss={this.onDismiss}
                hasBodyScroll={true}
            >
                {this.props.innerModal}
                <Modal.Header>
                    <Modal.Title children={getText('locationAndStores')} />
                </Modal.Header>
                <Modal.Body>
                    {!isLoaded ? (
                        <Box minHeight={300}>
                            <Loader isShown={true} />
                        </Box>
                    ) : (
                        <>
                            {currentLocation && (
                                <ExperienceLocation
                                    showInitialUseMyLocation={true}
                                    dataAt={'change_store'}
                                    clearOnFocus={true}
                                    isShowSearchIcon={false}
                                    currentLocation={currentLocation}
                                    updateCurrentLocation={this.getStoresAndUpdateState}
                                />
                            )}
                            {!showNoStoreResults && (
                                <Text
                                    marginTop={3}
                                    fontSize='sm'
                                    is='p'
                                >
                                    {getText('optional')}
                                </Text>
                            )}
                            {this.renderStoreOptions(storeList)}
                            {showNoStoreResults && (
                                <NoStores
                                    countryMismatch={countryMismatch}
                                    currentLocation={currentLocation}
                                    close={this.onDismiss}
                                    withErrorLine2={false}
                                />
                            )}
                        </>
                    )}
                </Modal.Body>
                {storeList && !showNoStoreResults && isLoaded && (
                    <Modal.Footer>
                        <Grid columns={2}>
                            <Button
                                variant='secondary'
                                onClick={this.onDismiss}
                                children={getText('cancel')}
                            />
                            <Button
                                variant='primary'
                                children={getText('showResults')}
                                block={true}
                                onClick={this.handleShowResults}
                            />
                        </Grid>
                    </Modal.Footer>
                )}
            </Modal>
        ) : null;
    }

    handleStoreSwitch = (item, index) => () => {
        this.selectStore(item, index);
    };

    renderStoreOptions = storeList => {
        const { openModal } = this.props;

        return storeList.map((item, index) => (
            <React.Fragment key={item.displayName}>
                {index > 0 && (
                    <Divider
                        marginY={4}
                        marginX={modal.outdentX}
                    />
                )}
                <Grid
                    alignItems='flex-start'
                    columns='1fr auto'
                    marginTop={index === 0 && 4}
                >
                    <div data-at={Sephora.debug.dataAt('store_data')}>
                        <Checkbox
                            paddingY={null}
                            dataAt={'checkbox_dot_store'}
                            checked={item.isChecked}
                            onChange={this.handleStoreSwitch(item, index)}
                        >
                            <dl>
                                <dt
                                    className='StoreSwitcher-name'
                                    data-at={Sephora.debug.dataAt('store_name_label')}
                                    css={{
                                        fontWeight: 'var(--font-weight-bold)',
                                        marginBottom: '.25em'
                                    }}
                                >
                                    {storeUtils.getStoreDisplayNameWithSephora(item)}
                                </dt>

                                <BopisKohlsItem
                                    store={item}
                                    is='dd'
                                    marginTop={[1, 2]}
                                    marginBottom={[1, 2]}
                                />
                                <dd>{item.address.address1}</dd>
                                {item.address.address2 && <dd>{item.address.address2}</dd>}
                                <dd>
                                    {item.address.city}
                                    {', '}
                                    {item.address.state} {item.address.postalCode}
                                </dd>
                                <dd css={{ marginTop: '.75em' }}>
                                    {this.getStoreClosingText(item)}
                                    <React.Fragment>
                                        <span css={{ margin: '0 .5em' }}>•</span>
                                        {item.distance} {localeUtils.isCanada() ? getDefaultText('kmAway') : getDefaultText('milesAway')}
                                    </React.Fragment>
                                </dd>
                            </dl>
                        </Checkbox>
                    </div>
                    <InfoButton
                        size={16}
                        dataAt={'store'}
                        onClick={function () {
                            openModal({
                                isOpen: true,
                                currentProduct: null,
                                selectedStore: item,
                                useBackToStoreLink: false,
                                showBackButton: true
                            });
                        }}
                    />
                </Grid>
            </React.Fragment>
        ));
    };

    componentDidMount() {
        const { options, showStoreDetails } = this.props;
        const getLocationFunction = !options?.isUpperFunnel && showStoreDetails ? this.getStoreLocation : this.getUserLocation;

        if (!window.google) {
            this.loadGoogleScript(getLocationFunction);
        }
    }

    onDismiss = () => {
        this.props.closeLocationAndStores();
    };

    handleShowResults = () => {
        const { storeList } = this.state;
        const {
            setStoresList, getFilteredEvents, closeLocationAndStores, appliedFilters, setCurrentLocation
        } = this.props;
        // open question what to do when we don't have stores
        const firstStore = storeList[0];
        const storeId = firstStore?.storeId;
        const zipCode = firstStore?.address?.postalCode;

        setStoresList(storeList);
        setCurrentLocation({ display: zipCode, storeId });

        const newFilters = { ...appliedFilters };
        newFilters[FILTERS_KEY.LOCATION_AND_STORES] = storeList.filter(item => item.isChecked).map(item => item.storeId);

        getFilteredEvents({ appliedFilters: newFilters, zipCode, storeId });
        closeLocationAndStores();
    };

    getUserLocation = () => {
        userLocation.determineLocation(
            locationObj => {
                this.getStoresAndUpdateState(locationObj, true);
            },
            null,
            { sequence: userLocation.getDefaultStrategiesSequence() }
        );
    };

    loadGoogleScript = _callback => {
        scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE] /*, callback*/);
    };

    selectStore = (selectedStore, index) => {
        this.setState(({ storeList }) => {
            storeList[index].isChecked = !storeList[index].isChecked;

            return { storeList };
        });
    };

    getStoreClosingText = item => {
        const storeClosingTime = storeUtils.getStoreTodayClosingTime(item.storeHours);

        return storeClosingTime ? getDefaultText('openUntil', [storeClosingTime]) : getDefaultText('closed');
    };

    getStoreListCountry = storeList => {
        return storeList && storeList.length > 0 && storeList[0].address.country;
    };

    isCountryMismatch = country => {
        return country !== localeUtils.getCurrentCountry();
    };

    getStoreLocation = () => {
        const { preferredStoreInfo } = store.getState().user;
        const storeData = {
            display: storeUtils.getStoreDisplayName(preferredStoreInfo),
            country: preferredStoreInfo?.address?.country,
            zipCode: preferredStoreInfo?.address?.postalCode,
            lat: preferredStoreInfo?.latitude,
            lon: preferredStoreInfo?.longitude
        };
        this.getStoresAndUpdateState(storeData);
    };

    getStoresAndUpdateState = locationObj => {
        if (locationObj?.display != null) {
            this.setState({ currentLocation: locationObj.display });
        } else {
            this.getUserLocation();
        }

        if (locationObj.src === LOCATION.TYPES.GEOLOCATION && typeof locationObj.country === 'undefined') {
            locationObj.country = localeUtils.getCurrentCountry();
        }

        if (locationObj.country === localeUtils.getCurrentCountry().toUpperCase()) {
            storeUtils
                .getStores(locationObj, true, false, false, true, true)
                .then(storeList => {
                    const filteredStores = storeList
                        .filter(item => item.storeType.toLowerCase() === 'sephora')
                        .map(item => ({
                            ...item,
                            isChecked: this.props.appliedFilters[FILTERS_KEY.LOCATION_AND_STORES].includes(item.storeId)
                        }));
                    const storesCountry = this.getStoreListCountry(filteredStores);
                    const isCountryMismatch = this.isCountryMismatch(storesCountry);

                    this.setState({
                        storeList: isCountryMismatch ? null : filteredStores,
                        isLoaded: true,
                        showNoStoreResults: isCountryMismatch,
                        countryMismatch: isCountryMismatch
                    });
                })
                .catch(() => {
                    this.setState({
                        isLoaded: true,
                        showNoStoreResults: true,
                        countryMismatch: false,
                        storeList: []
                    });
                });
        } else {
            this.setState({
                isLoaded: true,
                showNoStoreResults: true,
                storeList: [],
                countryMismatch: true
            });
        }
    };
}

LocationAndStoresModal.propTypes = {
    appliedFilters: PropTypes.object,
    isOpen: PropTypes.func,
    getFilteredEvents: PropTypes.func,
    showLocationAndStores: PropTypes.func,
    closeLocationAndStores: PropTypes.func,
    setStoresList: PropTypes.func,
    setCurrentLocation: PropTypes.func
};

LocationAndStoresModal.defaultProps = {
    isOpen: () => {}
};

export default withInnerModal(wrapComponent(LocationAndStoresModal, 'LocationAndStoresModal', true), FindInStoreMapModal);
