/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import { breakpoints } from 'style/config';
import { Link, Flex, Button } from 'components/ui';
import Pill from 'components/Pill';
import FilterGroup from 'components/ProductPage/ShadeFilter/FilterGroup';
import skuUtils from 'utils/Sku';
import localeUtils from 'utils/LanguageLocale';
import { DebouncedResize } from 'constants/events';
import skuHelpers from 'utils/skuHelpers';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/ShadeFilter/locales', 'ShadeFilter');
class ShadeFilter extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            selectedFilters: [],
            appliedFilters: [],
            isSmallView: null
        };

        this.skus = (this.props.currentProduct.regularChildSkus || []).concat(this.props.currentProduct.onSaleChildSkus || []);

        store.setAndWatch('user.beautyInsiderAccount', this, null, store.STATE_STRATEGIES.CLIENT_SIDE_DATA);
    }

    dropdownRef = React.createRef();

    updateFilters = (selectedFilters, shouldTriggerCallBack) => {
        this.setState(
            {
                selectedFilters
            },
            () => {
                shouldTriggerCallBack && this.applyGalleryFiltersCallback(this.state);
            }
        );
    };

    toggleDropdownOpen = (e, isOpen) => {
        this.setState({
            isDropdownOpen: isOpen,
            selectedFilters: isOpen ? this.state.appliedFilters : this.state.selectedFilters
        });
    };

    applyGalleryFiltersCallback = newState => {
        const newFilters = {
            skuId: newState.appliedFilters.map(filter => filter.skuId)
        };
        this.props.applyFilters && this.props.applyFilters(newFilters);
    };

    applyGalleryFilters = (e, isReset = false) => {
        const { selectedFilters, isModalOpened } = this.state;

        if (!isModalOpened && this.dropdownRef) {
            this.dropdownRef.current.triggerDropdown(e, false);
        }

        this.setState(
            {
                isModalOpened: false,
                selectedFilters: isReset ? [] : selectedFilters,
                appliedFilters: isReset ? [] : selectedFilters,
                isDropdownOpen: !this.state.isDropdownOpen
            },
            () => this.applyGalleryFiltersCallback(this.state)
        );
    };

    isXS = () => {
        return window.matchMedia(breakpoints.xsMax).matches;
    };

    handleResize = () => {
        const { isSmallView } = this.state;
        const isXS = this.isXS();

        if (isXS && !isSmallView) {
            this.setState({
                isSmallView: true
            });
        } else if (!isXS && isSmallView) {
            this.setState({
                isSmallView: false
            });
        }
    };

    componentDidMount() {
        this.setState({ isSmallView: this.isXS() });
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    buttons = (
        <Flex
            alignItems='center'
            justifyContent='space-between'
        >
            <Link
                data-at={Sephora.debug.dataAt('swatch_clear_btn')}
                color='blue'
                padding={2}
                margin={-2}
                onClick={e => {
                    this.applyGalleryFilters(e, true);
                }}
            >
                {getText('clear')}
            </Link>
            <Button
                data-at={Sephora.debug.dataAt('swatch_done_btn')}
                variant='primary'
                hasMinWidth={true}
                onClick={e => this.applyGalleryFilters(e)}
            >
                {getText('done')}
            </Button>
        </Flex>
    );

    toggleModal = isOpen => {
        this.setState({
            isModalOpened: isOpen,
            selectedFilters: isOpen ? this.state.appliedFilters : this.state.selectedFilters
        });
    };

    render() {
        const {
            selectedFilters = [], appliedFilters = [], isDropdownOpen, isModalOpened, isSmallView
        } = this.state;

        const { currentProduct } = this.props;

        const hasColorFilter = currentProduct.variationType === skuUtils.skuVariationType.COLOR && this.skus.length > 0;
        const colorMatchSku = skuHelpers.getColorIQMatchSku(currentProduct.regularChildSkus);
        const showColorMatch = skuUtils.showColorIQOnPPage(currentProduct) ? colorMatchSku : false;
        const colorMatchSkuId = showColorMatch && showColorMatch.skuId;

        const isActive = isSmallView ? isModalOpened : isDropdownOpen;

        return hasColorFilter ? (
            <FilterGroup
                id='shade_filter'
                skus={this.skus}
                showModal={isOpen => this.toggleModal(isOpen)}
                isModalOpened={isModalOpened}
                ref={this.dropdownRef}
                colorMatchSkuId={colorMatchSkuId}
                selectedFilters={selectedFilters}
                buttons={this.buttons}
                updateFilters={this.updateFilters}
                toggleDropdownOpen={this.toggleDropdownOpen}
                isSmallView={isSmallView}
                itemType={currentProduct.swatchType}
            >
                <Pill
                    isActive={isActive || appliedFilters.length > 0}
                    fontSize='sm'
                    hasArrow={true}
                >
                    {getText('shade')}
                    {appliedFilters.length > 0 && ` (${appliedFilters.length})`}
                </Pill>
            </FilterGroup>
        ) : null;
    }

    shouldUpdateStateOn = ['selectedFilters'];
}

export default wrapComponent(ShadeFilter, 'ShadeFilter', true);
