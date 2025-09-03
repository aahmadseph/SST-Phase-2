/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import storeUtils from 'utils/Store';
import InfoButton from 'components/InfoButton/InfoButton';
import userLocation from 'utils/userLocation/UserLocation';
import scriptUtils from 'utils/LoadScripts';
import withInnerModal from 'components/withInnerModal/withInnerModal';
import FindInStoreMapModal from 'components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal';
import ExperienceLocation from 'components/Happening/ExperienceLocation';
import Radio from 'components/Inputs/Radio/Radio';
import userActions from 'actions/UserActions';
import Modal from 'components/Modal/Modal';
import profileApi from 'services/api/profile';
import actions from 'Actions';
import addToBasketActions from 'actions/AddToBasketActions';
import basketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import StoreSelectorModalBindings from 'analytics/bindingMethods/components/globalModals/storeSelectorModal/StoreSelectorModalBindings';
import NoStores from 'components/SharedComponents/Stores/NoStores/NoStores';
import LOCATION from 'utils/userLocation/Constants';
import Location from 'utils/Location';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import { MAX_STORES } from 'constants/Store';
import Loader from 'components/Loader/Loader';
import BopisKohlsItem from 'components/SharedComponents/BopisKohlsItem';
import { PICKUP } from 'constants/UpperFunnel';
import userUtils from 'utils/User';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import { modal, colors } from 'style/config';
import {
    Box, Link, Grid, Divider, Button, Text
} from 'components/ui';
import LanguageLocale from 'utils/LanguageLocale';
import cookieUtils from 'utils/Cookies';

const { getLocaleResourceFile } = LanguageLocale;
const getPickupIndicatorText = getLocaleResourceFile('components/CurbsidePickupIndicator/locales', 'CurbsidePickupIndicator');

const KOHLS_LINK = 'https://www.kohls.com/sale-event/sephora-at-kohls.jsp?icid=fromSephora';

const getText = (text, vars) => localeUtils.getLocaleResourceFile('components/Header/StoresContent/locales', 'StoresContent')(text, vars);

class StoreSwitcher extends BaseClass {
    state = {
        currentLocation: null,
        isOpen: true
    };

    getOkButtonText = ({ okButtonText, options }) => {
        if (okButtonText != null) {
            return okButtonText;
        }

        return okButtonText || (options?.isUpperFunnel ? getText(options.taskQueue ? 'done' : 'showResults') : getText('chooseThisStore'));
    };

