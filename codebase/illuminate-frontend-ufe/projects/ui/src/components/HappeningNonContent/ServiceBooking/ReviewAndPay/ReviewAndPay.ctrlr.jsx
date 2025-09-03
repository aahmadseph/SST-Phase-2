/* eslint-disable complexity */
import React from 'react';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import StepsCTA from 'components/HappeningNonContent/ServiceBooking/StepsCTA';
import {
    Box, Divider, Flex, Text, Link, Button, Icon, Image
} from 'components/ui';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import TextInput from 'components/Inputs/TextInput/TextInput';
import PaymentInfo from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo';
import CreditCard from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCard';
import CreditCardForm from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCardForm';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import { WAITLIST_BUTTONS } from 'components/Content/Happening/ActionButtons/constants';

import creditCardUtils from 'utils/CreditCard';
import debounceUtils from 'utils/Debounce';
import decorators from 'utils/decorators';
import errorConstants from 'utils/ErrorConstants';
import errorsUtils from 'utils/Errors';
import formsUtils from 'utils/Forms';
import formValidator from 'utils/FormValidator';
import resourceWrapper from 'utils/framework/resourceWrapper';
import { renderModal } from 'utils/globalModals';
import { getWaiverMediaPrefValues, showSignInModal } from 'utils/happening';
import isFunction from 'utils/functions/isFunction';
import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';
import orderUtils from 'utils/Order';
import userUtils from 'utils/User';
import uiUtils from 'utils/UI';
import anaUtils from 'analytics/utils';
import profileApi from 'services/api/profile';
import sdnApi from 'services/api/sdn';
import utilityApi from 'services/api/utility';

import { colors } from 'style/config';

import Empty from 'constants/empty';
import { ANY_ARTIST_ID } from 'components/HappeningNonContent/ServiceBooking/PickArtistDateTime/constants';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';
import servicesBindings from 'analytics/bindingMethods/pages/happeningAtSephora/servicesBindings';
import { DEBOUNCE_TIME as SOT_TRACKING_CALL_DEBOUNCE_TIME } from 'analytics/utils/sotTracking';
import { showSignInModalWithContextOptions } from 'utils/happening';

const { isAMEXCard, loadChaseTokenizer, shortenCardNumber } = creditCardUtils;
const { getLocaleResourceFile, getCurrentCountry, getCurrentLanguage } = localeUtils;
const { getCardTypeDisplayName } = orderUtils;
const { getCreditCardsFromProfile, removeCreditCardFromProfile, updateCreditCardOnProfile, getShippingAddresses } = profileApi;
const { postApptReservation, deleteApptReservation } = sdnApi;
const { getCountryList } = utilityApi;

const INTERSTICE_DELAY_MS = 1000;

const WAIVER_OF_RIGHTS_VALUE = {
    ACKFORCLIENT: 'AckforClient',
    ACKFORCLIENTUNDER18: 'Ackforclientunder18'
};

const ACTIVITY_TYPE = 'services';

const SMS_TCS_EXTERNAL_LINK = '/beauty/sms-terms-and-conditions?icid2=customer_service_sms_terms_conditions_link_internal';
const PRIVACY_POLICY_EXTERNAL_LINK = '/beauty/privacy-policy?icid2=customer_service_privacy_policy_external_link';
const POLICIES_EXTERNAL_LINK = '/beauty/beauty-services-faq?icid2=happening_services_faq_link_external';

const ERROR = {
    TIME_SLOT_TAKEN: 'error.reservationservice.sm.booking.timeslot',
    PAYMENT_ERROR: 'Error when creating payment, payment rejected auth',
    PAYMENT_ERROR_AUTH: 'error.reservationservice.payment.auth'
};

const CVV_STATUS = {
    NOT_CONFIRMED: 0,
    CONFIRMED: 1,
    NOT_SUBMITED: -1
};

const newCreditCardTemplate = userDefaultAddress => ({
    firstName: userDefaultAddress?.firstName || Empty.String,
    lastName: userDefaultAddress?.lastName || Empty.String,
    address: {
        country: userUtils.getShippingCountry().countryCode
    }
});

