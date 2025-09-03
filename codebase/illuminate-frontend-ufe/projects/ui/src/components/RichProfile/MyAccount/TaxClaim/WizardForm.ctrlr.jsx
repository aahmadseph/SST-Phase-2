import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Stepper from 'components/RichProfile/MyAccount/TaxClaim/Steps/Stepper';
import localeUtils from 'utils/LanguageLocale';
import StepMapper from 'components/RichProfile/MyAccount/TaxClaim/Steps/StepMapper';
import { CategoryType, CategoryTypeCA } from 'components/RichProfile/MyAccount/TaxClaim/constants';
import ErrorConstants from 'utils/ErrorConstants';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import FormSubmittedStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/FormSubmittedStep';
import TaxClaimUtils from 'utils/TaxClaim';

class WizardForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            nextIsClicked: false,
            steps: [],
            orderNumber: '',
            firstName: '',
            lastName: '',
            email: '',
            tribeName: '',
            tribeIdNumber: '',
            tribeReserveName: '',
            issueDate: '',
            expirationDate: '',
            additionalComments: '',
            isAgreed: false,
            checkboxError: false,
            veteranExemptionNumber: '',
            veteranEffectiveDate: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            postalCode: '',
            registrationNumber: '',
            aliasName: '',
            registryGroupNumber: '',
            registryBandName: '',
            nameOfReservation: '',
            addressErrors: [],
            organizationPosition: '',
            organizationName: '',
            organizationType: '',
            organizationUrl: '',
            stateIssuedTaxExemptNumber: '',
            phoneNumber: '',
            creditCardIssued: null,
            ccfirstName: '',
            cclastName: '',
            formErrors: null,
            freightName: '',
            freightCertNumber: '',
            formSubmittedSuccessfully: false,
            hasStep4FormErrors: false,
            taxAddressFormErrors: [],
            taxExemptionSelection: null,
            addAddressErrors: [],
            addressId: null,
            addAddress: false,
            setDefaultAddress: false
        };

        this.taxClaimGetText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');
    }

    componentDidMount() {
        this.updateSteps();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.wizardFormData !== this.props.wizardFormData ||
            prevProps.wizardFormErrors !== this.props.wizardFormErrors ||
            prevState.currentStep !== this.state.currentStep ||
            prevProps.selectedCategory !== this.props.selectedCategory ||
            prevState.taxExemptionSelection !== this.state.taxExemptionSelection ||
            prevState.addAddressErrors !== this.state.addAddressErrors ||
            prevState.addressId !== this.state.addressId ||
            prevState.addAddress !== this.state.addAddress // TODO: These checks is only for all the categories in the step 4 that implements the new TaxAddress component (see https://jira.sephora.com/browse/ECSC-5381 and related). We should remove this from here to pass state and props properly in a future refactor.
        ) {
            this.updateSteps();
        }
    }

    updateSteps() {
        const steps = StepMapper({
            taxClaimGetText: this.taxClaimGetText,
            addWizardFormData: this.props.addWizardFormData,
            currentStep: this.state.currentStep,
            selectedCategory: this.props.selectedCategory,
            wizardFormData: this.props.wizardFormData,
            wizardFormErrors: this.props.wizardFormErrors,
            handleOrderNumberChange: this.handleOrderNumberChange,
            handleFreightForwarderChange: this.handleFreightForwarderChange,
            handleUploadDocumentsChange: this.handleUploadDocumentsChange,
            nextStep: this.nextStep,
            handleFirstNameChange: this.handleFirstNameChange,
            handleLastNameChange: this.handleLastNameChange,
            handleEmailChange: this.handleEmailChange,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            clearOrderNumberError: this.clearOrderNumberError,
            userGeneralData: this.props.userGeneralData,
            updateStep4Data: this.props.updateStep4Data,
            handleTribeNameChange: this.handleTribeNameChange,
            handleTribeIdNumberChange: this.handleTribeIdNumberChange,
            handleTribeReserveNameChange: this.handleTribeReserveNameChange,
            handleIssueDateChange: this.handleIssueDateChange,
            handleExpirationDateChange: this.handleExpirationDateChange,
            clearErrors: this.clearErrors,
            handleAdditionalCommentsChange: this.handleAdditionalCommentsChange,
            additionalComments: this.state.additionalComments,
            submitTaxClaimForm: this.submitTaxClaimForm,
            handleVeteranExemptionNumberChange: this.handleVeteranExemptionNumberChange,
            handleVeteranEffectiveDateChange: this.handleVeteranEffectiveDateChange,
            veteranExemptionNumber: this.state.veteranExemptionNumber,
            veteranEffectiveDate: this.state.veteranEffectiveDate,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.city,
            state: this.state.state,
            postalCode: this.state.postalCode,
            addressErrors: this.state.addressErrors,
            handleRegistrationNumberChange: this.handleRegistrationNumberChange,
            handleAliasChange: this.handleAliasChange,
            handleRegistryGroupChange: this.handleRegistryGroupChange,
            handleRegistryBandChange: this.handleRegistryBandChange,
            handleNameOfReservationChange: this.handleNameOfReservationChange,
            handleInitialDateChange: this.handleInitialDateChange,
            handleEndDateChange: this.handleEndDateChange,
            handleAddressChange: this.handleAddressChange,
            handleAddressErrorsFromStepFour: this.handleAddressErrorsFromStepFour,
            step4VariationData: this.props.step4VariationData,
            organizationPosition: this.state.organizationPosition,
            organizationName: this.state.organizationName,
            organizationType: this.state.organizationType,
            organizationUrl: this.state.organizationUrl,
            stateIssuedTaxExemptNumber: this.state.stateIssuedTaxExemptNumber,
            phoneNumber: this.state.phoneNumber,
            creditCardIssued: this.state.creditCardIssued,
            ccfirstName: this.state.ccfirstName,
            cclastName: this.state.cclastName,
            handleOrganizationPositionChange: this.handleOrganizationPositionChange,
            handleOrganizationNameChange: this.handleOrganizationNameChange,
            handleOrganizationTypeChange: this.handleOrganizationTypeChange,
            handleOrganizationUrlChange: this.handleOrganizationUrlChange,
            handleStateIssuedTaxExemptNumberChange: this.handleStateIssuedTaxExemptNumberChange,
            handlePhoneNumberChange: this.handlePhoneNumberChange,
            handleCreditCardIssuedChange: this.handleCreditCardIssuedChange,
            handleCCFirstNameChange: this.handleCCFirstNameChange,
            handleCCLastNameChange: this.handleCCLastNameChange,
            formErrors: this.state.formErrors, // genral form errors state for all step4 form variations
            handleFreightForwarderNameChange: this.handleFreightForwarderNameChange,
            handleFreightCertNumberChange: this.handleFreightCertNumberChange,
            freightName: this.state.freightName,
            freightCertNumber: this.state.freightCertNumber,
            categoryTypes: this.props?.categoryTypes,
            handleFinalStepCheckBoxChange: this.handleFinalStepCheckBoxChange,
            isFreightForwarderCert: this.isFreightForwarderCert,
            hasStep4FormErrors: this.state.hasStep4FormErrors,
            handleTaxExemptionSelection: this.handleTaxExemptionSelectionChange,
            taxAddressFormErrors: this.state.taxAddressFormErrors,
            taxExemptionSelection: this.state.taxExemptionSelection,
            handleTaxAddressChange: this.handleTaxAddressChange,
            handleAddAddressChange: this.handleAddAddressChange,
            handleAddressIdChange: this.handleAddressIdChange,
            addAddressErrors: this.state.addAddressErrors,
            addAddress: this.state.addAddress,
            addressId: this.state.addressId,
            setDefaultAddress: this.state.setDefaultAddress,
            handleSetDefaultAddressChange: this.handleSetDefaultAddressChange,
            setDefaultShippingAddress: this.props.setDefaultShippingAddress
        });

        // Update steps with isStepCompleted property
        const updatedSteps = steps.map((step, _index) => {
            return { ...step, isStepCompleted: this.state.steps[_index]?.isStepCompleted || false };
        });

        this.setState({ steps: updatedSteps });
    }

    isFreightForwarderCert = () => {
        const CERTIFICATE = 'CERTIFICATE';

        return this.props.wizardFormData.freightForwarderType === CERTIFICATE;
    };

    handleAddressChange = (field, value) => {
        this.clearErrors();
        this.setState({ [field]: value }, () => {
            this.validateAddress();
        });
    };

    handleTaxAddressChange = (field, value) => {
        this.setState({ [field]: value });
    };

    handleSetDefaultAddressChange = value => {
        this.setState({ setDefaultAddress: value });
    };

    handleAddAddressChange = value => {
        this.setState({ addAddress: value });
    };

    handleAddressIdChange = value => {
        this.setState({ addressId: value, taxAddressFormErrors: [] });
    };

    validateTaxAddress = () => {
        const errors = this.validateTaxExemptionAddress();
        this.setState({ taxAddressFormErrors: errors });

        return errors;
    };

    validateAddress = () => {
        const errors = this.collectAddressErrors();
        this.setState({ addressErrors: errors });

        return errors;
    };

    // Callback handler for address errors from Step Four variations using the tax address form
    handleAddressErrorsFromStepFour = (fieldName, error) => {
        this.setState(
            prevState => {
                // Create a new array that excludes the current field's errors
                const updatedAddressErrors = prevState.addressErrors.filter(errorMessage => !errorMessage.startsWith(fieldName));

                // If there's a new error, add it to the array
                if (error) {
                    updatedAddressErrors.push(error);
                }

                return {
                    addressErrors: updatedAddressErrors
                };
            },
            () => {
                this.handleStepsAndDispatch(this.state.formErrors, null);
            }
        );
    };

    handleVeteranExemptionNumberChange = newValue => {
        this.setState({ veteranExemptionNumber: newValue }, () => {
            const error = this.validateVeteranExemptionNumber();
            this.handleErrorUpdate('veteranExemptionNumber', error);
        });
    };

    handleVeteranEffectiveDateChange = newValue => {
        this.setState({ veteranEffectiveDate: newValue }, () => {
            const error = this.validateVeteranEffectiveDate();
            this.handleErrorUpdate('veteranEffectiveDate', error);
        });
    };

    validateVeteranExemptionNumber = () => {
        return TaxFormValidator.validateExemptionNumber(this.state.veteranExemptionNumber);
    };

    validateVeteranEffectiveDate = () => {
        return TaxFormValidator.validateEffectiveDate(this.state.veteranEffectiveDate);
    };

    handleErrorUpdate = (field, error) => {
        this.setState(prevState => ({
            wizardFormErrors: {
                ...prevState.wizardFormErrors,
                [field]: error || null
            }
        }));
    };

    handleFinalStepCheckBoxChange = isAgreed => {
        this.setState({ isAgreed: Boolean(isAgreed) });
    };

    validateCheckbox = () => {
        const { isAgreed } = this.state;

        if (!isAgreed) {
            this.setState({ checkboxError: true });

            return true; // Indicate error exists
        }

        return false;
    };

    handleAdditionalCommentsChange = additionalComments => {
        this.setState({ additionalComments }, () => {
            const validateCommentsError = this.validateAdditionalComments();

            // Update formErrors and dispatch actions based on validation result
            this.setState(
                prevState => ({
                    formErrors: {
                        ...prevState.formErrors,
                        additionalCommentsErrors: validateCommentsError || ''
                    }
                }),
                () => {
                    if (!validateCommentsError) {
                        this.handleStepsAndDispatch(this.state.formErrors, validateCommentsError);
                    }
                }
            );
        });
    };

    handleFirstNameChange = firstName => {
        this.setState({ firstName });
    };

    handleLastNameChange = lastName => {
        this.setState({ lastName });
    };

    handleCCFirstNameChange = ccfirstName => {
        this.setState({ ccfirstName });
    };

    handleCCLastNameChange = cclastName => {
        this.setState({ cclastName });
    };

    handleEmailChange = email => {
        this.setState({ email });
    };

    handleOrderNumberChange = orderNumber => {
        this.setState({ orderNumber }, () => {
            const orderNumberError = this.validateOrderNumber();

            if (orderNumberError) {
                this.handleStepsAndDispatch(this.state.formErrors, orderNumberError);
            }
        });
    };

    handleTribeNameChange = tribeName => {
        this.setState({ tribeName }, () => {
            const tribeNameError = this.validateTribeName();

            if (tribeNameError) {
                this.handleStepsAndDispatch(this.state.formErrors, tribeNameError);
            }
        });
    };

    handleTribeIdNumberChange = tribeIdNumber => {
        this.setState({ tribeIdNumber });
    };

    handleTribeReserveNameChange = tribeReserveName => {
        this.setState({ tribeReserveName }, () => {
            const tribeReserveNameError = this.validateTribeReserveName();

            if (tribeReserveNameError) {
                this.handleStepsAndDispatch(this.state.formErrors, tribeReserveNameError);
            }
        });
    };

    handleRegistrationNumberChange = registrationNumber => {
        this.setState({ registrationNumber }, () => {
            const registrationNumberError = this.validateRegistrationNumber();

            if (registrationNumberError) {
                this.handleStepsAndDispatch(this.state.formErrors, registrationNumberError);
            }
        });
    };

    handleAliasChange = aliasName => {
        this.setState({ aliasName: aliasName });
    };

    handleRegistryGroupChange = registryGroupNumber => {
        this.setState({ registryGroupNumber }, () => {
            const registryGroupError = this.validateRegistryGroup();

            if (registryGroupError) {
                this.handleStepsAndDispatch(this.state.formErrors, registryGroupError);
            }
        });
    };

    handleRegistryBandChange = registryBandName => {
        this.setState({ registryBandName }, () => {
            const registryBandError = this.validateRegistryBand();

            if (registryBandError) {
                this.handleStepsAndDispatch(this.state.formErrors, registryBandError);
            }
        });
    };

    handleNameOfReservationChange = nameOfReservation => {
        this.setState({ nameOfReservation }, () => {
            const nameOfReservationError = this.validateNameOfReservation();

            if (nameOfReservationError) {
                this.handleStepsAndDispatch(this.state.formErrors, nameOfReservationError);
            }
        });
    };

    handleInitialDateChange = issueDate => {
        this.setState({ issueDate }, () => {
            const issueDateError = this.validateIssueDate(); //This only validates if the date is not empty

            if (issueDateError) {
                this.handleStepsAndDispatch(this.state.formErrors, issueDateError);
            }
        });
    };

    handleEndDateChange = expirationDate => {
        this.setState({ expirationDate }, () => {
            const issueDateError = this.validateIssueDate(); //This only validates if the date is not empty

            if (issueDateError) {
                this.handleStepsAndDispatch(this.state.formErrors, issueDateError);
            }
        });
    };

    handleIssueDateChange = issueDate => {
        this.setState({ issueDate }, () => {
            const issueDateError = this.validateIssueDate();

            if (issueDateError) {
                this.handleStepsAndDispatch(this.state.formErrors, issueDateError);
            }
        });
    };

    handleExpirationDateChange = expirationDate => {
        this.setState({ expirationDate }, () => {
            const expirationDateError = this.validateExpirationDate();

            if (expirationDateError) {
                this.handleStepsAndDispatch(this.state.formErrors, expirationDateError);
            }
        });
    };

    handleOrganizationPositionChange = organizationPosition => {
        this.setState({ organizationPosition }, () => {
            const organizationPositionError = this.validateOrganizationPosition();

            if (organizationPositionError) {
                this.handleStepsAndDispatch(this.state.formErrors, organizationPositionError);
            }
        });
    };

    handleOrganizationNameChange = organizationName => {
        this.setState({ organizationName }, () => {
            const organizationNameError = this.validateOrganizationName();

            if (organizationNameError) {
                this.handleStepsAndDispatch(this.state.formErrors, organizationNameError);
            }
        });
    };

    handleOrganizationTypeChange = organizationType => {
        this.setState({ organizationType });
    };

    handleOrganizationUrlChange = organizationUrl => {
        this.setState({ organizationUrl }, () => {
            const organizationUrlError = this.validateOrganizationUrl();

            if (organizationUrlError) {
                this.handleStepsAndDispatch(this.state.formErrors, organizationUrlError);
            }
        });
    };

    handleStateIssuedTaxExemptNumberChange = stateIssuedTaxExemptNumber => {
        this.setState({ stateIssuedTaxExemptNumber });
    };

    handlePhoneNumberChange = phoneNumber => {
        this.setState({ phoneNumber });
    };

    clearErrors = (category = null, errorType = null) => {
        // Leaving this for now so we can see what category and error type we clear (8.15.24 -ST)
        //Sephora.logger.verbose(`Clearing errors for category: ${category}, errorType: ${errorType}`);
        this.setState(
            prevState => {
                const updatedErrors = { ...prevState.formErrors };

                if (category && updatedErrors[category]) {
                    if (errorType) {
                        if (updatedErrors[category] && updatedErrors[category][errorType] !== undefined) {
                            updatedErrors[category][errorType] = false; // Clear specific error
                        }
                    } else {
                        // Clear all errors under a category
                        Object.keys(updatedErrors[category]).forEach(key => {
                            updatedErrors[category][key] = false; // Clear all errors
                        });

                        // Remove the category if all errors are cleared
                        if (!Object.values(updatedErrors[category]).some(err => err !== false)) {
                            delete updatedErrors[category];
                        }
                    }
                } else {
                    // Clear all errors
                    Object.keys(updatedErrors).forEach(key => {
                        if (updatedErrors[key] && typeof updatedErrors[key] === 'object') {
                            Object.keys(updatedErrors[key]).forEach(subKey => {
                                updatedErrors[key][subKey] = false; // Clear all errors
                            });

                            // Remove the key if all errors are cleared
                            if (!Object.values(updatedErrors[key]).some(err => err !== false)) {
                                delete updatedErrors[key];
                            }
                        } else {
                            updatedErrors[key] = false; // Clear non-object errors
                        }
                    });
                }

                return { formErrors: updatedErrors };
            },
            () => {
                this.handleStepsAndDispatch(this.state.formErrors, errorType);
            }
        );
    };

    clearOrderNumberError = () => {
        this.handleStepsAndDispatch(this.state.formErrors, 'orderNumberErrors');
    };

    handleFreightForwarderChange = freightForwarderType => {
        this.setState({ freightForwarderType });
    };

    handleUploadDocumentsChange = uploadDocuments => {
        this.setState({ uploadDocuments });
    };

    handleCreditCardIssuedChange = creditCardIssued => {
        this.setState({ creditCardIssued }, () => {
            const creditCardIssuedError = this.validateCreditCardIssued();

            if (creditCardIssuedError) {
                this.handleStepsAndDispatch(this.state.formErrors, creditCardIssuedError);
            }
        });
    };

    handleStepCompleted = index => {
        const updatedSteps = this.state.steps.map((step, stepIndex) => (index === stepIndex ? { ...step, isStepCompleted: true } : step));

        this.setState({ steps: updatedSteps });
    };

    checkForIssueDateErrors = combinedErrors => {
        const errorCodes = {
            issueDateEmpty: ErrorConstants.ERROR_CODES.ISSUE_DATE_EMPTY,
            issueDateOutOfBounds: ErrorConstants.ERROR_CODES.ISSUE_DATE_OUT_OF_BOUNDS
        };

        const issueDateErrors = {
            issueDateEmpty: combinedErrors.includes(errorCodes.issueDateEmpty),
            issueDateOutOfBounds: combinedErrors.includes(errorCodes.issueDateOutOfBounds)
        };

        return issueDateErrors;
    };

    checkForExpirationDateErrors = combinedErrors => {
        const errorCodes = {
            expirationDateEmpty: ErrorConstants.ERROR_CODES.EXPIRATION_DATE_EMPTY,
            expirationDateInvalid: ErrorConstants.ERROR_CODES.EXPIRATION_DATE_INVALID,
            expirationDateOutOfBounds: ErrorConstants.ERROR_CODES.EXPIRATION_DATE_OUT_OF_BOUNDS
        };

        const expirationDateErrors = {
            expirationDateEmpty: combinedErrors.includes(errorCodes.expirationDateEmpty),
            expirationDateInvalid: combinedErrors.includes(errorCodes.expirationDateInvalid),
            expirationDateOutOfBounds: combinedErrors.includes(errorCodes.expirationDateOutOfBounds)
        };

        return expirationDateErrors;
    };

    checkForTribeNameErrors = combinedErrors => {
        const errorCodes = {
            tribeNameEmpty: ErrorConstants.ERROR_CODES.TRIBE_NAME_EMPTY
        };

        const tribeNameErrors = {
            tribeNameEmpty: combinedErrors.includes(errorCodes.tribeNameEmpty)
        };

        return tribeNameErrors;
    };

    checkForTribeReserveNameErrors = combinedErrors => {
        const errorCodes = {
            tribeReserveNameEmpty: ErrorConstants.ERROR_CODES.TRIBE_RESERVE_NAME_EMPTY
        };

        const tribeReserveNameErrors = {
            tribeReserveNameEmpty: combinedErrors.includes(errorCodes.tribeReserveNameEmpty)
        };

        return tribeReserveNameErrors;
    };

    checkForDisabledVetsErrors = combinedErrors => {
        const errorCodes = {
            taxEffectiveDateEmpty: ErrorConstants.ERROR_CODES.EFFECTIVE_DATE_EMPTY,
            taxExemptionNumberEmpty: ErrorConstants.ERROR_CODES.EXEMPTION_NUMBER_EMPTY,
            taxExemptionNumberInvalid: ErrorConstants.ERROR_CODES.EXEMPTION_NUMBER_INVALID,
            taxEffectiveDateInvalid: ErrorConstants.ERROR_CODES.EFFECTIVE_DATE_INVALID
        };

        const disabledVetsErrors = {
            taxEffectiveDateEmpty: combinedErrors.includes(errorCodes.taxEffectiveDateEmpty),
            taxExemptionNumberEmpty: combinedErrors.includes(errorCodes.taxExemptionNumberEmpty),
            taxExemptionNumberInvalid: combinedErrors.includes(errorCodes.taxExemptionNumberInvalid),
            taxEffectiveDateInvalid: combinedErrors.includes(errorCodes.taxEffectiveDateInvalid)
        };

        return disabledVetsErrors;
    };

    checkForTaxAddressFormErrors = combinedErrors => {
        const errorCodes = {
            taxAddress1Empty: ErrorConstants.ERROR_CODES.TAX_ADDRESS_1_EMPTY,
            taxCityEmpty: ErrorConstants.ERROR_CODES.TAX_CITY_EMPTY,
            taxStateEmpty: ErrorConstants.ERROR_CODES.TAX_STATE_EMPTY,
            taxZipCodeEmpty: ErrorConstants.ERROR_CODES.TAX_ZIP_CODE_EMPTY
        };

        const addressErrors = {
            taxAddress1Empty: combinedErrors.includes(errorCodes.taxAddress1Empty),
            taxCityEmpty: combinedErrors.includes(errorCodes.taxCityEmpty),
            taxStateEmpty: combinedErrors.includes(errorCodes.taxStateEmpty),
            taxZipCodeEmpty: combinedErrors.includes(errorCodes.taxZipCodeEmpty)
        };

        return addressErrors;
    };

    checkForNPRCOErrors = combinedErrors => {
        const errorCodes = {
            organizationPositionEmpty: ErrorConstants.ERROR_CODES.ORGANIZATION_POSITION_EMPTY,
            organizationNameEmpty: ErrorConstants.ERROR_CODES.ORGANIZATION_NAME_EMPTY,
            organizationUrlEmpty: ErrorConstants.ERROR_CODES.ORGANIZATION_URL_EMPTY,
            creditCardIssuedEmpty: ErrorConstants.ERROR_CODES.CREDIT_CARD_ISSUED_EMPTY
        };

        const nprcoErrors = {
            organizationPositionEmpty: combinedErrors.includes(errorCodes.organizationPositionEmpty),
            organizationNameEmpty: combinedErrors.includes(errorCodes.organizationNameEmpty),
            organizationUrlEmpty: combinedErrors.includes(errorCodes.organizationUrlEmpty),
            creditCardIssuedEmpty: combinedErrors.includes(errorCodes.creditCardIssuedEmpty)
        };

        return nprcoErrors;
    };

    checkForFNMErrors = combinedErrors => {
        const errorCodes = {
            registrationNumberEmpty: ErrorConstants.ERROR_CODES.REGISTRATION_NUMBER_EMPTY,
            registrationNumberInvalid: ErrorConstants.ERROR_CODES.REGISTRATION_NUMBER_INVALID,
            registryGroupEmpty: ErrorConstants.ERROR_CODES.REGISTRY_GROUP_EMPTY,
            registryBandNameEmpty: ErrorConstants.ERROR_CODES.REGISTRY_BAND_EMPTY,
            nameOfReservationEmpty: ErrorConstants.ERROR_CODES.NAME_OF_RESERVATION_EMPTY
        };

        return {
            registrationNumberEmpty: combinedErrors.includes(errorCodes.registrationNumberEmpty),
            registrationNumberInvalid: combinedErrors.includes(errorCodes.registrationNumberInvalid),
            registryGroupEmpty: combinedErrors.includes(errorCodes.registryGroupEmpty),
            registryBandNameEmpty: combinedErrors.includes(errorCodes.registryBandNameEmpty),
            nameOfReservationEmpty: combinedErrors.includes(errorCodes.nameOfReservationEmpty)
        };
    };

    checkForFreightForwarderErrors = combinedErrors => {
        const errorCodes = {
            freightForwarderNameEmpty: TaxFormValidator.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_NAME_EMPTY,
            freightForwarderNameInvalid: TaxFormValidator.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_NAME_INVALID,
            freightForwarderCertNumberEmpty: TaxFormValidator.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_CERT_NUMBER_EMPTY,
            freightForwarderCertNumberInvalid: TaxFormValidator.VALIDATION_CONSTANTS.FREIGHT_FORWARDER_CERT_NUMBER_INVALID
        };

        return {
            freightForwarderNameEmpty: combinedErrors.includes(errorCodes.freightForwarderNameEmpty),
            freightForwarderNameInvalid: combinedErrors.includes(errorCodes.freightForwarderNameInvalid),
            freightForwarderCertNumberEmpty: combinedErrors.includes(errorCodes.freightForwarderCertNumberEmpty),
            freightForwarderCertNumberInvalid: combinedErrors.includes(errorCodes.freightForwarderCertNumberInvalid)
        };
    };

    // Extracts errors for a specific key from combinedErrors based on provided error codes
    getBuildStepErrorsForKey = (key, codes, combinedErrors) => {
        // If combinedErrors is not provided, return null
        if (!combinedErrors) {
            return null;
        }

        let errors = [];

        // Handle case where combinedErrors is an array
        if (Array.isArray(combinedErrors)) {
            // Filter errors that match the provided codes
            errors = combinedErrors.filter(error => codes.includes(error));
        } else if (typeof combinedErrors === 'object') {
            const errorValue = combinedErrors[key];

            // Handle case where errorValue is an array
            if (Array.isArray(errorValue)) {
                errors = errorValue.filter(error => codes.includes(error));
            } else if (typeof errorValue === 'object' && errorValue !== null) {
                // Handle case where errorValue is an object
                errors = Object.keys(errorValue)
                    .filter(subKey => errorValue[subKey] && codes.includes(subKey))
                    .map(subKey => subKey);
            } else if (errorValue && codes.includes(key)) {
                // Handle case where errorValue is a single value
                errors.push(key);
            }
        }

        // Return errors if any were found, otherwise return null
        return errors.length > 0 ? errors : null;
    };

    // Helper function to build form errors based on error codes
    buildFormErrors = combinedErrors => {
        const errorCodes = {
            orderNumber: [
                ErrorConstants.ERROR_CODES.ORDER_ID_EMPTY,
                ErrorConstants.ERROR_CODES.ORDER_ID_INVALID,
                ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC
            ],
            additionalComments: [ErrorConstants.ERROR_CODES.TAX_ADDITIONAL_COMMENTS_EMPTY],
            step4Date: [ErrorConstants.ERROR_CODES.DATE_RANGE_INVALID]
        };

        const formErrors = {};

        for (const [key, codes] of Object.entries(errorCodes)) {
            formErrors[`${key}Errors`] = this.getBuildStepErrorsForKey(`${key}Errors`, codes, combinedErrors);
        }

        return formErrors;
    };

    // Main buildStepData method
    buildStepData = (combinedErrors, field) => {
        // Initialize formErrors
        let formErrors = this.buildFormErrors(combinedErrors);
        const checkboxError = this.validateCheckbox();

        if (Array.isArray(combinedErrors)) {
            formErrors = {
                ...formErrors,
                tribeNameErrors: this.checkForTribeNameErrors(combinedErrors),
                tribeReserveNameErrors: this.checkForTribeReserveNameErrors(combinedErrors),
                disabledVetsOfOklahomaErrors: this.checkForDisabledVetsErrors(combinedErrors),
                nprcoErrors: this.checkForNPRCOErrors(combinedErrors),
                rErrors: this.checkForNPRCOErrors(combinedErrors),
                slgeiErrors: this.checkForNPRCOErrors(combinedErrors),
                issueDateErrors: this.checkForIssueDateErrors(combinedErrors),
                expirationDateErrors: this.checkForExpirationDateErrors(combinedErrors),
                fnmErrors: this.checkForFNMErrors(combinedErrors),
                freightForwarderErrors: this.checkForFreightForwarderErrors(combinedErrors),
                addressErrors: this.checkForTaxAddressFormErrors(combinedErrors),
                missingFreightForwarder:
                    !this.state.freightForwarderType && this.props.selectedCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER
                        ? this.taxClaimGetText('missingFreightForwarder')
                        : null
            };
        } else {
            // When combinedErrors is not an array
            formErrors = {
                ...formErrors,
                disabledVetsOfOklahomaErrors: combinedErrors?.disabledVetsOfOklahomaErrors || null,
                tribeNameErrors: combinedErrors?.tribeNameErrors || null,
                tribeReserveNameErrors: combinedErrors?.tribeReserveNameErrors || null,
                issueDateErrors: combinedErrors?.issueDateErrors || null,
                expirationDateErrors: combinedErrors?.expirationDateErrors || null,
                nprcoErrors: combinedErrors?.nprcoErrors || null,
                rErrors: combinedErrors?.rErrors || null,
                fnmErrors: combinedErrors?.fnmErrors || null,
                freightForwarderErrors: combinedErrors?.freightForwarderErrors || null,
                addressErrors: combinedErrors?.addressErrors || null,
                checkboxError
            };
        }

        // Clear errors for the specified field if provided
        if (field) {
            formErrors[field] = null;
        }

        // Update state with formErrors
        this.setState({ formErrors });

        const hasStep4FormErrors = TaxClaimUtils.deeplyCheckFormErrors(formErrors, ['checkboxError']);
        this.setState({ hasStep4FormErrors });

        // Return the complete step data
        return {
            currentStep: this.state.currentStep,
            category: this.props.selectedCategory,
            formData: {
                orderNumber: this.state.orderNumber,
                taxExemptionCategory: this.props.selectedCategory,
                uploadDocuments: this.state.uploadDocuments,
                freightForwarderType: this.state.freightForwarderType,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                additionalComments: this.state.additionalComments,
                registrationNumber: this.state.registrationNumber,
                aliasName: this.state.aliasName,
                registryGroupNumber: this.state.registryGroupNumber,
                registryBandName: this.state.registryBandName,
                nameOfReservation: this.state.nameOfReservation,
                issueDate: this.state.issueDate,
                expirationDate: this.state.expirationDate,
                tribeIdNumber: this.state.tribeIdNumber,
                tribeName: this.state.tribeName,
                tribeReserveName: this.state.tribeReserveName
            },
            formErrors
        };
    };

    advanceStep = step => {
        const newStepIndex = step !== undefined ? step : Math.min(this.state.currentStep + 1, this.state.steps.length - 1);

        // Ensure the previous step is marked as completed if necessary
        this.handleStepCompleted(this.state.currentStep);

        this.setState({
            currentStep: newStepIndex,
            nextIsClicked: false
        });
    };

    validateAdditionalComments = () => {
        return TaxFormValidator.validateTaxComments(this.state.additionalComments, this.props.selectedCategory);
    };

    validateOrderNumber = () => {
        const genericOrderNumberErrorExists = this.props.wizardFormErrors?.formErrors?.genericOrderNumberErrorExists;

        return TaxFormValidator.validateOrderNumber(this.state.orderNumber, genericOrderNumberErrorExists);
    };

    validateOrderSelection = () => {
        return this.props.wizardFormData.selectedOrders.length === 0 ? ErrorConstants.ERROR_CODES.ORDER_ID_EMPTY : null;
    };

    validateTribeName = () => {
        return TaxFormValidator.validateTribeName(this.state.tribeName);
    };

    validateTribeReserveName = () => {
        return TaxFormValidator.validateTribeReserveName(this.state.tribeReserveName);
    };

    validateRegistrationNumber = () => {
        return TaxFormValidator.validateRegistrationNumber(this.state.registrationNumber);
    };

    validateRegistryGroup = () => {
        return TaxFormValidator.validateRegistryGroup(this.state.registryGroupNumber);
    };

    validateRegistryBand = () => {
        return TaxFormValidator.validateRegistryBand(this.state.registryBandName);
    };

    validateNameOfReservation = () => {
        return TaxFormValidator.validateNameOfReservation(this.state.nameOfReservation);
    };

    validateIssueDate = () => {
        return TaxFormValidator.validateIssueDate(this.state.issueDate);
    };

    validateExpirationDate = () => {
        return TaxFormValidator.validateExpirationDate(this.state.expirationDate, this.state.issueDate);
    };

    validateStep4Dates = () => {
        return TaxFormValidator.validateOnlyDateGap(this.state.expirationDate, this.state.issueDate);
    };

    validateFreightForwarderType = () => {
        return !this.state.freightForwarderType && this.props.selectedCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER;
    };

    validateFreightName = () => {
        return TaxFormValidator.validateFreightForwarderName(this.state.freightName);
    };

    validateFreightCertNumber = () => {
        return TaxFormValidator.validateFreightForwarderCertNumber(this.state.freightCertNumber);
    };

    handleFreightFieldChange = (fieldName, validateFn) => value => {
        this.setState({ [fieldName]: value }, () => {
            const error = validateFn();

            if (error) {
                this.handleStepsAndDispatch(this.state.formErrors, error);
            }
        });
    };

    handleFreightForwarderNameChange = this.handleFreightFieldChange('freightName', this.validateFreightName);
    handleFreightCertNumberChange = this.handleFreightFieldChange('freightCertNumber', this.validateFreightCertNumber);

    validateUploadDocuments = () => {
        return !this.state.uploadDocuments;
    };

    validateOrganizationPosition = () => {
        return TaxFormValidator.validateOrganizationPosition(this.state.organizationPosition);
    };

    validateOrganizationName = () => {
        return TaxFormValidator.validateOrganizationName(this.state.organizationName);
    };

    validateOrganizationUrl = () => {
        return TaxFormValidator.validateOrganizationUrl(this.state.organizationUrl);
    };

    validateCreditCardIssued = () => {
        return TaxFormValidator.validateCreditCardIssued(this.state.creditCardIssued);
    };

    handleStepsAndDispatch = (combinedErrors, field) => {
        const stepData = this.buildStepData(combinedErrors, field);
        this.props.addWizardFormData(this.props.selectedCategory, {
            stepData: [stepData]
        });
    };

    goToStep = step => {
        this.setState({ currentStep: step });
    };

    nextStep = async () => {
        this.setState({ nextIsClicked: true });
        const { currentStep } = this.state;

        const currentStepComponent = this.state.steps[this.state.currentStep].content['edit'];
        const isOrderInputStep = currentStep === 2; // currentStepComponent?.type.componentName.startsWith('OrderNumberInputStep');
        const isUploadDocumentsStep = currentStepComponent?.type.componentName.startsWith('UploadDocumentsStep');
        const isTaxExemptionInfoStep = currentStepComponent?.type.componentName.startsWith('TaxExemptionInfoStep');
        const isAdditionalCommentsStep = currentStepComponent?.type.componentName.startsWith('AdditionalCommentsStep');

        // Collect errors
        const errors = this.collectErrors(isOrderInputStep, isUploadDocumentsStep, isTaxExemptionInfoStep, isAdditionalCommentsStep);

        // If there are errors from any step handle them and do not advance
        if (errors.length > 0) {
            this.handleStepsAndDispatch(errors, null);

            return;
        }

        // Proceed with API call if on Order Input Step
        if (!TaxClaimUtils.isTaxExemptionEnabled()) {
            if (isOrderInputStep && !(await this.fetchOrderDetailsAndAdvance())) {
                return;
            }
        }

        const { selectedCategory } = this.props;

        // It should go to step 5 when the user is on step 3 and the user selected other as category type
        if (selectedCategory === CategoryType.OTHER && currentStep === 2) {
            this.skipToStep5();
        }

        // It should create a new address for tax exemption
        const addressEligibleCategories = [
            CategoryType.INDIGENOUS_AMERICAN,
            CategoryTypeCA.FIRST_NATION_MEMBERS,
            CategoryType.DISABLED_VETERANS_OKLAHOMA
        ];

        if (
            addressEligibleCategories.includes(this.props.selectedCategory) &&
            isTaxExemptionInfoStep &&
            this.state.taxExemptionSelection &&
            this.state.addAddress
        ) {
            const response = await this.handleAddressCreation();

            if (!response) {
                return;
            }
        }

        const isExportSaleFreightForwarder = selectedCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER;
        const isCertificateFreightForwarder = this.isFreightForwarderCert();

        if (isOrderInputStep && isExportSaleFreightForwarder && isCertificateFreightForwarder) {
            this.skipToStep5();
        }

        // Proceed to the next step
        this.advanceStep();
    };

    handleAddressCreation = async () => {
        const {
            city, state, address1, address2, postalCode, phoneNumber, firstName, lastName, setDefaultAddress
        } = this.state;

        try {
            const response = await this.props.addShippingAddress({
                address: {
                    city,
                    state,
                    address1,
                    address2,
                    postalCode,
                    phone: phoneNumber,
                    firstName,
                    lastName,
                    country: localeUtils.getCurrentCountry().toUpperCase(),
                    addressValidated: false,
                    isDefaultAddress: setDefaultAddress
                }
            });

            if (response.errorCode === -1) {
                this.setState({ addAddressErrors: response.errorMessages });

                return false;
            }

            this.setState({ addressId: response.addressId });

            return true;
        } catch (error) {
            return false;
        }
    };

    // Helper function to collect errors based on current step
    collectErrors = (isOrderInputStep, isUploadDocumentsStep, isTaxExemptionInfoStep, isAdditionalCommentsStep) => {
        const errors = [];

        // Validate for Order Input Step
        if (isOrderInputStep) {
            const orderNumberError = TaxClaimUtils.isTaxExemptionEnabled() ? this.validateOrderSelection() : this.validateOrderNumber();

            if (orderNumberError) {
                errors.push(orderNumberError);
            }
        }

        // Consolidate Freight Forwarder and Upload Documents validation
        if (isUploadDocumentsStep) {
            const freightForwarderError = this.validateFreightForwarderType();
            const isFreightForwarderCateory = this.props.selectedCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER;

            if (freightForwarderError) {
                errors.push(freightForwarderError);
            }

            const uploadDocumentsErrors = this.validateUploadDocuments();

            // FF category doesn't require upload documents validation
            if (uploadDocumentsErrors && !isFreightForwarderCateory) {
                errors.push(uploadDocumentsErrors);
            }
        }

        // Validate Tax Exemption Info Step
        if (isTaxExemptionInfoStep) {
            const taxExemptionErrors = this.validateTaxExemptionInfoStep();
            errors.push(...taxExemptionErrors);

            if (TaxClaimUtils.isTaxExemptionEnabled()) {
                const taxExemptionAddressErrors = this.validateTaxExemptionInfoStepAddress();

                errors.push(...taxExemptionAddressErrors);
            }
        }

        if (isAdditionalCommentsStep) {
            const commentsError = this.validateAdditionalComments();

            if (commentsError) {
                errors.push(commentsError);
            }
        }

        return errors;
    };

    // Validating Tax Exemption Info Step errors related to TaxAddress only
    validateTaxExemptionInfoStepAddress = () => {
        const errors = [];
        const addressEligibleCategories = [
            CategoryType.INDIGENOUS_AMERICAN,
            CategoryType.DISABLED_VETERANS_OKLAHOMA,
            CategoryTypeCA.FIRST_NATION_MEMBERS
        ];

        if (TaxClaimUtils.isTaxExemptionEnabled()) {
            addressEligibleCategories.push(CategoryType.DISABLED_VETERANS_OKLAHOMA);
        }

        const { selectedCategory } = this.props;

        if (addressEligibleCategories.includes(selectedCategory)) {
            const addressErrors = this.validateTaxAddressErrors();

            if (addressErrors.length) {
                errors.push(addressErrors);

                this.setState({ taxAddressFormErrors: addressErrors });
            }
        }

        return errors;
    };

    // Validating Tax Exemption Info Step in isolation
    validateTaxExemptionInfoStep = () => {
        const errors = [];
        const addressEligibleCategories = [CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE, CategoryType.STATE_LOCAL_EDUCATIONAL, CategoryType.RESELLER];

        if (!TaxClaimUtils.isTaxExemptionEnabled()) {
            addressEligibleCategories.push(CategoryType.DISABLED_VETERANS_OKLAHOMA);
        }

        const { selectedCategory } = this.props;

        // Determine the validation functions based on the selected category
        const validationFunctions = {
            [CategoryType.DISABLED_VETERANS_OKLAHOMA]: this.validateStep4DisabledVeteransOklahoma,
            [CategoryType.INDIGENOUS_AMERICAN]: this.validateStep4IndigenousAmerican,
            [CategoryTypeCA.FIRST_NATION_MEMBERS]: this.validateStep4FirstNationMembers,
            [CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE]: this.validateStep4NonProfitReligiousCharitable,
            [CategoryType.RESELLER]: this.validateStep4NonProfitReligiousCharitable,
            [CategoryType.STATE_LOCAL_EDUCATIONAL]: this.validateStep4NonProfitReligiousCharitable,
            [CategoryType.EXPORT_SALE_FREIGHT_FORWARDER]: this.validateStep4ExportSaleFreightForwarder
        };

        // Common validation for address, if needed
        if (addressEligibleCategories.includes(selectedCategory)) {
            const addressErrors = this.validateAddress();

            if (addressErrors.length > 0) {
                errors.push(...addressErrors);
                this.setState({ addressErrors });
            }
        }

        // Execute the appropriate validation function for the selected category
        if (validationFunctions[selectedCategory]) {
            const categoryErrors = validationFunctions[selectedCategory]();
            errors.push(...categoryErrors);
        }

        return errors;
    };

    validateStep4ExportSaleFreightForwarder = () => {
        const validationFunctions = [
            this.validateFreightName,
            this.validateFreightCertNumber,
            this.validateStep4Dates,
            this.validateIssueDate,
            this.validateExpirationDate
        ];

        const errors = validationFunctions.reduce((acc, validate) => {
            const error = validate();

            if (error) {
                acc.push(error);
            }

            return acc;
        }, []);

        return errors;
    };

    // Validation functions for each category
    validateStep4DisabledVeteransOklahoma = () => {
        const errors = [];
        const veteranExemptionNumberError = this.validateVeteranExemptionNumber();

        if (veteranExemptionNumberError) {
            errors.push(veteranExemptionNumberError);
            this.handleErrorUpdate('veteranExemptionNumber', veteranExemptionNumberError);
        }

        const veteranEffectiveDateError = this.validateVeteranEffectiveDate();

        if (veteranEffectiveDateError) {
            errors.push(veteranEffectiveDateError);
            this.handleErrorUpdate('veteranEffectiveDate', veteranEffectiveDateError);
        }

        return errors;
    };

    validateStep4IndigenousAmerican = () => {
        const validationFunctions = [this.validateTribeName, this.validateTribeReserveName, this.validateIssueDate, this.validateExpirationDate];

        const errors = validationFunctions.reduce((errorList, validateFunction) => {
            const error = validateFunction();

            if (error) {
                errorList.push(error);
            }

            return errorList;
        }, []);

        return errors;
    };

    validateStep4FirstNationMembers = () => {
        const errors = [];
        const issueDateError = this.validateIssueDate();
        const expDateError = this.validateExpirationDate();
        const dateRangeError = this.validateStep4Dates();

        if (issueDateError) {
            errors.push(issueDateError);
        }

        if (expDateError) {
            errors.push(expDateError);
        }

        if (dateRangeError) {
            errors.push(dateRangeError);
        }

        const registrationNumberError = this.validateRegistrationNumber();

        if (registrationNumberError) {
            errors.push(registrationNumberError);
        }

        const registryGroupError = this.validateRegistryGroup();

        if (registryGroupError) {
            errors.push(registryGroupError);
        }

        const registryBandError = this.validateRegistryBand();

        if (registryBandError) {
            errors.push(registryBandError);
        }

        const nameOfReservationError = this.validateNameOfReservation();

        if (nameOfReservationError) {
            errors.push(nameOfReservationError);
        }

        return errors;
    };

    validateStep4NonProfitReligiousCharitable = () => {
        const errors = [];
        const organizationPositionError = this.validateOrganizationPosition();

        if (organizationPositionError) {
            errors.push(organizationPositionError);
        }

        const organizationNameError = this.validateOrganizationName();

        if (organizationNameError) {
            errors.push(organizationNameError);
        }

        const organizationUrlError = this.validateOrganizationUrl();

        if (organizationUrlError) {
            errors.push(organizationUrlError);
        }

        const creditCardIssuedError = this.validateCreditCardIssued();

        if (creditCardIssuedError) {
            errors.push(creditCardIssuedError);
        }

        return errors;
    };

    validateTaxAddressErrors = () => {
        const errors = [];
        const taxExemptionSelectionError = this.validateTaxExemptionSelection();

        if (taxExemptionSelectionError) {
            errors.push(taxExemptionSelectionError);
        }

        if (this.state.taxExemptionSelection) {
            const taxAddressErrors = this.validateTaxExemptionAddress();

            if (taxAddressErrors.length) {
                errors.push(...taxAddressErrors);
            }
        }

        return errors;
    };

    validateTaxExemptionSelection = () => {
        return TaxFormValidator.validateTaxExemptionSelection(this.state.taxExemptionSelection);
    };

    validateTaxExemptionAddress = () => {
        const errors = [];
        const eligibleCategories = [CategoryType.INDIGENOUS_AMERICAN, CategoryType.DISABLED_VETERANS_OKLAHOMA, CategoryTypeCA.FIRST_NATION_MEMBERS];
        const locale = localeUtils.getCurrentCountry();

        const address1Error = TaxFormValidator.validateStreetAddressLine1(this.state.address1);

        if (address1Error) {
            errors.push(address1Error);
        }

        if (
            TaxClaimUtils.isTaxExemptionEnabled() &&
            this.state.taxExemptionSelection &&
            !this.state.addAddress &&
            eligibleCategories.includes(this.props.selectedCategory)
        ) {
            const addressIdError = this.validateTaxExemptionAddressId();

            if (addressIdError) {
                errors.push(addressIdError);
            }
        }

        if (
            TaxClaimUtils.isTaxExemptionEnabled() &&
            this.state.taxExemptionSelection &&
            this.state.addAddress &&
            eligibleCategories.includes(this.props.selectedCategory)
        ) {
            const phoneError = TaxFormValidator.validatePhoneNumber(this.state.phoneNumber);

            if (phoneError) {
                errors.push(phoneError);
            }
        }

        const cityError = TaxFormValidator.validateCity(this.state.city);

        if (cityError) {
            errors.push(cityError);
        }

        const stateError = TaxFormValidator.validateState(this.state.state);

        if (stateError) {
            errors.push(stateError);
        }

        const postalCodeError = TaxFormValidator.validatePostalCode(this.state.postalCode, locale);

        if (postalCodeError) {
            errors.push(postalCodeError);
        }

        return errors;
    };

    validateTaxExemptionAddressId = () => {
        return TaxFormValidator.validateTaxExemptionAddressId(this.state.addressId);
    };

    handleTaxExemptionSelectionChange = value => {
        this.setState({ taxExemptionSelection: value, taxAddressFormErrors: [] });
    };

    collectAddressErrors = () => {
        const errors = [];
        const locale = localeUtils.getCurrentCountry();
        const address1Error = TaxFormValidator.validateStreetAddressLine1(this.state.address1);

        if (address1Error) {
            errors.push(address1Error);
        }

        const cityError = TaxFormValidator.validateCity(this.state.city);

        if (cityError) {
            errors.push(cityError);
        }

        const stateError = TaxFormValidator.validateState(this.state.state);

        // VETS category will have default state value of Oklahoma. Bypass state/province validation
        const stateErrorCheckCondition = (stateError && !this.props.selectedCategory === CategoryType.DISABLED_VETERANS_OKLAHOMA) || stateError;

        if (stateErrorCheckCondition) {
            errors.push(stateError);
        }

        const postalCodeError = TaxFormValidator.validatePostalCode(this.state.postalCode, locale);

        if (postalCodeError) {
            errors.push(postalCodeError);
        }

        return errors; // Return all collected address errors
    };

    fetchOrderDetailsAndAdvance = async () => {
        try {
            await this.props.getOrderDetails();

            return true;
        } catch (error) {
            // IF api call fails return false.
            // (set to true for dev work to bypass step) - delete this comment when dev work is done.
            return false;
        }
    };

    submitTaxClaimForm = async () => {
        try {
            // Validate checkbox and handle errors if validation fails
            if (this.validateCheckbox()) {
                this.handleStepsAndDispatch(this.state.formErrors, null);

                return;
            }

            // Submit the form and await response
            const response = await this.props.submitFinalTaxForm(this.state);

            // If ticketId is present, update state and replace location
            if (response?.ticketId) {
                this.setState({ formSubmittedSuccessfully: true }, () => {
                    const newLocation = { path: window.location.pathname };
                    this.props.replaceLocation(newLocation);
                });

                return;
            }

            throw new Error(response);
        } catch (error) {
            // Extract and log the error message
            const errorMessage = error.message || 'Unknown error occurred';

            this.setState({ formSubmittedSuccessfully: false });
            const errorType = TaxFormValidator.validateSubmitApiErrors(errorMessage);
            const errorTypeLocaleMessage = this.taxClaimGetText(errorType);

            this.props.handleApiSubmitError(errorType, errorTypeLocaleMessage);
        }
    };

    prevStep = () => {
        this.setState(prevState => ({
            currentStep: Math.max(prevState.currentStep - 1, 0)
        }));
    };

    skipToStep5 = () => {
        this.handleStepCompleted(2); // Mark step 3 (index 2) as completed
        this.goToStep(3); // Skip to step 5 (index 3)
    };

    render() {
        const { currentStep, nextIsClicked, formSubmittedSuccessfully } = this.state;
        const { selectedCategory } = this.props;

        if (formSubmittedSuccessfully) {
            return <FormSubmittedStep />;
        }

        return (
            <Stepper
                steps={this.state.steps}
                currentStep={currentStep}
                prevStep={this.prevStep}
                goToStep={this.goToStep}
                wizardFormData={this.props.wizardFormData}
                wizardFormErrors={this.props.wizardFormErrors}
                selectedCategoryError={!selectedCategory && nextIsClicked}
                isFreightForwarderCert={this.isFreightForwarderCert}
            />
        );
    }
}

export default wrapComponent(WizardForm, 'WizardForm', true);
