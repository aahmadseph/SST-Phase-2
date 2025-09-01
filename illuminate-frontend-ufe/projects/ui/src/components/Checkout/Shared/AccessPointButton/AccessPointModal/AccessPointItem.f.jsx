import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Radio from 'components/Inputs/Radio/Radio';
import InfoButton from 'components/InfoButton/InfoButton';
import { Grid, Box, Text } from 'components/ui';
import accessPointConstants from 'components/Checkout/Shared/AccessPointButton/constants';
import LanguageLocale from 'utils/LanguageLocale';
const getText = LanguageLocale.getLocaleResourceFile('components/Checkout/Shared/AccessPointButton/AccessPointModal/locales', 'AccessPointModal');
import { hasOpeningTimes, getOpensTillTime } from 'utils/AccessPoints';

const AccessPointItem = ({ checked, onChange, data, openDetails }) => {
    const {
        locationId, companyName, addressLine1, city, state, zipCode, distance, pickupLocationType, operatingHours
    } = data;
    const isFedexOnsite = pickupLocationType === accessPointConstants.FEDEX_ONSITE;

    return (
        <Grid
            key={locationId}
            alignItems='flex-start'
            columns='1fr auto'
        >
            <div css={checked || { ':hover .accessPointName': { textDecoration: 'underline' } }}>
                <Radio
                    paddingY={null}
                    checked={checked}
                    onChange={onChange}
                >
                    <Box is='dl'>
                        <Text
                            className='accessPointName'
                            is='dt'
                            fontWeight='bold'
                            mb='.25em'
                        >
                            {companyName}
                        </Text>
                        {isFedexOnsite && (
                            <Text
                                is='dd'
                                color='gray'
                                mb='.25em'
                            >
                                {getText('fedexOnsite')}
                            </Text>
                        )}
                        <Text
                            is='dd'
                            mb='.25em'
                        >{`${addressLine1}, ${city}, ${state} ${zipCode}`}</Text>
                        <Text is='dd'>
                            {hasOpeningTimes(operatingHours) && `${getText('openUntil')} ${getOpensTillTime(operatingHours)}`}
                            {distance && hasOpeningTimes(operatingHours) && ' • '}
                            {distance &&
                                `${Number(distance?.value).toFixed(1)} ${getText(distance?.units === 'MI' ? 'miles' : 'kilometers')} ${getText(
                                    'away'
                                )}`}
                        </Text>
                    </Box>
                </Radio>
            </div>
            <InfoButton
                size={16}
                onClick={openDetails}
            />
        </Grid>
    );
};

AccessPointItem.shouldUpdatePropsOn = ['checked'];

export default wrapFunctionalComponent(AccessPointItem, 'AccessPointItem');
