import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import { Icon } from 'components/ui';
import Pill from 'components/Pill';
import PillCouple from 'components/PillCouple';
import { REFINEMENT_TYPES } from 'utils/CatalogConstants';
import { PICKUP, SAME_DAY, SHIP_TO_HOME } from 'constants/UpperFunnel';
import catalogUtils from 'utils/Catalog';
import happeningFiltersUtils from 'utils/happeningFilters';

class FilterPills extends BaseClass {
    constructor(props) {
        super(props);
    }

    getIconConfig = filterName => {
        const iconConfig = {};

        if (filterName === PICKUP) {
            iconConfig.iconName = 'store';
            iconConfig.iconSize = 12;
        }

        if (filterName === SAME_DAY) {
            iconConfig.iconName = 'bag';
            iconConfig.iconSize = 16;
        }

        if (filterName === SHIP_TO_HOME) {
            iconConfig.iconName = 'truck';
            iconConfig.iconSize = 16;
        }

        return iconConfig;
    };

    getPillContentWithIcon = (filterName, filterDisplayName) => {
        const { iconName, iconSize } = this.getIconConfig(filterName);

        return (
            <>
                <Icon
                    name={iconName || ''}
                    size={iconSize}
                    marginRight={2}
                />
                {filterDisplayName}
            </>
        );
    };

    handlePillClick = refinement => () => {
        const { selectedFilters, selectFilters, toggleModal } = this.props;
        const filterHasSelectedValues = selectedFilters[refinement.displayName].length > 0;

        refinement?.property !== 'single'
            ? refinement.pillHandler
                ? refinement.pillHandler()
                : toggleModal(refinement.displayName)
            : selectFilters(
                {
                    [refinement.displayName]: filterHasSelectedValues ? [] : [refinement.values[0].refinementValue]
                },
                true
            );
    };

    handleToggleMegaModal = () => {
        const { toggleModal } = this.props;
        toggleModal('mega');
    };

    render() {
        const {
            pillScrollRef, selectedFilters, refinements, activeItem, showSingleFilterPill, showCompactPills
        } = this.props;

        let isAnyFilterActive = false;
        let compactPillProps = {};

        if (showCompactPills) {
            compactPillProps = {
                minHeight: 32,
                paddingX: '10px',
                arrowSize: '.8em'
            };
        }

        const UpperFunnelPills = ({ refinement }) => {
            const components = refinement.values.map(value => {
                if (showSingleFilterPill) {
                    return (
                        <div
                            key={`pill-${refinement.displayName}`}
                            css={[styles.filter, showCompactPills && styles.compactPill]}
                        >
                            <Pill
                                onClick={value.pillClick}
                                isActive={value.isSelected}
                                fontSize='sm'
                                children={this.getPillContentWithIcon(value.filterKey, value.refinementValueDisplayName)}
                                {...compactPillProps}
                            />
                        </div>
                    );
                }

                return (
                    <PillCouple
                        css={styles.filter}
                        key={value.filterKey}
                    >
                        <Pill
                            onClick={value.pillClick}
                            isActive={value.isSelected}
                            fontSize='sm'
                            children={this.getPillContentWithIcon(value.filterKey, value.refinementValueDisplayName)}
                        />
                        {value.describedByComp}
                        <Pill
                            aria-describedby={value.describedById}
                            onClick={value.labelClick}
                            useActiveArrow={false}
                            fontSize='sm'
                            hasArrow={true}
                            children={value.refinementValueSpecificDisplayName}
                        />
                    </PillCouple>
                );
            });

            return components;
        };

        const pills = refinements.map(refinement => {
            const isRadiosCustom = refinement.subType === REFINEMENT_TYPES.RADIOS_CUSTOM;
            const isCheckboxCustom = refinement.subType === REFINEMENT_TYPES.CHECKBOXES_CUSTOM;
            const filterHasSelectedValues = selectedFilters[refinement.displayName].length > 0;
            const isSelectedCheckboxOrNonDefault =
                filterHasSelectedValues && happeningFiltersUtils.getIsValueCheckboxOrNonDefault(selectedFilters[refinement.displayName], refinement);

            if (!isAnyFilterActive && isSelectedCheckboxOrNonDefault) {
                isAnyFilterActive = true;
            }

            const showPill = refinement.type !== REFINEMENT_TYPES.CHECKBOXES_WITH_DROPDOWN;
            const customCheckBoxesFilterName = Object.values(refinements).find(x => x.subType === REFINEMENT_TYPES.CHECKBOXES_CUSTOM)?.displayName;
            const selectedCustomValues = selectedFilters[customCheckBoxesFilterName];
            let label;

            if (refinement.type === REFINEMENT_TYPES.SORT && !isRadiosCustom) {
                label = `${refinement.displayName}: ${catalogUtils.getSelectedOrDefaultSortOption(refinement.values).refinementValueDisplayName}`;

                if (showCompactPills) {
                    label = refinement.displayName;
                }
            } else if (isRadiosCustom) {
                label = `${refinement.displayName}: ${
                    happeningFiltersUtils.getSelectedOrDefaultRefinement(
                        refinements,
                        refinement.displayName,
                        selectedFilters[refinement.displayName][0]
                    ).refinementValueDisplayName
                }`;
            } else if (isCheckboxCustom) {
                label = selectedCustomValues?.length > 0 ? `${refinement.subTitle} (${selectedCustomValues.length})` : refinement.subTitle;
            } else {
                label = refinement.displayName;
            }

            return (
                <React.Fragment key={`pill-wrapper-${refinement.displayName}`}>
                    {showPill && (
                        <div
                            key={`pill-${refinement.displayName}`}
                            css={[styles.filter, showCompactPills && styles.compactPill]}
                        >
                            <Pill
                                onClick={this.handlePillClick(refinement)}
                                isActive={activeItem === refinement.displayName || isSelectedCheckboxOrNonDefault}
                                useActiveArrow={false}
                                fontSize='sm'
                                hasArrow={refinement?.property !== 'single'}
                                children={label}
                                {...compactPillProps}
                            />
                        </div>
                    )}
                    {!showPill && <UpperFunnelPills refinement={refinement} />}
                </React.Fragment>
            );
        });

        return (
            <div
                ref={pillScrollRef}
                css={[styles.filtersWrap, this.props.filterShadow]}
            >
                <div css={styles.filter}>
                    <Pill
                        onClick={this.handleToggleMegaModal}
                        isActive={activeItem === 'mega' || isAnyFilterActive}
                        paddingX={null}
                        width={compactPillProps.minHeight || 36}
                        {...compactPillProps}
                    >
                        <Icon
                            name='filter'
                            size={17}
                        />
                    </Pill>
                </div>
                {pills}
            </div>
        );
    }
}

const styles = {
    filtersWrap: {
        whiteSpace: 'nowrap',
        marginLeft: -space.container,
        marginRight: -space.container,
        paddingLeft: space.container,
        paddingRight: space.container,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        // prevent cut off of focus outline
        paddingTop: space[1],
        paddingBottom: space[1],
        marginTop: -space[1],
        marginBottom: -space[1]
    },
    filter: {
        display: 'inline-block',
        verticalAlign: 'top',
        textTransform: 'capitalize',
        '& + *': {
            marginLeft: space[2]
        }
    },
    compactPill: {
        '& + *': {
            marginLeft: space[1]
        }
    }
};

export default wrapComponent(FilterPills, 'FilterPills');
