import React from 'react';

import { Text, Button } from 'components/ui';

import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = localeUtils;

function ReservationLogin({ handleOnClick }) {
    const getText = getLocaleResourceFile('components/HappeningNonContent/Reservations/ReservationLogin/locales', 'ReservationLogin');

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
                width={235}
                onClick={handleOnClick}
                children={getText('button')}
            />
        </>
    );
}

export default wrapFunctionalComponent(ReservationLogin, 'ReservationLogin');
