import PageActionCreators from 'actions/framework/PageActionCreators';
import { getContent } from 'services/api/Content/getContent';
import {
    SET_START_APPLICATION,
    ADD_WIZARD_FORM_DATA,
    FETCH_ORDER_DETAILS_SUCCESS,
    FETCH_ORDER_DETAILS_ERROR,
    FETCH_ELIGIBLE_ORDERS_SUCCESS,
    FETCH_ELIGIBLE_ORDERS_ERROR,
    SET_TAX_CLAIM_DATA,
    UPDATE_STEP4_DATA,
    TAX_INIT_SUCCESS,
    TAX_INIT_ERROR,
    SUBMIT_FINAL_TAX_FORM_ERROR,
    SUBMIT_FINAL_TAX_FORM_SUCCESS,
    UPDATE_SELECTED_ORDERS
} from 'constants/actionTypes/taxClaim';
import { UPDATE_TAX_STATUS } from 'constants/actionTypes/user';
import TaxClaimUtils from 'utils/TaxClaim';
import checkoutApi from 'services/api/checkout';
import getEligibleOrders from 'services/api/taxClaim/getEligibleOrders';
import ErrorConstants from 'utils/ErrorConstants';
import { submitFinalTaxForm } from 'services/api/taxClaim/submitFinalTaxForm';
import addShippingAddress from 'services/api/profile/addresses/addShippingAddress';
import setDefaultShippingAddress from 'services/api/profile/addresses/setDefaultShippingAddress';
import localeUtils from 'utils/LanguageLocale';
import { taxInit } from 'services/api/taxClaim/taxInit';
import Empty from 'constants/empty';
import Actions from 'Actions';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import store from 'store/Store';

const { showTaxclaimErrorModal, showInterstice } = Actions;

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

class TaxClaimActionCreators extends PageActionCreators {
    isNewPage = () => {
        return true;
    };

    updatePage = () => {
        return {};
    };

    setStartApplication = payload => ({
        type: SET_START_APPLICATION,
        payload
    });

    setTaxClaimData = payload => ({
        type: SET_TAX_CLAIM_DATA,
        payload
    });

    addWizardFormData = (category, stepData) => ({
        type: ADD_WIZARD_FORM_DATA,
        payload: { category, stepData }
    });

    isOrderNumberErrorResponse = response => {
        const isErrorCode = response?.pickup?.errorCode === 404;
        const isTransactionNotFound = response?.errors?.transactionNotFound;
        const isResponseStatusError = [404, 403].includes(response?.responseStatus);

        return isErrorCode || isTransactionNotFound || isResponseStatusError;
    };

    handleApiSubmitError = (errorType, errorTypeLocaleMessage) => {
        // Dispatch an action with the errorType to show the error modal
        store.dispatch(
            showTaxclaimErrorModal({
                isOpen: true,
                errorType,
                errorTypeLocaleMessage
            })
        );
    };

    openPage =
        ({ events: { onPageUpdated, onDataLoaded, onError }, newLocation }) =>
            dispatch => {
                try {
                    const { country, language } = Sephora.renderQueryParams;
                    const promise = getContent({ path: '/taxClaim/', language, country });

                    return promise
                        .then(({ data }) => {
                            if (!data) {
                                onError({ responseStatus: 404 }, null);
                            } else {
                                onDataLoaded(data);
                                dispatch(this.setTaxClaimData(data));
                                onPageUpdated(data);
                            }
                        })
                        .catch(error => {
                            onError(error, newLocation, true);
                        });
                } catch (error) {
                    onError(error, newLocation, true);

                    return Promise.reject(error);
                }
            };

    updatePage = () => () => {};

    startApplication = () => dispatch => {
        dispatch(this.setStartApplication(true));
    };

