/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import snbApi from 'services/api/search-n-browse';
import localeUtils from 'utils/LanguageLocale';
import actions from 'Actions';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';

import { measure, modal } from 'style/config';
import {
    Box, Divider, Button, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Modal from 'components/Modal/Modal';
import InputZip from 'components/Inputs/InputZip/InputZip';
import Select from 'components/Inputs/Select/Select';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import ErrorMsg from 'components/ErrorMsg';
import BccUtils from 'utils/BCC';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import skuUtils from 'utils/Sku';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { IMAGE_SIZES } = BccUtils;

const STORES_PER_PAGE = 5;

const DISTANCE = {
    US: {
        Values: [5, 10, 25, 50, 100],
        Unit: 'mile'
    },
    CA: {
        Values: [10, 25, 50, 100, 150],
        Unit: 'kilometer'
    }
};

class FindInStoreModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            inStock: false,
            zipCode: this.props.zipCode || null,
            showResult: this.props.showResult || false,
            searchedDistance: null,
            storeMessage: null,
            currentPage: 1,
            storesToShow: []
        };
        this.storeZipCode = null;
        this.totalStores = 0;
        this.storeList = [];
    }

    componentDidMount() {
        if (this.props.zipCode && !this.props.storesToShow) {
            this.setState(
                {
                    searchedDistance: localeUtils.isCanada() ? 150 : 100
                },
                () => this.fetchStores()
            );
        }

        const setStoresToShow = value =>
            this.setState({
                storesToShow: value.storesToShow,
                showResult: true,
                inStock: true,
                searchedDistance: value.searchedDistance
            });

        store.setAndWatch('modals', this, value => {
            if (value.modals.storesToShow) {
                setStoresToShow(value.modals);
            }
        });
    }

    requestClose = () => {
        store.dispatch(actions.showFindInStoreModal(false));
    };

    handleDistanceSelect = e => {
        e.preventDefault();
        this.setState({ searchedDistance: e.target.value });
    };

    handleDistanceSelect = e => {
        e.preventDefault();
        this.setState({ searchedDistance: e.target.value });
    };

    handleSubmit = searched => e => {
        e.preventDefault();
        const errorMessage = this.storeZipCode.validateError();

        if (!errorMessage) {
            this.fetchStores(searched);
            this.fireAnalytics();
        }
    };

    fireAnalytics = () => {
        //Analytics
        const eventString = 'Find In Store';
        const currentSku = this.props.currentProduct.currentSku;
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [analyticsConsts.Event.EVENT_71, 'event55'],
                linkName: eventString,
                sku: currentSku,
                actionInfo: eventString
            }
        });
    };

    fetchStores = searched => {
        const skuId = this.props.currentProduct.currentSku ? this.props.currentProduct.currentSku.skuId : this.props.currentProduct.skuId;
        const country = localeUtils.isCanada() ? 'CA' : 'US';
        const searchedDistance = this.state.searchedDistance || searched;
        const data = {
            zipCode: this.storeZipCode.getValue(),
            radius: parseInt(searchedDistance),
            country: country
        };

        return snbApi
            .findInStore(skuId, data)
            .then(resp => {
                if (resp.errorCode) {
                    this.setState({
                        showResult: true,
                        inStock: false,
                        searchedDistance: searchedDistance
                    });
                } else {
                    this.storeList = resp.stores;
                    this.totalStores = this.storeList.length;
                    const inStock = this.totalStores > 0;
                    const storesToShow = this.getCurrentPageStores(this.state.currentPage);
                    this.setState({
                        showResult: true,
                        zipCode: data.zipCode,
                        storesToShow: storesToShow,
                        storeMessage: resp.storeMessages[0].messages[0],
                        inStock: inStock,
                        searchedDistance: searchedDistance
                    });
                }
            })
            .catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);

                if (err.errorCode) {
                    this.setState({
                        showResult: true,
                        inStock: false,
                        searchedDistance: searchedDistance
                    });
                }
            });
    };

    showMap = (product, selectedStore, zipCode, searchedDistance, storesToShow) => {
        store.dispatch(actions.showFindInStoreModal(false));
        store.dispatch(
            actions.showFindInStoreMapModal({
                isOpen: true,
                currentProduct: product,
                selectedStore: selectedStore,
                zipCode: zipCode,
                searchedDistance: searchedDistance,
                storesToShow: storesToShow,
                useBackToStoreLink: true
            })
        );
    };

    shouldShowMoreStores = () => {
        return this.totalStores > this.state.currentPage * STORES_PER_PAGE;
    };

    showMoreStores = () => {
        const currentPage = this.state.currentPage + 1;
        const storeListToShow = this.getCurrentPageStores(currentPage);
        this.setState({
            currentPage: currentPage,
            storesToShow: storeListToShow
        });
    };

    getCurrentPageStores = currentPage => {
        return this.storeList.slice(0, currentPage * STORES_PER_PAGE);
    };

    handleViewMap = () => {
        const product = this.props.currentProduct;
        this.showMap(product, store, this.state.zipCode, this.state.searchedDistance, this.state.storesToShow);
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/FindInStore/FindInStoreModal/locales', 'FindInStoreModal');

        const isMobile = Sephora.isMobile();
        const product = this.props.currentProduct;
        const sku = product.currentSku || product;
        const productDetails = product.productDetails;
        let brandName;
        let displayName;

        if (productDetails) {
            brandName = productDetails.brand ? productDetails.brand.displayName : productDetails.brandName;
            displayName = productDetails.displayName;
        } else {
            brandName = product.brandName;
            displayName = product.displayName;
        }

        const isCanada = !!localeUtils.isCanada();
        let defaultDistance;
        let distanceUnit;
        let distanceValues;
        let index;

        if (isCanada) {
            distanceUnit = getText(DISTANCE.CA.Unit);
            distanceValues = DISTANCE.CA.Values;
            index = this.props.zipCode ? DISTANCE.CA.Values.length - 1 : 0;
            defaultDistance = DISTANCE.CA.Values[index];
        } else {
            distanceUnit = getText(DISTANCE.US.Unit);
            distanceValues = DISTANCE.US.Values;
            index = this.props.zipCode ? DISTANCE.US.Values.length - 1 : 0;
            defaultDistance = DISTANCE.US.Values[index];
        }

        const searched = this.state.searchedDistance || defaultDistance;
        const isShowMore = this.shouldShowMoreStores();

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{getText('findInStore')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LegacyGrid gutter={4}>
                        <LegacyGrid.Cell width='fit'>
                            <ProductImage
                                id={sku.skuId}
                                size={IMAGE_SIZES[97]}
                                skuImages={sku.skuImages}
                                altText={supplementAltTextWithProduct(sku, product)}
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width='fill'
                            lineHeight='tight'
                        >
                            <strong data-at={Sephora.debug.dataAt('fis_sku_brand')}>{brandName}</strong>
                            <div data-at={Sephora.debug.dataAt('fis_sku_name')}>{displayName}</div>
                            <SizeAndItemNumber
                                sku={sku}
                                fontSize='sm'
                                marginTop={2}
                                lineHeight='tight'
                            />
                            <ProductVariation
                                fontSize='sm'
                                marginTop={1}
                                data-at={Sephora.debug.dataAt('fis_sku_var')}
                                {...skuUtils.getProductVariations({
                                    product,
                                    sku
                                })}
                            />
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                    <Divider
                        marginX={modal.outdentX}
                        marginY={4}
                        thick
                    />
                    <form
                        method='post'
                        onSubmit={this.handleSubmit(searched)}
                    >
                        <LegacyGrid
                            fill={true}
                            gutter={3}
                            marginBottom={5}
                        >
                            <LegacyGrid.Cell>
                                <Text
                                    is='label'
                                    htmlFor='fisZip'
                                    display='block'
                                    lineHeight='tight'
                                    fontWeight='bold'
                                    marginBottom={2}
                                    children={isCanada ? getText('postal') : getText('zip')}
                                />
                                <InputZip
                                    id='fisZip'
                                    placeholder={`e.g., ${isCanada ? 'M5B 2H1' : '90210'}`}
                                    marginBottom={null}
                                    value={this.state.zipCode}
                                    ref={c => {
                                        if (c !== null) {
                                            this.storeZipCode = c;
                                        }
                                    }}
                                />
                            </LegacyGrid.Cell>
                            <LegacyGrid.Cell>
                                <Text
                                    is='label'
                                    htmlFor='fisDistance'
                                    display='block'
                                    lineHeight='tight'
                                    fontWeight='bold'
                                    marginBottom={2}
                                    children={getText('within')}
                                />
                                <Select
                                    id='fisDistance'
                                    marginBottom={null}
                                    name='distance'
                                    value={searched}
                                    onChange={this.handleDistanceSelect}
                                >
                                    {distanceValues.map(name => (
                                        <option
                                            key={name}
                                            value={name}
                                        >
                                            {name} {' ' + distanceUnit}s
                                        </option>
                                    ))}
                                </Select>
                            </LegacyGrid.Cell>
                        </LegacyGrid>
                        <Button
                            variant='primary'
                            type='submit'
                            block={true}
                            children={getText('find')}
                        />
                    </form>
                    {this.state.showResult && (
                        <Box
                            marginTop={6}
                            lineHeight='tight'
                        >
                            {this.state.inStock && (
                                <React.Fragment>
                                    <Text
                                        is='h3'
                                        fontWeight='bold'
                                    >
                                        {getText('inStock')}
                                    </Text>
                                    <Text
                                        is='p'
                                        marginTop={1}
                                        marginBottom={4}
                                    >
                                        {this.state.storeMessage}
                                    </Text>
                                    {this.state.storesToShow &&
                                        this.state.storesToShow.map((store, idx) => (
                                            <React.Fragment key={store.displayName || idx.toString()}>
                                                {idx > 0 && <Divider marginY={4} />}
                                                <LegacyGrid>
                                                    <LegacyGrid.Cell
                                                        width='2em'
                                                        fontWeight='bold'
                                                        textAlign='right'
                                                        paddingRight='.5em'
                                                    >
                                                        {idx + 1}.
                                                    </LegacyGrid.Cell>
                                                    <LegacyGrid.Cell
                                                        width='fill'
                                                        is='dl'
                                                        lineHeight='tight'
                                                    >
                                                        <Text
                                                            is='dt'
                                                            fontWeight='bold'
                                                            marginBottom={2}
                                                        >
                                                            {store.displayName}
                                                        </Text>
                                                        <dd>{store.address.address1}</dd>
                                                        {store.address.address2 && <dd>{store.address.address2}</dd>}
                                                        <dd>
                                                            {store.address.city}
                                                            {', '}
                                                            {store.address.state} {store.address.postalCode}
                                                        </dd>
                                                        <dd>{store.address.country}</dd>
                                                        <dd>
                                                            <Link
                                                                color='blue'
                                                                paddingY={2}
                                                                href={`tel:${store.address.phone.replace(/[^0-9]+/g, '')}`}
                                                            >
                                                                {store.address.phone}
                                                            </Link>
                                                        </dd>
                                                        {isMobile && (
                                                            <Text
                                                                is='dd'
                                                                color='gray'
                                                            >
                                                                {`${store.distance} `}
                                                                {getText(localeUtils.isCanada() ? 'kilometer' : 'mile')}
                                                                {store.distance !== 1 ? 's ' : ' '}
                                                                {getText('away')}
                                                            </Text>
                                                        )}
                                                    </LegacyGrid.Cell>
                                                    <LegacyGrid.Cell
                                                        width='fit'
                                                        paddingLeft={3}
                                                    >
                                                        <Link
                                                            color='blue'
                                                            padding={2}
                                                            margin={-2}
                                                            onClick={this.handleViewMap}
                                                        >
                                                            {getText('viewMap')}
                                                        </Link>
                                                    </LegacyGrid.Cell>
                                                </LegacyGrid>
                                            </React.Fragment>
                                        ))}
                                </React.Fragment>
                            )}
                            {isShowMore && (
                                <React.Fragment>
                                    <Divider marginY={4} />
                                    <Button
                                        variant='secondary'
                                        block={true}
                                        onClick={this.showMoreStores}
                                        maxWidth='22em'
                                        marginX='auto'
                                    >
                                        {getText('showMore')}
                                    </Button>
                                </React.Fragment>
                            )}
                            {this.state.inStock || (
                                <ErrorMsg
                                    maxWidth={measure[1]}
                                    marginBottom={null}
                                >
                                    {getText('sorry')} {searched + ' ' + distanceUnit}
                                    {getText('selected')}.
                                </ErrorMsg>
                            )}
                        </Box>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(FindInStoreModal, 'FindInStoreModal');
