import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import profileApi from 'services/api/profile/index';
import localeUtils from 'utils/LanguageLocale';
import actions from 'Actions';
import dsgUtils from 'utils/dsg';

import { fontSizes, lineHeights, space } from 'style/config';
import {
    Box, Flex, Divider, Link
} from 'components/ui';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import skuUtils from 'utils/Sku';
import ProductItem from 'components/Product/ProductItem';
import ListsHeader from 'components/RichProfile/Lists/ListsHeader';
import EmptyService from 'components/RichProfile/StoreServices/EmptyService/EmptyService';
import dateUtils from 'utils/Date';

const CAROUSEL_SAMPLES_LIMIT = 16;

class ListsStoreServices extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            digitalMakeoverSamples: null,
            showStoreServices: false,
            showBookResevervation: false
        };
    }

    componentDidMount() {
        const user = store.getState().user;
        profileApi
            .getProfileSamplesByDSG(user.profileId, {
                limit: CAROUSEL_SAMPLES_LIMIT,
                includeInactiveSkus: true,
                itemsPerPage: CAROUSEL_SAMPLES_LIMIT
            })
            .then(skus => {
                if (skus.length) {
                    const services = dsgUtils.combineSkusIntoServices(skus);

                    // Only display samples from most recent service
                    /* eslint-disable array-callback-return */
                    this.setState({
                        digitalMakeoverSamples: services[0].skus,
                        showStoreServices: true
                    });
                } else if (localeUtils.isUS()) {
                    // Show module with book a reservation button for US clients or CA clients
                    // with previous store makeovers (only in US). Hide completely for CA clients
                    // with no previous in store makeovers
                    this.setState({
                        showStoreServices: true,
                        showBookReservation: true
                    });
                }
            });
    }

    showFindInStore = (e, product) => {
        e.preventDefault();
        store.dispatch(actions.showFindInStoreModal(true, product));
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/Lists/ListsStoreServices/locales', 'ListsStoreServices');
        const isMobile = Sephora.isMobile();
        const isListPage = true;

        return (
            <div>
                {this.state.showStoreServices && (
                    <React.Fragment>
                        <Divider
                            height={3}
                            color='nearWhite'
                        />
                        <LegacyContainer
                            paddingY={this.props.sectionSpace}
                            data-at={Sephora.debug.dataAt('product_carousel')}
                        >
                            <ListsHeader
                                dataAt={Sephora.debug.dataAt('product_carousel_title')}
                                children={getText('inStoreServices')}
                                link={this.state.digitalMakeoverSamples ? '/in-store-services' : null}
                            />
                            {this.state.digitalMakeoverSamples && (
                                <React.Fragment>
                                    <Box
                                        lineHeight='tight'
                                        textAlign={isMobile || 'center'}
                                        marginY={isMobile ? 4 : 5}
                                        data-at={Sephora.debug.dataAt('InStoreServices_Date&Name_header')}
                                    >
                                        {`${dateUtils.getDateInMMDDYYYY(this.state.digitalMakeoverSamples[0].dateToDisplay)}
                                             at Sephora
                                            ${this.state.digitalMakeoverSamples[0].store.displayName}`}
                                        <br />
                                        {this.state.digitalMakeoverSamples[0].serviceName}
                                    </Box>
                                    <LegacyCarousel
                                        isFlexItem={true}
                                        displayCount={isMobile ? 2 : 4}
                                        totalItems={this.state.digitalMakeoverSamples.length}
                                        carouselMaxItems={16}
                                        gutter={space[5]}
                                        controlHeight={this.props.imageSize}
                                        showArrows={!isMobile}
                                        showTouts={true}
                                    >
                                        {this.state.digitalMakeoverSamples.map(product => (
                                            <Flex
                                                position='relative'
                                                width='100%'
                                                paddingBottom={fontSizes.sm * lineHeights.tight + space[1]}
                                            >
                                                <ProductItem
                                                    key={product.skuId}
                                                    isWithBackInStockTreatment={
                                                        product.actionFlags && product.actionFlags.backInStockReminderStatus !== 'notApplicable'
                                                    }
                                                    isCountryRestricted={skuUtils.isCountryRestricted(product)}
                                                    showQuickLook={product.isActive && !skuUtils.isCountryRestricted(product)}
                                                    showSignUpForEmail={true}
                                                    useAddToBasket={product.isActive}
                                                    showPrice={true}
                                                    showMarketingFlags={true}
                                                    imageSize={this.props.imageSize}
                                                    rootContainerName={'services'}
                                                    isCarousel={true}
                                                    {...product}
                                                />
                                                {product.isOutOfStock && product.isActive && !skuUtils.isCountryRestricted(product) && (
                                                    <Box
                                                        position='absolute'
                                                        right={0}
                                                        bottom={0}
                                                        left={0}
                                                    >
                                                        <Link
                                                            display='block'
                                                            lineHeight='tight'
                                                            padding={2}
                                                            marginY={-2}
                                                            marginX='auto'
                                                            fontSize='sm'
                                                            color='blue'
                                                            onClick={e => this.showFindInStore(e, product)}
                                                            children={getText('findStore')}
                                                        />
                                                    </Box>
                                                )}
                                            </Flex>
                                        ))}
                                    </LegacyCarousel>
                                </React.Fragment>
                            )}
                            {this.state.showBookReservation && (
                                <EmptyService
                                    isListsPage={isListPage}
                                    buttonWidth={this.props.buttonWidth}
                                />
                            )}
                        </LegacyContainer>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default wrapComponent(ListsStoreServices, 'ListsStoreServices');