    initTaxFlow = () => async dispatch => {
        dispatch(showInterstice(true));

        let taxInitResponse;

        try {
            // Make an API call here to get the tax exemption categories
            taxInitResponse = await taxInit();

            // Ensure the response is valid
            if (!taxInitResponse.isEligible) {
                throw new Error(taxInitResponse.reasonCode);
            }
        } catch (error) {
            // If there's an error, ensure that taxInitResponse is not undefined
            // You might want to set a default response or handle specific error cases
            taxInitResponse = {
                isEligible: false,
                reasonCode: error?.message || 'unknown.error'
            };
        }

        // Proceed with error code validation and dispatching actions
        try {
            const errorCode = TaxFormValidator.validateInitApiErrors(taxInitResponse?.reasonCode);

            if (errorCode) {
                throw new Error(errorCode);
            }

            // Properly dispatch startApplication action
            dispatch(this.setStartApplication(true));
            dispatch({ type: TAX_INIT_SUCCESS, payload: taxInitResponse });

            return true;
        } catch (error) {
            dispatch({ type: TAX_INIT_ERROR, payload: error });

            return false;
        } finally {
            dispatch(showInterstice(false));
        }
    };

    createCombinedStepData = (responseData, wizardFormData) => {
        return {
            orderDetails: responseData,
            stepData: [
                ...wizardFormData.stepData.map((step, index) => {
                    // Specific check for order number input step
                    if (index === 2) {
                        return {
                            ...step,
                            formData: {
                                ...step.formData,
                                // Step only needs orderDate not entire response object
                                orderDate: responseData?.orderDate
                            }
                        };
                    }

                    return step;
                })
            ]
        };
    };

    getOrderDetails = () => async (dispatch, getState) => {
        const state = getState();
        const orderNumber = TaxClaimUtils.isTaxExemptionEnabled()
            ? state.page.taxClaim.wizardForm.selectedOrders[0]
            : state.page.taxClaim.wizardForm?.stepData[2]?.formData?.orderNumber;

        // Check if the order details already exist in the state
        const cachedOrderDetails = TaxClaimUtils.getCachedOrderDetails(state, orderNumber);

        if (cachedOrderDetails) {
            return cachedOrderDetails;
        }

        try {
            dispatch(showInterstice(true));
            const response = await checkoutApi.getOrderDetails(orderNumber, '', false, true);

            if (this.isOrderNumberErrorResponse(response)) {
                const error = new Error(getText('orderNumberNotFound'));
                error.errorCode = ErrorConstants.ERROR_CODES.ORDER_ID_NOT_FOUND;
                throw error;
            }

            // Dispatch the response to Redux store
            dispatch({ type: FETCH_ORDER_DETAILS_SUCCESS, payload: response?.header });

            // Create combined step data and dispatch action
            const wizardFormData = state.page.taxClaim.wizardForm;
            const combinedStepData = this.createCombinedStepData(response?.header, wizardFormData);
            dispatch(this.addWizardFormData(wizardFormData.currentCategory, { stepData: [combinedStepData] }));

            return response;
        } catch (error) {
            // Handle specific error case where 403 err message should be treated as not found (per QA)
            if (error.responseStatus === 403) {
                error.errorCode = ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC;
            }

            // Determine the error code to dispatch
            const errorCode = error.errorCode || ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC;

            // Dispatch the error to redux
            dispatch({
                type: FETCH_ORDER_DETAILS_ERROR,
                payload: {
                    orderNumberErrors: errorCode,
                    orderApiErrorMsg: error.message
                }
            });

            // Re-throw the error if needed for higher-level handling
            throw error;
        } finally {
            dispatch(showInterstice(false));
        }
    };

    fetchEligibleOrders = () => async () => {
        try {
            store.dispatch(showInterstice(true));
            const eligibleOrdersData = await getEligibleOrders();
            const { eligibleOrders } = eligibleOrdersData;

            if (eligibleOrders?.length === 0) {
                throw new Error(ErrorConstants.ERROR_CODES.TAX_ELIGIBLE_ORDERS_EMPTY);
            }

            store.dispatch({ type: FETCH_ELIGIBLE_ORDERS_SUCCESS, payload: eligibleOrders });

            return Empty.Object;
        } catch (error) {
            store.dispatch({ type: FETCH_ELIGIBLE_ORDERS_ERROR, payload: error.message });

            return Empty.Object;
        } finally {
            store.dispatch(showInterstice(false));
        }
    };

    updateSelectedOrders = payload => ({
        type: UPDATE_SELECTED_ORDERS,
        payload
    });

