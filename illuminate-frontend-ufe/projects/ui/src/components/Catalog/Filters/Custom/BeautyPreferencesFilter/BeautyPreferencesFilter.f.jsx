import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import Store from 'Store';
const { dispatch } = Store;

import Actions from 'Actions';
const { showInfoModal } = Actions;

import Location from 'utils/Location';
import catalogUtils from 'utils/Catalog';
import analyticsConstants from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';

import * as catalogConstantsUtils from 'utils/CatalogConstants';
const { EXTRACT_KEY_FROM_FILTER_REGEX, BEAUTY_PREFERENCES_FILTER_LIMIT } = catalogConstantsUtils;

import { colors } from 'style/config';

import {
    Text, Flex, Box, Link
} from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import Flag from 'components/Flag/Flag';

import FilterGroup from 'components/Catalog/Filters/FilterGroup/FilterGroup';

import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/Filters/Custom/BeautyPreferencesFilter/locales', 'BeautyPreferencesFilter');

import auth from 'utils/Authentication';
const { GUIDED_SELLING_SPOKE, MY_SEPHORA } = analyticsConstants.GUIDED_SELLING;

import { HEADER_VALUE } from 'constants/authentication';

function infoModalMessageOnClick(e) {
    anaUtils.setNextPageData({ linkData: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE}` });
    Location.navigateTo(e, '/profile/BeautyPreferences');
}

function InfoModalMessage() {
    return (
        <Box>
            {getText('infoModalMessage')}
            <Link
                onClick={infoModalMessageOnClick}
                color={colors.blue}
                children={getText('infoModalMessageEndLink')}
                underline={true}
            />
            .
        </Box>
    );
}

function fireBeautyPreferencesInfoTracking() {
    processEvent.process(analyticsConstants.ASYNC_PAGE_LOAD, {
        data: {
            pageName: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE} info modal:n/a:*`
        }
    });
}

function showBeautyPreferenceInfoModal(e) {
    e.stopPropagation();
    dispatch(
        showInfoModal({
            isOpen: true,
            title: getText('infoModalTitle'),
            message: <InfoModalMessage />,
            buttonText: getText('gotIt'),
            bodyFooterPaddingX: 4,
            bodyPaddingBottom: 4
        })
    );

    fireBeautyPreferencesInfoTracking();
}

function FilterTitle({ title, isModal }) {
    return (
        <Flex
            gap={'6px'}
            alignItems={'end'}
        >
            <Text maxWidth={isModal ? '168px' : '82px'}>{title}</Text>
            <Flex
                gap={'6px'}
                alignItems={'center'}
            >
                <InfoButton
                    size={16}
                    onClick={showBeautyPreferenceInfoModal}
                />
                <Flag
                    {...(localeUtils.isFrench() && { fontSize: '9px' })}
                    backgroundColor={'black'}
                    children={getText('new')}
                    marginLeft={'1px'}
                />
            </Flex>
        </Flex>
    );
}

function signInHandler(e, anaData) {
    e.stopPropagation();
    auth.requireAuthentication(null, null, anaData, null, true, HEADER_VALUE.USER_CLICK).catch(() => {});
}

