/* eslint-disable complexity */
import {
    SUBMITTED_ORDER,
    TOGGLE_PLACE_ORDER,
    UPDATE_DELIVERY_INSTRUCTIONS,
    UPDATE_ORDER,
    UPDATE_SHIPPING_METHODS,
    VALIDATE_ADDRESS,
    CREATE_DRAFT_HAL_ADDRESS,
    SHOW_SCHEDULED_DELIVERY_UNAVAILABLE,
    REMOVE_HAL_ADDRESS,
    UPDATE_CURRENT_HAL_ADDRESS,
    UPDATE_ADDRESS_LIST_WITH_HAL_ADDRESS,
    UPDATE_AUTOREPLENISH_TERMS,
    UPDATE_VERBAL_CONSENT,
    UPDATE_SDU_TERMS,
    UPDATE_AGENT_AWARE_TERMS,
    SET_DELIVERY_ISSUES,
    SET_SELECTED_DELIVERY_ISSUE,
    SET_DELIVERY_ISSUE_MODAL_SCREEN,
    SET_RETURN_ELIGIBILITY,
    SET_DELIVERY_ISSUE_ERROR,
    SET_LAST_SHIPPING_ADDRESS_ID,
    UPDATE_ORDER_HEADER,
    UPDATE_WAIVE_SHIPPING,
    SWAP_PAYPAL_TO_CREDIT,
    SET_SECTION_ERRORS,
    CLEAR_SECTION_ERRORS,
    SET_ACTIVE_SECTION,
    CLEAR_NAMED_SECTION_ERRORS
} from 'constants/actionTypes/order';
import { CONFIRM_RETURN_ORDER } from 'constants/actionTypes/replacementOrder';
import order from 'utils/Order';
const {
    SHIPPING_GROUPS: { SAME_DAY },
    SHIPPING_METHOD_TYPES: { HAL },
    whatDefaultAddressAfterHal
} = order;
import Empty from 'constants/empty';

const initialState = {
    orderDetails: {
        isInitialized: false,
        header: { profile: { user: {} } },
        items: { items: [] },
        priceInfo: {},
        shippingGroups: { shippingGroupsEntries: [] },
        paymentGroups: { paymentGroupsEntries: [] },
        deliveryIssues: [],
        selectedDeliveryIssue: null,
        deliveryIssueModalScreen: null,
        returnEligibility: null,
        isDeliveryIssueError: false,
        returnOrder: null
    },
    editOrderData: {},
    orderShippingMethods: {},
    addressList: [],
    halAddress: null,
    halOperatingHours: [],
    paymentOptions: {},
    isApplePayFlow: false,
    acceptAutoReplenishTerms: false,
    confirmVerbalConsent: false,
    acceptSDUTerms: false,
    acceptAgentAwareTerms: false,
    waiveShippingFee: false,
    splitEDDExperienceDisplayed: false,
    sectionErrors: {},
    activeSection: null
};

