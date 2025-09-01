import React from 'react';
import BaseClass from 'components/BaseClass';
import framework from 'utils/framework';
import languageLocaleUtils from 'utils/LanguageLocale';
import {
    Button, Text, Box, Divider
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import FormValidator from 'utils/FormValidator';
import ErrorMsg from 'components/ErrorMsg';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import storeUtils from 'utils/Store';
import orderDetailsBindings from 'analytics/bindingMethods/pages/orderDetails/orderDetailsBindings';
import VehicleColorSelector from 'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/VehicleColorSelector';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';

const { wrapComponent } = framework;
const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/locales', 'CurbsidePickupCheckinModal');

const fireSubmitLinkTrackingError = errorMessage => {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: linkTrackingError,
            fieldErrors: ['curbside'],
            errorMessages: [errorMessage]
        }
    });
};

class CurbsidePickupCheckinModal extends BaseClass {
    state = {
        submitErrors: [],
        vehicleMakeModel: '',
        comments: '',
        contactPhone: '',
        vehicleColor: null,
        isMultipleOrders: false,
        parkingLotNumber: '',
        notifed: false
    };

    vehicleColourRef = React.createRef();
    vehicleMakeModelRef = React.createRef();
    commentsRef = React.createRef();
    contactPhoneRef = React.createRef();
    parkingLotNumberRef = React.createRef();

    blurOnReturnMobile = e => {
        if (Sephora.isMobile() && e.key.toLowerCase() === 'enter') {
            e.target.blur();
            e.preventDefault();
        }
    };

    setFormValue = fieldName => e => {
        let value = e;

        if (e.target) {
            value = Object.prototype.hasOwnProperty.call(e.target, 'checked') ? e.target.checked : e.target.value;
        }

        this.setState({
            [fieldName]: value,
            submitErrors: []
        });
    };

    isValid = () => {
        const fieldsForValidation = [
            this.vehicleMakeModelRef,
            this.commentsRef,
            this.contactPhoneRef,
            this.vehicleColourRef,
            this.parkingLotNumberRef
        ];

        const errors = FormValidator.getErrors(fieldsForValidation);

        if (errors?.fields?.length) {
            errors.messages.forEach(message => fireSubmitLinkTrackingError(message));
        }

        this.setState({ submitErrors: [] });

        return !errors.fields.length;
    };

    handleSubmit = e => {
        e.preventDefault();
        const { storeDetails } = this.props;
        const conciergeCurbsideEnabled = storeUtils.isConciergeCurbsideEnabled(storeDetails);

        if (this.isValid()) {
            orderDetailsBindings.curbsideModalSuccess();
            const payload = {
                vehicleMakeModel: this.state.vehicleMakeModel,
                comments: this.state.comments,
                contactPhone: this.state.contactPhone,
                vehicleColor: this.state.vehicleColor,
                isMultipleOrders: this.state.isMultipleOrders,
                parkingLotNo: this.state.parkingLotNumber,
                ...(conciergeCurbsideEnabled && { conciergeIndicator: 'Brookfield' })
            };

            this.props
                .notifyStore(payload)
                .then(response => {
                    if (response.errorCode && response.errorCode === 409) {
                        this.setState({ notifed: true });
                    } else {
                        this.props.goToNextScreen();
                    }
                })
                .catch(() => {
                    this.setState({ submitErrors: [getText('errorMessage')] });
                });
        }
    };

