/* eslint-disable class-methods-use-this */
/*global google*/
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors, forms, space } from 'style/config';
import TextInput from 'components/Inputs/TextInput/TextInput';
import {
    Divider, Box, Text, Flex, Link, Icon
} from 'components/ui';
import LOCATION from 'utils/userLocation/Constants';
import localeUtils from 'utils/LanguageLocale';
import GeoLocationDisclaimerModal from 'components/Happening/ExperienceLocation/GeoLocationDisclaimerModal';
import debounceUtils from 'utils/Debounce';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import userLocation from 'utils/userLocation/UserLocation';
import actions from 'actions/Actions';
import store from 'store/Store';
import keyConsts from 'utils/KeyConstants';
import ReactDOM from 'react-dom';
import { TIME_OUT } from 'constants/location';

let debounceSubscription;

const DEBOUNCE_BLUR = 200;
const DEBOUNCE_CLICK = 205;
const NO_RESULTS_MODAL_SHOW = 1000;
const { debounce: Debounce } = debounceUtils;

class ExperienceLocation extends BaseClass {
    state = {
        currentLocation: this.props.currentLocation,
        highlightedIndex: -1,
        showGeoLocationDisclaimerModal: false
    };

    componentDidMount() {
        if (navigator.geolocation) {
            this.setState({ geoLocationEnabled: true });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.currentLocation !== this.props.currentLocation) {
            this.setState({ currentLocation: newProps.currentLocation });
        }
    }

    handleSubmit = () => {
        let { predictions, previousLocations } = this.state;
        predictions = predictions || [];
        previousLocations = previousLocations || [];
        const suggestions = predictions.concat(previousLocations);

        // We might have predictions (based on what the user typed) or previousLocations
        // (based on what the user has previously selected), or both, or none
        if (suggestions.length > 0) {
            const suggestionIndex = this.state.highlightedIndex >= 0 ? this.state.highlightedIndex : 0;
            // As predictions come first, if the index is larger than the amount of
            // predictions, then it's a previousLocation
            const suggestionType = suggestionIndex >= predictions.length ? { previousLocation: true } : { prediction: true };
            this.currentLocation.blur();
            this.findNearbyStores(suggestionType, suggestions[suggestionIndex]);
        }
    };

