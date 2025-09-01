import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Flex, Text, Link } from 'components/ui';

import { formatAppointmentTimeFrame, formatAppointmentDate, ensureSephoraPrefix } from 'utils/happening';
import isFunction from 'utils/functions/isFunction';
import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = localeUtils;

function AppointmentDetails({
    serviceInfo, selectedStore, selectedTimeSlot, selectedArtist, onClickEditAppointment
}) {
    const getText = getLocaleResourceFile('components/HappeningNonContent/ServiceBooking/AppointmentDetails/locales', 'AppointmentDetails');

    const showEditLink = isFunction(onClickEditAppointment);

    return (
        <>
            <Flex
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                marginBottom={1}
            >
                <Text
                    is={'h3'}
                    fontSize={'md'}
                    fontWeight={'bold'}
                    lineHeight={'20px'}
                    css={{ flex: 1 }}
                    children={serviceInfo.displayName}
                />
                {showEditLink && (
                    <Link
                        lineHeight={'18px'}
                        color='blue'
                        children={getText('edit')}
                        onClick={onClickEditAppointment}
                    />
                )}
            </Flex>
            <Text
                is={'p'}
                lineHeight={'18px'}
                children={formatAppointmentDate(selectedTimeSlot.startDateTime, selectedStore.timeZone)}
            />
            <Text
                is={'p'}
                lineHeight={'18px'}
                marginBottom={1}
                children={formatAppointmentTimeFrame(selectedTimeSlot.startDateTime, selectedStore.timeZone, serviceInfo.durationInt)}
            />
            <Text
                is={'p'}
                lineHeight={'18px'}
                marginBottom={1}
                children={getText('artist', [selectedArtist.displayName])}
            />
            <Text
                is={'p'}
                lineHeight={'18px'}
                marginBottom={2}
                children={ensureSephoraPrefix(selectedStore.displayName)}
            />
        </>
    );
}

AppointmentDetails.defaultProps = {
    serviceInfo: {},
    selectedStore: {},
    selectedTimeSlot: {},
    selectedArtist: {}
};

export default wrapFunctionalComponent(AppointmentDetails, 'AppointmentDetails');