class ReviewAndPay extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isInitialized: false,
            initialDataLoadError: false,
            isNewUserFlow: true,
            isSMSReminderChecked: false,
            isWaiverOfRightsChecked: false,
            isBookingForMinorChecked: false,
            isIAmTheParentChecked: false,
            isAcceptPoliciesChecked: false,
            showAcceptPoliciesError: false,
            securityCode: '',
            phoneNumber: props.user.phoneNumber || Empty.String,
            showPhoneNumberTooltip: true,
            userCreditCards: [],
            userCardToUse: null,
            securityCodeInputError: false,
            showPaymentInfoSection: false,
            billingCountries: null,
            userDefaultAddress: null,
            waiverOfRightsValue: WAIVER_OF_RIGHTS_VALUE.ACKFORCLIENT,
            bookingApiErrorMsg: '',
            securityCodeStatus: CVV_STATUS.NOT_SUBMITED,
            isCreditCardApiErrorMsg: '',
            showSecurityCodeError: false,
            temporalCardInfo: '',
            guestFirstName: '',
            guestLastName: '',
            guestEmail: '',
            guestEmailError: '',
            guestPhoneError: '',
            isGuestBookingFlow: !this.props.user.isSignedIn && this.props.isGuestBooking && Sephora.configurationSettings.isGuestEventServicesEnabled
        };

        this.getText = getLocaleResourceFile('components/HappeningNonContent/ServiceBooking/ReviewAndPay/locales', 'ReviewAndPay');

        this.errorRef = React.createRef();
    }

    checkGuestBookingFlow = () => {
        const { isGuestEventServicesEnabled } = Sephora.configurationSettings;
        const { user, isGuestBooking } = this.props;
        const isSignedIn = user.isSignedIn;
        const isGuestBookingFlow = !isSignedIn && isGuestBooking && isGuestEventServicesEnabled;
        this.setState({ isGuestBookingFlow });
    };

    getInitialData = async () => {
        const { user } = this.props;
        const { profileId } = user;

        try {
            const [billingCountries, creditCardsData] = await Promise.all([getCountryList(), getCreditCardsFromProfile(profileId)]);

            const userCreditCards = creditCardsData?.creditCards;
            const userCardToUse = userCreditCards?.find(card => card.isDefault) || userCreditCards[0];
            const userDefaultAddress = await this.fetchShippingAddresses(profileId);

            this.setState({
                billingCountries,
                userCreditCards,
                userCardToUse,
                userDefaultAddress,
                isNewUserFlow: userCreditCards.length === 0,
                isInitialized: true,
                initialDataLoadError: false,
                showPaymentInfoSection: !!(userCardToUse && userCardToUse.isExpired)
            });
        } catch {
            this.setState({ initialDataLoadError: true });
        }
    };

    fetchShippingAddresses = async profileId => {
        try {
            const response = await getShippingAddresses(profileId);

            return response?.addressList?.find(address => address.isDefault);
        } catch (error) {
            Sephora.logger.error('Error fetching user addressList:', error);

            return null;
        }
    };

    checkIsSignedIn = cb => {
        const { isInitialized, isGuestBookingFlow } = this.state;
        const { user } = this.props;

        if (user.isSignedIn && isInitialized) {
            isFunction(cb) && cb();
        } else if (!user.isSignedIn && isGuestBookingFlow) {
            isFunction(cb) && cb();
        } else {
            showSignInModal(() => this.getInitialData().then(() => isFunction(cb) && cb()), false);
        }
    };

    getUserUpdatedCreditCardData = async (userCardIdToUse, isCardDeleted) => {
        const { profileId } = this.props.user;

        this.clearCreditCardErrorMessges();

        try {
            const { creditCards } = await getCreditCardsFromProfile(profileId);

            const userHasCreditCards = creditCards.length > 0;
            const userCardToUse = creditCards.find(card => card.creditCardId === userCardIdToUse);

            const nextState = {
                userCreditCards: creditCards,
                userCardToUse,
                isNewUserFlow: !userHasCreditCards,
                showPaymentInfoSection: !!(isCardDeleted && userHasCreditCards),
                ...(!isCardDeleted && {
                    isCardUsedOnceOrAddedOrEdited: true,
                    securityCodeStatus: CVV_STATUS.CONFIRMED
                })
            };

            this.setState(nextState);
        } catch {
            this.setState({
                initialDataLoadError: true
            });
        }
    };

    removeCreditCard = creditCardId => () => {
        const { profileId } = this.props.user;

        this.clearCreditCardErrorMessges();

        removeCreditCardFromProfile(profileId, creditCardId)
            .then(() => this.getUserUpdatedCreditCardData(null, true))
            .catch(error => {
                const errorMessage = error?.errorMessages?.length && error.errorMessages[0];

                errorMessage && this.setState({ isCreditCardApiErrorMsg: errorMessage }, this.jumpToErrorRef);
            });
    };

    handleRemoveCreditCard = creditCardId => () => {
        this.props.showInfoModal({
            isOpen: true,
            title: this.getText('deleteCard'),
            message: this.getText('removeCardMessage'),
            buttonText: this.getText('yes'),
            callback: this.removeCreditCard(creditCardId),
            showCancelButtonLeft: true,
            cancelText: this.getText('no')
        });
    };

    renderTimeSlotTakenErrMessage = () => {
        const listItems = [
            {
                title: this.getText('chooseAnotherTime'),
                description: this.getText('returnToSchedule')
            },
            {
                title: this.getText('joinWaitlist'),
                description: this.getText('joinWaitlistInfo')
            }
        ];

        return (
            <>
                <Text
                    is={'p'}
                    lineHeight={'18px'}
                    wordWrap={'break-word'}
                    marginBottom={4}
                    children={this.getText('timeSlotAlreadyTaken')}
                />

                <Text
                    is={'p'}
                    lineHeight={'18px'}
                    wordWrap={'break-word'}
                    children={`${this.getText('whatYouCanDo')}:`}
                />
                <Box
                    is='ul'
                    lineHeight='tight'
                    paddingLeft={5}
                >
                    {listItems.map(({ title, description }, index) => (
                        <Box
                            key={`${title}-${index}`}
                            is='li'
                            display={'list-item'}
                            lineHeight={'18px'}
                            wordWrap={'break-word'}
                            css={styles.timeSlotTakenListItem}
                        >
                            <Text
                                fontWeight={'bold'}
                                children={title}
                            />
                            {': '}
                            {description}
                        </Box>
                    ))}
                </Box>
            </>
        );
    };

    showTimeSlotTakenErrModal = () => {
        const { showInfoModal, onClickEditAppointment } = this.props;
        const { isRequestAppointmentEnabled } = Sephora.configurationSettings;
        const infoModalProps = isRequestAppointmentEnabled
            ? { message: this.renderTimeSlotTakenErrMessage(), width: 474 }
            : { message: this.getText('timeSlotAlreadyTakenErr') };

        showInfoModal({
            isOpen: true,
            title: this.getText('timeSlotUnavailable'),
            buttonText: this.getText('selectNewTimeSlot'),
            callback: onClickEditAppointment,
            ...infoModalProps
        });
    };

    handlePhoneNumber = phoneNumber => this.setState({ phoneNumber, guestPhoneError: '' });

    handleCheckboxChange = checkboxName => () => this.setState(prevState => this.getUpdatedCheckboxState(prevState, checkboxName));

    handleCvcChange = e => {
        const sanitizedSecurityCode = uiUtils.isAndroid()
            ? e.target.value.replace('.', '')
            : formValidator.replaceDotSeparator(e.target.value, this.refs.securityCodeInput);

        this.setState({
            securityCode: sanitizedSecurityCode,
            emptySecurityCode: false
        });
    };

    getUpdatedCheckboxState = (prevState, checkboxName) => {
        // isWaiverOfRightsChecked and isBookingForMinorChecked work like radio buttons so only one can be checked at a time
        if (checkboxName === 'isWaiverOfRightsChecked') {
            const isWaiverOfRightsChecked = !prevState.isWaiverOfRightsChecked;

            return {
                isWaiverOfRightsChecked,
                isBookingForMinorChecked: false,
                isIAmTheParentChecked: false
            };
        }

        if (checkboxName === 'isBookingForMinorChecked') {
            const isBookingForMinorChecked = !prevState.isBookingForMinorChecked;

            return {
                isWaiverOfRightsChecked: false,
                isBookingForMinorChecked,
                isIAmTheParentChecked: isBookingForMinorChecked ? prevState.isIAmTheParentChecked : false,
                waiverOfRightsValue: isBookingForMinorChecked ? WAIVER_OF_RIGHTS_VALUE.ACKFORCLIENTUNDER18 : WAIVER_OF_RIGHTS_VALUE.ACKFORCLIENT
            };
        }

        return {
            [checkboxName]: !prevState[checkboxName]
        };
    };

    handleWaiverOfRightsClick = e => {
        e.preventDefault();

        return renderModal({
            sid: 'happening_waiver_of_rights',
            title: this.getText('worModalTitle'),
            type: 'Modal',
            width: 3
        });
    };

    handleBookNowClickDebounced = debounceUtils.preventDoubleClick(() => this.checkIsSignedIn(this.handleBookNowClick));

    handleBookNowClick = async () => {
        const { userCardToUse, securityCodeStatus, isCardUsedOnceOrAddedOrEdited, isGuestBookingFlow } = this.state;

        const isWaiverValid = this.validateWaiver();
        const arePoliciesValid = this.validatePolicies();
        const isPhoneNumberValid = this.validatePhoneNumber();
        const isValidSecurityCode = isCardUsedOnceOrAddedOrEdited || this.validateSecurityCode();
        const isSecurityCodeNotConfirmed = securityCodeStatus !== CVV_STATUS.CONFIRMED;
        // Setting this as false to bypass when not in the guest booking flow
        let isGuestFieldsValid = true;

        if (isGuestBookingFlow) {
            isGuestFieldsValid = await this.validateGuestFields();

            if (isGuestFieldsValid && Sephora.configurationSettings.isGuestFMSPhoneEmailValidation) {
                isGuestFieldsValid = await this.validateEmailAndPhone();
            }
        }

        this.showSecurityCodeNotConfirmedError(isSecurityCodeNotConfirmed, isValidSecurityCode);
        this.showCardNotSelectedOrNotAddedError();

        if (
            !isWaiverValid ||
            !arePoliciesValid ||
            !isPhoneNumberValid ||
            !isValidSecurityCode ||
            !userCardToUse ||
            isSecurityCodeNotConfirmed ||
            !isGuestFieldsValid
        ) {
            return;
        }

        if (isGuestBookingFlow) {
            this.handleGuestServiceConfirmation();
        } else {
            this.handleServiceConfirmation();
        }
    };

    jumpToErrorRef = elementRef => {
        const ref = elementRef || this.errorRef;

        setTimeout(() => {
            ref && uiUtils.scrollTo({ ref });
        });
    };

    handleCancelPreviousReservation = async rescheduleConfirmationNumber => {
        try {
            await deleteApptReservation({
                activityType: locationUtils.getHappeningPathActivityInfo().activityType,
                confirmationNumber: rescheduleConfirmationNumber
            });
        } catch (error) {
            Sephora.logger.error(`Error deleting reservation ${rescheduleConfirmationNumber} on re-schedule:`, error);
        }
    };

    handleServiceConfirmation = () => {
        const {
            isSMSReminderChecked, userCardToUse, phoneNumber, waiverOfRightsValue, temporalCardInfo
        } = this.state;
        const {
            user, selectedStore, selectedTimeSlot, serviceInfo, selectedArtist, selectedFeature, specialRequests, rescheduleConfirmationNumber
        } =
            this.props;

        const options = {
            country: getCurrentCountry(),
            language: getCurrentLanguage(),
            activityType: ACTIVITY_TYPE,
            activityId: serviceInfo.activityId,
            payload: {
                clientExternalId: user.clientExternalId,
                channelId: 'web',
                phone: phoneNumber || user.phoneNumber,
                reservationPreferences: [
                    {
                        ...getWaiverMediaPrefValues(),
                        prefValue: waiverOfRightsValue
                    }
                ],
                storeId: selectedStore.storeId,
                paymentId: userCardToUse.creditCardId,
                smsEnabled: isSMSReminderChecked,
                lastName: user.lastName,
                activityType: ACTIVITY_TYPE,
                firstName: user.firstName,
                bookingId: serviceInfo.activityId,
                startDateTime: selectedTimeSlot.startDateTime,
                clientTimeZone: selectedStore.timeZone,
                locale: getCurrentLanguage(),
                ...(specialRequests && { specialRequests }),
                ...(selectedArtist?.resourceId !== ANY_ARTIST_ID &&
                    selectedArtist?.employeeNumber && { baEmployeeNumber: selectedArtist.employeeNumber }),
                ...(selectedFeature?.displayName && { featuresToFocusOn: selectedFeature.displayName })
            }
        };

        if (temporalCardInfo) {
            const { paymentId, ...updatedPayload } = options.payload;

            options.payload = {
                ...updatedPayload,
                creditCard: {
                    sourceId: temporalCardInfo.cardNumber,
                    brand: temporalCardInfo.cardType,
                    cvv: temporalCardInfo.securityCode,
                    expiryMonth: temporalCardInfo.expirationMonth,
                    expiryYear: temporalCardInfo.expirationYear,
                    billTo: {
                        street1: temporalCardInfo.address.address1,
                        street2: temporalCardInfo.address.address2,
                        city: temporalCardInfo.address.city,
                        country: temporalCardInfo.address.country,
                        state: temporalCardInfo.address.state,
                        email: user.clientExternalId,
                        firstName: temporalCardInfo.firstName,
                        lastName: temporalCardInfo.lastName,
                        postalCode: temporalCardInfo.address.postalCode
                    }
                },
                pageEncryption: {
                    pieIntegrityCheck: temporalCardInfo.paymentRefData.integrityCheck,
                    pieKeyId: temporalCardInfo.paymentRefData.keyID,
                    piePhaseId: temporalCardInfo.paymentRefData.phase,
                    pieMode: 'FPE'
                }
            };
        }

        this.setState({ bookingApiErrorMsg: '' });

        return decorators
            .withInterstice(
                postApptReservation,
                INTERSTICE_DELAY_MS
            )(options)
            .then(data => {
                const { responseStatus, confirmationNumber } = data;

                if (responseStatus === 200 && confirmationNumber) {
                    const shouldCancelPreviousReservation = !!rescheduleConfirmationNumber;

                    const redirect = () => {
                        this.removeExitEvent();
                        this.triggerSOTAnalytics();
                        locationUtils.navigateTo(null, `/happening/services/confirmation/${confirmationNumber}`);
                    };

                    if (shouldCancelPreviousReservation) {
                        this.handleCancelPreviousReservation(rescheduleConfirmationNumber).finally(redirect);
                    } else {
                        redirect();
                    }
                }
            })
            .catch(error => {
                const isTimeSlotTakenErr = error.errorMessages && error.errorMessages.find(msg => msg === ERROR.TIME_SLOT_TAKEN);
                const isPaymentErrorMessage = error.errorMessages && error.errorMessages.find(msg => msg === ERROR.PAYMENT_ERROR);

                if (isTimeSlotTakenErr) {
                    this.showTimeSlotTakenErrModal();
                } else if (isPaymentErrorMessage) {
                    this.setCreditCardApiErrorMsg(this.getText('genericCreditCardApiError'));
                } else {
                    this.setState({
                        bookingApiErrorMsg: this.getText('genericBookingApiError')
                    });
                }
            });
    };

    handleGuestServiceConfirmation = () => {
        const {
            guestEmail, guestFirstName, guestLastName, phoneNumber, isSMSReminderChecked, waiverOfRightsValue, temporalCardInfo
        } = this.state;
        const {
            selectedStore,
            serviceInfo,
            selectedTimeSlot,
            specialRequests,
            selectedArtist,
            selectedFeature,
            bookGuestService,
            rescheduleConfirmationNumber
        } = this.props;

        const options = {
            clientExternalId: guestEmail,
            firstName: guestFirstName,
            lastName: guestLastName,
            phone: phoneNumber,
            smsEnabled: isSMSReminderChecked,
            storeId: selectedStore.storeId,
            serviceId: serviceInfo.activityId,
            startDateTime: selectedTimeSlot.startDateTime,
            channelId: 'WEB',
            specialRequest: specialRequests || null,
            clientTimeZone: selectedStore.timeZone,
            baEmployeeNumber: selectedArtist?.employeeNumber || null,
            country: getCurrentCountry(),
            featuresToFocusOn: selectedFeature?.displayName || null,
            locale: getCurrentLanguage(),
            reservationPreferences: [
                {
                    ...getWaiverMediaPrefValues(),
                    prefValue: waiverOfRightsValue
                }
            ],
            pageEncryption: {
                pieIntegrityCheck: temporalCardInfo.paymentRefData.integrityCheck,
                pieKeyId: temporalCardInfo.paymentRefData.keyID,
                piePhaseId: String(temporalCardInfo.paymentRefData.phase),
                pieMode: 'FPE'
            },
            creditCard: {
                sourceId: temporalCardInfo.cardNumber,
                brand: temporalCardInfo.cardType,
                cvv: temporalCardInfo.securityCode,
                expiryMonth: temporalCardInfo.expirationMonth,
                expiryYear: temporalCardInfo.expirationYear,
                billTo: {
                    street1: temporalCardInfo?.address?.address1 || '',
                    street2: temporalCardInfo?.address?.address2 || '',
                    city: temporalCardInfo?.address?.city || '',
                    country: temporalCardInfo?.address?.country || '',
                    state: temporalCardInfo?.address?.state || '',
                    email: guestEmail,
                    firstName: temporalCardInfo?.firstName || '',
                    lastName: temporalCardInfo?.lastName || '',
                    postalCode: temporalCardInfo?.address?.postalCode || ''
                }
            }
        };

        this.setState({ bookingApiErrorMsg: '' });

        return decorators
            .withInterstice(
                bookGuestService,
                INTERSTICE_DELAY_MS
            )(options)
            .then(data => {
                const { errorCode, confirmationNumber } = data;
                const shouldCancelPreviousReservation = !!rescheduleConfirmationNumber;

                if (shouldCancelPreviousReservation) {
                    anaUtils.setNextPageData({
                        isRescheduling: true
                    });
                }

                if (errorCode === null && confirmationNumber) {
                    const redirect = () => {
                        this.removeExitEvent();
                        this.triggerSOTAnalytics();
                        locationUtils.navigateTo(null, `/happening/services/confirmation/${confirmationNumber}`);
                    };

                    if (shouldCancelPreviousReservation) {
                        this.handleCancelPreviousReservation(rescheduleConfirmationNumber).finally(redirect);
                    } else {
                        redirect();
                    }
                }
            })
            .catch(error => {
                const isTimeSlotTakenErr = error?.errorMessage === ERROR.TIME_SLOT_TAKEN;
                const isPaymentErrorMessage = error?.errorMessage === ERROR.PAYMENT_ERROR || error?.errorMessage === ERROR.PAYMENT_ERROR_AUTH;

                if (isTimeSlotTakenErr) {
                    this.showTimeSlotTakenErrModal();
                } else if (isPaymentErrorMessage) {
                    this.setCreditCardApiErrorMsg(this.getText('genericCreditCardApiError'));
                } else {
                    this.setState({
                        bookingApiErrorMsg: this.getText('genericBookingApiError')
                    });
                }
            });
    };

    triggerSOTAnalytics = () => {
        const { serviceInfo, selectedStore } = this.props;

        setTimeout(() => {
            servicesBindings.completeBooking({
                activityType: ACTIVITY_TYPE,
                activityId: serviceInfo.activityId,
                reservationName: serviceInfo.displayName,
                storeId: selectedStore.storeId
            });
        }, SOT_TRACKING_CALL_DEBOUNCE_TIME);
    };

    showSecurityCodeNotConfirmedError = (isSecurityCodeNotConfirmed, isValidSecurityCode) => {
        this.setState({ showSecurityCodeError: isSecurityCodeNotConfirmed && isValidSecurityCode });
    };

    showCardNotSelectedOrNotAddedError = () => {
        const { userCardToUse, showPaymentInfoSection, isNewUserFlow } = this.state;

        const isUserCardToUseNotSelected = !userCardToUse && showPaymentInfoSection;
        const isUserCardToUseNotAdded = !userCardToUse && isNewUserFlow && !showPaymentInfoSection;
        const showError = isUserCardToUseNotSelected || isUserCardToUseNotAdded;

        this.setState({ showCardNotSelectedOrAddedError: showError });
    };

    validateWaiver = () => {
        const { isWaiverOfRightsChecked, isBookingForMinorChecked, isIAmTheParentChecked } = this.state;
        const isValid = isBookingForMinorChecked ? isBookingForMinorChecked && isIAmTheParentChecked : isWaiverOfRightsChecked;

        this.setState({ showWaiverOfRightsError: !isValid }, () => !isValid && this.jumpToErrorRef());

        return isValid;
    };

    validatePolicies = () => {
        const { isAcceptPoliciesChecked } = this.state;
        const isValid = isAcceptPoliciesChecked;

        this.setState({ showAcceptPoliciesError: !isValid }, () => !isValid && this.jumpToErrorRef());

        return isValid;
    };

    validatePhoneNumber = () => {
        const errors = formValidator.getErrors([this.phoneNumberInput]);
        const isValid = !errors.fields.length;

        this.setState({ showPhoneNumberTooltip: isValid }, () => !isValid && this.jumpToErrorRef({ current: this.phoneNumberInput.inputElementRef }));

        return isValid;
    };

    validateGuestFields = () => {
        const { isGuestBookingFlow } = this.state;

        if (!isGuestBookingFlow) {
            return true;
        }

        const guestFields = [this.guestFirstNameInput, this.guestLastNameInput, this.guestEmailInput];
        const errors = formValidator.getErrors(guestFields);
        const indexError = errors.errorIndex;
        this.setState({
            guestEmailError: '',
            guestPhoneError: ''
        });

        if (indexError) {
            setTimeout(() => {
                this.jumpToErrorRef({ current: guestFields[indexError - 1]?.inputElementRef });
            }, 0);
        }

        return !errors.fields.length;
    };

    validateEmailAndPhone = async () => {
        const { checkEmailAndPhone } = this.props;
        const { phoneNumber, guestEmail } = this.state;
        let valid = true;

        this.setState({
            guestEmailError: '',
            guestPhoneError: '',
            bookingApiErrorMsg: ''
        });

        try {
            const { email, phone, fault } = await new Promise((resolve, reject) =>
                checkEmailAndPhone(
                    guestEmail,
                    phoneNumber,
                    d => resolve(d),
                    error => reject(error)
                )
            );

            if (fault) {
                throw new Error('Email and phone validation failed');
            }

            if (!email?.valid || email?.fraudScore === 100) {
                this.setState({ guestEmailError: this.getText('invalidGuestEmail') });
                setTimeout(() => {
                    this.jumpToErrorRef({ current: this.phoneNumberInput.inputElementRef });
                }, 0);
                valid = false;
            }

            if (!phone?.valid) {
                this.setState({ guestPhoneError: this.getText('invalidGuestPhone') });
                setTimeout(() => {
                    this.jumpToErrorRef({ current: this.guestEmailInput.inputElementRef });
                }, 0);
                valid = false;
            }

            return valid;
        } catch (error) {
            this.setState({
                bookingApiErrorMsg: this.getText('genericBookingApiError')
            });

            return false;
        }
    };

    validateSecurityCode = () => {
        const errors = formValidator.getErrors([this.securityCodeInput]);
        const isValid = !errors.fields.length;

        !isValid && this.jumpToErrorRef({ current: this.securityCodeInput.inputElementRef });

        return isValid;
    };

    confirmSecurityCode = () => {
        const { userCardToUse, securityCode } = this.state;
        const isValidSecurityCode = this.validateSecurityCode();

        if (isValidSecurityCode) {
            this.clearCreditCardErrorMessges();

            const options = {
                creditCard: {
                    firstName: userCardToUse.firstName,
                    lastName: userCardToUse.lastName,
                    creditCardId: userCardToUse.creditCardId,
                    address: userCardToUse.address,
                    securityCode,
                    expirationMonth: userCardToUse.expirationMonth,
                    expirationYear: userCardToUse.expirationYear
                },
                isMarkAsDefault: !!userCardToUse.isDefault
            };

            decorators
                .withInterstice(updateCreditCardOnProfile, INTERSTICE_DELAY_MS)(options, true)
                .then(data => {
                    const { creditCardId } = data;

                    if (creditCardId) {
                        this.setState({ securityCodeStatus: CVV_STATUS.CONFIRMED });
                    }
                })
                .catch(() => {
                    this.setState({ securityCodeInputError: true });
                });
        }
    };

    renderError = text => (
        <Flex
            gap={3}
            paddingX={3}
            paddingY={2}
            backgroundColor={'lightRed'}
            alignItems={'center'}
            borderRadius={2}
            ref={this.errorRef}
        >
            <Icon
                name='alert'
                color='red'
                size={16}
            />
            <Text
                is={'p'}
                color='red'
                children={text}
            />
        </Flex>
    );

    handleSetShowPaymentInfoSection = showPaymentInfoSection => () => {
        const { isGuestBookingFlow } = this.state;

        if (isGuestBookingFlow) {
            this.setState({ showPaymentInfoSection: false, userCardToUse: null, isNewUserFlow: true });
        } else {
            this.setState({ showPaymentInfoSection, userCardToUse: null });
        }
    };

    handleSetUserCardToUse = userCardToUse => () => {
        this.setState({
            userCardToUse,
            showPaymentInfoSection: false,
            securityCode: '',
            securityCodeStatus: CVV_STATUS.NOT_SUBMITED,
            showCardNotSelectedOrAddedError: false,
            isCardUsedOnceOrAddedOrEdited: false
        });
    };

    useTempCreditCardData = ({
        encryptedCCNumber,
        cardType,
        creditCardId,
        expirationMonth,
        expirationYear,
        paymentRefData,
        address,
        firstName,
        lastName,
        encryptedCVV,
        isTemporalCard
    } = {}) => {
        const userCardToUseFormatted = {
            cardNumber: `xxxx-xxxx-xxxx-${shortenCardNumber(encryptedCCNumber)}`,
            cardType: getCardTypeDisplayName(cardType),
            creditCardId,
            expirationMonth: String(expirationMonth),
            expirationYear: String(expirationYear),
            isDefault: false
        };

        let temporalCardToUse = false;

        if (isTemporalCard) {
            temporalCardToUse = {
                paymentRefData: paymentRefData,
                cardType: cardType,
                cardNumber: encryptedCCNumber,
                expirationMonth: String(expirationMonth),
                expirationYear: String(expirationYear),
                securityCode: encryptedCVV,
                firstName: firstName,
                lastName: lastName,
                address: address
            };
        }

        this.setState({
            userCardToUse: userCardToUseFormatted,
            temporalCardInfo: temporalCardToUse,
            isNewUserFlow: false,
            showPaymentInfoSection: false,
            securityCodeStatus: CVV_STATUS.CONFIRMED,
            isCardUsedOnceOrAddedOrEdited: true,
            showCardNotSelectedOrAddedError: false
        });
    };

    onAddOrEditSuccessCallback = (userCardIdToUse, tempCreditCardInfo) => {
        if (tempCreditCardInfo) {
            this.useTempCreditCardData(tempCreditCardInfo);
        } else {
            this.getUserUpdatedCreditCardData(userCardIdToUse);
        }
    };

    setCreditCardApiErrorMsg = isCreditCardApiErrorMsg => this.setState({ isCreditCardApiErrorMsg }, this.jumpToErrorRef);

    clearCreditCardErrorMessges = () => {
        this.setState({
            isCreditCardApiErrorMsg: '',
            showCardNotSelectedOrAddedError: false,
            showSecurityCodeError: false
        });
    };

    renderClientDetails = (textLabel, value) => (
        <Text
            is={'p'}
            lineHeight={'18px'}
            color={'gray'}
        >
            {`${this.getText(textLabel)}: `}
            <Text
                color={'black'}
                children={value}
            />
        </Text>
    );

    signIn = () => {
        showSignInModalWithContextOptions({
            contextOptions: {
                guestEventServicesEnabled: true,
                potentialServiceBIPoints: this.props.potentialBIPoints,
                onContinueAsAGuest: () => {},
                keepMeSignedIn: true
            },
            cb: () => {
                this.checkGuestBookingFlow();
            }
        });
    };

    register = () => {
        const { isGuestBookingFlow } = this.state;
        this.props.showRegisterModal({
            isOpen: true,
            extraParams: {
                keepMeSignedIn: true,
                isBookingFlow: isGuestBookingFlow,
                potentialBiPoints: this.props.potentialBIPoints
            },
            callback: () => {
                this.checkGuestBookingFlow();
            }
        });
    };

    renderGuestDetails = () => {
        return (
            <Flex
                flexDirection={'column'}
                gap={2}
            >
                <Text
                    is={'h2'}
                    fontSize={['md', null, 'lg']}
                    fontWeight={'bold'}
                    lineHeight={['20px', null, '22px']}
                    children={this.getText('clientDetails')}
                    marginBottom={1}
                />
                <Text
                    color={'black'}
                    children={this.getText('continueAsAGuestInfo')}
                />
                <Flex marginBottom={1}>
                    <Link
                        onClick={() => {
                            this.signIn();
                        }}
                        color='blue'
                        children={this.getText('signIn')}
                    />
                    <Text
                        is={'span'}
                        children={'|'}
                        display={'inline-block'}
                        paddingX={2}
                    />
                    <Link
                        onClick={() => {
                            this.register();
                        }}
                        color='blue'
                        children={this.getText('createAnAccount')}
                    />
                </Flex>
                <Text
                    is={'h2'}
                    fontSize={['md', null, 'lg']}
                    fontWeight={'bold'}
                    lineHeight={['20px', null, '22px']}
                    children={this.getText('continueAsAGuest')}
                    marginBottom={3}
                />
                <Flex
                    flexDirection={'column'}
                    gap={2}
                    style={styles.guestInputBox}
                >
                    <TextInput
                        ref={guestFirstNameInput => {
                            if (guestFirstNameInput !== null) {
                                this.guestFirstNameInput = guestFirstNameInput;
                            }
                        }}
                        label={this.getText('firstName')}
                        name='firstName'
                        autoCorrect='off'
                        type='text'
                        value={this.state.guestFirstName}
                        onChange={this.updateGuestField('guestFirstName')}
                        marginBottom={0}
                        validate={value => {
                            if (formValidator.isEmpty(value)) {
                                return this.getText('guestFirstNameErrorText');
                            }

                            return null;
                        }}
                    />
                    <TextInput
                        ref={guestLastNameInput => {
                            if (guestLastNameInput !== null) {
                                this.guestLastNameInput = guestLastNameInput;
                            }
                        }}
                        autoCorrect='off'
                        label={this.getText('lastName')}
                        name='lastName'
                        type='text'
                        value={this.state.guestLastName}
                        onChange={this.updateGuestField('guestLastName')}
                        marginBottom={0}
                        validate={value => {
                            if (formValidator.isEmpty(value)) {
                                return this.getText('guestLastNameErrorText');
                            }

                            return null;
                        }}
                    />
                    <TextInput
                        ref={guestEmailInput => {
                            if (guestEmailInput !== null) {
                                this.guestEmailInput = guestEmailInput;
                            }
                        }}
                        autoComplete='email'
                        autoCorrect='off'
                        autoCapitalize='off'
                        name='guest_email'
                        label={this.getText('emailAddress')}
                        type='text'
                        value={this.state.guestEmail}
                        onChange={this.updateGuestField('guestEmail')}
                        marginBottom={0}
                        invalid={!!this.state.guestEmailError}
                        error={this.state.guestEmailError}
                        validate={value => {
                            if (formValidator.isEmpty(value)) {
                                return this.getText('guestEmailErrorText');
                            } else if (!formValidator.isValidEmailAddress(value)) {
                                return this.getText('invalidGuestEmail');
                            }

                            return null;
                        }}
                    />
                </Flex>
            </Flex>
        );
    };

    getTextWithLink = (textLabel, linkPropsArr = []) => {
        const getFormattedText = resourceWrapper(this.getText);

        const linksArr = linkPropsArr.map(({ linkTextLabel, ...props }) => (
            <Link
                {...props}
                {...(props.href && { target: '_blank' })}
                color='blue'
                underline
                children={this.getText(linkTextLabel)}
            />
        ));

        return getFormattedText(textLabel, false, ...linksArr);
    };

    updateGuestField = name => e => {
        const fields = {
            [name]: e.target.value
        };

        if (name === 'guestEmail') {
            fields.guestEmailError = '';
        }

        this.setState(fields);
    };

    handleExit = e => {
        e.preventDefault();

        // Included for legacy support, e.g. Chrome/Edge < 119
        e.returnValue = true;
    };

    removeExitEvent = () => {
        window.removeEventListener('beforeunload', this.handleExit);
    };

    initializeGuestBookingFlow = async () => {
        try {
            const billingCountries = await getCountryList();

            this.setState({
                billingCountries,
                isInitialized: true,
                initialDataLoadError: false
            });
        } catch {
            this.setState({ initialDataLoadError: true });
        }
    };

    componentDidMount() {
        const { serviceInfo, selectedStore } = this.props;
        const { isGuestBookingFlow } = this.state;

        if (Sephora.configurationSettings.isChasePaymentEnabled) {
            loadChaseTokenizer();
        }

        if (isGuestBookingFlow) {
            this.initializeGuestBookingFlow();
        } else {
            this.checkIsSignedIn();
        }

        HappeningBindings.serviceBookingReviewAndPayPageLoadAnalytics(serviceInfo.displayName, selectedStore.storeId, 'service', isGuestBookingFlow);

        window.addEventListener('beforeunload', this.handleExit);
    }

    componentWillUnmount() {
        this.removeExitEvent();
    }

    render() {
        const {
            user, showInfoModal, isWaitlistSpot, serviceInfo, selectedStore, waitlistConfirmationNumber
        } = this.props;

        const {
            billingCountries,
            showAcceptPoliciesError,
            showWaiverOfRightsError,
            userCardToUse,
            securityCode,
            securityCodeInputError,
            showPaymentInfoSection,
            userCreditCards,
            userDefaultAddress,
            isInitialized,
            initialDataLoadError,
            isNewUserFlow,
            phoneNumber,
            showPhoneNumberTooltip,
            isSMSReminderChecked,
            isWaiverOfRightsChecked,
            isAcceptPoliciesChecked,
            isBookingForMinorChecked,
            isIAmTheParentChecked,
            bookingApiErrorMsg,
            securityCodeStatus,
            showCardNotSelectedOrAddedError,
            isCreditCardApiErrorMsg,
            showSecurityCodeError,
            isGuestBookingFlow
        } = this.state;

        const securityCodeLength = isAMEXCard(userCardToUse?.cardType)
            ? formValidator.FIELD_LENGTHS.securityCodeAmex
            : formValidator.FIELD_LENGTHS.securityCode;

        const newCreditCard = newCreditCardTemplate(userDefaultAddress);

        const showSecurityCodeInput = securityCodeStatus === CVV_STATUS.NOT_SUBMITED || securityCodeStatus === CVV_STATUS.NOT_CONFIRMED;

        return (
            <>
                <Flex
                    flexDirection={'column'}
                    gap={5}
                >
                    {/* client details */}
                    {!isGuestBookingFlow && (
                        <Flex
                            flexDirection={'column'}
                            gap={2}
                        >
                            <Text
                                is={'h2'}
                                fontSize={['md', null, 'lg']}
                                fontWeight={'bold'}
                                lineHeight={['20px', null, '22px']}
                                children={this.getText('clientDetails')}
                            />
                            <Flex
                                flexDirection={'column'}
                                gap={1}
                            >
                                {this.renderClientDetails('firstName', user.firstName)}
                                {this.renderClientDetails('lastName', user.lastName)}
                                {this.renderClientDetails('emailAddress', user.email)}
                            </Flex>
                        </Flex>
                    )}
                    {isGuestBookingFlow && this.renderGuestDetails()}
                    {/* text notifications */}
                    <Flex
                        flexDirection={'column'}
                        gap={4}
                    >
                        <Text
                            is={'h3'}
                            fontSize={'16px'}
                            fontWeight={'bold'}
                            lineHeight={'20px'}
                            children={this.getText('textNotifications')}
                        />
                        <MobilePhoneInput
                            name='phone_number'
                            required={true}
                            hideAsterisk={true}
                            value={phoneNumber}
                            initialValue={phoneNumber}
                            label={this.getText('phoneNumber')}
                            infoText={showPhoneNumberTooltip ? this.getText('phoneInfoText') : null}
                            onChange={this.handlePhoneNumber}
                            customStyle={{ root: styles.phoneNumberRoot, innerWrap: styles.phoneNumbeInnerWrap }}
                            marginBottom={0}
                            error={this.state.guestPhoneError}
                            invalid={!!this.state.guestPhoneError}
                            ref={phoneNumberInput => {
                                if (phoneNumberInput !== null) {
                                    this.phoneNumberInput = phoneNumberInput;
                                }
                            }}
                            validate={value => {
                                if (formValidator.isEmpty(value) || value.length !== formValidator.FIELD_LENGTHS.formattedPhone) {
                                    return this.getText('invalidPhoneNumberError');
                                }

                                return null;
                            }}
                        />
                        <Flex
                            flexDirection={'column'}
                            gap={3}
                        >
                            <Checkbox
                                checked={isSMSReminderChecked}
                                onChange={this.handleCheckboxChange('isSMSReminderChecked')}
                                name='sms_reminders_consent'
                                paddingY={0}
                                children={this.getText('smsReminder')}
                            />
                            <Text
                                is={'p'}
                                color={'gray'}
                                fontSize={'sm'}
                                lineheight={'13px'}
                                children={this.getTextWithLink('textNotificationsAgreement', [
                                    {
                                        linkTextLabel: 'textTerms',
                                        href: SMS_TCS_EXTERNAL_LINK
                                    },
                                    {
                                        linkTextLabel: 'privacyPolicy',
                                        href: PRIVACY_POLICY_EXTERNAL_LINK
                                    }
                                ])}
                            />
                        </Flex>
                    </Flex>
                </Flex>

                <Divider
                    marginY={[5, null, 6]}
                    marginX={[-4, 0]}
                    thick={true}
                    color={colors.nearWhite}
                />

                {/* waiver of rights checkboxes */}
                <Flex
                    flexDirection={'column'}
                    gap={[4, null, 5]}
                >
                    <Text
                        is={'h2'}
                        fontSize={['md', null, 'lg']}
                        fontWeight={'bold'}
                        lineHeight={['20px', null, '22px']}
                        children={this.getText('weRequireAWaiver')}
                    />
                    <Flex
                        flexDirection={'column'}
                        gap={4}
                    >
                        {showWaiverOfRightsError && this.renderError(this.getText('waiverCheckboxesErrorText'))}
                        <Text
                            is={'h3'}
                            fontSize={'14px'}
                            fontWeight={'bold'}
                            lineHeight={'normal'}
                            textTransform={'capitalize'}
                            children={this.getText('chooseOne')}
                        />
                        <Checkbox
                            checked={isWaiverOfRightsChecked}
                            onChange={this.handleCheckboxChange('isWaiverOfRightsChecked')}
                            name='waiver_of_rights_consent'
                            paddingY={0}
                            children={this.getTextWithLink('worCheckboxText', [
                                {
                                    linkTextLabel: 'worLinkText',
                                    onClick: this.handleWaiverOfRightsClick
                                }
                            ])}
                        />
                        <Checkbox
                            checked={isBookingForMinorChecked}
                            onChange={this.handleCheckboxChange('isBookingForMinorChecked')}
                            name='booking_for_minor_consent'
                            paddingY={0}
                            children={this.getText('worMinorCheckboxText')}
                        />
                        {isBookingForMinorChecked && (
                            <Checkbox
                                checked={isIAmTheParentChecked}
                                onChange={this.handleCheckboxChange('isIAmTheParentChecked')}
                                name='i_am_the_parent_consent'
                                paddingY={0}
                                marginLeft={6}
                                children={this.getTextWithLink('worParentCheckboxText', [
                                    {
                                        linkTextLabel: 'worLinkText',
                                        onClick: this.handleWaiverOfRightsClick
                                    }
                                ])}
                            />
                        )}
                    </Flex>
                </Flex>

                <Divider
                    marginY={[5, null, 6]}
                    marginX={[-4, 0]}
                    thick={true}
                    color={colors.nearWhite}
                />

                {/* payment section */}
                <Flex
                    flexDirection={'column'}
                    gap={5}
                >
                    <Flex
                        flexDirection={'column'}
                        gap={[4, null, 5]}
                    >
                        {/* header */}
                        <Flex justifyContent={'space-between'}>
                            <Text
                                is={'h2'}
                                fontSize={['md', null, 'lg']}
                                fontWeight={'bold'}
                                lineHeight={['20px', null, '22px']}
                                children={this.getText('payment')}
                            />
                            {isInitialized && !isNewUserFlow && !showPaymentInfoSection && (
                                <Link
                                    lineHeight={'18px'}
                                    color='blue'
                                    children={this.getText('change')}
                                    onClick={this.handleSetShowPaymentInfoSection(true)}
                                />
                            )}
                        </Flex>

                        {/* cc form api errors */}
                        {isCreditCardApiErrorMsg && this.renderError(isCreditCardApiErrorMsg)}

                        <Box
                            paddingX={3}
                            paddingY={2}
                            backgroundColor={'nearWhite'}
                            borderRadius={2}
                        >
                            <Text
                                is={'p'}
                                fontSize={['14px']}
                                lineHeight='normal'
                                children={this.getTextWithLink(isGuestBookingFlow ? 'validGuestCreditCard' : 'validCreditCard', [
                                    {
                                        linkTextLabel: 'paymentPolicy',
                                        href: POLICIES_EXTERNAL_LINK
                                    }
                                ])}
                            />
                        </Box>

                        {/* initial required APIs data fetching error */}
                        {!isInitialized && initialDataLoadError && this.renderError(this.getText('initialDataLoadError'))}
                    </Flex>

                    {isInitialized && (
                        <div>
                            {userCardToUse && !showPaymentInfoSection && (
                                <>
                                    {userCardToUse.isDefault && (
                                        <Text
                                            is={'p'}
                                            fontSize={12}
                                            lineHeight={'14px'}
                                            color={'gray'}
                                            marginBottom={[2, null, 4]}
                                            children={this.getText('defaultMethod')}
                                        />
                                    )}
                                    <CreditCard
                                        {...userCardToUse}
                                        marginBottom={[2, null, 4]}
                                    />
                                    {showSecurityCodeInput && (
                                        <Flex gap={3}>
                                            <TextInput
                                                label={this.getText('securityCode')}
                                                autoComplete='cc-csc'
                                                autoCorrect='off'
                                                infoLabel='Security Code'
                                                name='securityCode'
                                                required={true}
                                                hideAsterisk={true}
                                                inputMode='numeric'
                                                marginBottom={null}
                                                invalid={securityCodeInputError}
                                                onKeyDown={formValidator.inputAcceptOnlyNumbers}
                                                onPaste={formValidator.pasteAcceptOnlyNumbers}
                                                maxLength={securityCodeLength}
                                                value={securityCode}
                                                onChange={this.handleCvcChange}
                                                error={
                                                    securityCode?.length > 0 && securityCodeInputError ? this.getText('securityCodeInputError') : null
                                                }
                                                ref={securityCodeInput => {
                                                    if (securityCodeInput !== null) {
                                                        this.securityCodeInput = securityCodeInput;
                                                    }
                                                }}
                                                validate={securityCodeValue => {
                                                    if (formValidator.isEmpty(securityCodeValue)) {
                                                        return errorsUtils.getMessage(errorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE);
                                                    } else if (securityCodeValue.length < securityCodeLength) {
                                                        return errorsUtils.getMessage(errorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE_LENGTH);
                                                    }

                                                    return null;
                                                }}
                                                contentAfter={
                                                    <Box
                                                        marginY={3}
                                                        marginRight={3}
                                                        marginLeft={'4px'}
                                                    >
                                                        <Image src={'/img/ufe/payments/securityCode.svg'} />
                                                    </Box>
                                                }
                                            />
                                            <Button
                                                variant={'primary'}
                                                maxWidth={144}
                                                width={'100%'}
                                                paddingX={'20px'}
                                                paddingY={0}
                                                children={this.getText('confirm')}
                                                onClick={this.confirmSecurityCode}
                                            />
                                        </Flex>
                                    )}
                                    {showSecurityCodeError && (
                                        <Box
                                            marginTop={4}
                                            children={this.renderError(this.getText('securityCodeNotConfirmed'))}
                                        />
                                    )}
                                </>
                            )}

                            {!isNewUserFlow && showPaymentInfoSection && (
                                <PaymentInfo
                                    billingCountries={billingCountries}
                                    userDefaultAddress={userDefaultAddress}
                                    userCreditCards={userCreditCards}
                                    setSelectedCreditCard={this.handleSetUserCardToUse}
                                    removeSelectedCreditCard={this.handleRemoveCreditCard}
                                    showInfoModal={showInfoModal}
                                    newCreditCard={newCreditCard}
                                    succesCallback={this.onAddOrEditSuccessCallback}
                                    setCreditCardApiErrorMsg={this.setCreditCardApiErrorMsg}
                                    clearErrors={this.clearCreditCardErrorMessges}
                                />
                            )}

                            {isNewUserFlow && !showPaymentInfoSection && (
                                <CreditCardForm
                                    editStore={formsUtils.getStoreEditSectionName(formsUtils.FORMS.CHECKOUT.CREDIT_CARD, true)}
                                    creditCard={newCreditCard}
                                    shippingAddress={userDefaultAddress}
                                    isUseShippingAddressAsBilling={!!userDefaultAddress}
                                    isFirstCreditCard={true}
                                    isNewUserFlow={true}
                                    isDefault={true}
                                    billingCountries={billingCountries}
                                    succesCallback={this.onAddOrEditSuccessCallback}
                                    setCreditCardApiErrorMsg={this.setCreditCardApiErrorMsg}
                                    isGuestMode={isGuestBookingFlow}
                                />
                            )}
                        </div>
                    )}

                    {isInitialized && showCardNotSelectedOrAddedError && this.renderError(this.getText('cardNotSelectedErr'))}

                    {/* acceptance checkbox */}
                    <Flex
                        gap={4}
                        flexDirection={'column'}
                    >
                        {showAcceptPoliciesError && this.renderError(this.getText('policiesCheckboxErrorText'))}
                        <Checkbox
                            checked={isAcceptPoliciesChecked}
                            onChange={this.handleCheckboxChange('isAcceptPoliciesChecked')}
                            name='accept_policies_consent'
                            paddingY={0}
                            children={this.getTextWithLink('iAcknowledge', [
                                {
                                    linkTextLabel: 'paymentPolicy',
                                    href: POLICIES_EXTERNAL_LINK
                                },
                                {
                                    linkTextLabel: 'onTimePolicy',
                                    href: POLICIES_EXTERNAL_LINK
                                },
                                {
                                    linkTextLabel: 'cancelationPolicy',
                                    href: POLICIES_EXTERNAL_LINK
                                }
                            ])}
                        />
                    </Flex>

                    {/* reservations api errors */}
                    {isInitialized && bookingApiErrorMsg && this.renderError(bookingApiErrorMsg)}
                </Flex>

                {/* cta */}
                <StepsCTA
                    ctaText={this.getText('bookNow')}
                    type={'special'}
                    onClick={this.handleBookNowClickDebounced}
                    smuiBottom={0}
                    additionalCTA={
                        isWaitlistSpot && (
                            <ActionButtons
                                size='sm'
                                variantStyle='link'
                                width='100%'
                                reservationDetails={{
                                    serviceInfo,
                                    store: selectedStore,
                                    confirmationNumber: waitlistConfirmationNumber
                                }}
                                buttons={WAITLIST_BUTTONS.DECLINE_WAITLIST}
                            />
                        )
                    }
                />
            </>
        );
    }
}

const styles = {
    phoneNumberRoot: {
        width: 343
    },
    phoneNumbeInnerWrap: {
        span: {
            'span:nth-child(2)': {
                width: 156
            }
        }
    },
    timeSlotTakenListItem: {
        listStyleType: 'initial'
    },
    guestInputBox: {
        maxWidth: 343
    }
};

ReviewAndPay.defaultProps = {
    user: {},
    onClickCTA: () => {},
    specialRequests: '',
    reservationPreferences: [],
    selectedStore: {},
    selectedTimeSlot: {},
    selectedArtist: {},
    selectedFeature: {},
    // This flag allows to review and pay with a guest account
    isGuestBooking: false
};

export default wrapComponent(ReviewAndPay, 'ReviewAndPay', true);
