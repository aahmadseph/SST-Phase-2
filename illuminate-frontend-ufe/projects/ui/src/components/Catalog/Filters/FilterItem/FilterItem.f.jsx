import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link, Icon, Grid } from 'components/ui';
import SingleSelect from 'components/Catalog/Filters/SingleSelect/SingleSelect';
import MultiSelect from 'components/Catalog/Filters/MultiSelect/MultiSelect';
import CustomRange from 'components/Catalog/Filters/CustomRange/CustomRange';
import { REFINEMENT_STATES, SINGLE_SELECTS } from 'utils/CatalogConstants';
import catalogUtils from 'utils/Catalog';
import localeUtils from 'utils/LanguageLocale';
import {
    PICKUP,
    SAME_DAY,
    SHIP_TO_HOME,
    PICKUP_ARIA_DESCRIBED_BY,
    SAME_DAY_ARIA_DESCRIBED_BY,
    SHIP_TO_HOME_ARIA_DESCRIBED_BY
} from 'constants/UpperFunnel';

const getText = localeUtils.getLocaleResourceFile('components/Catalog/UpperFunnel/locales', 'UpperFunnelFilters');

const RefinementValueDisplayNameComp = ({
    type,
    isSelected,
    describedBy,
    describedByComp,
    labelClick,
    refinementDisplayNameAndValue
}) => {
    return (
        <Grid
            columns='auto 1fr auto'
            alignItems='start'
            gap='0.375em'
        >
            {describedByComp}
            <Icon
                name={isSelected ? `${type}Active` : type}
                size={20}
            />
            <Link
                aria-describedby={describedBy}
                data-at={Sephora.debug.dataAt(`select_${type}_filter`)}
                onClick={labelClick}
                children={refinementDisplayNameAndValue}
                arrowDirection='down'
            />
        </Grid>
    );
};

const getTextLabel = ({
    id,
    isSelected,
    storeNameText,
    zipCodeText,
    showEddOnBrowseAndSearch
}) => {
    switch (id) {
        case PICKUP_ARIA_DESCRIBED_BY:
            return isSelected ? getText('pickupSelectedAriaDescription', [storeNameText]) : getText('pickupNotSelectedAriaDescription');
        case SAME_DAY_ARIA_DESCRIBED_BY:
            return isSelected ? getText('sameDaySelectedAriaDescription', [zipCodeText]) : getText('sameDayNotSelectedAriaDescription');
        case SHIP_TO_HOME_ARIA_DESCRIBED_BY && showEddOnBrowseAndSearch:
            return getText('shipToHomeAriaDescription');
        default:
            return null;
    }
};

const createDescribedByComp = (id, isSelected, { storeNameText, zipCodeText, showEddOnBrowseAndSearch }) => (
    <div
        css={styles.describedBy}
        id={id}
    >
        {getTextLabel({
            id,
            isSelected,
            storeNameText,
            zipCodeText,
            showEddOnBrowseAndSearch
        })}
    </div>
);

function createFilterItemLabel({
    refinementValueDisplayName,
    refinementDisplayNameAndValue,
    refinementValueDisplayNameComp,
    count,
    fullStoreNameText,
    isSelected,
    describedByCompData,
    labelClick
}) {
    if (refinementValueDisplayNameComp) {
        switch (refinementValueDisplayNameComp) {
            case PICKUP:
                return RefinementValueDisplayNameComp({
                    type: 'store',
                    isSelected,
                    describedBy: PICKUP_ARIA_DESCRIBED_BY,
                    describedByComp: createDescribedByComp(PICKUP_ARIA_DESCRIBED_BY, isSelected, describedByCompData),
                    labelClick,
                    refinementDisplayNameAndValue: `${refinementValueDisplayName}: ${fullStoreNameText}`
                });
            case SAME_DAY:
                return RefinementValueDisplayNameComp({
                    type: 'bag',
                    isSelected,
                    describedBy: SAME_DAY_ARIA_DESCRIBED_BY,
                    describedByComp: createDescribedByComp(SAME_DAY_ARIA_DESCRIBED_BY, isSelected, describedByCompData),
                    labelClick,
                    refinementDisplayNameAndValue
                });
            case SHIP_TO_HOME:
                return RefinementValueDisplayNameComp({
                    type: 'truck',
                    isSelected,
                    describedBy: SHIP_TO_HOME_ARIA_DESCRIBED_BY,
                    describedByComp: createDescribedByComp(SHIP_TO_HOME_ARIA_DESCRIBED_BY, isSelected, describedByCompData),
                    labelClick,
                    refinementDisplayNameAndValue
                });
            default:
            // do nothing
        }
    }

    const displayName = refinementValueDisplayName?.replace('/', ' / ');

    if (count != null) {
        return `${displayName} (${count})`;
    }

    return displayName;
}

function FilterItem({
    type, title, value, selected, contextId, isModal, onClick, selectFilters, isHappening
}) {
    const isSingleSelect = SINGLE_SELECTS.indexOf(type) >= 0;
    const disabled = value.refinementValueStatus === REFINEMENT_STATES.IMPLICIT;
    const isDefault = value.isDefault;

    const Component = isSingleSelect ? (catalogUtils.isCustomRange(value.refinementValue) ? CustomRange : SingleSelect) : MultiSelect;

    return (
        <Component
            {...(isSingleSelect && {
                name: title.toLowerCase().replace(' ', '')
            })}
            displayName={value.refinementValueDisplayName}
            type={type}
            title={title}
            isDefault={isDefault}
            isModal={isModal}
            contextId={contextId}
            value={value.refinementValue}
            valueStatus={value.refinementValueStatus}
            label={createFilterItemLabel({
                type,
                ...value
            })}
            disabled={disabled}
            checked={selected || disabled}
            onClick={(e, refinement) => onClick(e, refinement ? refinement : value)}
            selectFilters={selectFilters}
            isHappening={isHappening}
        />
    );
}

const styles = {
    describedBy: {
        display: 'none'
    }
};

export default wrapFunctionalComponent(FilterItem, 'FilterItem');
