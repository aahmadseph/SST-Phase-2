import localeUtils from 'utils/LanguageLocale';
import {
    SET_TAX_CLAIM_DATA,
    SET_START_APPLICATION,
    ADD_WIZARD_FORM_DATA,
    FETCH_ORDER_DETAILS_SUCCESS,
    FETCH_ORDER_DETAILS_ERROR,
    UPDATE_STEP4_DATA,
    TAX_INIT_SUCCESS,
    TAX_INIT_ERROR,
    SUBMIT_FINAL_TAX_FORM_SUCCESS,
    SUBMIT_FINAL_TAX_FORM_ERROR,
    FETCH_ELIGIBLE_ORDERS_SUCCESS,
    FETCH_ELIGIBLE_ORDERS_ERROR,
    UPDATE_SELECTED_ORDERS
} from 'constants/actionTypes/taxClaim';

const initialState = {
    isInitialized: false,
    wizardForm: {
        currentCategory: '',
        currentCategoryLabel: '',
        stepData: [],
        selectedOrders: []
    },
    step4VariationData: {
        ia: {
            tribeName: '',
            tribeIdNumber: '',
            tribeReserveName: '',
            issueDate: '',
            expirationDate: ''
        },
        fa: {},
        dvifo: {
            veteranExemptionNumber: '',
            veteranEffectiveDate: ''
        },
        esfff: {},
        slgei: {
            organizationPosition: '',
            organizationName: '',
            organizationUrl: '',
            stateIssuedTaxExemptNumber: '',
            phoneNumber: '',
            firstName: '',
            lastName: '',
            creditCardIssued: null
        },
        r: {
            organizationPosition: '',
            organizationName: '',
            organizationUrl: '',
            stateIssuedTaxExemptNumber: '',
            phoneNumber: '',
            firstName: '',
            lastName: '',
            creditCardIssued: null
        },
        nprco: {
            organizationPosition: '',
            organizationName: '',
            organizationUrl: '',
            stateIssuedTaxExemptNumber: '',
            phoneNumber: '',
            firstName: '',
            lastName: '',
            creditCardIssued: false
        }
    },
    orderDetails: null,
    eligibleOrdersData: null,
    eligibleOrdersDataErrors: null,
    orderApiError: null,
    taxCreditMemoSubmitSuccess: false,
    categoryTypes: {},
    categoryTypesError: {},
    taxFormSubmitError: null,
    taxFormSubmitSuccess: false
};

const updateOrderStepData = (stepData, orderNumberErrors, genericOrderNumberErrorExists) => {
    return stepData.map(step => {
        if (step.currentStep === 2) {
            return {
                ...step,
                formErrors: {
                    ...step.formErrors,
                    orderNumberErrors,
                    genericOrderNumberErrorExists
                }
            };
        }

        return step;
    });
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_TAX_CLAIM_DATA: {
            const { data } = payload;

            return { ...state, wizardForm: { ...state.wizardForm, ...data } };
        }

        case SET_START_APPLICATION: {
            return { ...initialState, ...state, isInitialized: payload };
        }

        case ADD_WIZARD_FORM_DATA: {
            const { category, stepData: newStepData } = payload;

            // Ensure stepData is an array
            if (!Array.isArray(newStepData.stepData)) {
                Sephora.logger.verbose('Invalid stepData format:', newStepData.stepData);

                // Reset stepData to an empty array if it's invalid
                newStepData.stepData = []; // Ensure stepData is an empty array
            }

            const updatedStepData = [...state.wizardForm.stepData];

            newStepData.stepData.forEach(step => {
                const stepIndex = updatedStepData.findIndex(s => s.currentStep === step.currentStep);

                if (stepIndex === -1) {
                    updatedStepData.push(step);
                } else {
                    updatedStepData[stepIndex] = {
                        ...updatedStepData[stepIndex],
                        formData: {
                            ...updatedStepData[stepIndex].formData,
                            ...step.formData // Combine with existing formData
                        },
                        formErrors: step.formErrors // Each step tracks its own form errors
                    };
                }
            });

            const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');
            const currentCategoryLabel = getText(`categoryTitleFor${category}`) || '';

            return {
                ...state,
                wizardForm: {
                    ...state.wizardForm,
                    currentCategory: category,
                    currentCategoryLabel,
                    stepData: updatedStepData
                },
                genericOrderNumberErrorExists: false
            };
        }

        case FETCH_ORDER_DETAILS_SUCCESS: {
            // Create a new stepData based on the existing state
            const updatedStepData = updateOrderStepData(
                state.wizardForm.stepData,
                null, // Resetting orderNumberErrors to null
                false // Reset the error flag
            );

            return {
                ...state,
                orderDetails: payload,
                wizardForm: {
                    ...state.wizardForm,
                    stepData: updatedStepData
                }
            };
        }

        case FETCH_ORDER_DETAILS_ERROR: {
            const orderNumberErrors = payload.orderNumberErrors || null;

            return {
                ...state,
                orderApiError: payload, // Store real error for UFE devs
                wizardForm: {
                    ...state.wizardForm,
                    stepData: updateOrderStepData(state.wizardForm.stepData, orderNumberErrors, true)
                }
            };
        }

        case FETCH_ELIGIBLE_ORDERS_SUCCESS: {
            return {
                ...state,
                eligibleOrders: payload
            };
        }

        case FETCH_ELIGIBLE_ORDERS_ERROR: {
            return {
                ...state,
                eligibleOrdersError: payload
            };
        }

        case UPDATE_SELECTED_ORDERS: {
            return {
                ...state,
                wizardForm: {
                    ...state.wizardForm,
                    selectedOrders: payload
                }
            };
        }

        case UPDATE_STEP4_DATA: {
            const { section, key, data } = payload;

            return {
                ...state,
                step4VariationData: {
                    ...state.step4VariationData,
                    [section]: {
                        ...state.step4VariationData[section],
                        [key]: data
                    }
                }
            };
        }

        case SUBMIT_FINAL_TAX_FORM_SUCCESS: {
            return {
                ...state,
                taxFormSubmitSuccess: true,
                taxFormSubmitError: null
            };
        }

        case SUBMIT_FINAL_TAX_FORM_ERROR: {
            return {
                ...state,
                taxFormSubmitSuccess: false,
                taxFormSubmitError: payload
            };
        }

        case TAX_INIT_SUCCESS: {
            return {
                ...state,
                categoryTypes: payload,
                categoryTypesError: {}
            };
        }

        case TAX_INIT_ERROR: {
            return {
                ...state,
                categoryTypes: {},
                categoryTypesError: payload
            };
        }

        default: {
            return state;
        }
    }
};

export default { reducer, initialState };
