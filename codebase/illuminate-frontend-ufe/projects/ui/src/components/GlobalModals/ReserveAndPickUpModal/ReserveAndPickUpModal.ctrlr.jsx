/* eslint-disable no-unused-expressions */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { modal } from 'style/config';
import Modal from 'components/Modal/Modal';
import withInnerModal from 'components/withInnerModal/withInnerModal';
import {
    Box, Grid, Divider, Button
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import BccUtils from 'utils/BCC';
import Price from 'components/Product/Price/Price';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import ExperienceLocation from 'components/Happening/ExperienceLocation/ExperienceLocation';
import FindInStoreMapModal from 'components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal';
import StoresList from 'components/GlobalModals/ReserveAndPickUpModal/StoresList';
import Loader from 'components/Loader/Loader';
import LanguageLocaleUtils from 'utils/LanguageLocale';

import userLocation from 'utils/userLocation/UserLocation';
import store from 'store/Store';
import actions from 'actions/Actions';
import scriptUtils from 'utils/LoadScripts';
import localeUtils from 'utils/LanguageLocale';
import profileApi from 'services/api/profile';
import snbApi from 'services/api/search-n-browse';
import userActions from 'actions/UserActions';
import NoStores from 'components/SharedComponents/Stores/NoStores/NoStores';
import productActions from 'actions/ProductActions';
import { MAX_STORES } from 'constants/Store';
import LOCATION from 'utils/userLocation/Constants';
import basketUtils from 'utils/Basket';
import userUtils from 'utils/User';
import storeUtils from 'utils/Store';
import locationUtils from 'utils/Location';
import addToBasketActions from 'actions/AddToBasketActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import cookieUtils from 'utils/Cookies';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { updateReserveOnlinePickUpInStoreProductDetails } = productActions;
const { IMAGE_SIZES } = BccUtils;

const getText = (text, vars) => getLocaleResourceFile('components/GlobalModals/ReserveAndPickUpModal/locales', 'ReserveAndPickUpModal')(text, vars);
const FIND_IN_STORE_COUNTRY_MISMATCH = 'product.find_store.country.mismatch';

class ReserveAndPickUpModal extends BaseClass {
    state = {
        isLoading: true,
        location: null,
        storesToShow: null,
        selectedStore: null,
        countryMismatch: false,
        stores: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.mountCallback();
        this.loadGoogleScript(this.getUserLocation);
    }

    loadGoogleScript = callback => {
        if (!window.google) {
            scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE], callback);
        } else {
            callback();
        }
    };

    getUserLocation = () => {
        const reduxState = store.getState();
        const { preferredStoreInfo } = reduxState.user;
        userLocation.determineLocation(
            locationObj => {
                let nextState;

                if (preferredStoreInfo?.displayName && !preferredStoreInfo?.isDefault) {
                    nextState = {
                        location: {
                            zipCode: preferredStoreInfo.address.postalCode,
                            country: preferredStoreInfo.address.country,
                            lat: preferredStoreInfo.latitude,
                            lon: preferredStoreInfo.longitude
                        }
                    };
                } else {
                    nextState = { location: locationObj };
                }

                this.setState(nextState, () => this.fetchStores(this.props.currentProduct));
            },
            null,
            { sequence: userLocation.getDefaultStrategiesSequence() }
        );
    };

    updateCurrentLocation = location => {
        this.setState({ location }, () => {
            this.fetchStores(this.props.currentProduct);
        });
    };

    close = () => {
        store.dispatch(actions.showReserveAndPickUpModal({ isOpen: false }));
        this.props.pickupInsteadModalRef && this.props.pickupInsteadModalRef.setState({ isHidden: false });
        this.props.cancelCallback();
    };

    hasSwitchedToKohlsStore = preferredStoreInfoId => {
        const user = store.getState().user;
        const userPreferredStoreId = preferredStoreInfoId ? preferredStoreInfoId : user.preferredStoreInfo.storeId;

        return userPreferredStoreId !== this.state.selectedStore.storeId && storeUtils.isKohlsStore(this.state.selectedStore);
    };

    showInfoModalCallback = () => {
        this.updateProfile().then(res => {
            const { success, preferredStoreInfoId } = res;

            if (success && !locationUtils.isBasketPage()) {
                const updateBopisKohlsBasket = this.hasSwitchedToKohlsStore(preferredStoreInfoId) && basketUtils.hasPickupItems();

                if (updateBopisKohlsBasket) {
                    store.dispatch(addToBasketActions.refreshBasket(true));
                }
            }
        });

        //Fire event for Sephora One Tag
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: anaConsts.LinkData.BOPIS_STORE_SELECTED,
                actionInfo: `change store:${storeUtils.removePrepAtStartForKohls(this.state.selectedStore.displayName)}`,
                storeId: this.state.selectedStore.storeId
            }
        });
    };

    changeStore = () => {
        const user = store.getState().user;

        if (
            this.hasSwitchedToKohlsStore() ||
            (basketUtils.hasPickupItems() && user.preferredStoreInfo && user.preferredStoreInfo.storeId !== this.state.selectedStore.storeId)
        ) {
            let infoMessage = `${getText('changeStoreMessage')} <strong>Sephora ${this.state.selectedStore.displayName}</strong> ${getText(
                'changeStoreMessage2'
            )}.`;

            if (this.state.selectedStore.isRopisable) {
                infoMessage += `<br /><br />${getText('anyPromosRewardsMsg')}`;
            }

            if (this.hasSwitchedToKohlsStore()) {
                infoMessage += `<br /><br />${getText('changeItemQtyMsg')}`;
            }

            store.dispatch(actions.showReserveAndPickUpModal({ isOpen: false }));
            store.dispatch(
                actions.showInfoModal({
                    isOpen: true,
                    title: getText('changeStoreTitle'),
                    message: infoMessage,
                    buttonText: getText('ok'),
                    showCancelButton: true,
                    callback: this.showInfoModalCallback,
                    cancelCallback: this.cancelCallback,
                    dataAtButton: 'change_store_ok_btn',
                    dataAtCancelButton: 'change_store_cancel_btn',
                    isHtml: true
                })
            );
        } else {
            this.updateProfile(true);
            //Fire event for Sephora One Tag
            const isKohlsStoreSelected = storeUtils.isKohlsStore(this.state.selectedStore);

            if (!isKohlsStoreSelected) {
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        eventStrings: [anaConsts.Event.EVENT_71],
                        linkName: anaConsts.LinkData.BOPIS_STORE_SELECTED,
                        actionInfo: anaConsts.LinkData.BOPIS_STORE_SELECTED,
                        sku: this.props.currentProduct.currentSku,
                        selectedStore: this.state.selectedStore,
                        preferredStore: user.preferredStoreInfo,
                        itemAvailabilityInStores: this.state.storesToShow.reduce(
                            (acc, item) => acc + `${item.storeId}:${ExtraProductDetailsUtils.isinStock(item.availabilityStatus) ? 'Yes' : 'No'};`,
                            ''
                        ),
                        isAvailablePreferredStore: ExtraProductDetailsUtils.isinStock(this.state.selectedStore.availabilityStatus) ? 'Yes' : 'No',
                        storeId: this.state.selectedStore.storeId
                    }
                });
            }
        }
    };

    updateProfile = shouldClose => {
        const user = store.getState().user;

        return profileApi.switchPreferredStore(this.state.selectedStore.storeId, true).then(res => {
            if (this.props.isRopisSelected) {
                this.getRopisDetails();
            }

            storeUtils.cacheStoreData(this.state.selectedStore);
            // if user data is not flushed prior to updating the preferred store it would remain outdated information there.
            const shouldClearCache = !userUtils.isAnonymous();
            store.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: this.state.selectedStore }, shouldClearCache, true));
            shouldClose && store.dispatch(actions.showReserveAndPickUpModal({ isOpen: false }));
            this.props.pickupInsteadModalRef && this.props.pickupInsteadModalRef.switchToPickupBasket();
            this.props.callback(res?.success);

            if (Sephora.configurationSettings.setZipStoreCookie) {
                cookieUtils.write(cookieUtils.KEYS.PREFERRED_STORE, this.state.selectedStore.storeId, null, false, false);
            }

            return {
                ...res,
                preferredStoreInfoId: user.preferredStoreInfo.storeId
            };
        });
    };

    cancelCallback = () => {
        store.dispatch(
            actions.showReserveAndPickUpModal({
                ...this.props,
                isOpen: true
            })
        );
    };

    getRopisDetails = () => {
        const user = store.getState().user.profileId;
        const product = this.props.currentProduct;
        const sku = product.currentSku;
        const productId = product?.productDetails?.productId;
        profileApi.getRopisSpecificProductDetails(user, productId, sku.skuId, 'pdp').then(data => {
            store.dispatch(updateReserveOnlinePickUpInStoreProductDetails(data));
        });
    };

    fetchStores = product => {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true,
                selectedStore: null
            });
        }

        const { location } = this.state;

        if (location === null) {
            return;
        }

        if (location.src === LOCATION.TYPES.GEOLOCATION && typeof location.country === 'undefined') {
            location.country = localeUtils.getCurrentCountry();
        }

        const skuId = product.currentSku ? product.currentSku.skuId : product.skuId;

        const radius =
            location.src !== LOCATION.TYPES.GEOLOCATION ? localeUtils.getCountrySearchRadius(location.country) : localeUtils.getCountrySearchRadius();

        const data = {
            excludeNonSephoraStores: true,
            zipCode: location.zipCode,
            country: location.country,
            latitude: location.lat,
            longitude: location.lon,
            radius
        };

        snbApi
            .findInStore(skuId, data)
            .then(resp => {
                if (resp.errorCode) {
                    this.setState({
                        inStock: false,
                        isLoading: false
                    });
                } else {
                    this.storeList = resp.stores;
                    this.totalStores = this.storeList.length;
                    const inStock = this.totalStores > 0;
                    const storesToShow = this.totalStores > MAX_STORES ? this.storeList.slice(0, MAX_STORES) : this.storeList;
                    this.setState({
                        storesToShow: storesToShow,
                        storeMessage: resp.storeMessages[0].messages[0],
                        inStock: inStock,
                        isLoading: false,
                        countryMismatch: false
                    });

                    digitalData.page.attributes.itemAvailabilityInStores = this.state.storesToShow.reduce(
                        (acc, item) => acc + `${item.storeId}:${ExtraProductDetailsUtils.isinStock(item.availabilityStatus) ? 'Yes' : 'No'};`,
                        ''
                    );
                    digitalData.page.attributes.isAvailablePreferredStore = ExtraProductDetailsUtils.isinStock(
                        this.state.selectedStore.availabilityStatus
                    )
                        ? 'Yes'
                        : 'No';
                    digitalData.page.attributes.skuId = skuId;
                }
            })
            .catch(err => {
                if (err.errorCode) {
                    this.setState({
                        inStock: false,
                        isLoading: false,
                        countryMismatch: err.key === FIND_IN_STORE_COUNTRY_MISMATCH
                    });
                }
            });
    };

    handleStoreSelection = (e, selectedStore) => {
        this.setState({ selectedStore });
    };

    render() {
        const {
            isLoading, location, selectedStore, storesToShow, countryMismatch
        } = this.state;
        const product = this.props.currentProduct;
        const { productDetails } = product;
        const sku = product.currentSku || product;
        const { innerModal, disableNonBopisStores, disableOutOfStockStores, openModal } = this.props;

        return (
            <Modal
                onDismiss={this.close}
                isOpen={this.props.isOpen}
                width={0}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title children={getText('pickUpInStore')} />
                </Modal.Header>
                <Modal.Body position='relative'>
                    {innerModal}
                    <Grid
                        columns='auto 1fr'
                        gap={4}
                        lineHeight='tight'
                    >
                        <ProductImage
                            id={sku.skuId}
                            size={IMAGE_SIZES[97]}
                            skuImages={sku.skuImages}
                        />
                        <div>
                            <span
                                css={{ fontWeight: 'var(--font-weight-bold)' }}
                                data-at={Sephora.debug.dataAt('ropis_sku_brand')}
                            >
                                {productDetails.brand ? productDetails.brand.displayName : productDetails.brandName}
                            </span>
                            <br />
                            <span data-at={Sephora.debug.dataAt('ropis_sku_name')}>{productDetails.displayName}</span>
                            <SizeAndItemNumber
                                sku={sku}
                                marginTop={1}
                                fontSize='sm'
                            />
                            <ProductVariation
                                product={product}
                                sku={sku}
                                fontSize='sm'
                                data-at={Sephora.debug.dataAt('ropis_sku_var')}
                            />
                            <Price
                                marginTop={1}
                                sku={sku}
                            />
                        </div>
                    </Grid>
                    <Divider
                        thick
                        marginY={4}
                        marginX={modal.outdentX}
                    />
                    <ExperienceLocation
                        currentLocation={location ? location.display : ''}
                        updateCurrentLocation={this.updateCurrentLocation}
                    />
                    <Box minHeight={[null, 250]}>
                        {storesToShow && storesToShow.length && !countryMismatch ? (
                            <StoresList
                                openModal={openModal}
                                stores={storesToShow}
                                selectedStore={selectedStore}
                                disableNonBopisStores={disableNonBopisStores}
                                disableOutOfStockStores={disableOutOfStockStores}
                                handleStoreSelection={this.handleStoreSelection}
                                skuId={sku.skuId}
                            />
                        ) : !isLoading ? (
                            <NoStores
                                countryMismatch={countryMismatch}
                                currentLocation={location.display ? location.display : location.zipCode}
                                close={this.close}
                            />
                        ) : null}
                        {isLoading && <Loader isShown />}
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        data-at={Sephora.debug.dataAt('pickup_modal_choose_this_store_btn')}
                        variant='primary'
                        block={true}
                        // iOS Safari 14.5+ intermittently neglects to update the button text color
                        // when the disabled prop is changed; force a re-render
                        key={`changeStoreButton${selectedStore}`}
                        disabled={!selectedStore}
                        onClick={this.changeStore}
                        children={getText('chooseThisStore')}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

ReserveAndPickUpModal.defaultProps = {
    callback: () => {},
    mountCallback: () => {},
    cancelCallback: () => {}
};

export default withInnerModal(wrapComponent(ReserveAndPickUpModal, 'ReserveAndPickUpModal', true), FindInStoreMapModal);
