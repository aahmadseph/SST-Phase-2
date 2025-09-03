import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';
import store from 'store/Store';
import Actions from 'Actions';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import { Box, Text, Button } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import TextInput from 'components/Inputs/TextInput/TextInput';
import ErrorConstants from 'utils/ErrorConstants';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Textarea from 'components/Inputs/Textarea/Textarea';
import localeUtils from 'utils/LanguageLocale';
import ErrorsUtils from 'utils/Errors';
import ACTIVITY from 'constants/happening/activityConstants';

const { getMessage } = ErrorsUtils;

class GuestForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            userName: '',
            phone: '',
            formattedPhone: '',
            smsEnabled: true,
            specialRequests: '',
            isGuest: true
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        const isValdated = this.validateForm();

        if (isValdated) {
            this.props.getGuestDetails(this.state);
            store.dispatch(Actions.showAuthenticateModal({ isOpen: false }));
        }

        const modalLoadEvent = anaUtils.getMostRecentEvent(anaConsts.ASYNC_PAGE_LOAD);
        const pageName = modalLoadEvent.eventInfo && modalLoadEvent.eventInfo.attributes && modalLoadEvent.eventInfo.attributes.pageName;
        anaUtils.setNextPageData({ pageName });
    };

    updateState = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    updatePhoneState = e => {
        const updatedObj = {};
        updatedObj['phone'] = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        updatedObj['formattedPhone'] = FormValidator.getFormattedPhoneNumber(updatedObj['phone']);
        this.setState(updatedObj);
    };

    validateForm = () => {
        const errors = FormValidator.getErrors([this.firstNameInput, this.lastNameInput, this.phoneNumberInput, this.emailInput]);

        return !errors.fields.length;
    };

    handleSmsEnabled = () => {
        this.setState({ smsEnabled: !this.state.smsEnabled });
    };

    validateFirstName = firstName => {
        if (FormValidator.isEmpty(firstName)) {
            return getMessage(ErrorConstants.ERROR_CODES.FIRST_NAME);
        }

        return null;
    };

    validateLastName = lastName => {
        if (FormValidator.isEmpty(lastName)) {
            return getMessage(ErrorConstants.ERROR_CODES.LAST_NAME);
        }

        return null;
    };

    validatePhone = phoneNumber => {
        if (FormValidator.isEmpty(phoneNumber)) {
            return getMessage(ErrorConstants.ERROR_CODES.PHONE_NUMBER);
        }

        if (phoneNumber.length !== FormValidator.FIELD_LENGTHS.formattedPhone) {
            return getMessage(ErrorConstants.ERROR_CODES.PHONE_NUMBER_INVALID);
        }

        return null;
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/EDP/SignInWithAuthenticateModal/GuestForm/locales', 'GuestForm');
        const { hasSpecialRequests, hasPrice, activityId } = this.props;
        const isMobile = Sephora.isMobile();
        const isCanada = localeUtils.isCanada();

        const isMakeupDeluxeService = activityId === ACTIVITY.MAKEUP_DELUXE_SERVICE_ACTIVITY_ID;

        return (
            <form
                action=''
                noValidate
                onSubmit={this.handleSubmit}
            >
                <LegacyGrid
                    gutter={3}
                    fill={true}
                >
                    <LegacyGrid.Cell>
                        <TextInput
                            label={getText('firstName')}
                            name='firstName'
                            id='guest_booking_firstName'
                            required={true}
                            onChange={this.updateState}
                            ref={comp => (this.firstNameInput = comp)}
                            validate={this.validateFirstName}
                        />
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell>
                        <TextInput
                            name='lastName'
                            label={getText('lastName')}
                            id='guest_booking_lastName'
                            required={true}
                            onChange={this.updateState}
                            ref={comp => (this.lastNameInput = comp)}
                            validate={this.validateLastName}
                        />
                    </LegacyGrid.Cell>
                </LegacyGrid>

                <InputEmail
                    label={getText('emailAddress')}
                    name='userName'
                    id='guest_booking_email'
                    ref={comp => (this.emailInput = comp)}
                    required={true}
                    onChange={this.updateState}
                />

                <TextInput
                    name='phone'
                    label={getText('phone')}
                    id='guest_booking_phone'
                    autoComplete='tel'
                    autoCorrect='off'
                    type='tel'
                    marginBottom={null}
                    value={this.state.formattedPhone}
                    onKeyDown={!isMobile && FormValidator.inputAcceptOnlyNumbers}
                    required={true}
                    onChange={this.updatePhoneState}
                    maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                    ref={comp => (this.phoneNumberInput = comp)}
                    validate={this.validatePhone}
                />
                <Checkbox
                    paddingY={4}
                    checked={this.state.smsEnabled}
                    onChange={this.handleSmsEnabled}
                >
                    {getText('sendReminders')}
                </Checkbox>
                {hasSpecialRequests && (
                    <Textarea
                        label={getText('specialRequests')}
                        placeholder={getText('specialRequestsPlaceholder')}
                        rows={5}
                        maxLength={1000}
                        name='specialRequests'
                        onChange={this.updateState}
                        value={this.state.specialRequests}
                    />
                )}
                {(hasPrice || (isMakeupDeluxeService && !isCanada)) && (
                    <React.Fragment>
                        <Text
                            {...ACTIVITY.SUBSECTION_HEADER_PROPS}
                            children={ACTIVITY.PAYMENT_HEADER}
                        />
                        <Text
                            is='p'
                            children={hasPrice && !isCanada ? ACTIVITY.PAYMENT_WITH_PRICE_TEXT(hasPrice) : ACTIVITY.PAYMENT_TEXT}
                        />

                        {isMakeupDeluxeService && !isCanada && (
                            <Text
                                is='p'
                                children={ACTIVITY.PAYMENT_TEXT_MAKEUP_DELUXE}
                            />
                        )}
                        <Text
                            {...ACTIVITY.SUBSECTION_HEADER_PROPS}
                            children={ACTIVITY.ONTIME_HEADER}
                        />
                        <Text
                            is='p'
                            children={ACTIVITY.ONTIME_TEXT}
                        />
                    </React.Fragment>
                )}
                <Box marginTop={5}>
                    <Button
                        variant='primary'
                        type='submit'
                        block={true}
                        onClick={this.handleSubmit}
                        data-at={Sephora.debug.dataAt('complete_booking')}
                        children={getText('completeBooking')}
                    />
                </Box>
            </form>
        );
    }
}

export default wrapComponent(GuestForm, 'GuestForm');
