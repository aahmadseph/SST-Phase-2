import React from 'react';
import FrameworkUtils from 'utils/framework';
import LanguageLocale from 'utils/LanguageLocale';
import { Text, Box, Grid } from 'components/ui';
import { leftColWidth, isMobile } from 'components/SharedComponents/AccessPoint/PickupPerson/constants';
import Empty from 'constants/empty';

const localeUtils = LanguageLocale;
const { wrapFunctionalComponent } = FrameworkUtils;
const getText = localeUtils.getLocaleResourceFile('components/SharedComponents/AccessPoint/PickupPerson/locales', 'PickupPerson');

function PickupPerson({ address, isOrderDetail, isGuestOrder, isCAOrder }) {
    const {
        pickUpPersonAddress1 = '',
        pickUpPersonAddress2 = '',
        pickUpPersonCity = '',
        pickUpPersonState = '',
        pickUpPersonPostalCode = ''
    } = address || Empty.Object;

    return (
        <Grid
            columns={[`${leftColWidth}px 1fr`, isOrderDetail ? `${leftColWidth}px 1fr` : 1]}
            gap={0}
            mb={[isMobile && !isOrderDetail ? 0 : 4, isMobile && !isOrderDetail ? 0 : 4, isOrderDetail ? 4 : 0]}
        >
            <Text
                is='h2'
                fontWeight='bold'
            >
                {getText('pickupPerson')}
            </Text>
            <Box
                p={0}
                m={0}
            >
                <Text display='block'>
                    {address?.firstName} {address?.lastName}
                </Text>
                {isCAOrder && pickUpPersonAddress1 && <Text display='block'>{pickUpPersonAddress1}</Text>}
                {!isOrderDetail && isGuestOrder && address?.email && <Text display='block'>{address.email}</Text>}
                {isCAOrder && pickUpPersonAddress2 && <Text display='block'>{pickUpPersonAddress2}</Text>}
                {isCAOrder && pickUpPersonCity && (
                    <Text display='block'>{`${pickUpPersonCity}, ${pickUpPersonState} ${pickUpPersonPostalCode}`}</Text>
                )}
                <Box
                    padding={4}
                    mt={3}
                    backgroundColor='nearWhite'
                    borderRadius='4px'
                >
                    {getText('pleaseHaveYour')}
                    <b>{getText('photoId')}</b>
                    {getText('addedInstructions')}
                    {isCAOrder && <b>{getText('idMustMatch')}</b>}
                    {getText('packagesWillBeHeld', [isCAOrder ? 15 : 5])}
                </Box>
            </Box>
        </Grid>
    );
}

PickupPerson.defaultProps = {
    isOrderDetail: false,
    isGuestOrder: false
};

export default wrapFunctionalComponent(PickupPerson, 'PickupPerson');
