const UrlUtils = require('utils/Url').default;
const React = require('react');
const { shallow } = require('enzyme');

describe('SiteSearch component', () => {
    let store;
    let searchActions;
    let subscribeStub;
    let dispatchStub;
    let SiteSearch;
    let component;
    let getSearchResultsStub;
    let Location;

    beforeEach(() => {
        store = require('Store').default;
        searchActions = require('actions/SearchActions').default;
        SiteSearch = require('components/SiteSearch/SiteSearch').default;
        Location = require('utils/Location').default;

        subscribeStub = spyOn(store, 'subscribe');
        dispatchStub = spyOn(store, 'dispatch');

        const wrapper = shallow(<SiteSearch />);
        component = wrapper.instance();
        component.inputRef = {
            current: {
                getValue: () => {},

                setValue: () => {}
            }
        };
    });

    describe('Focus Event', () => {
        let getValueStub;

        beforeEach(() => {
            getSearchResultsStub = spyOn(searchActions, 'getSearchResults');
            getValueStub = spyOn(component.inputRef.current, 'getValue').and.returnValue('test');
            component.handleFocus();
        });

        it('should request current input value', () => {
            expect(getValueStub).toHaveBeenCalledTimes(1);
        });

        it('should get search results for current input value', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(getSearchResultsStub).toHaveBeenCalledTimes(1);
            expect(getSearchResultsStub).toHaveBeenCalledWith('test', undefined);
        });
    });

    describe('Controller initialization', () => {
        it('should subscribe to search store', () => {
            expect(subscribeStub).toHaveBeenCalled();
        });
    });

    const eStub = {
        preventDefault: () => {},

        target: { innerHTML: 'test' }
    };

    describe('Clear Search', () => {
        let handleFocusStub;

        beforeEach(() => {
            handleFocusStub = spyOn(component, 'handleFocus');
        });

        it('should set an empty value to text input', () => {
            const setValueStub = spyOn(component.inputRef.current, 'setValue');
            component.handleClearClick(eStub);
            expect(handleFocusStub).toHaveBeenCalled();
            expect(setValueStub).toHaveBeenCalledWith('');
        });
    });

    describe('Submit Search', () => {
        let fetchSearchDataAndRedirect;
        let getValueStub;
        beforeEach(() => {
            getValueStub = spyOn(component.inputRef.current, 'getValue').and.returnValue('test');
            fetchSearchDataAndRedirect = spyOn(component, 'fetchSearchDataAndRedirect');
            spyOn(component, 'processURLRedirect');
            spyOn(UrlUtils, 'redirectTo');
        });

        it('should call fetchSearchDataAndRedirect with keyword', () => {
            component.handleSubmit(eStub);
            expect(getValueStub).toHaveBeenCalledTimes(1);
            expect(fetchSearchDataAndRedirect).toHaveBeenCalledWith('test');
        });
    });

    describe('Item Click', () => {
        let productMockedData;
        let processSubmitStub;
        let navigateToSpy;
        beforeEach(() => {
            productMockedData = {
                term: 'test product',
                value: 'test product'
            };

            spyOn(UrlUtils, 'redirectTo');
            processSubmitStub = spyOn(component, 'processURLRedirect');
            navigateToSpy = spyOn(Location, 'navigateTo');
        });

        // TODO: fix this unit test
        it('should redirect to PdP using term provided for mobileWeb', () => {
            spyOn(window.Sephora, 'isMobile').and.returnValue(true);
            component.handleItemClick(eStub, productMockedData);
            expect(processSubmitStub).toHaveBeenCalled();
            expect(navigateToSpy).toHaveBeenCalled();
        });

        it('should submit value provided for desktop', () => {
            spyOn(window.Sephora, 'isMobile').and.returnValue(false);
            component.handleItemClick(eStub, productMockedData);
            expect(processSubmitStub).toHaveBeenCalled();
            expect(navigateToSpy).toHaveBeenCalled();
        });
    });
});
