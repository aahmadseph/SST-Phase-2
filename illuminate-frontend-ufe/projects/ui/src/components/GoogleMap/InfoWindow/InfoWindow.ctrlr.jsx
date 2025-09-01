import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import localeUtils from 'utils/LanguageLocale';
import { Text, Box, Link } from 'components/ui';
import storeUtils from 'utils/Store';
import storeHoursUtils from 'utils/StoreHours';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import Location from 'utils/Location';

class InfoWindow extends BaseClass {
    constructor(props) {
        super(props);
    }

    getStoreStatus = ({ storeData, todayClosingTime, getText, isExperienceDetailsPage = false }) => {
        if (isExperienceDetailsPage) {
            const storeStatus = storeHoursUtils.getStoreStatus(storeData.storeHours, storeData.timeZone);

            return (
                <Text
                    color={storeStatus.valueColor}
                    fontSize='12px'
                >
                    {storeStatus.value}
                </Text>
            );
        }

        return storeData.storeHours
            ? todayClosingTime && todayClosingTime !== 'Closed'
                ? getText('openUntil', [todayClosingTime])
                : getText('closed')
            : getText('storeHoursUnavailable');
    };

    render() {
        const { storeData, isStoreLocator } = this.props;
        const isStoreDetailsPage = Location.isStoreDetailsPage();
        const isExperienceDetailsPage = Location.isExperienceDetailsPage();

        const distanceUnits = localeUtils.getCountryDistanceUnits();
        const todayClosingTime = storeUtils.getStoreTodayClosingTime(storeData.storeHours);

        const StoreNameComp = isStoreLocator ? Link : 'div';
        let storeNameProps;

        if (isStoreLocator) {
            storeNameProps = {
                display: 'block',
                href: storeData.targetUrl,
                hoverSelector: '.Link-target'
            };
        }

        const getText = localeUtils.getLocaleResourceFile('components/GoogleMap/InfoWindow/locales', 'InfoWindow');
        const curbsidePickupFlag = isExperienceDetailsPage ? storeHoursUtils.isCurbsideEnabled(storeData) : storeUtils.isCurbsideEnabled(storeData);
        const showConciergeCurbsidePickupIndicator = storeUtils.isConciergeCurbsideEnabled(storeData);
        const showCurbsidePickupIndicator = curbsidePickupFlag && !showConciergeCurbsidePickupIndicator;

        return (
            <Box
                fontFamily='base'
                fontSize='sm'
                lineHeight='tight'
                fontWeight='normal'
            >
                <StoreNameComp {...storeNameProps}>
                    <strong className='Link-target'>Sephora {storeData.displayName}</strong>
                    <Text
                        marginTop='.25em'
                        marginBottom='.75em'
                        display='block'
                        className='Store-address'
                        data-at={Sephora.debug.dataAt('map_store_address')}
                    >
                        {storeData.address.address1}, {storeData.address.city}, {storeData.address.state} {storeData.address.postalCode}
                        <br />
                        <Link
                            color='blue'
                            href={`tel:${storeData.address.phone.replace(/[^0-9]+/g, '')}`}
                            children={`${storeData.address.phone}`}
                        />
                    </Text>
                </StoreNameComp>
                <div>
                    {this.getStoreStatus({
                        storeData,
                        todayClosingTime,
                        getText,
                        isExperienceDetailsPage: isExperienceDetailsPage || isStoreDetailsPage
                    })}
                    <Text
                        fontWeight={'bold'}
                        css={{ whiteSpace: 'nowrap' }}
                    >{`  •  ${storeData?.distance ?? 0} ${distanceUnits}`}</Text>
                </div>
                {showCurbsidePickupIndicator && <CurbsidePickupIndicator marginTop='0.75em' />}
                {showConciergeCurbsidePickupIndicator && (
                    <ConciergeCurbsidePickupIndicator
                        dataAt={Sephora.isMobile() ? 'concierge_curbside_indicator_stores_modal_label' : 'concierge_curbside_indicator_flyout_label'}
                        marginTop='0.75em'
                    />
                )}
            </Box>
        );
    }
}

export default wrapComponent(InfoWindow, 'InfoWindow');
