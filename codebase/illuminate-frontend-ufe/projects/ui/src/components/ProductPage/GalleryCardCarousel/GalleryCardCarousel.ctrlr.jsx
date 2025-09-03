/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { space, site, radii } from 'style/config';
import {
    Box, Text, Divider, Link, Flex
} from 'components/ui';
import LazyLoad from 'components/LazyLoad/LazyLoad';
import GalleryCard from 'components/Community/GalleryCard';
import SeeMoreCard from 'components/ProductPage/GalleryCardCarousel/SeeMoreCard/SeeMoreCard';
import ShadeFilter from 'components/ProductPage/ShadeFilter/ShadeFilter';
import languageLocale from 'utils/LanguageLocale';
import analyticsConsts from 'analytics/constants';
import biProfile from 'utils/BiProfile';
import userUtils from 'utils/User';
import communityUtils from 'utils/Community';
import ProfileActions from 'actions/ProfileActions';
import Actions from 'Actions';
import store from 'store/Store';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Carousel from 'components/Carousel';

import pixleeUtils from 'utils/pixlee';
import urlUtils from 'utils/Url';

import { DebouncedResize } from 'constants/events';

const { COMMUNITY_URLS } = communityUtils;
const { getApprovedContentFromAlbum } = pixleeUtils;
const { getParamsByName } = urlUtils;
const BRANDS_WITHOUT_LOOKS = { CHANEL: '1065' };
const BI_TYPES_WITHOUT_LOOKS = ['birthday gift', 'rouge birthday gift', 'welcome kit'];
const SKU_TYPES_WITHOUT_LOOKS = ['sample', 'gwp', 'msg'];

const CARD_TRANSITION_OFFSET = 1;
const BEAUTY_MATCHES = 'beautyMatches';

const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/GalleryCardCarousel/locales', 'GalleryCardCarousel')(text);

class GalleryCardCarousel extends BaseClass {
    state = {
        medias: [],
        clicked: false,
        pageCount: null,
        isFlush: null,
        carouselContextId: JSON.stringify({ productId: this.props.productId }),
        selectedFilters: {}
    };

    updateVisibleItems = pageCount => {
        this.setState(prevState => {
            return {
                visibleItems: prevState.visibleItems + Math.floor(pageCount)
            };
        });
    };

    isObservable = (index, pageCount) => {
        if (index !== 0 && index !== Math.floor(pageCount)) {
            return index % Math.floor(pageCount) === 0;
        }

        return false;
    };

    isGift = biType => {
        if (biType) {
            return Object.values(BI_TYPES_WITHOUT_LOOKS).indexOf(biType) === -1;
        }

        return false;
    };

    shouldDisplayGallery = () => {
        const isPpageBeautyBoardEnabled = Sephora.configurationSettings.productPageConfigurations.isPpageBeautyBoardEnabled;

        if (!isPpageBeautyBoardEnabled) {
            return false;
        }

        const { brandId, skuType, biType } = this.props;

        const displayForBrand = Object.values(BRANDS_WITHOUT_LOOKS).indexOf(brandId) === -1;
        const displayForType = SKU_TYPES_WITHOUT_LOOKS.indexOf(skuType.toLowerCase()) === -1;
        const shouldDisplay = displayForBrand && displayForType && !this.isGift(biType);

        //Analytics
        if (shouldDisplay) {
            if (digitalData.page.attributes.featureVariantKeys.indexOf(analyticsConsts.PAGE_VARIANTS.EXPLORE_LOOKS) === -1) {
                digitalData.page.attributes.featureVariantKeys.push(analyticsConsts.PAGE_VARIANTS.EXPLORE_LOOKS);
            }
        }

        return shouldDisplay;
    };

    containerPaddedMatches = () => {
        return window.matchMedia(`(min-width: ${site.containerMax + space.container * 2}px)`).matches;
    };

    handleResize = () => {
        const { isFlush } = this.state;
        const containerPaddedMatches = this.containerPaddedMatches();

        if (containerPaddedMatches && isFlush) {
            this.setState({
                isFlush: false
            });
        } else if (!containerPaddedMatches && !isFlush) {
            this.setState({
                isFlush: true
            });
        }
    };

    updateMedias = (medias, displayFilter, contextId) => {
        this.setState({
            isFlush: !this.containerPaddedMatches(),
            displayFilter: displayFilter,
            carouselContextId: contextId
        });
        this.props.setCarouselGallery(medias);
    };

