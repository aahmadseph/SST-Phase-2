import React from 'react';
import { wrapComponent } from 'utils/framework';

import Empty from 'constants/empty';

import BaseClass from 'components/BaseClass';
import {
    Box, Flex, Icon, Image, Link, Text
} from 'components/ui';
import GoogleMap from 'components/GoogleMap/GoogleMap';
import ExperienceLocation from 'components/Happening/ExperienceLocation';
import StepsCTA from 'components/HappeningNonContent/ServiceBooking/StepsCTA';

import sdnApi from 'services/api/sdn';

import {
    colors, mediaQueries, radii, space
} from 'style/config';

import { ensureSephoraPrefix, showCountryMissMatchModal } from 'utils/happening';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import mediaUtils from 'utils/Media';
import scriptUtils from 'utils/LoadScripts';

import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

import { BOOKING_PAGE_WIDTH } from 'components/HappeningNonContent/ServiceBooking/constants';

const { getServiceBookingDetails } = sdnApi;
const { getLocaleResourceFile, isCanada, isUS, COUNTRIES } = localeUtils;
const { Media } = mediaUtils;

const MARKERS = {
    outline: '/img/ufe/happening/map-marker-outline.svg',
    solid: '/img/ufe/happening/map-marker-solid.svg'
};

const ICON_WIDTH = 17;
const ICON_HEIGHT = 25;

const MAP_WIDTH = BOOKING_PAGE_WIDTH;
const MAP_HEIGHT = 275;

const INITIAL_STORES_TO_DISPLAY = 3;
const STORES_LIST_MAX_HEIGHT = 215;
const STORES_LIST_GAP_PADDING_Y = 2;

class PickStore extends BaseClass {
    constructor(props) {
        super(props);

        const {
            stores,
            selectedStore: { address, storeId },
            updateStoresList
        } = props;

        const storesToDisplay = updateStoresList ? Empty.Array : stores.slice(0, INITIAL_STORES_TO_DISPLAY);

        this.state = {
            selectedStoreId: storeId,
            storesToDisplay,
            storesList: updateStoresList ? Empty.Array : stores,
            showMap: false,
            currentLocation: address.postalCode,
            isStoresContainerScrollHeight: false,
            showNoStoresErrorMessage: false
        };

        this.storesListRef = React.createRef();
        this.storeCardRefs = [];

        this.buildStoreCardRefs(storesToDisplay);

        this.getText = getLocaleResourceFile('components/HappeningNonContent/ServiceBooking/PickStore/locales', 'PickStore');
    }

    setStoresToDisplay = ({ showMore, isNewLocation }) => {
        return () => {
            const { storesList } = this.state;

            let nextState;
            let counter = 1;

            if (showMore) {
                const remainingStoresList = storesList.slice(this.state.storesToDisplay.length);
                nextState = { storesToDisplay: [...this.state.storesToDisplay] };

                while (counter <= 5 && remainingStoresList.length >= 1) {
                    counter++;
                    nextState.storesToDisplay.push(remainingStoresList.shift());
                }
            }

            if (isNewLocation) {
                nextState = {
                    selectedStoreId: storesList[0]?.storeId,
                    storesToDisplay: storesList.slice(0, 3),
                    isStoresContainerScrollHeight: false,
                    ...(!storesList.length && { showMap: false })
                };

                this.expectedSize = false;
            }

            this.buildStoreCardRefs(nextState.storesToDisplay).then(() => this.setState(nextState));
        };
    };

    setSelectedStoreId = selectedStoreId => this.setState({ selectedStoreId });

    setShowNoStoresErrorMessage = showNoStoresErrorMessage => this.setState({ showNoStoresErrorMessage });

    setSelectedStoreIdCallback = selectedStoreId => () => this.setState({ selectedStoreId });

    toggleShowMap = () => {
        const prevSelectedStoreId = this.state.selectedStoreId;
        const { serviceInfo } = this.props;

        this.setSelectedStoreId(null);

        this.setState(
            prevState => ({
                showMap: !prevState.showMap && !!prevState.storesToDisplay.length
            }),
            () => {
                if (prevSelectedStoreId != null) {
                    this.setSelectedStoreId(prevSelectedStoreId);
                    this.props.openInfoWindow(prevSelectedStoreId);
                }
            }
        );

        if (!this.state.showMap) {
            HappeningBindings.serviceBookingShowMapLinkAnalytics(serviceInfo?.displayName);
        }
    };

