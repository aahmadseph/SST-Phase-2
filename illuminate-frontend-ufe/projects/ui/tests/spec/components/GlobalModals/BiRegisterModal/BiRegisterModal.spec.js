/* eslint-disable object-curly-newline */
const React = require('react');
const { createSpy, any, objectContaining } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const anaUtils = require('analytics/utils').default;
const actions = require('actions/Actions').default;
const userActions = require('actions/UserActions').default;
const BiRegisterModal = require('components/GlobalModals/BiRegisterModal/BiRegisterModal').default;

describe('BiRegisterModal component', () => {
    let dispatchStub;
    let showBiRegisterModalStub;
    let biRegisterStub;
    let event;
    let component;
    let biFormData;
    let optionParams;
    let setErrorStateStub;
    let processStub;

    beforeEach(() => {
        spyOn(actions, 'showInfoModal');
        dispatchStub = spyOn(store, 'dispatch');
        showBiRegisterModalStub = spyOn(actions, 'showBiRegisterModal');
        biRegisterStub = spyOn(userActions, 'biRegister');

        biFormData = {
            birthMonth: '3',
            birthDay: '2',
            birthYear: '1984'
        };
        optionParams = {
            isJoinBi: true,
            biAccount: {
                birthMonth: '3',
                birthDay: '2',
                birthYear: '1984'
            }
        };
        event = { preventDefault: createSpy('preventDefault') };
    });

    describe('ctrlr', () => {
        const previousPageName = 'register previousPageName';

        beforeEach(() => {
            digitalData.page.attributes.sephoraPageInfo.pageName = previousPageName;
            processStub = spyOn(processEvent, 'process');
            const wrapper = shallow(<BiRegisterModal />);
            component = wrapper.instance();
        });

        it('should trigger analytics with correct data', () => {
            const { REGISTER } = anaConsts.PAGE_TYPES;
            const data = {
                pageName: `${REGISTER}:${REGISTER}:n/a:*`,
                pageType: REGISTER,
                pageDetail: REGISTER,
                eventStrings: [anaConsts.Event.REGISTRATION_STEP_1],
                previousPageName
            };
            expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data });
        });
    });

    describe('close modal', () => {
        beforeEach(() => {
            const wrapper = shallow(<BiRegisterModal />);
            component = wrapper.instance();
        });

        it('should dispatch BiRegisterModal false', () => {
            // Arrange/Act
            component.requestClose();

            // Assert
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(showBiRegisterModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: false }));
        });
    });

    describe('submit BI register form', () => {
        beforeEach(() => {
            component = shallow(<BiRegisterModal />).instance();
            spyOn(component, 'setState');
            component.biRegForm = {
                getBIDate: () => biFormData,
                validateForm: () => {}
            };
            component.componentDidMount();
        });

        it('should register non-bi user for BI account', () => {
            const getState = store.getState;
            spyOn(store, 'getState').and.returnValue({
                ...getState(),
                errors: {
                    GLOBAL: {},
                    FORM: {},
                    FIELD: {}
                }
            });
            spyOn(component.biRegForm, 'validateForm').and.returnValue(false);
            component.biRegister(event);
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(biRegisterStub).toHaveBeenCalledWith(optionParams, component.biRegisterSuccess, component.biRegisterFailure, undefined);
        });

        it('should expect store.dispatch to not be called if error', () => {
            const getState = store.getState;
            spyOn(store, 'getState').and.returnValue({
                ...getState(),
                errors: {
                    GLOBAL: {},
                    FORM: {},
                    FIELD: {}
                }
            });
            spyOn(component.biRegForm, 'validateForm').and.returnValue(true);

            component.biRegister(event);
            expect(dispatchStub).not.toHaveBeenCalledTimes(1);
        });
    });

    describe('get form data', () => {
        beforeEach(() => {
            const wrapper = shallow(<BiRegisterModal />);
            component = wrapper.instance();
        });

        it('should return appropriately formatted form data if data exists', () => {
            const result = component.getOptionParams(biFormData);
            expect(result).toEqual(optionParams);
        });

        it('should return object with false if data does not exist', () => {
            const result = component.getOptionParams();
            expect(result).toEqual({
                isJoinBi: false,
                biAccount: undefined
            });
        });
    });

    describe('failure callback', () => {
        beforeEach(() => {
            const wrapper = shallow(<BiRegisterModal />);
            component = wrapper.instance();
            component.biRegForm = {
                setErrorState: () => {}
            };
            setErrorStateStub = spyOn(component.biRegForm, 'setErrorState');
        });

        it('should call change error state on BiRegisterForm', () => {
            component.biRegisterFailure({
                errors: {
                    biBirthDayInput: ['error']
                }
            });
            expect(setErrorStateStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('success callback', () => {
        it('should close the modal', () => {
            // Arrange/Act
            shallow(<BiRegisterModal />)
                .instance()
                .biRegisterSuccess();

            // Assert
            expect(showBiRegisterModalStub).toHaveBeenCalledTimes(1);
            expect(showBiRegisterModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: false }));
        });
    });

    describe('track errors when present', () => {
        it('should trigger analytics with correct data', () => {
            // Arrange
            const fieldError = ['birthday'];
            const errorMessage = ['Please enter your birth date.'];
            const pageName = 'register pageName';
            const previousPage = 'register previousPage';
            const pageType = 'register pageType';
            const process = spyOn(processEvent, 'process');
            spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({
                pageName,
                previousPage,
                pageType
            });

            // Act
            const wrapper = shallow(<BiRegisterModal />);
            component = wrapper.instance();
            component.trackErrors({
                somerror: {
                    name: fieldError[0],
                    message: errorMessage[0],
                    location: {}
                }
            });

            // Assert
            expect(process).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    pageName,
                    previousPage,
                    pageType,
                    linkName: `${anaConsts.PAGE_TYPES.REGISTER}:${anaConsts.LinkData.MODAL}:${anaConsts.EVENT_NAMES.ERROR}`,
                    bindingMethods: any(Function),
                    fieldErrors: fieldError,
                    errorMessages: errorMessage
                }
            });
        });
    });
});
