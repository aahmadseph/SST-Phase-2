/* eslint-disable consistent-return */
/* eslint-disable guard-for-in */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';
import { breakpoints, colors, radii } from 'style/config';
import {
    Grid, Link, Text, Box
} from 'components/ui';
import Dropdown from 'components/Dropdown/Dropdown';
import Chevron from 'components/Chevron/Chevron';
import anaConsts from 'analytics/constants';
import BaseClass from 'components/BaseClass';
import processEvent from 'analytics/processEvent';
import React from 'react';
import skuUtils from 'utils/Sku';
import store from 'Store';
import SwatchDescription from 'components/ProductPage/Swatches/SwatchDescription';
import SwatchGroup from 'components/ProductPage/Swatches/SwatchGroup';
import SwatchTypeSelector from 'components/ProductPage/Swatches/SwatchTypeSelector';
import SwatchImage from 'components/ProductPage/Swatches/SwatchImage';

import swatchUtils from 'utils/Swatch';
import { wrapComponent } from 'utils/framework';
import ShadeFinderText from 'components/ProductPage/ShadeFinderText/ShadeFinderText';
import actions from 'Actions';
import { COLOR_SWATCH_DISPLAY } from 'constants/TestTarget';
import safelyReadProp from 'analytics/utils/safelyReadProperty';
import filterUtils from 'utils/Filters';
import { DebouncedResize, TestTargetReady } from 'constants/events';
import Helpers from 'utils/Helpers';

const { getSwatchType, SWATCH_GROUP_VIEWS } = swatchUtils;
const { Media } = mediaUtils;
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/Swatches/locales', 'Swatches');
const { deferTaskExecution } = Helpers;

