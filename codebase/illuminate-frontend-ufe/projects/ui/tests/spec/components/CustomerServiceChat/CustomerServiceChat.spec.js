/* eslint-disable object-curly-newline */
const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('CustomerServiceChat component', () => {
    let CustomerServiceChat;
    let LoadScripts;
    let Events;
    let onLastLoadEvent;
    let store;
    let component;
    let onLastLoadEventStub;
    let setAndWatch;
    let setAndWatchStub;
    let loadScripts;
    let LoadScriptsStub;
    let originalConfigurationSettings;
    let PostLoad;

    beforeEach(() => {
        LoadScripts = require('utils/LoadScripts').default;
        loadScripts = LoadScripts.loadScripts;
        LoadScriptsStub = spyOn(LoadScripts, 'loadScripts');
        CustomerServiceChat = require('components/CustomerServiceChat/CustomerServiceChat').default;
        Events = Sephora.Util;
        store = require('Store').default;
        onLastLoadEvent = Events.onLastLoadEvent;
        PostLoad = require('constants/events').PostLoad;
        onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
        setAndWatch = store.setAndWatch;
        setAndWatchStub = spyOn(store, 'setAndWatch');
        const wrapper = shallow(<CustomerServiceChat />);
        component = wrapper.instance();

        originalConfigurationSettings = window.Sephora.configurationSettings;
        window.Sephora.configurationSettings.enableOSCLiveChat = true;
    });

    afterEach(() => {
        window.Sephora.configurationSettings = originalConfigurationSettings;
    });

    describe('Initialization', () => {
        let setGlobalBreadcrumbsStub;

        beforeEach(() => {
            window.ATGSvcs = { setEEID: createSpy() };
            spyOn(document, 'getElementById').and.returnValue({
                children: [{ innerText: 'breadcrumb' }]
            });
            setGlobalBreadcrumbsStub = spyOn(component, 'setGlobalBreadcrumbs');

            component.componentDidMount();
        });

        it('should call LoadScripts with correct script and callback', () => {
            // Arrange
            LoadScripts.loadScripts = loadScripts;
            LoadScriptsStub = spyOn(LoadScripts, 'loadScripts');

            // Act
            shallow(<CustomerServiceChat />);

            // Assert
            expect(LoadScriptsStub).toHaveBeenCalledTimes(1);
            expect(LoadScriptsStub).toHaveBeenCalledWith(['//static.atgsvcs.com/js/atgsvcs.js'], any(Function));

            LoadScriptsStub.calls.argsFor(0)[1]();
            expect(window.ATGSvcs.setEEID).toHaveBeenCalledTimes(1);
            expect(window.ATGSvcs.setEEID).toHaveBeenCalledWith('200106308507');
        });

        it('should call Events.onLastLoadEvent for PostLoad ', () => {
            // Arrange
            Events.onLastLoadEvent = onLastLoadEvent;
            onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');

            // Act
            shallow(<CustomerServiceChat />);

            // Assert
            expect(onLastLoadEventStub).toHaveBeenCalledTimes(1);
            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, [PostLoad], any(Function));
        });

        it('should set and watch user information then set global user variables for Oracle', () => {
            // Arrange
            store.setAndWatch = setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');
            Events.onLastLoadEvent = onLastLoadEvent;
            onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
            const userDataStub = {
                user: {
                    firstName: 'First',
                    lastName: 'Last',
                    login: 'first.last@sephora.com'
                }
            };
            const wrapper = shallow(<CustomerServiceChat />);
            component = wrapper.instance();
            setGlobalBreadcrumbsStub = spyOn(component, 'setGlobalBreadcrumbs');

            // Act
            onLastLoadEventStub.calls.argsFor(0)[2]();
            setAndWatchStub.calls.argsFor(0)[2](userDataStub);

            // Assert
            expect(setGlobalBreadcrumbsStub).toHaveBeenCalledTimes(1);
            expect(setGlobalBreadcrumbsStub).toHaveBeenCalledWith([{ innerText: 'breadcrumb' }]);
            expect(setAndWatchStub).toHaveBeenCalledTimes(1);
            expect(setAndWatchStub).toHaveBeenCalledWith('user', null, any(Function));
            expect(window.first).toEqual('First');
            expect(window.last).toEqual('Last');
            expect(window.email).toEqual('first.last@sephora.com');
            expect(window.pageURL).toEqual(window.location.href);
        });

        it('should call loadScripts function within onLastLoadEvent callback with correct scripts', () => {
            onLastLoadEventStub.calls.first().args[2]();
            expect(LoadScriptsStub).toHaveBeenCalledTimes(2);
            expect(LoadScriptsStub).toHaveBeenCalledWith([
                '//sephorausa.custhelp.com/rnt/rnw/javascript/vs/1/vsapi.js',
                '//sephorausa.custhelp.com/vs/1/vsopts.js'
            ]);
        });
    });

    describe('Set Global Breadcrumbs', () => {
        it('should set window.breadcrumb to breadcrumb', () => {
            component.setGlobalBreadcrumbs([{ innerText: 'breadcrumb' }]);
            expect(window.breadcrumbs).toEqual('breadcrumb');
        });
    });
});