function AnonymousState() {
    return (
        <Box paddingBottom={4}>
            <Link
                onClick={e => signInHandler(e, { linkData: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE}:sign in` })}
                color={colors.blue}
                children={getText('signIn')}
                underline={true}
            />
            {getText('signInToAdd')}
        </Box>
    );
}

function NoBeautyPreferencesSavedState() {
    return <Box paddingBottom={4}>{getText('applyFilters')}</Box>;
}

function onFilterSelect({ categorySpecificMasterList, selectFilters, allSelectedValuesByKey }) {
    return (selectedFilters, applyFilters, refinementValueClicked) => {
        const { refinementValue } = refinementValueClicked;
        const { key } = EXTRACT_KEY_FROM_FILTER_REGEX.exec(refinementValue)?.groups;
        const { value } = categorySpecificMasterList?.refinements.find(refinement => refinement.key === key);

        const previousSelectedValues = allSelectedValuesByKey[value];

        // If this is a de-selection, filtering out selected value will get us correct values
        let newSelectedValues = previousSelectedValues.filter(v => v !== refinementValue);

        // If no filtering occurred, then we need to add the selected value
        if (newSelectedValues.length === previousSelectedValues.length) {
            newSelectedValues = new Set([...previousSelectedValues, refinementValue]).values().toArray();
        }

        const newSelectedValuesObject = { [value]: newSelectedValues };

        return selectFilters(
            {
                // We dont need to add the BP filter values when applyFilters===true as BP filters values will get calculated after fetch/response
                // We do need to add the BP filters for Modal
                ...(!applyFilters && selectedFilters),
                ...newSelectedValuesObject
            },
            applyFilters
        );
    };
}

function onSelectAll({ selectFilters, categorySpecificMasterList, values }) {
    const allSelected = values?.reduce((acc, value) => {
        const { key } = EXTRACT_KEY_FROM_FILTER_REGEX.exec(value.refinementValue)?.groups;
        const map = categorySpecificMasterList?.refinements.length
            ? Object.values(categorySpecificMasterList?.refinements).find(refinement => refinement.key === key)
            : [];

        if (map) {
            if (!acc[map.value]) {
                acc[map.value] = [];
            }

            acc[map.value].push(value.refinementValue);
        }

        return acc;
    }, {});

    return () => {
        selectFilters(allSelected, true);
    };
}

function isAllSelected({ values }) {
    if (!values || !values.length) {
        return false;
    }

    return values?.every(value => value.refinementValueStatus === 2);
}

function onDeselectAll({ selectFilters, categorySpecificMasterList, values }) {
    const allDeselected = values?.reduce((acc, value) => {
        const { key } = EXTRACT_KEY_FROM_FILTER_REGEX.exec(value.refinementValue)?.groups;
        const map = categorySpecificMasterList?.refinements.length
            ? Object.values(categorySpecificMasterList?.refinements).find(refinement => refinement.key === key)
            : [];

        if (map) {
            if (!acc[map.value]) {
                acc[map.value] = [];
            }
        }

        return acc;
    }, {});

    return () => {
        selectFilters(allDeselected, true);
    };
}

function SelectAllCTA(props) {
    const allSelected = isAllSelected(props);
    const isSearchBarDisplayed = props?.values?.length >= BEAUTY_PREFERENCES_FILTER_LIMIT;

    return (
        <Link
            display='block'
            color='blue'
            lineHeight='tight'
            width='100%'
            paddingTop={!isSearchBarDisplayed ? [1, 0] : 2}
            paddingBottom={2}
            onClick={allSelected ? onDeselectAll(props) : onSelectAll(props)}
            children={getText(allSelected ? 'deselectAll' : 'selectAll')}
        />
    );
}

function BeautyPreferencesFilter(props) {
    const { userInfo, categorySpecificMasterList } = props;

    const isAtLeastOneAnsweredForWorld = bpRedesignedUtils.isAtLeastOneAnsweredForWorld(
        userInfo?.customerPreference,
        categorySpecificMasterList?.key
    );

    const commonFilterGroupProps = {
        customTitle: (
            <FilterTitle
                title={props.title}
                isModal={props.isModal}
            />
        ),
        customHeight: props.isModal ? 50 : 68
    };

    if (props.userInfo.isAnonymous) {
        return (
            <FilterGroup
                {...props}
                {...commonFilterGroupProps}
                customChild={<AnonymousState />}
            />
        );
    }

    const filterLimit = BEAUTY_PREFERENCES_FILTER_LIMIT;

    const groupingInfo = catalogUtils.getFilterGroupingInfo({
        preferences: props.values,
        categorySpecificMasterList: props.categorySpecificMasterList,
        isModal: props.isModal,
        filterLimit
    });

    if (!isAtLeastOneAnsweredForWorld || props.values?.length === 0) {
        return (
            <FilterGroup
                {...props}
                {...commonFilterGroupProps}
                customChild={<NoBeautyPreferencesSavedState />}
            />
        );
    }

    return (
        <FilterGroup
            {...props}
            {...commonFilterGroupProps}
            valueGrouping={{
                isGrouped: true,
                hasOrdering: true,
                getGroupedValues: groupingInfo.getGroupedValues
            }}
            values={props.values}
            customChild={null}
            customCTA={({ searchTerm }) => {
                if (props.values?.length >= filterLimit || searchTerm.length > 0) {
                    return null;
                }

                return <SelectAllCTA {...props} />;
            }}
            selectFilters={onFilterSelect(props)}
            withoutAtoZ={true}
            filterLimit={filterLimit}
        />
    );
}

export default wrapFunctionalComponent(BeautyPreferencesFilter, 'BeautyPreferencesFilter');
