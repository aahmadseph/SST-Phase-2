import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import userUtils from 'utils/User';
import watch from 'redux-watch';
import actions from 'Actions';
import decoratorUtils from 'utils/decorators';
import biApi from 'services/api/beautyInsider';

import { space } from 'style/config';
import {
    Box, Text, Divider, Button
} from 'components/ui';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import SkuUtils from 'utils/Sku';
import bccUtils from 'utils/BCC';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import Loves from 'components/Loves';
import ListsStoreServices from 'components/RichProfile/Lists/ListsStoreServices/ListsStoreServices';
import ListsHeader from 'components/RichProfile/Lists/ListsHeader';
import localeUtils from 'utils/LanguageLocale';
import RewardItem from 'components/Reward/RewardItem/RewardItem';
import SampleItem from 'components/Product/SampleItem/SampleItem';
import ProductItem from 'components/Product/ProductItem';

const { IMAGE_SIZES } = bccUtils;
const { showBiRegisterModal } = actions;

class Lists extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            loves: null,
            userIsBi: null,
            user: {},
            isUserReady: false,
            isUserAtleastRecognized: false
        };
    }

    componentDidMount() {
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watchedUser => {
                if (this.state.user.profileId !== watchedUser.profileId) {
                    this.setState({
                        user: watchedUser
                    });
                    this.getPurchaseHistory();
                }

                this.setState({
                    isUserReady: true,
                    isUserAtleastRecognized: userUtils.isUserAtleastRecognized()
                });
            }),
            this
        );
    }

    getPurchaseHistory = () => {
        if (!userUtils.isBI()) {
            this.setState({ userIsBi: false });
        } else {
            const user = store.getState('user').user;
            const options = {
                sortBy: 'recently',
                groupBy: 'none',
                excludeSamples: false,
                excludeRewards: false,
                itemsPerPage: 12
            };

            biApi
                .getPurchaseHistory(user.profileId, options)
                .then(purchaseHistory => {
                    this.setState({
                        pastPurchases: purchaseHistory.purchasedItems,
                        userIsBi: true
                    });
                })
                .catch(() => {
                    this.setState({
                        pastPurchases: [],
                        userIsBi: true
                    });
                });
        }
    };

    biRegisterHandler = () => {
        // sign up for beauty insider modal needs to be implemented
        store.dispatch(showBiRegisterModal({ isOpen: true }));

        //call getPurchaseHistory after user becomes beautyInsider
        const userBIWatch = watch(store.getState, 'user.beautyInsiderAccount');
        store.subscribe(
            userBIWatch(() => {
                this.getPurchaseHistory();
            }),
            this
        );
    };

    isUserReady = () => {
        return this.state.isUserReady;
    };

    isUserAtleastRecognized = () => {
        return this.state.isUserAtleastRecognized;
    };

    // eslint-disable-next-line complexity
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/Lists/locales', 'Lists');
        const pastPurchases = this.state.pastPurchases;
        const userIsBi = this.state.userIsBi;
        const isMobile = Sephora.isMobile();

        const sectionSpace = isMobile ? space[5] : space[6];
        const buttonWidth = '18.5em';
        const imageSize = IMAGE_SIZES[162];

        const getComponentType = function (item) {
            let Item;

            if (SkuUtils.isBiReward(item.sku)) {
                Item = RewardItem;
            } else if (SkuUtils.isSample(item.sku)) {
                Item = SampleItem;
            } else {
                Item = ProductItem;
            }

            //revisit this
            return (
                <Item
                    key={item.commerceId}
                    isWithBackInStockTreatment={item.sku.actionFlags.backInStockReminderStatus !== 'notApplicable'}
                    isCountryRestricted={SkuUtils.isCountryRestricted(item.sku)}
                    showQuickLook={!SkuUtils.isCountryRestricted(item.sku)}
                    showSignUpForEmail={true}
                    useAddToBasket={
                        // eslint-disable-next-line max-len
                        item.sku.fullSizeSku
                            ? item.sku.actionFlags.isFullSizeSkuOrderable
                            : item.sku.actionFlags.isAddToBasket || item.sku.isOutOfStock
                    }
                    isPastPurchaseItem={true}
                    isShowAddFullSize={item.sku.actionFlags.isFullSizeSkuOrderable}
                    showPrice={true}
                    showMarketingFlags={true}
                    imageSize={imageSize}
                    skuImages={item.sku.skuImages}
                    rootContainerName={'purchases'}
                    containerTitle={'purchases'}
                    isBoldProductName={!item.sku.actionFlags.isFullSizeSkuOrderable}
                    isCarousel={true}
                    {...item.sku}
                />
            );
        };

        return (
            <div>
                {!Sephora.isNodeRender && this.isUserReady() && (
                    <Box
                        is='main'
                        textAlign={!isMobile && 'center'}
                    >
                        <LegacyContainer
                            paddingY={sectionSpace}
                            data-at={Sephora.debug.dataAt('product_carousel')}
                        >
                            {this.isUserAtleastRecognized() || (
                                <React.Fragment>
                                    <ListsHeader
                                        dataAt={Sephora.debug.dataAt('product_carousel_title')}
                                        children={getText('loves')}
                                    />
                                    <PleaseSignInBlock />
                                </React.Fragment>
                            )}
                            {this.isUserAtleastRecognized() && (
                                <Loves
                                    compType={'ListsLoves'}
                                    maxLoves={12}
                                    compProps={{ imageSize: imageSize }}
                                />
                            )}
                        </LegacyContainer>

                        <Divider
                            height={3}
                            color='nearWhite'
                        />

                        <LegacyContainer
                            paddingY={sectionSpace}
                            data-at={Sephora.debug.dataAt('product_carousel')}
                        >
                            <ListsHeader
                                dataAt={Sephora.debug.dataAt('product_carousel_title')}
                                children={getText('purchases')}
                                link={pastPurchases && pastPurchases.length > 0 ? '/purchase-history' : null}
                            />

                            {this.isUserAtleastRecognized() || <PleaseSignInBlock />}

                            {this.isUserAtleastRecognized() && (
                                <React.Fragment>
                                    {pastPurchases && pastPurchases.length > 0 && (
                                        <Box marginTop={isMobile ? 4 : 5}>
                                            <LegacyCarousel
                                                displayCount={isMobile ? 2 : 4}
                                                totalItems={pastPurchases.length}
                                                carouselMaxItems={12}
                                                isFlexItem={true}
                                                gutter={space[5]}
                                                controlHeight={imageSize}
                                                showArrows={Sephora.isDesktop()}
                                                showTouts={true}
                                            >
                                                {pastPurchases.map(pastPurchase => getComponentType(pastPurchase))}
                                            </LegacyCarousel>
                                        </Box>
                                    )}
                                    {pastPurchases && pastPurchases.length === 0 && (
                                        <Text
                                            is='p'
                                            lineHeight='tight'
                                            fontSize={isMobile || 'md'}
                                            marginTop={2}
                                        >
                                            {getText('keepTrackPastPurchases1')}
                                            {isMobile ? ' ' : <br />}
                                            {getText('keepTrackPastPurchases2')}
                                        </Text>
                                    )}
                                    {userIsBi === false && (
                                        <React.Fragment>
                                            <Text
                                                is='p'
                                                lineHeight='tight'
                                                fontSize={isMobile || 'md'}
                                                marginTop={2}
                                                marginBottom={5}
                                            >
                                                {getText('needBeautyInsiderToViewPastPurchases1')}
                                                {isMobile ? ' ' : <br />}
                                                {getText('needBeautyInsiderToViewPastPurchases2')}
                                            </Text>
                                            <Button
                                                variant='primary'
                                                marginX='auto'
                                                minWidth={buttonWidth}
                                                onClick={this.biRegisterHandler}
                                                children={getText('joinBI')}
                                            />
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}
                        </LegacyContainer>

                        {this.isUserAtleastRecognized() && (
                            <ListsStoreServices
                                buttonWidth={buttonWidth}
                                sectionSpace={sectionSpace}
                                imageSize={imageSize}
                            />
                        )}
                        {!this.isUserAtleastRecognized() && localeUtils.isUS() && (
                            <React.Fragment>
                                <Divider
                                    height={3}
                                    color='nearWhite'
                                />
                                <LegacyContainer
                                    paddingY={sectionSpace}
                                    data-at={Sephora.debug.dataAt('product_carousel')}
                                >
                                    <ListsHeader
                                        dataAt={Sephora.debug.dataAt('product_carousel_title')}
                                        children={getText('inStoreServices')}
                                    />
                                    <PleaseSignInBlock />
                                </LegacyContainer>
                            </React.Fragment>
                        )}
                    </Box>
                )}
            </div>
        );
    }
}

export default wrapComponent(decoratorUtils.ensureUserIsAtLeastRecognized(Lists), 'Lists', true);
