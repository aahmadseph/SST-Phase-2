import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import {
    Button, Divider, Flex, Link, Text
} from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';
import Modal from 'components/Modal';

import { getEventFormattedFullDate, createEventRSVP, ensureSephoraPrefix } from 'utils/happening';
import formValidator from 'utils/FormValidator';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';

import Actions from 'actions/Actions';
import store from 'store/Store';

import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';
import servicesBindings from 'analytics/bindingMethods/pages/happeningAtSephora/servicesBindings';

import { ERROR_URL } from 'components/Content/Happening/HappeningEDP/EDPInfo/constants';

const { getLocaleResourceFile } = localeUtils;

const ACTIVITY_TYPE = 'events';

class EDPConfirmRsvpModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isSMSReminderChecked: false,
            phoneNumber: props.user.phoneNumber || ''
        };
    }

    handlePhoneNumber = phoneNumber => this.setState({ phoneNumber });

    handleChange = () => {
        this.setState(prevState => ({ isSMSReminderChecked: !prevState.isSMSReminderChecked }));
    };

    bookReservation = (phoneNumber, isSMSReminderChecked) => {
        const {
            edpInfo, timeSlot, storeId, user, timeZone
        } = this.props;

        const { clientExternalId, firstName, lastName, phoneNumber: profilePhoneNumber } = user;
        const activityId = edpInfo.activityId;
        const { country, language } = Sephora.renderQueryParams;

        const options = {
            country,
            language,
            activityType: ACTIVITY_TYPE,
            activityId,
            payload: {
                smsEnabled: isSMSReminderChecked,
                clientExternalId,
                bookingId: timeSlot.bookingId,
                storeId,
                firstName,
                lastName,
                phone: phoneNumber || profilePhoneNumber,
                activityType: ACTIVITY_TYPE,
                startDateTime: timeSlot.startDateTime,
                channelId: 'web',
                clientTimeZone: timeZone
            }
        };

        createEventRSVP(options).catch(() => urlUtils.redirectTo(ERROR_URL));

        this.triggerSOTAnalytics();
    };

    validatePhoneNumber = () => {
        const errors = formValidator.getErrors([this.phoneNumberInput]);
        const isValid = !errors.fields.length;

        return isValid;
    };

    handleCompleteRSVP = () => {
        const isPhoneNumberValid = this.validatePhoneNumber();

        if (isPhoneNumberValid) {
            const { phoneNumber, isSMSReminderChecked = false } = this.state;

            this.bookReservation(phoneNumber, isSMSReminderChecked);
            this.requestClose();
        }
    };

    requestClose = () => {
        store.dispatch(Actions.showEDPConfirmRsvpModal({ isOpen: false }));
    };

    handleDismiss = () => this.requestClose();

    triggerSOTAnalytics = () => {
        const { edpInfo, eventDisplayName, storeId } = this.props;

        servicesBindings.completeBooking({
            reservationName: eventDisplayName,
            activityType: ACTIVITY_TYPE,
            activityId: edpInfo.activityId,
            storeId
        });
    };

    componentDidMount() {
        const { eventDisplayName, storeId, guest } = this.props;
        HappeningBindings.eventDetailsPhoneValidationPageLoadAnalytics(eventDisplayName, storeId, ACTIVITY_TYPE, guest);
    }

    render() {
        const {
            isOpen, eventDisplayName, storeDisplayName, timeSlot, timeZone
        } = this.props;
        const { durationMin, startDateTime } = timeSlot;

        const getText = getLocaleResourceFile('components/GlobalModals/EDPConfirmRsvpModal/locales', 'EDPConfirmRsvpModal');

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.handleDismiss}
            >
                <Modal.Header>
                    <Modal.Title>{getText('rsvp')}</Modal.Title>
                </Modal.Header>
                <Modal.Body lineHeight={'tight'}>
                    <Text
                        is={'h2'}
                        fontSize={['md', null, 'lg']}
                        fontWeight={'bold'}
                        lineHeight={['20px', null, '22px']}
                        marginBottom={2}
                        children={getText('rsvpForEvent', [eventDisplayName])}
                    />
                    <Text
                        display={'block'}
                        children={getEventFormattedFullDate(startDateTime, timeZone, durationMin)}
                    />
                    <Text
                        display={'block'}
                        children={ensureSephoraPrefix(storeDisplayName)}
                    />
                    <Divider marginY={[4, null, 5]} />
                    <Flex
                        flexDirection={'column'}
                        gap={4}
                    >
                        <Text
                            is={'h3'}
                            fontSize={'md'}
                            fontWeight={'bold'}
                            children={getText('rightPhoneNumber')}
                        />
                        <MobilePhoneInput
                            name='phone_number'
                            required={true}
                            initialValue={this.state.phoneNumber}
                            value={this.state.phoneNumber}
                            label={getText('phoneNumberLabel')}
                            onChange={this.handlePhoneNumber}
                            customStyle={{ root: { width: 343 } }}
                            marginBottom={0}
                            ref={phoneNumberInput => {
                                if (phoneNumberInput !== null) {
                                    this.phoneNumberInput = phoneNumberInput;
                                }
                            }}
                            validate={value => {
                                if (formValidator.isEmpty(value) || value.length !== formValidator.FIELD_LENGTHS.formattedPhone) {
                                    return getText('invalidPhoneNumberError');
                                }

                                return null;
                            }}
                        />
                        <Checkbox
                            checked={this.state.isSMSReminderChecked}
                            onChange={this.handleChange}
                            name='sms_reminders_consent'
                        >
                            {getText('consentMessage')}
                        </Checkbox>
                    </Flex>
                    <Text
                        is={'p'}
                        color={'gray'}
                        fontSize={'sm'}
                        marginTop={[2, null, 5]}
                    >
                        {`${getText('iAgreeToThe')} `}
                        <Link
                            color={'blue'}
                            css={{ textDecoration: 'underline' }}
                            href='/beauty/terms-of-use'
                            children={getText('textTerms')}
                        />
                        {` ${getText('termsAndConditions')} `}
                        <Link
                            color={'blue'}
                            css={{ textDecoration: 'underline' }}
                            href='/beauty/privacy-policy?icid2=customer_service_privacy_policy_action_link_internal'
                            children={getText('privacyPolicy')}
                        />
                        .
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        width={['100%', null, 205]}
                        children={getText('cta')}
                        onClick={this.handleCompleteRSVP}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

EDPConfirmRsvpModal.defaultProps = {
    user: {}
};

EDPConfirmRsvpModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    eventDisplayName: PropTypes.string.isRequired,
    storeDisplayName: PropTypes.string.isRequired,
    timeSlot: PropTypes.shape({
        startDateTime: PropTypes.string.isRequired,
        durationMin: PropTypes.number.isRequired,
        bookingId: PropTypes.string.isRequired
    }).isRequired,
    timeZone: PropTypes.string.isRequired,
    edpInfo: PropTypes.shape({
        type: PropTypes.string.isRequired,
        activityId: PropTypes.string.isRequired
    }).isRequired,
    storeId: PropTypes.string.isRequired,
    user: PropTypes.shape({})
};

export default wrapComponent(EDPConfirmRsvpModal, 'EDPConfirmRsvpModal', true);
