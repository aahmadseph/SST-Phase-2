import React from 'react';
import PropTypes from 'prop-types';
import { breakpoints, space } from 'style/config';
import { createRef } from 'react';
import localeUtils from 'utils/LanguageLocale';
import { Link } from 'components/ui';
import anaConsts from 'analytics/constants';
import BaseClass from 'components/BaseClass';
import FilterGroup from 'components/ProductPage/ShadeFilter/FilterGroup';
import processEvent from 'analytics/processEvent';
import skuUtils from 'utils/Sku';
import swatchUtils from 'utils/Swatch';
import { wrapComponent } from 'utils/framework';
import { DebouncedResize } from 'constants/events';
import skuHelpers from 'utils/skuHelpers';

const getText = text => localeUtils.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

class SwatchListDropdown extends BaseClass {
    constructor(props) {
        super(props);

        const {
            product: { onSaleChildSkus = [], productDetails = {}, regularChildSkus = [] }
        } = this.props;
        const { productId } = productDetails;
        const skus = regularChildSkus.concat(onSaleChildSkus);
        this.state = {
            dropdownRef: createRef(),
            isExpanded: false,
            productId,
            scrollRef: createRef(),
            skus
        };
    }

    static getDerivedStateFromProps = ({ product }, state) => {
        const { onSaleChildSkus = [], productDetails = {}, regularChildSkus = [] } = product;
        const { productId } = productDetails;

        if (state.productId !== productId) {
            const skus = regularChildSkus.concat(onSaleChildSkus);
            const newState = {
                productId,
                skus
            };

            return newState;
        }

        return null;
    };

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener(DebouncedResize, this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.onWindowResize);
    }

    render() {
        const { product, isCustomSet } = this.props;
        const {
            dropdownRef, isExpanded, isSmallView, skus, scrollRef
        } = this.state;
        const colorMatchSku = skuHelpers.getColorIQMatchSku(product.regularChildSkus);
        const showColorMatch = skuUtils.showColorIQOnPPage(product) ? colorMatchSku : false;
        const colorMatchSkuId = showColorMatch && showColorMatch.skuId;
        const selectedFilters = product.currentSku ? [product.currentSku] : [];
        const isModalOpened = isSmallView && isExpanded;
        const arrowDirection = isExpanded ? 'up' : 'down';

        return (
            <FilterGroup
                triggerDataAtLarge={Sephora.debug.dataAt('view_as_list_btn_large')}
                triggerDataAtSmall={Sephora.debug.dataAt('view_as_list_btn_small')}
                listDataAtLarge={Sephora.debug.dataAt('view_as_list_large')}
                listDataAtSmall={Sephora.debug.dataAt('view_as_list_small')}
                ref={dropdownRef}
                id='swatch_list'
                scrollRef={scrollRef}
                isSmallView={isSmallView}
                skus={skus}
                dropdownAlign='right'
                itemType={isCustomSet ? swatchUtils.SWATCH_TYPES.CIRCLE : product.swatchType}
                colorMatchSkuId={colorMatchSkuId}
                selectedFilters={selectedFilters}
                updateFilters={this.onFilterChanged}
                isModalOpened={isModalOpened}
                showModal={(expanded, selectedItem) => {
                    this.toggleMenu(expanded, selectedItem);
                }}
                toggleDropdownOpen={(_event, expanded, selectedItem) => {
                    this.toggleMenu(expanded, selectedItem);
                }}
            >
                <Link
                    arrowDirection={arrowDirection}
                    padding={2}
                    margin={-2}
                    fontSize='sm'
                >
                    {getText('viewAsList')}
                </Link>
            </FilterGroup>
        );
    }

    onWindowResize = () => {
        const { isSmallView } = this.state;
        const isXS = window.matchMedia(breakpoints.xsMax).matches;

        if (isXS && !isSmallView) {
            this.setState({ isSmallView: true });
        } else if (!isXS && isSmallView) {
            this.setState({ isSmallView: false });
        }
    };

    onFilterChanged = selectedSkus => {
        if (!(selectedSkus?.length && selectedSkus[selectedSkus.length - 1])) {
            return;
        }

        const { isCustomSet, onSelectedSkuChanged } = this.props;
        const { dropdownRef, skus } = this.state;
        dropdownRef.current?.triggerDropdown(new Event('triggerDropdown'), false);
        this.setState({ isExpanded: false }, () => {
            const { skuId } = selectedSkus[selectedSkus.length - 1];
            const selectedSku = skus.find(sku => sku.skuId === skuId);

            if (onSelectedSkuChanged) {
                onSelectedSkuChanged(selectedSku);
            }

            if (!isCustomSet && selectedSku) {
                swatchUtils.handleSkuOnClick(selectedSku);
            }
        });
    };

    toggleMenu = (isExpanded, selectedItem) => {
        const { scrollRef } = this.state;
        this.setState({ isExpanded }, () => {
            if (isExpanded && selectedItem) {
                const x = 0;
                const y = selectedItem.current?.offsetTop - space[2] || 0;
                scrollRef.current?.scroll(x, y);
            }
        });

        //Analytics
        if (isExpanded) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    pageName: 'product:swatch selector modal:n/a*',
                    actionInfo: 'view as list',
                    linkName: 'D=c55'
                }
            });
        }
    };
}

SwatchListDropdown.defaultProps = {
    isCustomSet: false,
    selectedSku: null
};
SwatchListDropdown.propTypes = {
    isCustomSet: PropTypes.bool,
    product: PropTypes.object.isRequired
};

export default wrapComponent(SwatchListDropdown, 'SwatchListDropdown', true);
