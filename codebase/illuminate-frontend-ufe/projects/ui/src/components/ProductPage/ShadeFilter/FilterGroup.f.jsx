import React, { useRef, forwardRef } from 'react';
import localeUtils from 'utils/LanguageLocale';
import { Box, Flex } from 'components/ui';
import { modal } from 'style/config';
import Dropdown from 'components/Dropdown/Dropdown';
import FilterItem from 'components/ProductPage/ShadeFilter/FilterItem';
import filterUtils from 'utils/Filters';
import Modal from 'components/Modal/Modal';
import { wrapFunctionalComponent } from 'utils/framework';
import Chiclet from 'components/Chiclet/Chiclet';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/ShadeFilter/locales', 'ShadeFilter');

const FilterGroup = forwardRef((props, ref) => {
    const {
        id,
        buttons,
        children,
        colorMatchSkuId,
        isSmallView,
        scrollRef,
        itemType,
        selectedFilters = [],
        showSelectedFilters,
        skus = [],
        toggleDropdownOpen,
        triggerDataAtLarge,
        triggerDataAtSmall,
        listDataAtLarge,
        listDataAtSmall,
        dropdownAlign
    } = props;
    const selectedItemRef = useRef();

    const isApplied = (skuId, filters) => {
        return filters.some(filter => filter.skuId === skuId);
    };

    const onItemToggled = ({ skuId, desc }, shouldTriggerCallBack) => {
        const filters = [...selectedFilters];

        if (!isApplied(skuId, filters)) {
            filters.push({
                skuId,
                desc
            });
        } else {
            const index = filters.findIndex(filter => filter.skuId === skuId);
            filters.splice(index, 1);
        }

        props.updateFilters && props.updateFilters(filters, shouldTriggerCallBack);
    };

    const hasScrollMenu = skus.length > 8;

    return (
        <React.Fragment>
            {isSmallView ? (
                <React.Fragment>
                    <button
                        data-at={triggerDataAtSmall}
                        css={{ outline: 0 }}
                        onClick={() => props.showModal(true, selectedItemRef)}
                    >
                        {children}
                    </button>
                    <Modal
                        isOpen={props.isModalOpened}
                        isDrawer={true}
                        onDismiss={() => props.showModal(false)}
                    >
                        <Modal.Header>
                            <Modal.Title data-at={Sephora.debug.dataAt('shade_menu_title')}>{getText('shade')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                            data-at={listDataAtSmall}
                            ref={scrollRef}
                            paddingX={null}
                        >
                            {skus.map(sku => {
                                const selected = isApplied(sku.skuId, selectedFilters);
                                const filterItemRef = selected ? selectedItemRef : null;

                                return (
                                    <FilterItem
                                        ref={filterItemRef}
                                        key={sku.skuId}
                                        sku={sku}
                                        paddingX={modal.paddingX[0] - 2}
                                        desc={filterUtils.getDescription(sku)}
                                        itemType={itemType}
                                        selected={isApplied(sku.skuId, selectedFilters)}
                                        onItemToggled={onItemToggled}
                                        isColorMatch={colorMatchSkuId === sku.skuId}
                                    />
                                );
                            })}
                        </Modal.Body>
                        {buttons && <Modal.Footer children={buttons} />}
                    </Modal>
                </React.Fragment>
            ) : (
                <Dropdown
                    id={id}
                    ref={ref}
                    useClick={true}
                    onTrigger={(event, expanded) => {
                        toggleDropdownOpen(event, expanded, selectedItemRef);
                    }}
                >
                    <Dropdown.Trigger
                        data-at={triggerDataAtLarge}
                        css={{ outline: 0 }}
                    >
                        {children}
                    </Dropdown.Trigger>
                    <Dropdown.Menu
                        data-at={listDataAtLarge}
                        offset={2}
                        width={580}
                        align={dropdownAlign}
                        hasCustomScroll={hasScrollMenu}
                    >
                        <Box
                            marginY={2}
                            {...(hasScrollMenu && {
                                ref: scrollRef,
                                maxHeight: 340,
                                overflowY: 'auto',
                                marginRight: 2
                            })}
                        >
                            {skus.map(sku => {
                                const selected = isApplied(sku.skuId, selectedFilters);
                                const filterItemRef = selected ? selectedItemRef : null;

                                return (
                                    <FilterItem
                                        ref={filterItemRef}
                                        key={sku.skuId}
                                        sku={sku}
                                        desc={filterUtils.getDescription(sku)}
                                        itemType={itemType}
                                        selected={selected}
                                        onItemToggled={onItemToggled}
                                        isColorMatch={colorMatchSkuId === sku.skuId}
                                    />
                                );
                            })}
                        </Box>
                        {buttons && (
                            <Box
                                boxShadow='light'
                                paddingY={3}
                                paddingX={4}
                            >
                                {buttons}
                            </Box>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            )}
            {showSelectedFilters && (
                <Flex
                    width='100%'
                    flexWrap='wrap'
                    justifyContent={[null, 'flex-end']}
                    order={1}
                    marginTop={1}
                    marginX='-.25em'
                    fontSize='sm'
                >
                    {selectedFilters.map((filter, index) => (
                        <Chiclet
                            key={index}
                            onClick={() => onItemToggled(filter, true)}
                            showX={true}
                            marginTop='.5em'
                            marginX='.25em'
                            maxWidth='16ch'
                            children={filter.desc}
                        />
                    ))}
                </Flex>
            )}
        </React.Fragment>
    );
});

FilterGroup.defaultProps = {
    dropdownAlign: 'left',
    selectedFilters: [],
    showSelectedFilters: false,
    skus: []
};

export default wrapFunctionalComponent(FilterGroup, 'FilterGroup');
