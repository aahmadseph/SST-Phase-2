import { SET_TAX_CLAIM_DATA, SET_START_APPLICATION, ADD_WIZARD_FORM_DATA } from 'constants/actionTypes/taxClaim';
import events from 'reducers/page/events';
import taxClaim from 'reducers/page/taxClaim.js';
import shopMyStore from 'reducers/page/shopMyStore';
import shopSameDay from 'reducers/page/shopSameDay';
import myLists from 'reducers/page/myLists';
import beautyPreferencesRedesigned from 'reducers/page/beautyPreferencesRedesigned';
import myCustomList from 'reducers/page/myCustomList';
import localeUtils from 'utils/LanguageLocale';

const taxClaimReducer = taxClaim.reducer;
const taxClaimInitialState = taxClaim.initialState;

// Describe block for page reducer tests
describe('page reducer', () => {
    let page;
    const initialState = {
        autoReplenishment: {
            creditCards: [],
            countries: [],
            cmsData: null,
            subscriptions: {
                numOfPagesLoaded: 0,
                activePagesLoaded: 0,
                pausedPagesLoaded: 0,
                cancelledPagesLoaded: 0,
                subscriptions: []
            },
            shippingAndPaymentInfo: {
                payment: {},
                shippingAddress: {}
            }
        },
        buy: {},
        content: {},
        contentStoreData: {},
        creatorStoreFront: {},
        enhancedContent: {},
        happening: {
            content: null,
            isInitialized: false
        },
        home: {},
        nthBrand: {},
        nthCategory: {},
        photoCaptureSmartSkinScan: {},
        product: {},
        sameDayUnlimited: {
            bccContent: {},
            SDUsubscription: {}
        },
        search: {},
        showLoadSpaPageProgress: null,
        smartSkinScan: {},
        templateInformation: {},
        // TODO
        rwdBasket: {},
        events: events.initialState,
        tlpPage: {},
        taxClaim: {
            isInitialized: false
        },
        shopMyStore: shopMyStore.initialState,
        shopSameDay: shopSameDay.initialState,
        myLists: myLists.initialState,
        beautyPreferencesRedesigned: beautyPreferencesRedesigned.initialState,
        myCustomList: myCustomList.initialState,
        showCreateListModal: false
    };

    beforeEach(() => {
        // Load the page reducer before each test
        page = require('reducers/page').default;
    });

    it('should not mutate state for unknown action type', () => {
        const unknownAction = {};
        const state = page(initialState, unknownAction);

        expect(state).toEqual({
            ...initialState,
            gallery: {},
            myProfile: {}
        });
    });

    it('should create wrapper for product reducer', () => {
        const reducer = jasmine.createSpy('reducer').and.callFake(state => state);
        spyOn(page, 'withMerge').and.returnValue(reducer);

        page.wrapReducers();

        expect(page.pageReducers['product']).toEqual(reducer);
    });
});

// Describe block for taxClaim reducer tests
describe('taxClaim reducer', () => {
    let originalGetLocaleResourceFile;

    beforeEach(() => {
        // Store the original function to restore later
        originalGetLocaleResourceFile = localeUtils.getLocaleResourceFile;

        // Mock the getLocaleResourceFile function to return an empty string
        localeUtils.getLocaleResourceFile = jasmine.createSpy('getLocaleResourceFile').and.callFake(() => {
            return () => ''; // Returns a function that returns an empty string
        });
    });

    afterEach(() => {
        localeUtils.getLocaleResourceFile = originalGetLocaleResourceFile;
    });

    it('should return the initial state', () => {
        const state = taxClaimReducer(undefined, {});

        expect(state).toEqual(taxClaimInitialState);
    });

    it('should handle SET_TAX_CLAIM_DATA', () => {
        const action = {
            type: SET_TAX_CLAIM_DATA,
            payload: {
                data: { isInitialized: true }
            }
        };

        const state = taxClaimReducer(taxClaimInitialState, action);

        expect(state).toEqual({
            ...taxClaimInitialState,
            wizardForm: {
                ...taxClaimInitialState.wizardForm,
                isInitialized: true
            }
        });
    });

    it('should handle SET_START_APPLICATION', () => {
        const action = {
            type: SET_START_APPLICATION,
            payload: true
        };

        const state = taxClaimReducer(taxClaimInitialState, action);

        expect(state).toEqual({
            ...taxClaimInitialState,
            isInitialized: true
        });
    });

    it('should handle ADD_WIZARD_FORM_DATA when step does not exist', () => {
        const action = {
            type: ADD_WIZARD_FORM_DATA,
            payload: {
                category: 'exampleCategory',
                stepData: {
                    stepData: [{ currentStep: 'step1', formData: { field: 'value' } }]
                }
            }
        };

        const state = taxClaimReducer(taxClaimInitialState, action);

        expect(state).toEqual({
            ...taxClaimInitialState,
            wizardForm: {
                selectedOrders: [],
                currentCategory: 'exampleCategory',
                currentCategoryLabel: '', // This should now match
                stepData: [{ currentStep: 'step1', formData: { field: 'value' } }]
            },
            genericOrderNumberErrorExists: false
        });
    });

    it('should handle ADD_WIZARD_FORM_DATA when step exists', () => {
        const initialState = {
            isInitialized: false,
            wizardForm: {
                currentCategory: 'exampleCategory',
                currentCategoryLabel: '',
                stepData: [{ currentStep: 'step1', formData: { field: 'oldValue' } }]
            },
            genericOrderNumberErrorExists: false
        };
        const action = {
            type: ADD_WIZARD_FORM_DATA,
            payload: {
                category: 'exampleCategory',
                stepData: {
                    stepData: [{ currentStep: 'step1', formData: { field: 'newValue' }, formErrors: {} }]
                }
            }
        };

        const state = taxClaimReducer(initialState, action);

        expect(state).toEqual({
            ...initialState,
            wizardForm: {
                currentCategory: 'exampleCategory',
                currentCategoryLabel: '', // This should now match
                stepData: [{ currentStep: 'step1', formData: { field: 'newValue' }, formErrors: {} }]
            },
            genericOrderNumberErrorExists: false
        });
    });
});