    // eslint-disable-next-line class-methods-use-this
    render() {
        const { hasBodyScroll, disabled, storeDetails } = this.props;
        const conciergeCurbsideEnabled = storeUtils.isConciergeCurbsideEnabled(storeDetails);
        const { isConciergePurchaseEnabled } = Sephora?.configurationSettings;

        return (
            <>
                <Modal.Body hasBodyScroll={hasBodyScroll}>
                    <Box
                        is='form'
                        lineHeight='tight'
                        noValidate
                        onSubmit={this.handleSubmit}
                    >
                        {this.state.submitErrors &&
                            this.state.submitErrors.length > 0 &&
                            this.state.submitErrors.map((msg, i) => (
                                <ErrorMsg
                                    marginBottom={4}
                                    is='div'
                                    key={i}
                                >
                                    {msg}
                                </ErrorMsg>
                            ))}

                        {this.state.notifed && (
                            <ErrorMsg
                                marginBottom={4}
                                is='div'
                            >
                                {getText('notifiedMessage')}
                            </ErrorMsg>
                        )}

                        <Text
                            is='h2'
                            marginBottom={5}
                        >
                            {getText('subtitle')}
                        </Text>

                        <VehicleColorSelector
                            ref={e => {
                                this.vehicleColourRef = e;
                            }}
                            title={getText('vehicleColor')}
                            selectedColour={this.state.vehicleColor}
                            onClick={this.setFormValue('vehicleColor')}
                            disabled={disabled}
                            validate={value => {
                                if (FormValidator.isEmpty(value)) {
                                    return getText('vehicleColorError');
                                }

                                return null;
                            }}
                        />

                        <TextInput
                            ref={e => {
                                this.vehicleMakeModelRef = e;
                            }}
                            marginBottom={null}
                            name='vehicleMakeModel'
                            label={getText('vehicleMakeModelPlaceholder')}
                            maxLength={30}
                            onChange={this.setFormValue('vehicleMakeModel')}
                            value={this.state.vehicleMakeModel}
                            onKeyUp={this.blurOnReturnMobile}
                            validate={value => {
                                if (FormValidator.isEmpty(value)) {
                                    return getText('vehicleMakeModelEmptyError');
                                }

                                return null;
                            }}
                            disabled={disabled}
                        />
                        <Text
                            textAlign='right'
                            is='p'
                            color='gray'
                            fontSize='sm'
                            marginTop={2}
                            marginBottom={4}
                        >
                            {this.state.vehicleMakeModel.length}/30 {getText('characters')}
                        </Text>

                        {isConciergePurchaseEnabled && conciergeCurbsideEnabled && (
                            <TextInput
                                ref={e => {
                                    this.parkingLotNumberRef = e;
                                }}
                                name='parkingLotNumber'
                                label={getText('parkingLotNumberPlaceholder')}
                                maxLength={2}
                                onChange={this.setFormValue('parkingLotNumber')}
                                value={this.state.parkingLotNumber}
                                onKeyUp={this.blurOnReturnMobile}
                                validate={value => {
                                    if (FormValidator.isEmpty(value) || !FormValidator.isNumeric(value)) {
                                        return getText('parkingLotNumberEmptyError');
                                    }

                                    return null;
                                }}
                                disabled={disabled}
                            />
                        )}

                        <TextInput
                            ref={e => {
                                this.commentsRef = e;
                            }}
                            marginBottom={null}
                            name='comments'
                            label={getText('commentPlaceholder')}
                            maxLength={125}
                            onChange={this.setFormValue('comments')}
                            value={this.state.comments}
                            onKeyUp={this.blurOnReturnMobile}
                            disabled={disabled}
                        />
                        <Text
                            textAlign='right'
                            is='p'
                            color='gray'
                            fontSize='sm'
                            marginTop={2}
                        >
                            {this.state.comments.length}/125 {getText('characters')}
                        </Text>

                        <Divider marginY={4} />

                        <MobilePhoneInput
                            ref={e => {
                                this.contactPhoneRef = e;
                            }}
                            marginBottom={null}
                            name='contactPhone'
                            label={getText('contactPhonePlaceholder')}
                            onChange={this.setFormValue('contactPhone')}
                            onKeyUp={this.blurOnReturnMobile}
                            validate={value => {
                                if (FormValidator.isEmpty(value)) {
                                    return getText('contactPhoneEmptyError');
                                }

                                if (value.length !== FormValidator.FIELD_LENGTHS.formattedPhone) {
                                    return getText('contactPhoneInvalidError');
                                }

                                return null;
                            }}
                            disabled={disabled}
                        />

                        <Text
                            is='p'
                            color='gray'
                            fontSize='sm'
                            marginTop={2}
                        >
                            {getText('contactPhoneConsent')}
                        </Text>

                        {!conciergeCurbsideEnabled && (
                            <>
                                <Divider marginY={4} />

                                <Checkbox
                                    name='isMultipleOrders'
                                    paddingY={null}
                                    onChange={this.setFormValue('isMultipleOrders')}
                                    checked={this.state.isMultipleOrders}
                                    disabled={disabled}
                                >
                                    {getText('isMultipleOrdersLabel')}
                                </Checkbox>
                            </>
                        )}

                        <input
                            type='submit'
                            style={{ display: 'none' }}
                        />
                    </Box>
                </Modal.Body>
                <Modal.Footer hasBodyScroll={hasBodyScroll}>
                    <Button
                        variant='primary'
                        width='100%'
                        onClick={this.handleSubmit}
                        disabled={disabled}
                    >
                        {getText('submit')}
                    </Button>
                </Modal.Footer>
            </>
        );
    }
}

export default wrapComponent(CurbsidePickupCheckinModal, 'CurbsidePickupCheckingModal', true);