    showNoResultsModal = () => {
        this.props.showInfoModal({
            isOpen: true,
            title: this.getText('noResultsFound'),
            message: this.getText('noResultsMessage'),
            buttonText: this.getText('ok'),
            buttonWidth: ['100%', null, 180],
            width: 2
        });
    };

    loadGoogleScript = () => {
        if (!window.google) {
            scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE]);
        }
    };

    getCommonAPIParams = () => {
        const { country, language } = Sephora.renderQueryParams;
        const { activityId } = Location.getHappeningPathActivityInfo();

        return {
            country,
            language,
            activityId,
            includeServiceInfo: false
        };
    };

    updateCurrentLocation = async locationObj => {
        const { country: searchCountry, lat: latitude, lon: longitude, display: currentLocation } = locationObj;

        const currentCountry = this.getCommonAPIParams().country;
        const isUSToCASearch = isUS(currentCountry) && searchCountry === COUNTRIES.CA;
        const isCAToUSSearch = isCanada(currentCountry) && searchCountry === COUNTRIES.US;
        const isCountryMissmatch = isUSToCASearch || isCAToUSSearch;

        if (isCountryMissmatch) {
            return showCountryMissMatchModal();
        }

        if (!latitude && !longitude && !currentLocation) {
            return null;
        }

        this.props.showInterstice(true);

        try {
            const { stores = Empty.Array } = await getServiceBookingDetails({
                ...this.getCommonAPIParams(),
                latitude,
                longitude,
                selectedStoreId: this.props.preferredStore?.storeId
            });

            const noStoresFound = stores.length === 0;
            noStoresFound && this.showNoResultsModal();

            return this.setState(
                { currentLocation, storesList: stores, showNoStoresErrorMessage: false },
                this.setStoresToDisplay({ isNewLocation: true })
            );
        } catch {
            return this.showNoResultsModal();
        } finally {
            this.props.showInterstice(false);
        }
    };

    onCTAClick = () => {
        const { storesList, selectedStoreId } = this.state;
        const selectedStore = storesList.find(store => store.storeId === selectedStoreId);

        return storesList.length === 0
            ? this.setShowNoStoresErrorMessage(true)
            : selectedStore
                ? this.props.onClickCTA(selectedStore, storesList)
                : null;
    };

    setupStoresContainerObserver = () => {
        const storesListContainer = this.storesListRef.current;

        if (storesListContainer) {
            const callback = ([entry]) => {
                const containerSize = entry.contentRect;

                if (containerSize) {
                    const isStoresContainerScrollHeight = containerSize.height >= STORES_LIST_MAX_HEIGHT;
                    const shouldSetState = !this.expectedSize && isStoresContainerScrollHeight;

                    // condition needed to stop the ResizeObserver loop
                    shouldSetState && this.setState({ isStoresContainerScrollHeight }, () => (this.expectedSize = true));
                }
            };

            this.observer = new ResizeObserver(callback);
            this.observer.observe(storesListContainer);
        }
    };

    onEditStoreUpdateStoresList = async () => {
        if (!this.props.updateStoresList) {
            return;
        }

        try {
            const { storeId, address = {} } = this.props.selectedStore;
            const currentLocation = address.postalCode;

            const { stores = Empty.Array } = await getServiceBookingDetails({
                ...this.getCommonAPIParams(),
                zipCode: currentLocation,
                selectedStoreId: storeId
            });

            this.setState({ currentLocation, storesList: stores }, this.setStoresToDisplay({ isNewLocation: true }));
        } catch {
            this.showNoResultsModal();
        }
    };

    onLoadShowNoNoStoresError = () => {
        if (this.props.stores.length === 0) {
            this.setShowNoStoresErrorMessage(true);
        }
    };

    renderError = errorText => (
        <Flex
            gap={3}
            padding={4}
            backgroundColor={'lightRed'}
            alignItems={'center'}
            borderRadius={2}
            marginTop={-4}
        >
            <Icon
                name='alert'
                color='red'
                size={16}
            />
            <Text
                is={'p'}
                color='red'
                children={errorText}
            />
        </Flex>
    );

    buildStoreCardRefs = storesToDisplay => {
        if (storesToDisplay.length) {
            this.storeCardRefs = storesToDisplay.map(() => React.createRef());
        }

        return Promise.resolve();
    };

    setNextStoresLisScrollHeight = (prevState, currentState) => {
        const prevStoresToDisplayLength = prevState.storesToDisplay.length;
        const currentStoresToDisplayLength = currentState.storesToDisplay.length;

        // Are we adding new items to the list?
        if (prevStoresToDisplayLength < currentStoresToDisplayLength) {
            const nextElementInList = this.storeCardRefs[prevStoresToDisplayLength]?.current;
            const containerPaddingTopSpace = prevStoresToDisplayLength <= INITIAL_STORES_TO_DISPLAY ? 0 : space[STORES_LIST_GAP_PADDING_Y];

            const nextScrollHeight = nextElementInList ? nextElementInList.offsetTop - containerPaddingTopSpace : 0;

            // Adjust scrollTop to the new list so the next item is pushed into view.
            const list = this.storesListRef.current;

            list && nextScrollHeight && (list.scrollTop = nextScrollHeight);
        }
    };

    componentDidMount() {
        this.loadGoogleScript();
        this.setupStoresContainerObserver();
        this.onEditStoreUpdateStoresList();
        this.onLoadShowNoNoStoresError();

        const { rebookingStoreId, serviceInfo } = this.props;

        // if rebookingStoreId exists, we are rescheduling or booking again, so we don't need to track this (fist) step
        if (!rebookingStoreId) {
            HappeningBindings.serviceBookingPickStorePageLoadAnalytics(serviceInfo?.displayName);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Adjust scrollTop to the new list so the next item is pushed into view.
        this.setNextStoresLisScrollHeight(prevState, this.state);
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    render() {
        const {
            selectedStoreId, storesToDisplay, showMap, currentLocation, storesList, isStoresContainerScrollHeight, showNoStoresErrorMessage
        } =
            this.state;

        const displayShowMoreLink = storesToDisplay.length < storesList.length;

        const renderMap = ratio => (
            <GoogleMap
                isZoomControlShown
                ratio={ratio || 9 / 16}
                showFirstMarkerInfoBox={false}
                selectedStore={storesToDisplay[0]}
                stores={storesToDisplay}
                isHappening
                markerIcons={MARKERS}
                setSelectedStoreId={this.setSelectedStoreId}
                selectedStoreId={selectedStoreId}
            />
        );

        return (
            <>
                <Flex
                    flexDirection={'column'}
                    gap={4}
                >
                    {/* header */}
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Text
                            is={'h2'}
                            fontSize={['md', null, 'lg']}
                            fontWeight={'bold'}
                            lineHeight={['20px', null, '22px']}
                            children={this.getText('pickAStore')}
                        />
                        <Link
                            color={'blue'}
                            onClick={this.toggleShowMap}
                            children={this.getText(showMap ? 'hideMap' : 'showMap')}
                        />
                    </Flex>

                    {/* map */}
                    {showMap && (
                        <Box
                            borderRadius={2}
                            css={{ overflow: 'hidden' }}
                            height={[null, null, MAP_HEIGHT]}
                        >
                            <Media lessThan={'sm'}>{renderMap()}</Media>
                            <Media greaterThan={'sm'}>{renderMap(MAP_HEIGHT / MAP_WIDTH)}</Media>
                        </Box>
                    )}

                    {/* change location autocomplete input */}
                    <Box zIndex={styles.label['&::before'].zIndex + 1}>
                        <ExperienceLocation
                            clearOnFocus
                            showNoStoreErrorAsModal
                            isShowSearchIcon={false}
                            currentLocation={currentLocation}
                            updateCurrentLocation={this.updateCurrentLocation}
                            showNoResultsModal={this.showNoResultsModal}
                        />
                    </Box>

                    {/* store cards */}
                    <Flex
                        ref={this.storesListRef}
                        is='fieldset'
                        lineHeight={'tight'}
                        flexDirection={'column'}
                        gap={STORES_LIST_GAP_PADDING_Y}
                        maxHeight={[null, null, STORES_LIST_MAX_HEIGHT]}
                        overflowY={[null, null, 'auto']}
                        overflowX={[null, null, 'hidden']}
                        position={'relative'}
                        css={isStoresContainerScrollHeight ? styles.scrollableStoresContainer : null}
                    >
                        {storesToDisplay.map(({ address, displayName: storeDisplayName, distance, storeId }, index) => {
                            const selected = selectedStoreId === storeId;
                            const markerNumber = `${index + 1}`;

                            return (
                                <Flex
                                    ref={this.storeCardRefs[index]}
                                    key={storeId}
                                    is='label'
                                    aria-selected={selected}
                                    gap={2}
                                    padding={2}
                                    borderRadius={2}
                                    borderWidth={1}
                                    borderColor={'midGray'}
                                    position={'relative'}
                                    css={[styles.label, selected ? styles.labelActive : styles.labelInactive]}
                                >
                                    <input
                                        type='radio'
                                        checked={selected}
                                        onChange={this.setSelectedStoreIdCallback(storeId)}
                                        css={{ position: 'absolute', opacity: 0 }}
                                    />
                                    {/* marker icon */}
                                    <Box
                                        position={'relative'}
                                        width={ICON_WIDTH}
                                        height={ICON_HEIGHT}
                                    >
                                        <Image
                                            css={{ position: 'absolute', inset: 0 }}
                                            display={'block'}
                                            width={ICON_WIDTH}
                                            height={ICON_HEIGHT}
                                            src={selected ? MARKERS.solid : MARKERS.outline}
                                        />
                                        <Text
                                            css={{ position: 'absolute', top: 3, left: 0 }}
                                            display={'block'}
                                            width={ICON_WIDTH}
                                            height={ICON_HEIGHT}
                                            fontSize={'10px'}
                                            fontWeight={selected ? 'bold' : 'normal'}
                                            color={selected ? 'white' : 'black'}
                                            textAlign={'center'}
                                            children={markerNumber}
                                        />
                                    </Box>

                                    {/* store name and address */}
                                    <Flex
                                        flex={1}
                                        flexDirection={'column'}
                                        gap={1}
                                    >
                                        <Text
                                            is={'h4'}
                                            fontWeight={'bold'}
                                            children={ensureSephoraPrefix(storeDisplayName)}
                                        />
                                        <Text>
                                            {address?.address1}
                                            <Text
                                                color={'#888'}
                                                children={` • ${distance} ${isCanada() ? 'km' : 'mi'}`}
                                            />
                                        </Text>
                                    </Flex>
                                </Flex>
                            );
                        })}

                        {/* Show more link */}
                        {displayShowMoreLink && (
                            <Link
                                color={'blue'}
                                onClick={this.setStoresToDisplay({ showMore: true })}
                                children={this.getText('showMoreLocations')}
                            />
                        )}
                    </Flex>

                    {/* error message */}
                    {showNoStoresErrorMessage && this.renderError(this.getText('noStoresErrorMessage'))}
                </Flex>

                {/* cta */}
                <StepsCTA
                    ctaText={this.getText('continueToPickArtist')}
                    onClick={this.onCTAClick}
                />
            </>
        );
    }
}

const styles = {
    scrollableStoresContainer: {
        [mediaQueries.md]: {
            paddingRight: space[2],
            paddingTop: space[STORES_LIST_GAP_PADDING_Y],
            paddingBottom: space[STORES_LIST_GAP_PADDING_Y],
            borderTop: `1px solid ${colors.midGray}`,
            borderBottom: `1px solid ${colors.midGray}`,
            scrollbarColor: 'auto'
        }
    },
    label: {
        '&::before': {
            content: '""',
            position: 'absolute',
            border: '2px solid',
            inset: -1,
            borderRadius: radii[2],
            opacity: 0,
            transition: 'opacity .2s',
            zIndex: 1,
            pointerEvents: 'none'
        },
        [mediaQueries.lg]: {
            '&:hover': {
                backgroundColor: colors.nearWhite
            }
        }
    },
    labelActive: {
        '&::before': {
            opacity: 1
        }
    },
    labelInactive: {
        cursor: 'pointer'
    }
};

PickStore.defaultProps = {
    stores: [],
    selectedStore: { address: {} },
    updateStoresList: false,
    preferredStore: {},
    openInfoWindow: () => {},
    setSelectedStore: () => {},
    onClickCTA: () => {},
    showInfoModal: () => {}
};

export default wrapComponent(PickStore, 'PickStore', true);