    findNearbyStores = (locationTypeObj = {}, location) => {
        const getText = localeUtils.getLocaleResourceFile('components/Happening/ExperienceLocation/locales', 'ExperienceLocation');

        if (locationTypeObj.prediction) {
            if (!this.placesService) {
                this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
            }

            const request = {
                placeId: location.place_id,
                fields: ['geometry', 'address_components']
            };

            if (this.autoCompleteSessionToken) {
                // make sure we are using autoCompleteSessionToken only once
                // for a single Place Details request
                // https://developers.google.com/maps/documentation/javascript/places-autocomplete#session_tokens
                request.sessionToken = this.autoCompleteSessionToken;
                this.autoCompleteSessionToken = null;
            }

            this.placesService.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    location.geometry = place.geometry;
                    location.addressComponents = place.address_components;
                    const locationObj = userLocation.getLocationFromPrediction(location);
                    locationObj &&
                        this.setState(
                            {
                                currentLocation: locationObj.display,
                                predictions: null,
                                showNoStoreError: null
                            },
                            () => {
                                this.props.updateCurrentLocation(locationObj);
                            }
                        );
                }
            });
        } else if (locationTypeObj.useMyLocation) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const locationObj = userLocation.getLocationFromPosition(position);
                        locationObj && this.props.updateCurrentLocation(locationObj);
                        this.hideLocationList();
                    },
                    () => {
                        store.dispatch(
                            actions.showInfoModal({
                                isOpen: true,
                                title: getText('locationSharingDisabled'),
                                message: getText('locationUpdateSettings'),
                                buttonText: getText('ok')
                            })
                        );
                    },
                    { timeout: TIME_OUT }
                );
            }
        } else if (locationTypeObj.previousLocation) {
            this.props.updateCurrentLocation(location);
        }
    };

    clearClick = () => {
        this.setState({
            showNoStoreError: null,
            predictions: null,
            currentLocation: '',
            isFocused: true,
            previousLocations: this.getPreviousExperienceLocations()
        });

        this.currentLocation.focus();
    };

    handleClearClick = () => {
        debounceSubscription = Debounce.call(this, this.clearClick, DEBOUNCE_CLICK)();
    };

    handleFocus = () => {
        const clearLocation = this.props.clearOnFocus || this.state.currentLocation === this.props.currentLocation;

        this.setState({
            isFocused: true,
            currentLocation: clearLocation ? '' : this.state.currentLocation,
            previousLocations: clearLocation || !this.state.currentLocation ? this.getPreviousExperienceLocations() : null
        });
    };

    hideLocationList = () => {
        const { clearOnFocus, currentLocation } = this.props;

        this.setState({
            isFocused: false,
            predictions: null,
            showNoStoreError: null,
            previousLocations: null,
            highlightedIndex: -1,
            currentLocation: clearOnFocus ? currentLocation : this.state.currentLocation
        });
    };

    blur = () => {
        const { currentLocation } = this.state;

        const activeElement = document.activeElement;
        const currentLocationLink = currentLocation !== LOCATION.CURRENT_LOCATION_TEXT ? ReactDOM.findDOMNode(this.currentLocationLink) : null;
        const clearLocationInput = currentLocation ? ReactDOM.findDOMNode(this.clearLocationInput) : null;

        if (activeElement !== clearLocationInput && activeElement !== currentLocationLink) {
            this.hideLocationList();
        }
    };

    handleBlur = () => {
        debounceSubscription = Debounce.call(this, this.blur, DEBOUNCE_BLUR)();
    };

    autoComplete = () => {
        const currentLocation = this.currentLocation.getValue();

        if (currentLocation) {
            if (!this.autoCompleteService) {
                this.autoCompleteService = new google.maps.places.AutocompleteService();
            }

            if (!this.autoCompleteSessionToken) {
                this.autoCompleteSessionToken = new google.maps.places.AutocompleteSessionToken();
            }

            this.autoCompleteService.getPlacePredictions(
                {
                    input: currentLocation,
                    sessionToken: this.autoCompleteSessionToken,
                    types: ['(regions)'],
                    componentRestrictions: {
                        country: [localeUtils.COUNTRIES.US, localeUtils.COUNTRIES.CA, localeUtils.COUNTRIES.PR]
                    }
                },
                this.setPredictionState
            );
        } else {
            this.setState({
                showNoStoreError: null,
                predictions: null,
                previousLocations: this.getPreviousExperienceLocations(),
                currentLocation: ''
            });
        }
    };

    handleKeyUp = e => {
        switch (e.key) {
            case keyConsts.UP:
                e.preventDefault();
                this.focusLocationListUp();

                break;
            case keyConsts.DOWN:
                e.preventDefault();
                this.focusLocationListDown();

                break;
            default:
                this.autoComplete();
        }
    };

    getDropDownItemsLength = () => {
        const predictionsLength = this.state.predictions ? this.state.predictions.length : 0;
        const previousLocationsLength = this.state.previousLocations ? this.state.previousLocations.length : 0;

        return predictionsLength + previousLocationsLength;
    };

    focusLocationListUp = () => {
        const dropDownItemsLength = this.getDropDownItemsLength();
        const highlightedIndex = this.state.highlightedIndex <= 0 ? dropDownItemsLength - 1 : this.state.highlightedIndex - 1;
        this.setState({ highlightedIndex });
    };

    focusLocationListDown = () => {
        const dropDownItemsLength = this.getDropDownItemsLength();
        const highlightedIndex = this.state.highlightedIndex === dropDownItemsLength - 1 ? 0 : this.state.highlightedIndex + 1;
        this.setState({ highlightedIndex });
    };

    getPreviousExperienceLocations = () => {
        const prevExperienceLocations = Storage.local.getItem(LOCAL_STORAGE.PREVIOUS_EXPERIENCE_LOCATIONS);

        return prevExperienceLocations ? prevExperienceLocations.slice(0, 6) : null;
    };

    setPredictionState = (predictions, status) => {
        const showNoStoreErrorAsModal = !!this.props.showNoResultsModal;
        const callback = () => (showNoStoreErrorAsModal ? setTimeout(this.props.showNoResultsModal, NO_RESULTS_MODAL_SHOW) : null);

        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            this.setState(
                {
                    showNoStoreError: !showNoStoreErrorAsModal,
                    previousLocations: null,
                    currentLocation: this.currentLocation.getValue()
                },
                callback
            );
        } else {
            this.setState({
                showNoStoreError: null,
                predictions: predictions,
                previousLocations: null,
                currentLocation: this.currentLocation.getValue()
            });
        }
    };

    highlight = (string, substring) => {
        if (substring) {
            const reg = new RegExp(substring.replace(/\(|\)|\.|\]|\[|\-|\,|\~|\!/g, '\\$&'), 'gi');

            return string.replace(reg, function (str) {
                return '<b>' + str + '</b>';
            });
        } else {
            return string;
        }
    };

    setHighlightedIndex = index => () => {
        this.setState({ highlightedIndex: index });
    };

    componentWillUnmount() {
        //unsubscribe any pending debounce timer
        clearTimeout(debounceSubscription);
    }

    closeModal = () => {
        this.setState({
            showGeoLocationDisclaimerModal: false
        });
    };

    handleAcceptGeoLocationDisclaimer = () => {
        this.findNearbyStores({ useMyLocation: true });
    };

    handleCurrentLocationLinkClick = e => {
        e.preventDefault();
        this.setState({ showGeoLocationDisclaimerModal: true });
    };

    setCurrentLocationLinkRef = comp => {
        if (comp !== null) {
            this.currentLocationLink = comp;
        }
    };

    handleLocationSubmit = e => {
        e.preventDefault();
        this.handleSubmit();
    };

    setClearLocationInputRef = comp => {
        if (comp !== null) {
            this.clearLocationInput = comp;
        }
    };

    setUseMyLocationRef = comp => {
        if (comp !== null) {
            this.currentLocation = comp;
        }
    };

    handlePredictedLocationClick = prediction => e => {
        e.preventDefault();
        this.findNearbyStores(
            {
                prediction: true
            },
            prediction
        );
    };

    handlePreviousLocationClick = prevLocation => e => {
        e.preventDefault();
        this.findNearbyStores(
            {
                previousLocation: true
            },
            prevLocation
        );
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Happening/ExperienceLocation/locales', 'ExperienceLocation');
        const {
            currentLocation, isFocused, geoLocationEnabled, showNoStoreError, predictions, previousLocations, highlightedIndex
        } = this.state;

        const { showInitialUseMyLocation = true, isShowSearchIcon = false, dataAt } = this.props;

        const isUsingCurrentLocation = currentLocation === LOCATION.CURRENT_LOCATION_TEXT;

        const currentLocationLink = (
            <Link
                display='block'
                width='100%'
                paddingY={2}
                color='blue'
                ref={this.setCurrentLocationLinkRef}
                {...(dataAt && { 'data-at': Sephora.debug.dataAt(`${dataAt}_input_use_my_location_btn`) })}
                onBlur={this.hideLocationList}
                onClick={this.handleCurrentLocationLinkClick}
            >
                <Icon
                    name='currentLocation'
                    size='1em'
                    marginRight='.5em'
                />
                {getText('useLocation')}
            </Link>
        );

        return (
            <>
                <GeoLocationDisclaimerModal
                    showGeoLocationDisclaimerModal={this.state.showGeoLocationDisclaimerModal}
                    onCloseModal={this.closeModal}
                    onAcceptGeoLocationDisclaimer={this.handleAcceptGeoLocationDisclaimer}
                />
                <div
                    aria-label={getText('chooseLocation')}
                    css={{ position: 'relative' }}
                >
                    <p
                        id='location_picker_desc'
                        style={{ display: 'none' }}
                    >
                        {getText('updatingLocationText')}
                    </p>
                    <form
                        noValidate
                        onSubmit={this.handleLocationSubmit}
                    >
                        <TextInput
                            aria-describedby='location_picker_desc'
                            indent={isShowSearchIcon && space[7]}
                            marginBottom={null}
                            label={getText('cityStateZip')}
                            autoCorrect='off'
                            autoComplete='off'
                            value={currentLocation}
                            name='currentLocation'
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onKeyUp={this.handleKeyUp}
                            contentAfter={[
                                currentLocation && isFocused && (
                                    <Box
                                        alignSelf='center'
                                        marginRight={2}
                                        aria-label={getText('clear')}
                                        backgroundColor='gray'
                                        color='white'
                                        borderRadius='full'
                                        lineHeight='0'
                                        padding='5px'
                                        css={{
                                            '.no-touch &:hover': {
                                                opacity: 0.5
                                            }
                                        }}
                                        onClick={this.handleClearClick}
                                        ref={this.setClearLocationInputRef}
                                    >
                                        <Icon
                                            size='9px'
                                            name='x'
                                        />
                                    </Box>
                                ),
                                showInitialUseMyLocation && !isFocused && geoLocationEnabled && !isUsingCurrentLocation && (
                                    <Flex
                                        key='useMyLocation'
                                        paddingX={2}
                                        borderLeft={1}
                                        borderColor='divider'
                                        {...(localeUtils.isFrench() && {
                                            fontSize: 'sm'
                                        })}
                                    >
                                        {currentLocationLink}
                                    </Flex>
                                )
                            ]}
                            ref={this.setUseMyLocationRef}
                        />
                    </form>

                    {isShowSearchIcon && (
                        <Flex
                            position='absolute'
                            top={0}
                            left={0}
                            width={space[7]}
                            height={forms.HEIGHT}
                            alignItems='center'
                            justifyContent='center'
                            css={{ pointerEvents: 'none' }}
                        >
                            <Icon
                                name='search'
                                size={20}
                            />
                        </Flex>
                    )}

                    {isFocused && (
                        <Box
                            lineHeight='tight'
                            position='absolute'
                            top='100%'
                            marginTop={`-${forms.BORDER_WIDTH}px`}
                            left={0}
                            right={0}
                            paddingX={4}
                            paddingTop={1}
                            paddingBottom={2}
                            borderRadius={2}
                            backgroundColor='white'
                            boxShadow='light'
                            zIndex={1}
                            data-at={Sephora.debug.dataAt('location_list')}
                        >
                            {showNoStoreError && (
                                <React.Fragment>
                                    <Text
                                        {...(dataAt && { 'data-at': Sephora.debug.dataAt(`${dataAt}_popup_error_msg`) })}
                                        is='p'
                                        paddingY={3}
                                        color='gray'
                                        textAlign='center'
                                        dangerouslySetInnerHTML={{
                                            __html: getText('noStoreFound', [currentLocation])
                                        }}
                                    />
                                    <Divider />
                                </React.Fragment>
                            )}

                            {geoLocationEnabled && !isUsingCurrentLocation && <Box paddingY={1}>{currentLocationLink}</Box>}
                            {predictions &&
                                predictions.length &&
                                predictions.map((prediction, index) => {
                                    const isActive = index === highlightedIndex;

                                    return (
                                        !prediction.types.some(predType => predType === 'country') && (
                                            <React.Fragment key={index.toString()}>
                                                {index === 0 ? null : <Divider />}
                                                <button
                                                    type='button'
                                                    id='predicted_location'
                                                    onMouseEnter={this.setHighlightedIndex(index)}
                                                    css={[styles.dropDownItem, isActive && styles.activeDropDownItem]}
                                                    onClick={this.handlePredictedLocationClick(prediction)}
                                                    dangerouslySetInnerHTML={{
                                                        __html: this.highlight(prediction.description, currentLocation)
                                                    }}
                                                />
                                            </React.Fragment>
                                        )
                                    );
                                })}
                            {previousLocations &&
                                previousLocations.length &&
                                previousLocations.map((prevLocation, index) => {
                                    const isActive = index === highlightedIndex;
                                    const predictionsLength = predictions ? predictions.length : 0;

                                    return (
                                        <React.Fragment key={index.toString()}>
                                            {index === 0 ? null : <Divider />}
                                            <button
                                                type='button'
                                                id='previous_location'
                                                onMouseEnter={this.setHighlightedIndex(index + predictionsLength)}
                                                css={[styles.dropDownItem, isActive && styles.activeDropDownItem]}
                                                onClick={this.handlePreviousLocationClick(prevLocation)}
                                                children={prevLocation.display}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                        </Box>
                    )}
                </div>
            </>
        );
    }
}

const styles = {
    dropDownItem: {
        padding: '12px 8px',
        margin: '-1px 8px -1px -8px',
        width: `calc(100% + ${space[2] * 2}px)`,
        transition: 'background .2s'
    },
    activeDropDownItem: {
        position: 'relative',
        background: colors.nearWhite
    }
};

export default wrapComponent(ExperienceLocation, 'ExperienceLocation', true);