    updateStep4Data = (section, key, data) => {
        return dispatch => {
            const payload = {
                section,
                key,
                data
            };

            dispatch({
                type: UPDATE_STEP4_DATA,
                payload
            });
        };
    };

    updateTaxStatus = data => ({
        type: UPDATE_TAX_STATUS,
        payload: data
    });

    addShippingAddress = async input => async () => {
        try {
            return await addShippingAddress(input);
        } catch (error) {
            return error;
        }
    };

    setDefaultShippingAddressAction = async orderId => async () => {
        try {
            return await setDefaultShippingAddress(orderId);
        } catch (error) {
            throw error;
        }
    };

    // eslint-disable-next-line complexity
    submitFinalTaxFormAction = localState => async (dispatch, getState) => {
        try {
            dispatch(showInterstice(true));
            // Fetch the current state
            const taxClaimState = getState().page.taxClaim;

            // Access step4VariationData from the state
            const step4VariationData = taxClaimState?.step4VariationData || Empty.Object;

            // Get the current category and convert it to lowercase (can grab from 2 places)
            const category =
                taxClaimState.wizardForm.currentCategory?.toLowerCase() ?? taxClaimState.wizardForm.stepData[0]?.formData?.taxExemptionCategory;

            // Access category data from step4VariationData
            const categoryData = step4VariationData[category] || Empty.Object;

            // Last step has all the aggregated data
            const indexToUse = taxClaimState.wizardForm.stepData?.length - 1;
            const lastStepAggregatedData = taxClaimState.wizardForm.stepData[indexToUse]?.formData || Empty.Object;
            const orderNums = [lastStepAggregatedData?.orderNumber] || Empty.Array;
            const selectedOrders = taxClaimState.wizardForm.selectedOrders;
            // Define universal/common payload data
            const firstName = lastStepAggregatedData?.firstName || localState.firstName || '';
            const lastName = lastStepAggregatedData?.lastName || localState.lastName || '';
            const allOtherPayloadData = {
                email: lastStepAggregatedData?.email || localState.email || '',
                firstName: firstName || '',
                lastName: lastName || '',
                exemptionCategory: taxClaimState?.wizardForm.currentCategory || '',
                orderNumbers: TaxClaimUtils.isTaxExemptionEnabled() ? selectedOrders : orderNums, // Use the array directly
                additionalInfo: lastStepAggregatedData?.additionalComments || ''
            };

            const country = localeUtils.getCurrentCountry().toUpperCase();

            const {
                addressId, taxExemptionSelection, city, state, postalCode, address1, address2
            } = localState;

            const taxAddressPayloadData = {
                ...(taxExemptionSelection
                    ? {
                        address: {
                            addressId,
                            addressLine1: address1,
                            addressLine2: address2,
                            city,
                            postalCode,
                            stateCode: state,
                            countryCode: country
                        }
                    }
                    : {}),
                optInForExemption: taxExemptionSelection
            };

            // Build category-specific payload data
            const categoryPayload = {
                exemptionInfo: TaxClaimUtils.isTaxExemptionEnabled()
                    ? TaxClaimUtils.buildTaxFormPayload(category, categoryData, firstName, lastName, taxAddressPayloadData)
                    : TaxClaimUtils.buildTaxFormPayload(category, categoryData, firstName, lastName)
            };

            // Merge all payload data
            const payload = { ...allOtherPayloadData, ...categoryPayload };

            // Access files to be sent with the payload
            const filesFromStep2 = taxClaimState.wizardForm.stepData[1]?.formData?.uploadDocuments || Empty.Array;

            // Submit the final tax form with payload and files
            const finalTaxResponse = await submitFinalTaxForm(payload, filesFromStep2);

            // Dispatch success action
            dispatch({ type: SUBMIT_FINAL_TAX_FORM_SUCCESS, payload: finalTaxResponse });

            return finalTaxResponse;
        } catch (error) {
            const errorCode = TaxClaimUtils.getFinalSubmissionErrorCode(error);

            // Dispatch error action
            dispatch({ type: SUBMIT_FINAL_TAX_FORM_ERROR, payload: errorCode });

            return errorCode;
        } finally {
            dispatch(showInterstice(false));
        }
    };
}

const TaxClaimActions = new TaxClaimActionCreators();

export default TaxClaimActions;
