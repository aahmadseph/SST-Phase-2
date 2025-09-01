/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'store/Store';
import storeUtils from 'utils/Store';
import decorators from 'utils/decorators';
import anaConsts from 'analytics/constants';
import scriptUtils from 'utils/LoadScripts';
import { colors, space } from 'style/config';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import {
    Box, Flex, Button, Divider, Text, Image, Link, Grid
} from 'components/ui';
import processEvent from 'analytics/processEvent';
import BaseClass from 'components/BaseClass/BaseClass';
import GoogleMap from 'components/GoogleMap/GoogleMap';
import userLocation from 'utils/userLocation/UserLocation';
import ACTIVITY from 'constants/happening/activityConstants';
import ExperienceDetailsActions from 'actions/ExperienceDetailsActions';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import ExperienceLocation from 'components/Happening/ExperienceLocation';

const { wrapComponent } = FrameworkUtils;

class StoreLocatorContent extends BaseClass {
    state = {
        isLoaded: false,
        showListTab: false,
        showMapTab: true,
        shownResults: ACTIVITY.LOCATION_RESULTS_INCREMENT
    };

    componentDidMount() {
        //need to assure that google script is loaded before any
        //google functionality is used (geolocator, place prediction, map)
        this.loadGoogleScript(() => {
            userLocation.determineLocation(
                locationObj => {
                    this.getStoresAndUpdateState(locationObj, true);
                },
                null,
                { sequence: userLocation.getDefaultStrategiesSequence() }
            );
        });

        //analytics
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.OLR;
        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.STORE_LOCATOR;
        digitalData.page.attributes.additionalPageInfo = 'find a sephora';
    }

