import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import { Box, Grid } from 'components/ui';
import React from 'react';
import AlternatePickup from 'components/Checkout/Sections/AlternatePickup';
const getText = (...args) =>
    localeUtils.getLocaleResourceFile('components/Checkout/Sections/PickUpOrderContactInfo/locales', 'PickUpOrderContactInfo')(...args);

function PickUpOrderContactInfo({
    email,
    firstname,
    lastName,
    pickupOrderNotifyWithinMessage,
    orderId,
    altPickupPersonDetails,
    isAltPickupPersonEnabled
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
                    {getText('contactMessage1')}
                    <strong>{getText('confirmEmail')}</strong>
                    {getText('or')}
                    <strong>{getText('photoId')}</strong>
                    {getText('ready')}
                </Box>
            )}
        </React.Fragment>
    );
}

export default wrapFunctionalComponent(PickUpOrderContactInfo, 'PickUpOrderContactInfo');
