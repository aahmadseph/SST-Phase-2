import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Box, Button, Flex, Grid, Image, Text
} from 'components/ui';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import HappeningImg from 'components/SharedComponents/HappeningImg';

import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';
import {
    getWaitListTimeOfTheDay, formatAppointmentDate, ensureSephoraPrefix, getDateFromYMD
} from 'utils/happening';
import resourceWrapper from 'utils/framework/resourceWrapper';

import { borders, colors, shadows } from 'style/config';

import { WAITLIST_BUTTONS } from 'components/Content/Happening/ActionButtons/constants';

const { getLocaleResourceFile } = localeUtils;

const renderMyReservationsCTA = (isFixedToBottom, size, getText) => {
    const handleOnClick = e => locationUtils.navigateTo(e, '/happening/reservations');

    const waitlistButton = (
        <Button
            width={isFixedToBottom ? '100%' : 'auto'}
            size={size}
            variant='primary'
            children={getText('viewMyReservations')}
            display={[isFixedToBottom ? 'block' : 'none', null, 'block']}
            onClick={handleOnClick}
        />
    );

    return isFixedToBottom ? (
        <Box
            paddingX={4}
            paddingY={2}
            position={'fixed'}
            right={0}
            bottom={'calc(var(--bottomNavHeight) - 1px)'}
            left={0}
            backgroundColor={colors.white}
            zIndex={'var(--layer-flyout)'}
            borderBottom={`${borders[1]} ${colors.lightGray}`}
            boxShadow={shadows.light}
            display={['block', null, 'none']}
            children={waitlistButton}
        />
    ) : (
        waitlistButton
    );
};

function WaitlistConfirmationDetails(props) {
    const getText = getLocaleResourceFile('components/Content/Happening/WaitlistConfirmationDetails/locales', 'WaitlistConfirmationDetails');

    const {
        confirmationNumber, artist, timeOfTheDay, startDate, store, serviceInfo = {}
    } = props.waitlistInfo;

    const { displayName: activityName, imageUrl } = serviceInfo;
    const storeName = store?.displayName;
    const artistName = artist?.displayName;

    const formattedDate = formatAppointmentDate(getDateFromYMD(startDate));
    const getFormattedText = resourceWrapper(getText);

    if (!props.user.isSignedIn) {
        return null;
    }

    return (
        <Flex
            flexDirection='column'
            gap={[5, null, 6]}
            marginTop={4}
        >
            <Grid gap={[2, 4]}>
                <Flex
                    alignItems='center'
                    gap={2}
                >
                    <Image
                        size={24}
                        src='/img/ufe/filled-checkmark.svg'
                    />
                    <Text
                        is='h1'
                        fontSize={['lg', null, 'xl']}
                        fontWeight='bold'
                        children={getText('youAreWaitlisted')}
                    />
                </Flex>
                <Text
                    is='p'
                    children={getFormattedText(
                        'emailConfirmation',
                        false,
                        <Text
                            fontWeight='bold'
                            children={props.user.email}
                        />
                    )}
                />
            </Grid>
            <Flex
                alignItems={'flex-start'}
                gap={3}
            >
                <HappeningImg
                    borderRadius={2}
                    width={['100%', null, 210]}
                    maxWidth={[105, null, '100%']}
                    alt={activityName}
                    src={imageUrl}
                />
                <Flex
                    gap={4}
                    flexDirection='column'
                >
                    <Grid gap={2}>
                        <div>
                            <Text
                                fontWeight='bold'
                                is='p'
                                children={formattedDate}
                            />
                            <Text
                                fontWeight='bold'
                                is='p'
                                children={getWaitListTimeOfTheDay(timeOfTheDay)}
                            />
                        </div>
                        <Text
                            is='p'
                            children={activityName}
                        />
                        <div>
                            <Text
                                is='p'
                                children={getText('artist', [artistName])}
                            />
                            <Text
                                is='p'
                                children={ensureSephoraPrefix(storeName)}
                            />
                        </div>
                        <Text
                            fontSize='sm'
                            is='p'
                            color={colors.gray}
                            children={`${getText('confirmationNumber')}: ${confirmationNumber}`}
                        />
                    </Grid>
                    <Flex gap={2}>
                        {/* Lg UI */}
                        {renderMyReservationsCTA(false, 'sm', getText)}
                        <ActionButtons
                            size='sm'
                            width={148}
                            variantStyle='secondary'
                            reservationDetails={props.waitlistInfo}
                            buttons={WAITLIST_BUTTONS.CANCEL_WAITLIST}
                            commonButtonProps={{ minWidth: ['100%', null, 148], maxWidth: ['100%', null, 148] }}
                            wrapperProps={{ flex: 1 }}
                        />
                    </Flex>
                    {/* Small UI */}
                    {renderMyReservationsCTA(true, null, getText)}
                </Flex>
            </Flex>
        </Flex>
    );
}

export default wrapFunctionalComponent(WaitlistConfirmationDetails, 'WaitlistConfirmationDetails');