class SwatchesDisplay extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            selectedSwatchView: SWATCH_GROUP_VIEWS.GRID,
            showSwatchSelectorType: false,
            swatchGroups: this.createSwatchGroups(),
            colorSwatchDisplayExperience: COLOR_SWATCH_DISPLAY.CURRENT,
            showDropdown: false,
            isDropOpen: false
        };

        this.selectedItemRef = React.createRef();
        this.dropdownRef = React.createRef();
        this.dropdownSelectedItemRef = React.createRef();
        this.scrollRef = React.createRef();
        this.needToScroll = false;
        this.userClickedOnSwatchItem = false;
        this.productHasChanged = true;

        // Cache for rendered views to improve switching performance
        this.cachedViews = {
            list: null,
            grid: null,
            currentSkuId: null
        };
    }

    showSmallView = () => {
        return typeof window !== 'undefined' ? window.matchMedia(breakpoints.smMax).matches : null;
    };

    createSwatchGroups = (setState = false) => {
        const { swatchGroups, swatchFilters } = this.props;

        const newSwatchGroups = swatchGroups.map((skus, index) => ({
            groupName: swatchFilters[index],
            skus,
            groupRef: React.createRef()
        }));

        if (setState) {
            return this.setState({ swatchGroups: newSwatchGroups }, () => this.handleResize());
        } else {
            return newSwatchGroups;
        }
    };

    resetScrollPosition = () => {
        if (!this.userClickedOnSwatchItem) {
            this.needToScroll = true;
            this.forceUpdate();
        } else {
            this.userClickedOnSwatchItem = false;
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.product?.currentSku !== prevProps.product?.currentSku) {
            // Reset cache when SKU changes
            this.cachedViews = {
                list: null,
                grid: null,
                currentSkuId: this.props.product?.currentSku?.skuId
            };

            this.needToScroll = true;
            this.createSwatchGroups(true);
            this.resetScrollPosition();
        }

        if (this.props.product !== prevProps.product) {
            this.setState({
                showSwatchSelectorType:
                    this.props.product.skuSelectorType === skuUtils.skuSwatchType.IMAGE && !!this.props.swatchGroups.find(skus => skus.length > 1)
            });
        }

        if (this.props.product?.productDetails?.productId !== prevProps.product?.productDetails?.productId) {
            this.productHasChanged = true;
            // Reset cache when product changes
            this.cachedViews = {
                list: null,
                grid: null,
                currentSkuId: null
            };
        }

        if (this.needToScroll && this.selectedItemRef.current) {
            // Defer the scrolling logic to improve INP
            deferTaskExecution(() => {
                const selectedItem = this.selectedItemRef?.current;
                const isListView = this.state.selectedSwatchView === SWATCH_GROUP_VIEWS.LIST;

                if (isListView) {
                    const x = selectedItem?.offsetTop || 0;
                    const scrollHeight = this.scrollRef.current?.getBoundingClientRect().height * 0.25;

                    if (x > 0) {
                        this.needToScroll = false;

                        this.scrollRef.current?.scroll(0, x - scrollHeight);
                    }
                }
            });
        }
    }

    showShadeFinder = currentProduct => {
        store.dispatch(actions.showWizard(true, currentProduct));

        const world = digitalData.page.attributes.world;
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `product:${anaConsts.PAGE_DETAIL.SHADE_FINDER_LANDING}:${world ? world.toLowerCase() : 'n/a'}:*`,
                pageType: 'product',
                pageDetail: anaConsts.PAGE_DETAIL.SHADE_FINDER_LANDING,
                internalCampaign: `product:shade finder:${currentProduct.productDetails.productId.toLowerCase()}`,
                world: world && world.toLowerCase()
            }
        });
    };

    handleSwatchTypeSelector = (e, typeSelected) => {
        e.preventDefault();

        // Prevent any computation until next frame
        deferTaskExecution(() => {
            // Set state inside the deferred task
            this.setState({ selectedSwatchView: SWATCH_GROUP_VIEWS[typeSelected] }, () => {
                // Set needToScroll after state is updated to prevent extra renders
                this.needToScroll = true;
            });

            // Process analytics separately
            deferTaskExecution(() => {
                const actionText = `product:swatch:${typeSelected.toLowerCase()}`;
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        actionInfo: actionText,
                        linkName: actionText,
                        eventStrings: [anaConsts.Event.EVENT_71]
                    }
                });
            });
        });
    };

    swatchesScroll = () => {
        const selectedItemWidth = this.selectedItemRef?.current?.offsetWidth;
        const skusOutOfWidth = this.state.swatchGroups.filter(
            group => group.skus.length > (group.groupRef?.current?.offsetWidth || window?.innerWidth || 0) / selectedItemWidth
        );

        return skusOutOfWidth.length > 0;
    };

    /* eslint-disable-next-line complexity */
    handleResize = () => {
        const { product } = this.props;
        const { currentSku } = product;

        let {
            selectedSwatchView,
            // eslint-disable-next-line prefer-const
            colorSwatchDisplayExperience
        } = this.state;

        const isFragrance = skuUtils.isFragrance(product, currentSku);
        const isDropdownTest = colorSwatchDisplayExperience === COLOR_SWATCH_DISPLAY.SHOW_HYBRID && !isFragrance;
        const isSmallView = this.showSmallView();

        if (isSmallView && isDropdownTest && product.skuSelectorType === skuUtils.skuSwatchType.IMAGE) {
            if (!this.state.showDropdown) {
                this.setState({
                    showDropdown: true,
                    selectedSwatchView: SWATCH_GROUP_VIEWS.GRID
                });
            }
        } else {
            if (this.productHasChanged) {
                selectedSwatchView = SWATCH_GROUP_VIEWS.GRID;
                this.productHasChanged = false;
            }

            this.setState({
                showDropdown: false,
                selectedSwatchView,
                isSmallView
            });
        }
    };

    componentDidMount() {
        window.addEventListener(DebouncedResize, this.handleResize);

        Sephora.Util.onLastLoadEvent(global, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                const colorSwatchDisplayResult = safelyReadProp('testTarget.offers.colorSwatchDisplay.result', newOffers);
                const colorSwatchDisplayExperience = colorSwatchDisplayResult?.experience || COLOR_SWATCH_DISPLAY.CURRENT;

                this.setState({ colorSwatchDisplayExperience }, () => {
                    // Need to check again if we should render default view according to isSmallView and colorSwatchDisplayExperience
                    this.handleResize();
                });
            });
        });
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    // Memoize SwatchGroup components to prevent unnecessary re-renders
    memoizedGroupsViews = (swatchView, isDropdown) => {
        const {
            showColorMatch, wizardResult, wizardMatchText, product, isSkuReady, colorIQMatch
        } = this.props;

        const { currentSku } = product;
        const isFragrance = skuUtils.isFragrance(product, currentSku);

        return this.state.swatchGroups.map(({ groupName, groupRef, skus }, index) => (
            <SwatchGroup
                key={`swatch-group-${index}`}
                index={index}
                isSkuReady={isSkuReady}
                isFragrance={isFragrance}
                swatchView={swatchView}
                groupName={groupName}
                scrollRef={groupRef}
                selectedItemRef={isDropdown ? this.dropdownSelectedItemRef : this.selectedItemRef}
                skus={skus}
                currentSku={currentSku}
                currentProduct={product}
                showColorMatch={showColorMatch}
                wizardResult={wizardResult}
                wizardMatchText={wizardMatchText}
                isDropdown={isDropdown}
                swatchItemCallback={isDropdown ? this.onSelectDropdownItemClick : this.onSelectRegularItemClick}
                colorIQMatch={colorIQMatch}
                {...this.props}
            />
        ));
    };

    onTriggerDropdown = (e, isDropdownOpen) => {
        // Optimize dropdown state update
        deferTaskExecution(() => {
            this.setState({ isDropOpen: isDropdownOpen }, () => {
                // Center the selected item within the dropdown
                const selectedItem = this.dropdownSelectedItemRef?.current;

                if (selectedItem) {
                    const menu = this.scrollRef.current;
                    menu.scrollTop = selectedItem.offsetTop - (menu.offsetHeight / 2 - selectedItem?.offsetHeight / 2);
                }
            });
        });
    };

    renderSwatchGroups() {
        const { product } = this.props;
        const { currentSku } = product;
        const { selectedSwatchView, isDropOpen, swatchGroups, showDropdown } = this.state;

        // Early return if no swatch groups
        if (swatchGroups.length <= 0) {
            return null;
        }

        // Check if SKU has changed, if so invalidate cache
        if (this.cachedViews.currentSkuId !== currentSku.skuId) {
            this.cachedViews = {
                list: null,
                grid: null,
                currentSkuId: currentSku.skuId
            };
        }

        // Pre-compute values needed for rendering
        const isListView = selectedSwatchView === SWATCH_GROUP_VIEWS.LIST;
        const dataAt = Sephora.debug.dataAt('list_section');
        const viewType = isListView ? 'list' : 'grid';

        // Use cached views if available, otherwise create and cache them
        if (!this.cachedViews[viewType]) {
            if (isListView) {
                const listViewGroups = this.memoizedGroupsViews(selectedSwatchView, false);
                this.cachedViews.list = (
                    <Box
                        ref={this.scrollRef}
                        overflowY='auto'
                        data-at={dataAt}
                        borderY={1}
                        border={[null, 1]}
                        borderColor={['lightGray', 'midGray']}
                        marginX={['-container', 0]}
                        marginTop={[2, 0]}
                        marginBottom={2}
                        paddingY={2}
                        borderRadius={[null, 2]}
                        maxHeight={[190, 210]}
                    >
                        {listViewGroups}
                    </Box>
                );
            } else {
                const gridViewGroups = this.memoizedGroupsViews(selectedSwatchView, false);
                this.cachedViews.grid = gridViewGroups;
            }
        }

        // Always generate dropdown groups since they depend on dropdown state
        const dropdownGroups = showDropdown ? this.memoizedGroupsViews(SWATCH_GROUP_VIEWS.LIST, true) : null;

        if (isListView) {
            return this.cachedViews.list;
        }

        // Grid view rendering
        return (
            <>
                {showDropdown && (
                    <Dropdown
                        id='swatches'
                        ref={this.dropdownRef}
                        useClick={true}
                        closeOnClick={false}
                        onTrigger={this.onTriggerDropdown}
                    >
                        <Dropdown.Trigger width='100%'>
                            <Grid
                                is='span'
                                gap={2}
                                columns='auto 1fr auto'
                                alignItems='center'
                                paddingY={1}
                                paddingX={3}
                                border={1}
                                borderColor='midGray'
                                borderTopLeftRadius={2}
                                borderTopRightRadius={2}
                                borderBottomLeftRadius={isDropOpen || 2}
                                borderBottomRightRadius={isDropOpen || 2}
                                borderBottomColor={isDropOpen && 'lightGray'}
                                minHeight={52}
                                css={{ '.no-touch &:hover': { backgroundColor: colors.nearWhite } }}
                            >
                                <SwatchImage
                                    src={currentSku.smallImage}
                                    type={getSwatchType(product.swatchType)}
                                    isOutOfStock={currentSku.isOutOfStock}
                                    isMatch={
                                        this.props.wizardResult?.skuId === currentSku.skuId || this.props.showColorMatch?.skuId === currentSku.skuId
                                    }
                                />
                                <span>
                                    <b>{getText('selected')}:</b> {filterUtils.getDescription(currentSku)}
                                </span>
                                <Chevron direction={isDropOpen ? 'up' : 'down'} />
                            </Grid>
                        </Dropdown.Trigger>
                        <Dropdown.Menu
                            ref={this.scrollRef}
                            hasTransition={false}
                            boxShadow={null}
                            border={1}
                            borderColor='midGray'
                            borderTopWidth={0}
                            maxHeight={240}
                            paddingY={2}
                            borderRadius={`0 0 ${radii[2]}px ${radii[2]}px`}
                        >
                            {dropdownGroups}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
                {this.cachedViews.grid}
            </>
        );
    }

    render() {
        const {
            isSkuReady, product, loveIcon, colorIQMatch, hideSizeAndDescription, isItemSubModal
        } = this.props;

        const { selectedSwatchView, showSwatchSelectorType, showDropdown } = this.state;

        const { currentSku } = product;

        const { isReverseLookupEnabled } = product;
        const isFragrance = skuUtils.isFragrance(product, currentSku);
        const selectedSku = product.hoveredSku || currentSku;
        const sizeText = selectedSku.size && selectedSku.size !== selectedSku.variationValue && (
            <Text
                fontSize='sm'
                data-at={Sephora.debug.dataAt('sku_size_label')}
                children={`${getText('size')} ${selectedSku.size}`}
            />
        );

        return (
            <>
                {!hideSizeAndDescription && (
                    <Grid
                        columns='1fr auto'
                        alignItems={[null, null, 'flex-end']}
                    >
                        <Grid gap={1}>
                            {showDropdown ? sizeText : <SwatchDescription />}
                            {isSkuReady && (
                                <ShadeFinderText
                                    colorIQMatch={colorIQMatch}
                                    product={product}
                                />
                            )}
                        </Grid>
                        {loveIcon && <Media lessThan='md'>{loveIcon}</Media>}
                    </Grid>
                )}

                {!isFragrance && !showDropdown && !hideSizeAndDescription && (showSwatchSelectorType || sizeText) && (
                    <Grid
                        columns='1fr auto'
                        alignItems='center'
                    >
                        <div>{sizeText}</div>
                        {showSwatchSelectorType && (
                            <SwatchTypeSelector
                                onSelect={(e, option) => this.handleSwatchTypeSelector(e, option)}
                                activeType={selectedSwatchView}
                                options={Object.keys(SWATCH_GROUP_VIEWS)}
                            />
                        )}
                    </Grid>
                )}

                {this.renderSwatchGroups()}

                {isReverseLookupEnabled && !isItemSubModal && (
                    <div>
                        <Link
                            padding={2}
                            margin={-2}
                            color='blue'
                            onClick={() => this.showShadeFinder(product)}
                            data-at={Sephora.debug.dataAt('shade_finder_button')}
                            children={getText('shadeFinder')}
                        />
                    </div>
                )}
            </>
        );
    }

    onSelectDropdownItemClick = () => {
        // Set flag without triggering re-render
        this.userClickedOnSwatchItem = true;

        // Defer dropdown closing to improve performance
        if (this.dropdownRef.current) {
            deferTaskExecution(() => {
                this.dropdownRef.current.triggerDropdown(null, false);
            });
        }
    };

    onSelectRegularItemClick = () => {
        // Set flag without triggering re-render
        this.userClickedOnSwatchItem = true;
    };

    shouldUpdateStateOn = ['product.hoveredSku.skuId', 'colorIQMatch'];
}

export default wrapComponent(SwatchesDisplay, 'SwatchesDisplay', true);
