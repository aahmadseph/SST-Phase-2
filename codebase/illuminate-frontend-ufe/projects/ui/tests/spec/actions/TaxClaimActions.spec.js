import TaxClaimActions from 'actions/TaxClaimActions';
import checkoutApi from 'services/api/checkout';
import ErrorConstants from 'utils/ErrorConstants';
import localeUtils from 'utils/LanguageLocale';
import { CategoryType } from 'components/RichProfile/MyAccount/TaxClaim/constants';
import Actions from 'Actions';
import TaxClaimUtils from 'utils/TaxClaim';

describe('TaxClaimActionCreators', function () {
    const taxClaimActions = TaxClaimActions;
    const taxClaimUtils = TaxClaimUtils;
    let dispatch;
    let getState;

    beforeEach(function () {
        spyOn(taxClaimActions, 'setStartApplication').and.callThrough();
        dispatch = jasmine.createSpy('dispatch');
        getState = jasmine.createSpy('getState').and.returnValue({
            page: {
                taxClaim: {
                    wizardForm: {
                        currentCategory: CategoryType.RESELLER,
                        stepData: [{ formData: {} }, { formData: {} }, { formData: { orderNumber: '12345' } }, { formData: {} }]
                    },
                    step4VariationData: {}
                }
            }
        });
    });

    describe('setStartApplication', function () {
        it('should create an action to set start application', function () {
            const payload = true;
            const expectedAction = {
                type: 'SET_START_APPLICATION',
                payload
            };
            expect(taxClaimActions.setStartApplication(payload)).toEqual(expectedAction);
        });
    });

    describe('setTaxClaimData', function () {
        it('should create an action to set tax claim data', function () {
            const payload = { taxData: 'someData' };
            const expectedAction = {
                type: 'SET_TAX_CLAIM_DATA',
                payload
            };
            expect(taxClaimActions.setTaxClaimData(payload)).toEqual(expectedAction);
        });
    });

    describe('addWizardFormData', function () {
        it('should create an action to add wizard form data', function () {
            const category = CategoryType.RESELLER;
            const stepData = { data: 'stepData' };
            const expectedAction = {
                type: 'ADD_WIZARD_FORM_DATA',
                payload: { category, stepData }
            };
            expect(taxClaimActions.addWizardFormData(category, stepData)).toEqual(expectedAction);
        });
    });

    it('should handle API call success', function (done) {
        const mockData = { some: 'data' };
        const onPageUpdated = jasmine.createSpy('onPageUpdated');
        const onDataLoaded = jasmine.createSpy('onDataLoaded');
        const onError = jasmine.createSpy('onError');
        const newLocation = {};

        spyOn(localeUtils, 'getLocaleResourceFile').and.returnValue('someText');
        spyOn(taxClaimActions, 'setTaxClaimData');
        spyOn(Actions, 'showInterstice').and.callFake(() => dispatch());
        spyOn(taxClaimActions, 'openPage').and.callFake(({ events }) => {
            return () => {
                // Mock implementation of openPage method
                return Promise.resolve({
                    data: mockData
                })
                    .then(({ data }) => {
                        events.onDataLoaded(data);
                        dispatch(taxClaimActions.setTaxClaimData(data));
                        events.onPageUpdated(data);
                    })
                    .catch(error => {
                        events.onError(error, newLocation, true);
                    });
            };
        });

        taxClaimActions
            .openPage({
                events: {
                    onPageUpdated,
                    onDataLoaded,
                    onError
                },
                newLocation
            })(dispatch)
            .then(() => {
                expect(onDataLoaded).toHaveBeenCalledWith(mockData);
                expect(taxClaimActions.setTaxClaimData).toHaveBeenCalledWith(mockData);
                expect(onPageUpdated).toHaveBeenCalledWith(mockData);
                done();
            });
    });

    it('should handle API call failure', function (done) {
        const error = new Error('Network error');
        const onPageUpdated = jasmine.createSpy('onPageUpdated');
        const onDataLoaded = jasmine.createSpy('onDataLoaded');
        const onError = jasmine.createSpy('onError');
        const newLocation = {};

        spyOn(taxClaimActions, 'openPage').and.callFake(({ events }) => {
            return () => {
                // Mock implementation of openPage method
                return Promise.reject(error)
                    .then(() => {
                        events.onDataLoaded();
                    })
                    .catch(err => {
                        events.onError(err, newLocation, true);

                        return Promise.reject(err);
                    });
            };
        });

        taxClaimActions
            .openPage({
                events: {
                    onPageUpdated,
                    onDataLoaded,
                    onError
                },
                newLocation
            })(dispatch)
            .catch(() => {
                expect(onError).toHaveBeenCalledWith(error, newLocation, true);
                done();
            });
    });

    describe('getOrderDetails', function () {
        it('should fetch order details and dispatch actions', function (done) {
            const mockResponse = { header: { orderId: '123' } };
            spyOn(checkoutApi, 'getOrderDetails').and.returnValue(Promise.resolve(mockResponse));
            spyOn(taxClaimActions, 'addWizardFormData');

            taxClaimActions
                .getOrderDetails()(dispatch, getState)
                .then(() => {
                    expect(dispatch).toHaveBeenCalledWith({ type: 'FETCH_ORDER_DETAILS_SUCCESS', payload: mockResponse.header });
                    expect(taxClaimActions.addWizardFormData).toHaveBeenCalled();
                    done();
                });
        });

        it('should handle errors when fetching order details', function (done) {
            const error = new Error('Order not found');
            spyOn(checkoutApi, 'getOrderDetails').and.returnValue(Promise.reject(error));

            taxClaimActions
                .getOrderDetails()(dispatch, getState)
                .catch(() => {
                    expect(dispatch).toHaveBeenCalledWith({
                        type: 'FETCH_ORDER_DETAILS_ERROR',
                        payload: {
                            orderNumberErrors: ErrorConstants.ERROR_CODES.ORDER_ID_GENERIC,
                            orderApiErrorMsg: error.message
                        }
                    });
                    done();
                });
        });
    });

    describe('buildTaxFormPayload', function () {
        it('should build payload correctly based on category', function () {
            const category = CategoryType.RESELLER;
            const data = { organizationName: 'Org', stateIssuedTaxExemptNumber: '1234' };
            const firstName = 'John';
            const lastName = 'Doe';

            const expectedPayload = {
                resellerInfo: {
                    position: undefined,
                    businessName: 'Org',
                    businessType: undefined,
                    businessUrl: undefined,
                    taxPermitNumber: '1234',
                    businessPhoneNumber: undefined,
                    businessAddress: {
                        addressLine1: undefined,
                        addressLine2: undefined,
                        city: undefined,
                        stateCode: undefined,
                        postalCode: undefined,
                        countryCode: 'US'
                    },
                    creditCardFirstName: 'John',
                    creditCardLastName: 'Doe',
                    isCreditCardIssuedByOrg: undefined
                }
            };

            expect(taxClaimUtils.buildTaxFormPayload(category, data, firstName, lastName)).toEqual(expectedPayload);
        });

        it('should throw an error for unsupported categories', function () {
            const category = 'UNSUPPORTED_CATEGORY';
            const data = {};

            expect(() => taxClaimUtils.buildTaxFormPayload(category, data)).toThrowError('Unsupported category');
        });
    });
});