    render() {
        const {
            currentLocation, isLoaded, storeList, showNoStoreResults, selectedStore, countryMismatch, isOpen
        } = this.state;

        const {
            showStoreDetails, onDismiss, options, showCancelButton, okButtonText
        } = this.props;
        const modalTitle = getText(options?.isUpperFunnel ? 'pickupInStore' : 'changeStore');
        const footerColumns = showCancelButton || options?.isUpperFunnel ? 2 : 1;

        return !this.state.isShowChangeAlertModal ? (
            <Modal
                isOpen={isOpen}
                width={0}
                onDismiss={onDismiss}
                hasBodyScroll={true}
            >
                {this.props.innerModal}
                <Modal.Header>
                    <Modal.Title children={modalTitle} />
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
                            {storeList && this.renderStoreOptions(storeList)}
                            {showNoStoreResults && (
                                <NoStores
                                    countryMismatch={countryMismatch}
                                    currentLocation={currentLocation}
                                    close={this.close}
                                />
                            )}
                        </>
                    )}
                </Modal.Body>
                {storeList && !showNoStoreResults && isLoaded && (
                    <Modal.Footer>
                        <Grid columns={footerColumns}>
                            {(options?.isUpperFunnel || showCancelButton) && (
                                <Button
                                    variant='secondary'
                                    onClick={onDismiss}
                                    children={getText('cancel')}
                                />
                            )}
                            <Button
                                variant='primary'
                                children={this.getOkButtonText({
                                    okButtonText,
                                    options
                                })}
                                {...(!showStoreDetails && { 'data-at': Sephora.debug.dataAt('change_store_use_this_store_btn') })}
                                disabled={!selectedStore || (showStoreDetails && !(selectedStore.isRopisable || selectedStore.isBopisable))}
                                block={true}
                                onClick={this.handleChangeStore}
                            />
                        </Grid>
                    </Modal.Footer>
                )}
            </Modal>
        ) : null;
    }

    renderCurbsidePickupOptions = item => {
        return (
            <>
                <>
                    {storeUtils.isCurbsideEnabled(item) && !storeUtils.isConciergeCurbsideEnabled(item) && (
                        <CurbsidePickupIndicator
                            dataAt='change_store_curbside_indicator_label'
                            is='dd'
                            marginTop={'.75em'}
                        />
                    )}
                </>
                <>
                    {storeUtils.isCurbsideEnabled(item) && storeUtils.isConciergeCurbsideEnabled(item) && (
                        <ConciergeCurbsidePickupIndicator
                            dataAt={
                                Sephora.isMobile() ? 'concierge_curbside_indicator_stores_modal_label' : 'concierge_curbside_indicator_flyout_label'
                            }
                            is='dd'
                            marginTop='0.75em'
                        />
                    )}
                </>
            </>
        );
    };

    renderStoreOptions = storeList => {
        const stores = storeList.slice(0, MAX_STORES);
        const { isBOPISEnabled } = Sephora.configurationSettings;
        const { selectedStore } = this.state;
        const { showStoreDetails, options, openModal } = this.props;

        // eslint-disable-next-line complexity
        return stores.map((item, index) => {
            const isStoreTypeKohls = storeUtils.isStoreTypeKohls(item);
            const storeName = storeUtils.getStoreDisplayNameWithSephora(item);
            const radioId = `store_select_${storeName.toLowerCase().replace(/\s+/g, '_')}_${index}`;
            const storeAddress = `${item.address.address1} ${item.address.address2} ${item.address.city} ${item.address.state} ${item.address.postalCode}`;
            const ariaLabelForRadioButtons = `Select ${storeName} ${storeAddress} ${this.getStoreClosingText(item)} ${getPickupIndicatorText(
                'curbsidePickupAvailable'
            )}`;

            return (
                <React.Fragment key={item.displayName}>
                    {index > 0 && (
                        <Divider
                            marginY={4}
                            marginX={modal.outdentX}
                        />
                    )}
                    <Grid
                        data-at={Sephora.debug.dataAt('change_store_found_store')}
                        alignItems='flex-start'
                        columns='1fr auto'
                        marginTop={index === 0 && 4}
                    >
                        <div data-at={Sephora.debug.dataAt('store_data')}>
                            <Radio
                                paddingY={null}
                                css={selectedStore === item || { ':hover .StoreSwitcher-name': { textDecoration: 'underline' } }}
                                dataAt={'radio_dot_store'}
                                disabled={(showStoreDetails && !(item.isRopisable || item.isBopisable)) || isStoreTypeKohls}
                                checked={selectedStore === item}
                                onChange={() => {
                                    this.selectStore(item);
                                }}
                                alignItems='start'
                                id={radioId}
                                label={`Select ${storeName}`}
                                aria-label={ariaLabelForRadioButtons}
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
                                        {storeName}
                                    </dt>
                                    {showStoreDetails && !isStoreTypeKohls && (
                                        <dd
                                            css={[
                                                { margin: '.5em 0' },
                                                item.isRopisable || (isBOPISEnabled && item.isBopisable) || { color: colors.gray }
                                            ]}
                                        >
                                            {item.isRopisable ||
                                                (isBOPISEnabled && item.isBopisable) ||
                                                getText(options?.isUpperFunnel ? 'pickupNotOffered' : 'reservationNotOffered')}
                                        </dd>
                                    )}
                                    {!isStoreTypeKohls && (
                                        <BopisKohlsItem
                                            store={item}
                                            is='dd'
                                            marginTop={[1, 2]}
                                            marginBottom={[1, 2]}
                                        />
                                    )}
                                    {isStoreTypeKohls && (
                                        <Text
                                            marginTop={2}
                                            marginBottom={2}
                                            color='gray'
                                            lineHeight='14px'
                                            fontWeight='normal'
                                            fontSize='sm'
                                            is='dd'
                                        >
                                            {getText('goTo')}
                                            <Link
                                                color='blue'
                                                href={KOHLS_LINK}
                                                children={'kohls.com'}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    StoreSelectorModalBindings.triggerAnalytics(null, item.storeId);
                                                    Location.setLocation(KOHLS_LINK);
                                                }}
                                            />
                                            {getText('kohlsCopy')}
                                        </Text>
                                    )}
                                    <dd>{item.address.address1}</dd>
                                    {item.address.address2 && <dd>{item.address.address2}</dd>}
                                    <dd>
                                        {item.address.city}
                                        {', '}
                                        {item.address.state} {item.address.postalCode}
                                    </dd>
                                    <dd css={{ marginTop: '.75em' }}>
                                        {this.getStoreClosingText(item)}
                                        {showStoreDetails && (
                                            <React.Fragment>
                                                <span css={{ margin: '0 .5em' }}>•</span>
                                                {item.distance} {localeUtils.isCanada() ? getText('kmAway') : getText('milesAway')}
                                            </React.Fragment>
                                        )}
                                    </dd>
                                    {this.renderCurbsidePickupOptions(item)}
                                </dl>
                            </Radio>
                        </div>
                        {showStoreDetails ? (
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
                        ) : (
                            <Link
                                color='blue'
                                padding={2}
                                margin={-2}
                                href={item.targetUrl}
                                target='_blank'
                                data-at={Sephora.debug.dataAt('change_store_view_details_btn')}
                                children={getText('viewDetails')}
                            />
                        )}
                    </Grid>
                </React.Fragment>
            );
        });
    };

    componentDidMount() {
        const { options, showStoreDetails, entry } = this.props;
        const getLocationFunction = !options?.isUpperFunnel && showStoreDetails ? this.getStoreLocation : this.getUserLocation;

        if (!window.google) {
            this.loadGoogleScript(getLocationFunction);
        } else {
            getLocationFunction();
        }

        StoreSelectorModalBindings.storeSwitcherLoad(entry);
    }

    getUserLocation = () => {
        userLocation.determineLocation(
            locationObj => {
                this.getStoresAndUpdateState(locationObj, true);
            },
            null,
            { sequence: userLocation.getDefaultStrategiesSequence() }
        );
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

    loadGoogleScript = callback => {
        scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE], callback);
    };

    selectStore = selectedStore => {
        this.setState({ selectedStore: selectedStore });
    };

    upfunnelActions = () => {
        const { options, onDismiss, afterCallback } = this.props;
        const { selectedStore } = this.state;

        const payload = {
            storeId: selectedStore?.storeId,
            displayName: selectedStore?.displayName
        };
        const taskId = PICKUP;
        const changeStorePromise = () =>
            new Promise(resolve => {
                store.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: selectedStore }, false, true));
                this.updateProfile(false);
                resolve();
            });
        options.taskQueue.add(changeStorePromise, taskId);
        store.dispatch(userActions.draftStoreDetails(payload));
        afterCallback({ storeId: selectedStore.storeId });
        onDismiss();
    };

    showConfirmationModal = (useUpfunnelAction = false) => {
        const cbFn = useUpfunnelAction ? this.upfunnelActions : this.showInfoModalCallback;
        const storeDisplayName = storeUtils.getStoreDisplayNameWithSephora(this.state.selectedStore);
        let infoMessage = `${getText('changeStoreMessage')} <strong>${storeDisplayName}</strong> ${getText('changeStoreMessage2')}.`;

        if (this.state.selectedStore.isRopisable) {
            infoMessage += `<br /><br />${getText('anyPromosRewardsMsg')}`;
        }

        if (this.hasSwitchedToKohlsStore()) {
            if (this.props?.options?.isHeader) {
                infoMessage += `<br /><br />${getText('changeItemQtyMsgHeader')}`;

                if (basketUtils.hasBopisItemsCountGreaterThanOne()) {
                    infoMessage += `<strong> ${getText('changeItemQtyMsgHeaderMoreThanOne')}</strong>`;
                }
            } else {
                infoMessage += `<br /><br />${getText('changeItemQtyMsg')}`;
            }
        }

        this.setState({ isShowChangeAlertModal: true });
        store.dispatch(
            actions.showInfoModal({
                isOpen: true,
                title: getText('changeStore'),
                message: infoMessage,
                buttonText: getText('ok'),
                showCancelButton: true,
                callback: cbFn,
                cancelCallback: this.cancelCallback,
                dataAtButton: 'change_store_ok_btn',
                dataAtCancelButton: 'change_store_cancel_btn',
                isHtml: true
            })
        );
    };

    handleChangeStore = () => {
        const { options, onDismiss, afterCallback } = this.props;
        const { selectedStore } = this.state;

        if (options?.taskQueue) {
            const user = store.getState().user;

            if (
                this.hasSwitchedToKohlsStore() ||
                (basketUtils.hasPickupItems() && user?.preferredStoreInfo?.storeId !== this.state.selectedStore.storeId)
            ) {
                this.showConfirmationModal(true);
            } else {
                this.upfunnelActions(options, onDismiss, afterCallback, selectedStore);
            }
        } else {
            this.changeStore();
        }
    };

    hasSwitchedToKohlsStore = preferredStoreInfoId => {
        const user = store.getState().user;
        const userPreferredStoreId = preferredStoreInfoId ? preferredStoreInfoId : user.preferredStoreInfo.storeId;

        return userPreferredStoreId !== this.state.selectedStore.storeId && storeUtils.isKohlsStore(this.state.selectedStore);
    };

    fireAnalytics = () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: anaConsts.LinkData.BOPIS_STORE_SELECTED,
                actionInfo: `change store:${storeUtils.removePrepAtStartForKohls(this.state.selectedStore.displayName)}`,
                storeId: this.state.selectedStore.storeId
            }
        });
    };

    showInfoModalCallback = () => {
        this.updateProfile().then(res => {
            const { success } = res;

            if (success) {
                //Fire event for Sephora One Tag
                this.fireAnalytics();
            }
        });
    };

    changeStore = () => {
        const user = store.getState().user;

        if (
            this.hasSwitchedToKohlsStore() ||
            (basketUtils.hasPickupItems() && user?.preferredStoreInfo?.storeId !== this.state.selectedStore.storeId)
        ) {
            this.showConfirmationModal();
        } else {
            this.updateProfile();
            //Fire event for Sephora One Tag
            this.fireAnalytics();
        }
    };

    updateProfile = (shouldTriggerCallback = true) => {
        this.props.onDismiss();
        const user = store.getState().user;

        return profileApi.switchPreferredStore(this.state.selectedStore.storeId, true).then(res => {
            storeUtils.cacheStoreData(Object.assign({}, this.state.selectedStore, { isUserSelected: true }));

            if (Sephora.configurationSettings.setZipStoreCookie) {
                cookieUtils.write(cookieUtils.KEYS.PREFERRED_STORE, this.state.selectedStore.storeId, null, false, false);
            }

            Promise.resolve()
                .then(() => {
                    const { options } = this.props;
                    const shouldClearCache = !userUtils.isAnonymous();
                    store.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: this.state.selectedStore }, shouldClearCache, true));
                    const basket = store.getState().basket;

                    if (typeof this.props.onChange === 'function') {
                        this.props.onChange();
                    } else if (basket?.pickupBasket?.itemCount) {
                        store.dispatch(addToBasketActions.refreshBasket(true));
                    }

                    shouldTriggerCallback &&
                        this.props.afterCallback({
                            storeId: this.state.selectedStore.storeId
                        });

                    // We need to dispatch this action at the very end
                    // This is why this check is done here.
                    if (options?.isHeader) {
                        store.dispatch(userActions.storeChangedFromHeader(this.state.selectedStore));
                    }
                })
                .catch(e => {
                    // eslint-disable-next-line no-console
                    console.warn(e);
                });

            return {
                ...res,
                preferredStoreInfoId: user.preferredStoreInfo.storeId
            };
        });
    };

    cancelCallback = () => {
        this.setState({ isShowChangeAlertModal: false });
    };

    getStoreClosingText = item => {
        const storeClosingTime = storeUtils.getStoreTodayClosingTime(item.storeHours);

        return storeClosingTime ? getText('openUntil', [storeClosingTime]) : getText('closed');
    };

    close = () => {
        this.props.onDismiss && this.props.onDismiss();
        this.setState({ isOpen: false });
    };

    getStoreListCountry = storeList => {
        return storeList && storeList.length > 0 && storeList[0].address.country;
    };

    isCountryMismatch = country => {
        return country !== localeUtils.getCurrentCountry();
    };

    getStoresAndUpdateState = locationObj => {
        if (locationObj?.display != null) {
            this.setState({ currentLocation: locationObj.display });
        } else {
            this.getUserLocation();
        }

        if (
            (locationObj.src === LOCATION.TYPES.GEOLOCATION || locationObj.src === LOCATION.TYPES.PREDICTION) &&
            typeof locationObj.country === 'undefined'
        ) {
            locationObj.country = localeUtils.getCurrentCountry();
        }

        if (locationObj.country === localeUtils.getCurrentCountry().toUpperCase()) {
            storeUtils
                .getStores(locationObj, true, false, false, true, true)
                .then(storeList => {
                    const storesCountry = this.getStoreListCountry(storeList);
                    const isCountryMismatch = this.isCountryMismatch(storesCountry);
                    userLocation.setNewLocation(locationObj);
                    const { showStoreDetails } = this.props;
                    const { preferredStoreInfo } = store.getState().user;
                    const selectedStore = storeList.find(storeItem => storeItem.storeId === preferredStoreInfo.storeId);

                    this.setState({
                        storeList: isCountryMismatch ? null : storeList,
                        isLoaded: true,
                        showNoStoreResults: isCountryMismatch,
                        countryMismatch: isCountryMismatch,
                        selectedStore:
                            showStoreDetails && selectedStore
                                ? selectedStore
                                : storeUtils.isStoreTypeKohls(storeList?.[0])
                                    ? selectedStore
                                    : storeList[0]
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

StoreSwitcher.defaultProps = {
    onDismiss: () => {},
    afterCallback: () => {},
    entry: '',
    preventDefaultSearchUpdates: false
};

export default withInnerModal(wrapComponent(StoreSwitcher, 'StoreSwitcher', true), FindInStoreMapModal);
