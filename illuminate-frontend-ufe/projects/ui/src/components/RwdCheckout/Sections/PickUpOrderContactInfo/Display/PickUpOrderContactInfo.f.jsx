import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Grid } from 'components/ui';
import React from 'react';
import AlternatePickup from 'components/RwdCheckout/Sections/AlternatePickup';

function PickUpOrderContactInfo({
    email,
    firstname,
    lastName,
    pickupOrderNotifyWithinMessage,
    orderId,
    altPickupPersonDetails,
    isAltPickupPersonEnabled,
    localization
}) {
    return (
        <React.Fragment>
            <Grid
                columns='1fr auto'
                gap={4}
                alignItems='center'
            >
                <div data-at={Sephora.debug.dataAt('personal_info')}>
                    {`${firstname} ${lastName}`}
                    <br />
                    {email}
                </div>
            </Grid>
            {isAltPickupPersonEnabled && (
                <AlternatePickup
                    marginY={5}
                    titleTextSize={['md', null, 'xl']}
                    orderId={orderId}
                    isCheckout={true}
                    alternatePickupData={altPickupPersonDetails}
                />
            )}
            {pickupOrderNotifyWithinMessage && (
                <Box
                    is='p'
                    backgroundColor='nearWhite'
                    paddingY={2}
                    paddingX={3}
                    marginTop={4}
                    data-at={Sephora.debug.dataAt('contact_information_section_info_message')}
                    borderRadius={2}
                >
                    {pickupOrderNotifyWithinMessage}
                    <br /> <br />
                    {localization.contactMessage1}
                    <strong>{localization.confirmEmail}</strong>
                    {localization.or}
                    <strong>{localization.photoId}</strong>
                    {localization.ready}
                </Box>
            )}
        </React.Fragment>
    );
}

export default wrapFunctionalComponent(PickUpOrderContactInfo, 'PickUpOrderContactInfo');