    applyFilters = (filtersToApply = {}) => {
        const { selectedFilters: currentFilters } = this.state;

        const filterKeys = Object.keys(filtersToApply);
        const newSelectedFilters = { ...currentFilters };

        for (const filterKey of filterKeys) {
            const filterValue = filtersToApply[filterKey];

            if (filterValue && filterValue.length) {
                newSelectedFilters[filterKey] = filterValue;
            } else {
                delete newSelectedFilters[filterKey];
            }
        }

        // Do not call api if the filters are exactly the same
        if (JSON.stringify(newSelectedFilters) !== JSON.stringify(currentFilters)) {
            this.setState(
                {
                    selectedFilters: newSelectedFilters
                },
                () => {
                    this.fetchPixleeMedia(newSelectedFilters?.skuId ? newSelectedFilters?.skuId[0] : null);
                }
            );

            if (Object.keys(newSelectedFilters).length > 0) {
                this.fireAnalytics(newSelectedFilters);
            }
        }
    };

    fireAnalytics = newSelectedFilters => {
        const selections = Object.keys(newSelectedFilters).map(
            key => key.replace(/([A-Z])/g, ' $1').toLowerCase() + '=' + newSelectedFilters[key].join(',')
        );

        // Overrides default Analytic for sku (Shade Filter) with a custom 'view by color'
        const skuAnalyticIndex = selections.findIndex(x => x.indexOf('sku id=') >= 0);

        if (skuAnalyticIndex >= 0) {
            const skus = (this.props.currentProduct.regularChildSkus || []).concat(this.props.currentProduct.onSaleChildSkus || []);
            const viewByColorValues = skus
                .filter(sku => newSelectedFilters['skuId'].find(value => value === sku.skuId))
                .map(sku => `${sku.variationValue} - ${sku?.refinements?.finishRefinements?.join(',') || ''}`);
            selections[skuAnalyticIndex] = `view by color=${viewByColorValues.join(',')}`;
        }

        const actionLink = 'see it in real life:filter';
        const filterSelections = selections.join('|');

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: actionLink,
                linkName: actionLink,
                filterSelections: filterSelections,
                selectedFilter: filterSelections,
                eventStrings: anaConsts.Event.EVENT_71
            }
        });
    };

    fetchPixleeMedia = selectedSkuId => {
        const { currentProduct } = this.props;

        const queryParamSkuId = getParamsByName('skuId')?.[0];
        const skuId = selectedSkuId || queryParamSkuId || currentProduct?.currentSku?.skuId;
        const options = {
            page: 1,
            photosPerPage: 30,
            // eslint-disable-next-line camelcase
            filters: { product_sku: { equals: skuId } }
        };
        getApprovedContentFromAlbum(Sephora.configurationSettings.exploreGalleryAlbumId, options)
            .then(({ data, album_id: albumId }) => {
                const filtersApplied = !!queryParamSkuId;
                const somethingFound = data?.length > 0;
                const displayFilter = filtersApplied || somethingFound;

                this.updateMedias(data, displayFilter, albumId);
            })
            .catch(() => {
                this.updateMedias([], false, skuId);
            });
    };

    toggleBeautyMatches = () => {
        if (!biProfile.hasAllTraits()) {
            return;
        }

        this.setState({ clicked: !this.state.clicked });

        const biInfo = biProfile.getBiProfileInfo();
        const { selectedFilters } = this.state;
        const { currentProduct } = this.props;
        const bmIsActive = selectedFilters[BEAUTY_MATCHES];
        const filtersToMerge = this.getBmMappedFilters(biInfo, currentProduct.reviewFilters);
        let filtersToApply = {};

        if (bmIsActive) {
            Object.keys(filtersToMerge).forEach(filterId => {
                if (selectedFilters[filterId]) {
                    filtersToApply[filterId] = [];
                }
            });
            filtersToApply[BEAUTY_MATCHES] = [];
        } else {
            filtersToApply = filtersToMerge;
            filtersToApply[BEAUTY_MATCHES] = ['true'];
        }

        this.applyFilters(filtersToApply);
    };

    toggle = () => {
        const isAnonymous = userUtils.isAnonymous();

        if (!isAnonymous && !biProfile.hasAllTraits()) {
            store.dispatch(
                Actions.showBeautyTraitsModal({
                    isOpen: true,
                    checkStatusCallback: this.checkUserStatusAndTraits
                })
            );
        } else {
            this.checkUserStatusAndTraits();
        }
    };

    checkUserStatusAndTraits = () => {
        communityUtils
            .ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.lithium)
            .then(() => {
                if (!biProfile.hasAllTraits()) {
                    store.dispatch(ProfileActions.showEditMyProfileModal(true, this.toggleBeautyMatches));
                } else {
                    this.toggleBeautyMatches();
                }
            })
            .catch(() => {
                // User must be BI and must have nickname to edit profile
                if (userUtils.isBI() && userUtils.isSocial() && !biProfile.hasAllTraits()) {
                    this.toggleBeautyMatches();
                }
            });
    };

    getBmMappedFilters = (biInfo, filtersConfiguration) => {
        const filtersToApply = {};

        if (biInfo) {
            filtersConfiguration
                .filter(filterConfig => biInfo[filterConfig.id] && filterConfig.contextual)
                .forEach(filterConfig => (filtersToApply[filterConfig.id] = biInfo[filterConfig.id].split(', ')));
        }

        return filtersToApply;
    };

    componentDidMount() {
        window.addEventListener(DebouncedResize, this.handleResize);

        this.fetchPixleeMedia();
    }

    componentDidUpdate(prevProps) {
        // Refresh media if a product has been changed
        if (this.props.productId !== prevProps.productId) {
            this.fetchPixleeMedia();
        }
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    render() {
        const {
            displayFilter,
            //selectedFilters,
            isFlush
        } = this.state;

        const { currentProduct, galleryItems = [] } = this.props;

        if (!this.shouldDisplayGallery()) {
            return null;
        }

        const items = [];

        galleryItems.forEach((media, index) => {
            items.push(
                <GalleryCard
                    key={index}
                    inCarousel={true}
                    index={index}
                    analyticsCardName={anaConsts.CARD_NAMES.UGC_IMAGE}
                    {...media}
                />
            );
        });

        if (items.length === 30) {
            items.push(<SeeMoreCard style={styles.card} />);
        }

        const hasItems = items.length > 0;

        return (
            <Box
                data-at={Sephora.debug.dataAt('see_it_in_real_life_section')}
                paddingBottom={hasItems ? [6, 8] : [4, 5]}
                lineHeight='tight'
            >
                <Divider />
                <Flex
                    flexDirection='column'
                    gap={1}
                >
                    <Text
                        data-at={Sephora.debug.dataAt('see_it_in_real_life_title')}
                        is='h2'
                        marginTop='1em'
                        fontSize={['md', 'lg']}
                        fontWeight='bold'
                        children={getText('seeItInRealLife')}
                    />
                    <p children={getText('mentionSephora')} />
                    <div>
                        <Link
                            data-at={Sephora.debug.dataAt('add_your_photo_link')}
                            href={COMMUNITY_URLS.ADD_PHOTO}
                            color='blue'
                            children={getText(hasItems ? 'addYourPhoto' : 'addAPhoto')}
                        />
                    </div>
                </Flex>
                {displayFilter && (
                    <Flex
                        marginTop={3}
                        marginLeft={[-2, 0]}
                    >
                        <ShadeFilter
                            currentProduct={currentProduct}
                            applyFilters={this.applyFilters}
                        />

                        {/* {bmFilter && (
                            <Pill
                                isActive={bmIsActive}
                                fontSize='sm'
                                marginLeft='.5em'
                                onClick={() => this.toggle()}
                            >
                                {bmFilter.label}
                                {<BeautyMatchTooltip clicked={this.state.clicked} />}
                            </Pill>
                        )} */}
                    </Flex>
                )}
                {hasItems && (
                    <Box
                        marginY={-CARD_TRANSITION_OFFSET}
                        paddingTop={[3, 4]}
                    >
                        <LazyLoad
                            analyticsCarouselName={anaConsts.CAROUSEL_NAMES.SEE_IT_REAL}
                            contextId={this.state.carouselContextId}
                            dataAt='see_it_real_carousel'
                            component={Carousel}
                            gap={[1, 2]}
                            itemWidth={[136, 188]}
                            marginX={isFlush && '-container'}
                            scrollPadding={isFlush && 2}
                            items={items}
                            title={getText('seeItInRealLife')}
                        />
                    </Box>
                )}
                {!hasItems && displayFilter && (
                    <Text
                        dataAt={Sephora.debug.dataAt('no_images_see_it_real_carousel')}
                        is='h3'
                        marginTop={5}
                        marginBottom={3}
                        fontWeight='bold'
                        children={getText('sorryNoImages')}
                    />
                )}
            </Box>
        );
    }
}

const styles = {
    card: {
        borderRadius: radii[2],
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        paddingBottom: '100%'
    },
    cardHover: {
        borderRadius: radii[2],
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        paddingBottom: '100%',
        outline: 0,
        transition: 'transform .2s',
        marginTop: space[CARD_TRANSITION_OFFSET],
        '.no-touch &': {
            willChange: 'transform'
        },
        '.no-touch &:hover, :focus': {
            transform: `translateY(-${space[CARD_TRANSITION_OFFSET]}px)`
        }
    }
};

export default wrapComponent(GalleryCardCarousel, 'GalleryCardCarousel', true);
