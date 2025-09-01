import React from 'react';

import { Text, Button } from 'components/ui';

import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';

function EmptyReservations() {
    const getText = localeUtils.getLocaleResourceFile('components/HappeningNonContent/Reservations/EmptyReservations/locales', 'EmptyReservations');

    const handleRedirect = () => locationUtils.navigateTo(null, '/happening/services');

    return (
        <>
            <Text
                is={'h2'}
                fontWeight={'bold'}
                fontSize={'lg'}
                marginBottom={0}
                children={getText('title')}
            />
            <Text
                is={'p'}
                marginBottom={4}
                children={getText('description')}
            />
            <Button
                variant={'secondary'}
                children={getText('button')}
                onClick={handleRedirect}
            />
        </>
    );
}

export default wrapFunctionalComponent(EmptyReservations, 'EmptyReservations');