/**
 * If removing property from basket state, don't remove property entirely.
 * If you do, state will not reflect change due to object.assign.
 * Instead set property value to null to simulate removal, this will update state.
 */

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_ORDER: {
            const { orderDetails = {} } = action;

            return Object.assign({}, state, {
                orderDetails: Object.assign({}, orderDetails, { isInitialized: state.orderDetails.isInitialized || orderDetails.isInitialized })
            });
        }
        case SUBMITTED_ORDER: {
            return Object.assign({}, state, { submittedDetails: action.submittedDetails });
        }
        case TOGGLE_PLACE_ORDER: {
            return Object.assign({}, state, { isPlaceOrderDisabled: action.isPlaceOrderDisabled });
        }
        case UPDATE_DELIVERY_INSTRUCTIONS: {
            const { deliveryInstructions } = payload;
            const {
                orderDetails,
                orderDetails: {
                    shippingGroups,
                    shippingGroups: { shippingGroupsEntries }
                }
            } = state;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    shippingGroups: {
                        ...shippingGroups,
                        shippingGroupsEntries: shippingGroupsEntries.map(shippingGroup => {
                            if (shippingGroup.shippingGroupType === SAME_DAY) {
                                return {
                                    ...shippingGroup,
                                    shippingGroup: {
                                        ...shippingGroup.shippingGroup,
                                        deliveryInstructions
                                    }
                                };
                            } else {
                                return shippingGroup;
                            }
                        })
                    }
                }
            };
        }
        case UPDATE_SHIPPING_METHODS: {
            const orderShippingMethods = Object.assign({}, state.orderShippingMethods);
            orderShippingMethods[action.shippingGroup] = action.shippingMethods;

            return Object.assign({}, state, { orderShippingMethods: orderShippingMethods });
        }
        case VALIDATE_ADDRESS: {
            return Object.assign({}, state, { addressData: action.addressId });
        }
        case CREATE_DRAFT_HAL_ADDRESS: {
            const {
                orderDetails,
                orderDetails: {
                    shippingGroups,
                    shippingGroups: { shippingGroupsEntries = Empty.Array }
                }
            } = state;

            const addressIdx = shippingGroupsEntries.findIndex(entry => entry.shippingGroup.shippingGroupId === action.shippingGroupId);

            if (addressIdx >= 0) {
                // clone and update properly the new shippingGroupEntries
                const updatedShippingGroupEntries = shippingGroupsEntries.map((shippingGroupEntry, index) => {
                    if (index === addressIdx) {
                        const {
                            shippingGroup,
                            shippingGroup: { address }
                        } = shippingGroupEntry;

                        return {
                            ...shippingGroupEntry,
                            shippingGroup: {
                                ...shippingGroup,
                                address: {
                                    ...(address?.altPickLocationID && address),
                                    ...action.address,
                                    addressId: null,
                                    isDraft: true
                                }
                            }
                        };
                    }

                    return shippingGroupEntry;
                });

                const nextState = {
                    ...state,
                    orderDetails: {
                        ...orderDetails,
                        shippingGroups: {
                            ...shippingGroups,
                            shippingGroupsEntries: updatedShippingGroupEntries
                        }
                    },
                    halOperatingHours: action?.halOperatingHours
                };

                return nextState;
            }

            return state;
        }
        case REMOVE_HAL_ADDRESS: {
            const {
                orderDetails,
                orderDetails: {
                    header: { isGuestOrder },
                    shippingGroups,
                    shippingGroups: { shippingGroupsEntries = Empty.Array }
                }
            } = state;

            const addressIdx = shippingGroupsEntries.findIndex(entry => entry.shippingGroup.address.addressType === HAL);

            if (addressIdx >= 0) {
                // clone and update properly the new shippingGroupEntries
                const updatedShippingGroupEntries = shippingGroupsEntries.map((shippingGroupEntry, index) => {
                    if (index === addressIdx) {
                        const { shippingGroup } = shippingGroupEntry;

                        return {
                            ...shippingGroupEntry,
                            shippingGroup: {
                                ...shippingGroup,
                                isComplete: false,
                                address: whatDefaultAddressAfterHal(isGuestOrder)
                            }
                        };
                    }

                    return shippingGroupEntry;
                });

                const nextState = {
                    ...state,
                    orderDetails: {
                        ...orderDetails,
                        shippingGroups: {
                            ...shippingGroups,
                            shippingGroupsEntries: updatedShippingGroupEntries
                        }
                    },
                    halOperatingHours: []
                };

                return nextState;
            }

            return state;
        }
        case UPDATE_CURRENT_HAL_ADDRESS: {
            const { halAddress } = payload;

            return {
                ...state,
                halAddress
            };
        }
        case UPDATE_ADDRESS_LIST_WITH_HAL_ADDRESS: {
            const { addressList, halAddress } = state;
            let nextState = state;

            if (halAddress !== null) {
                nextState = {
                    ...state,
                    addressList: [halAddress, ...addressList]
                };
            }

            return nextState;
        }
        case UPDATE_AUTOREPLENISH_TERMS: {
            return {
                ...state,
                acceptAutoReplenishTerms: action.payload.acceptAutoReplenishTerms
            };
        }
        case UPDATE_VERBAL_CONSENT: {
            return {
                ...state,
                confirmVerbalConsent: action.payload.confirmVerbalConsent
            };
        }
        case UPDATE_SDU_TERMS: {
            return {
                ...state,
                acceptSDUTerms: action.payload.acceptSDUTerms
            };
        }
        case UPDATE_AGENT_AWARE_TERMS: {
            return {
                ...state,
                acceptAgentAwareTerms: action.payload.acceptAgentAwareTerms
            };
        }
        case SHOW_SCHEDULED_DELIVERY_UNAVAILABLE: {
            const { message } = payload;

            return Object.assign({}, state, { scheduledAddrChangeMessage: message });
        }
        case SET_DELIVERY_ISSUES: {
            const { deliveryIssues } = payload;
            const { orderDetails } = state;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    deliveryIssues: deliveryIssues
                }
            };
        }
        case SET_SELECTED_DELIVERY_ISSUE: {
            const { selectedDeliveryIssue } = payload;
            const { orderDetails } = state;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    selectedDeliveryIssue: selectedDeliveryIssue
                }
            };
        }
        case SET_DELIVERY_ISSUE_MODAL_SCREEN: {
            const { deliveryIssueModalScreen } = payload;
            const { orderDetails } = state;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    deliveryIssueModalScreen: deliveryIssueModalScreen
                }
            };
        }
        case SET_RETURN_ELIGIBILITY: {
            const { returnEligibility } = payload;
            const { orderDetails } = state;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    returnEligibility: returnEligibility
                }
            };
        }
        case SET_DELIVERY_ISSUE_ERROR: {
            const isError = payload;
            const { orderDetails } = state;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    isDeliveryIssueError: isError
                }
            };
        }

        case SET_LAST_SHIPPING_ADDRESS_ID: {
            const { orderDetails } = state;
            const { addressId } = payload;
            const nextState = {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    lastUsedShippingAddressId: addressId
                }
            };

            return nextState;
        }

        case CONFIRM_RETURN_ORDER: {
            const { orderDetails } = state;
            const { returnOrder } = payload;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    returnOrder
                }
            };
        }

        case UPDATE_ORDER_HEADER: {
            const { orderDetails } = state;
            const { orderHeaderDetails = {} } = action;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails,
                    header: { ...orderDetails.header, ...orderHeaderDetails }
                }
            };
        }

        case UPDATE_WAIVE_SHIPPING: {
            const { orderDetails } = state;
            const { waiveShippingFee } = action;

            return {
                ...state,
                orderDetails: {
                    ...orderDetails
                },
                waiveShippingFee
            };
        }

        case SWAP_PAYPAL_TO_CREDIT: {
            const {
                orderDetails: {
                    priceInfo: { paypalAmount, ...priceInfoRest },
                    ...orderDetailsRest
                }
            } = state;

            if (paypalAmount === undefined) {
                return state;
            }

            return {
                ...state,
                orderDetails: {
                    ...orderDetailsRest,
                    priceInfo: {
                        ...priceInfoRest,
                        creditCardAmount: paypalAmount,
                        paypalAmount: undefined
                    }
                }
            };
        }

        case SET_SECTION_ERRORS: {
            return {
                ...state,
                sectionErrors: {
                    ...state.sectionErrors,
                    ...payload
                }
            };
        }

        case CLEAR_SECTION_ERRORS: {
            return {
                ...state,
                sectionErrors: {}
            };
        }

        case CLEAR_NAMED_SECTION_ERRORS: {
            const errorsToRemove = Array.isArray(payload) ? payload : [payload];
            const updatedSectionErrors = Object.fromEntries(
                Object.entries(state.sectionErrors || {}).filter(([key]) => !errorsToRemove.includes(key))
            );

            return {
                ...state,
                sectionErrors: updatedSectionErrors
            };
        }

        case SET_ACTIVE_SECTION: {
            return {
                ...state,
                activeSection: payload
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer;