    loadGoogleScript = callback => {
        //load google place script
        scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE], callback);
    };

    getStoresAndUpdateState = (locationObj, isPageLoad) => {
        //need to update currentLocation before making api call to avoid flash of
        //old location when user updates location
        this.setState({ currentLocation: locationObj.display });
        decorators
            .withInterstice(storeUtils.getStores)(locationObj, false, false)
            .then(storeList => {
                userLocation.setNewLocation(locationObj);

                //isLoaded state variable set to true so we display
                //location search input & sotreList at same time
                this.setState({
                    storeList: storeList,
                    isLoaded: true,
                    showNoStoreResults: false
                });
            })
            .catch(() => {
                this.setState({
                    isLoaded: true,
                    showNoStoreResults: true
                });
            });

        //analytics
        //only need to fire when user changes location, not when user lands on page
        if (!isPageLoad) {
            const isUseMyLocation = locationObj.display === 'Current Location';
            const actionInfo = `happening:${isUseMyLocation ? 'use my location' : 'enter my location'}`;

            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: ['event71'],
                    actionInfo: actionInfo,
                    internalCampaign: actionInfo,
                    linkName: actionInfo
                }
            });
        }
    };

    showMoreLocations = () => {
        const shownResults = this.state.shownResults;
        const totalResults = this.state.storeList.length;

        this.setState({
            shownResults:
                shownResults + ACTIVITY.LOCATION_RESULTS_INCREMENT < totalResults ? shownResults + ACTIVITY.LOCATION_RESULTS_INCREMENT : totalResults
        });
    };

    toggleStoreListTab = () => {
        this.setState({
            showListTab: true,
            showMapTab: false
        });
    };

    toggleMapTab = () => {
        this.setState({
            showListTab: false,
            showMapTab: true
        });
    };

    openMapMarker = storeId => {
        store.dispatch(ExperienceDetailsActions.openInfoWindow(storeId));
    };

    renderStoreOption(_store, index, getText) {
        const isDesktop = Sephora.isDesktop();

        const { address } = _store;

        const distanceUnits = localeUtils.getCountryDistanceUnits();
        const curbsidePickupFlag = storeUtils.isCurbsideEnabled(_store);
        const showConciergeCurbsidePickupIndicator = storeUtils.isConciergeCurbsideEnabled(_store);
        const showCurbsidePickupIndicator = curbsidePickupFlag && !showConciergeCurbsidePickupIndicator;
        const todayClosingTime = storeUtils.getStoreTodayClosingTime(_store.storeHours);

        return (
            <div
                key={index}
                style={index >= this.state.shownResults ? { display: 'none' } : null}
            >
                {index > 0 && <Divider />}
                <Box
                    is='dl'
                    lineHeight='tight'
                    paddingX={['container', 4]}
                    paddingY={4}
                    onClick={() => (isDesktop ? this.openMapMarker(_store.storeId) : (window.location.pathname = _store.targetUrl))}
                    css={{
                        cursor: 'pointer',
                        '.no-touch &:hover': { backgroundColor: colors.nearWhite }
                    }}
                >
                    <Grid
                        is='dt'
                        columns='1fr auto'
                        alignItems='baseline'
                        marginBottom='.25em'
                    >
                        <strong data-at={Sephora.debug.dataAt('store_name')}>
                            {index + 1}. {getText('sephora')} {_store.displayName}
                        </strong>
                        <Link
                            padding={2}
                            margin={-2}
                            color='blue'
                            href={_store.targetUrl}
                            children={getText('storeDetails')}
                        />
                    </Grid>
                    <dd children={address.address1} />
                    <dd
                        data-at={Sephora.debug.dataAt('city_state')}
                        children={`${address.city}, ${address.state} ${address.postalCode}`}
                    />
                    <dd
                        data-at={Sephora.debug.dataAt('country')}
                        children={address.country}
                    />
                    <dd>
                        <Link
                            padding={2}
                            margin={-2}
                            color='blue'
                            href={`tel:${address.phone.replace(/[^0-9]+/g, '')}`}
                            children={`${address.phone}`}
                        ></Link>
                        {todayClosingTime && (
                            <>{todayClosingTime !== 'Closed' ? `  •  ${getText('openUntil')} ${todayClosingTime}` : getText('closed')}</>
                        )}
                        <Text children={`  •  ${_store.distance} ${distanceUnits}`} />
                        {showCurbsidePickupIndicator && <CurbsidePickupIndicator marginTop={'0.75em'} />}
                        {showConciergeCurbsidePickupIndicator && (
                            <ConciergeCurbsidePickupIndicator
                                dataAt={
                                    Sephora.isMobile()
                                        ? 'concierge_curbside_indicator_stores_modal_label'
                                        : 'concierge_curbside_indicator_flyout_label'
                                }
                                marginTop='0.95em'
                            />
                        )}
                    </dd>
                </Box>
            </div>
        );
    }

    renderStoreListLink(getText) {
        return (
            <Flex justifyContent='flex-end'>
                <Link
                    padding={2}
                    margin={-2}
                    color='blue'
                    href={ACTIVITY.OLR_URLS.COMPLETE_STORE_LIST}
                    data-at={Sephora.debug.dataAt('complete_store_list')}
                    children={getText('seeCompleteStoreList')}
                />
            </Flex>
        );
    }

    renderStoreList(getText) {
        const { storeList } = this.state;

        return storeList && storeList.length > 0 ? storeList.map((_store, index) => this.renderStoreOption(_store, index, getText)) : null;
    }

    renderNoStoreResults(getText) {
        const { currentLocation } = this.state;

        return (
            <Box
                marginTop={6}
                textAlign='center'
            >
                <p>
                    <strong
                        dangerouslySetInnerHTML={{
                            __html: getText('noStoreNear', [currentLocation])
                        }}
                    />
                    <br />
                    {getText('pleaseTryDifferentLocation')}
                </p>
                <Image
                    display='block'
                    src='/img/ufe/no-result.svg'
                    size={128}
                    marginX='auto'
                    marginTop={4}
                />
            </Box>
        );
    }

    renderStoreMap() {
        const { storeList, shownResults } = this.state;

        const storeMarkersList = storeList && storeList.length && storeList.slice(0, shownResults);

        return storeMarkersList ? (
            <GoogleMap
                isZoomControlShown={true}
                isAbsoluteFill={Sephora.isDesktop()}
                selectedStore={storeMarkersList[0]}
                showFirstMarkerInfoBox={false}
                stores={storeMarkersList}
                isStoreLocator={true}
            />
        ) : null;
    }

    renderLocationSearch() {
        const { currentLocation } = this.state;

        return (
            <ExperienceLocation
                showInitialUseMyLocation={true}
                clearOnFocus={true}
                isShowSearchIcon={false}
                currentLocation={currentLocation}
                updateCurrentLocation={this.getStoresAndUpdateState}
            />
        );
    }

    render() {
        const {
            showMapTab, showListTab, isLoaded, shownResults, storeList, showNoStoreResults
        } = this.state;

        const getText = localeUtils.getLocaleResourceFile('components/Stores/StoreLocator/locales', 'StoreLocatorContent');
        const bottomSectionContent = {
            happeningAt: '',
            seeWhatsGoingOn: '',
            seeWhatsHappening: ''
        };

        bottomSectionContent.happeningAt = getText('happeningAtRedesign');
        bottomSectionContent.seeWhatsGoingOn = getText('seeWhatsGoingOnRedesign');
        bottomSectionContent.seeWhatsHappening = getText('seeWhatsHappeningRedesign');

        return (
            <>
                <LegacyContainer is='main'>
                    <Text
                        is='h1'
                        marginY={[4, 6]}
                        fontSize={['xl', '2xl']}
                        fontFamily='serif'
                        textAlign='center'
                        lineHeight='tight'
                        children={getText('findASephora')}
                    />
                    {Sephora.isDesktop() ? (
                        <>
                            {isLoaded && (
                                <>
                                    <Flex
                                        marginBottom={5}
                                        height={720}
                                    >
                                        <Flex
                                            width={368}
                                            flexDirection='column'
                                        >
                                            {this.renderLocationSearch()}
                                            {showNoStoreResults ? (
                                                this.renderNoStoreResults(getText)
                                            ) : (
                                                <Box
                                                    overflowY='auto'
                                                    marginTop={5}
                                                    borderRadius={2}
                                                    border={1}
                                                    borderColor='lightGray'
                                                >
                                                    {this.renderStoreList(getText)}
                                                    {shownResults < storeList.length && (
                                                        <>
                                                            <Divider />
                                                            <Flex
                                                                marginY={4}
                                                                justifyContent='center'
                                                            >
                                                                <Button
                                                                    variant='secondary'
                                                                    onClick={this.showMoreLocations}
                                                                >
                                                                    {getText('showMoreLocations')}
                                                                </Button>
                                                            </Flex>
                                                        </>
                                                    )}
                                                </Box>
                                            )}
                                        </Flex>
                                        <Box
                                            position='relative'
                                            marginLeft={5}
                                            flex={1}
                                        >
                                            {this.renderStoreMap()}
                                        </Box>
                                    </Flex>
                                    {this.renderStoreListLink(getText)}
                                    <Divider
                                        marginTop={4}
                                        marginBottom={6}
                                    />
                                </>
                            )}
                            <Box textAlign='center'>
                                <Text
                                    is='h2'
                                    fontSize='xl'
                                    fontFamily='serif'
                                    marginBottom={4}
                                    children={bottomSectionContent.happeningAt}
                                />
                                <Text
                                    is='p'
                                    marginBottom={5}
                                >
                                    {bottomSectionContent.seeWhatsGoingOn}
                                </Text>
                                <Button
                                    variant='primary'
                                    href={ACTIVITY.OLR_URLS.LANDING_PAGE}
                                >
                                    {bottomSectionContent.seeWhatsHappening}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            {isLoaded && (
                                <>
                                    {this.renderLocationSearch()}
                                    {showNoStoreResults ? (
                                        this.renderNoStoreResults(getText)
                                    ) : (
                                        <>
                                            <Flex
                                                marginTop={2}
                                                marginX='-container'
                                                fontSize='md'
                                            >
                                                <button
                                                    type='button'
                                                    onClick={this.toggleMapTab}
                                                    css={[styles.tab, showMapTab && styles.tabActive]}
                                                    children={getText('map')}
                                                />
                                                <button
                                                    type='button'
                                                    onClick={this.toggleStoreListTab}
                                                    css={[styles.tab, showListTab && styles.tabActive]}
                                                    children={getText('list')}
                                                />
                                            </Flex>
                                            <Divider marginX='-container' />
                                            {showListTab && (
                                                <>
                                                    <Box
                                                        marginBottom={5}
                                                        marginX='-container'
                                                    >
                                                        {this.renderStoreList(getText)}
                                                        <Divider />
                                                    </Box>
                                                    {shownResults < storeList.length && (
                                                        <>
                                                            <Flex justifyContent='center'>
                                                                <Button
                                                                    variant='secondary'
                                                                    onClick={this.showMoreLocations}
                                                                >
                                                                    {getText('showMoreLocations')}
                                                                </Button>
                                                            </Flex>
                                                            <Divider
                                                                marginY={5}
                                                                marginX='-container'
                                                            />
                                                        </>
                                                    )}
                                                    {this.renderStoreListLink(getText)}
                                                </>
                                            )}
                                            {showMapTab && <Box marginX='-container'>{this.renderStoreMap()}</Box>}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </LegacyContainer>
            </>
        );
    }
}

const styles = {
    tab: {
        flex: 1,
        textAlign: 'center',
        borderBottom: '2px solid transparent',
        paddingTop: space[2],
        paddingBottom: space[2]
    },
    tabActive: {
        fontWeight: 'var(--font-weight-bold)',
        borderColor: 'inherit'
    }
};

export default wrapComponent(StoreLocatorContent, 'StoreLocatorContent', true);
