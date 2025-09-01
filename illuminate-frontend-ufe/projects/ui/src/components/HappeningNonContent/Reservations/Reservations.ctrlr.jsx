/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';

import {
    Text, Box, Flex, Link, Button
} from 'components/ui';
import Pill from 'components/Pill';
import BaseClass from 'components/BaseClass';
import EmptyReservations from 'components/HappeningNonContent/Reservations/EmptyReservations';
import ReservationCard from 'components/HappeningNonContent/Reservations/ReservationCard';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import ReservationLogin from 'components/HappeningNonContent/Reservations/ReservationLogin';
import { colors } from 'style/config';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

import { showSignInModal } from 'utils/happening';

import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';

const { getLocaleResourceFile } = localeUtils;

class Reservations extends BaseClass {
    constructor(props) {
        super(props);

        this.getText = getLocaleResourceFile('components/HappeningNonContent/Reservations/locales', 'Reservations');

        const cancelLabel = Sephora.configurationSettings.isRequestAppointmentEnabled ? 'notAttended' : 'canceled';

        this.state = {
            options: [
                { label: this.getText('upcoming'), isActive: true, status: 'UPCOMING' },
                { label: this.getText('past'), isActive: false, status: 'PAST' },
                { label: this.getText(cancelLabel), isActive: false, status: 'CANCELLED' }
            ],
            page: 1
        };
    }

    onSwitchPill = index => {
        const { getMyReservationsCSC } = this.props;
        const { options } = this.state;

        getMyReservationsCSC(options[index].status).then(() => {
            const optionsUpdated = options.map((el, i) => ({
                ...el,
                isActive: index === i
            }));

            this.setState({ options: optionsUpdated, page: 1 });
        });
    };

    onShowMore = () => {
        this.setState({ page: this.state.page + 1 });
    };

    componentDidMount() {
        if (!this.props.user.isSignedIn) {
            showSignInModal();
        }

        HappeningBindings.myReservationsPageLoadAnalytics();
    }

    componentDidUpdate(prevProps) {
        const { content, user, getMyReservationsCSC } = this.props;

        if (user.isSignedIn && user.profileId !== prevProps.user.profileId && content.isDefaultData) {
            getMyReservationsCSC();
        }
    }

    render() {
        const { options, page } = this.state;
        const { content, user } = this.props;
        const optionSelected = options?.find(option => option.isActive);
        const reservations = content?.[optionSelected.status] ?? [];
        const filteredReservations = reservations.filter(reservation => reservation.status === optionSelected.status);
        const totalReservationsRender = page * 10;
        const displayShowMoreButton = filteredReservations.length > totalReservationsRender;

        const handleRedirect = targetURL => () => locationUtils.navigateTo(null, targetURL);

        return (
            <Box
                maxWidth={834}
                marginBottom={5}
            >
                <Text
                    is={'h1'}
                    fontSize={'xl'}
                    fontWeight={'bold'}
                    marginBottom={4}
                    children={this.getText('title')}
                />
                {!user.isSignedIn ? (
                    <ReservationLogin handleOnClick={() => showSignInModal(null, true)} />
                ) : (
                    <>
                        {options.map((option, index) => (
                            <Pill
                                key={index}
                                isActive={option.isActive}
                                marginRight={2}
                                marginBottom={[5, null, 6]}
                                marginTop={2}
                                children={option.label}
                                onClick={() => this.onSwitchPill(index)}
                            />
                        ))}
                        {filteredReservations.length === 0 && <EmptyReservations />}
                        {filteredReservations.length > 0 && (
                            <Flex
                                flexDirection={'column'}
                                gap={[3, null, 4]}
                                marginBottom={4}
                            >
                                {filteredReservations.slice(0, totalReservationsRender).map((reservation, index) => (
                                    <ReservationCard
                                        key={`reservation-${index}`}
                                        reservation={reservation}
                                    />
                                ))}
                            </Flex>
                        )}
                        {displayShowMoreButton && (
                            <Button
                                children={this.getText('showMoreButton')}
                                variant={'secondary'}
                                onClick={this.onShowMore}
                            />
                        )}
                    </>
                )}
                <SectionDivider
                    height={3}
                    color={colors.nearWhite}
                />
                <Link
                    display='block'
                    lineHeight='tight'
                    color='blue'
                    onClick={handleRedirect('/happening/services')}
                    children={this.getText('bookService')}
                />
                <SectionDivider />
                <Link
                    display='block'
                    lineHeight='tight'
                    color='blue'
                    children={this.getText('browseEvent')}
                    onClick={handleRedirect('/happening/events')}
                />
            </Box>
        );
    }
}

export default wrapComponent(Reservations, 'Reservations', true);
