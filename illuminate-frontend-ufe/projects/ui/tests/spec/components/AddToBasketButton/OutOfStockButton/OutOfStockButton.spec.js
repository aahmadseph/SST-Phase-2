const React = require('react');
const { createSpy } = jasmine;
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('OutOfStockButton component', () => {
    let OutOfStockButton;
    let props;
    let wrapper;
    let component;

    beforeEach(() => {
        OutOfStockButton = require('components/AddToBasketButton/OutOfStockButton/OutOfStockButton').default;
    });

    describe('emailMeButtonHandler', () => {
        let e;
        let profileApi;
        let getProductDetailsStub;
        let store;
        let dispatchStub;
        let actions;
        let anaUtils;
        let showEmailMeWhenInStockModalStub;
        let updateEmailMeTextStub;
        let processEvent;
        let processStub;
        let productData;
        let skuData;
        let dataStub;
        let fakePromise;
        let analyticsConsts;

        beforeEach(function () {
            e = {
                preventDefault: createSpy(),
                stopPropagation: createSpy()
            };

            profileApi = require('services/api/profile').default;
            getProductDetailsStub = spyOn(profileApi, 'getUserSpecificProductDetails');

            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            actions = require('Actions').default;
            anaUtils = require('analytics/utils').default;

            showEmailMeWhenInStockModalStub = spyOn(actions, 'showEmailMeWhenInStockModal').and.returnValue('showEmailMeWhenInStockModal');

            productData = {
                productDetails: {
                    productId: 'p123',
                    productData: 'productData'
                }
            };
            skuData = {
                productId: 'p567',
                skuId: 's123',
                skuData: 'skuData',
                rootContainerName: 'skuRootContainerName'
            };
            dataStub = {
                currentSku: {
                    productId: 'p567',
                    skuId: 's123',
                    skuData: 'skuData',
                    rootContainerName: 'skuRootContainerName',
                    currentSkuData: 'currentSkuData'
                },
                product: { productDetails: { productId: 'p123' } },
                dataInfo: 'dataInfo'
            };

            analyticsConsts = require('analytics/constants').default;
            processEvent = require('analytics/processEvent').default;
            processStub = spyOn(processEvent, 'process');
        });

        it('should call e.preventDefault once', () => {
            props = {
                product: productData,
                sku: skuData
            };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            updateEmailMeTextStub = spyOn(component, 'updateEmailMeText');
            getProductDetailsStub.and.returnValue(Promise.resolve(dataStub));
            component.emailMeButtonHandler(e);
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should call getProductDetails with product.productDetails.productId and sku.skuId', () => {
            // Arrange
            const userProfile = { user: { profileId: 1 } };
            spyOn(store, 'getState').and.returnValue(userProfile);
            props = {
                product: productData,
                sku: skuData
            };
            component = new OutOfStockButton(props);
            getProductDetailsStub.and.returnValue({ then: () => {} });

            // Act
            component.emailMeButtonHandler(e);

            // Assert
            expect(getProductDetailsStub).toHaveBeenCalledTimes(1);
            expect(getProductDetailsStub).toHaveBeenCalledWith(
                props.product.productDetails.productId,
                props.sku.skuId,
                false,
                userProfile.user.profileId
            );
        });

        it('should call getProductDetails with sku.productId and sku.skuId', () => {
            // Arrange
            const userProfile = { user: { profileId: 1 } };
            spyOn(store, 'getState').and.returnValue(userProfile);
            props = { sku: skuData };
            component = new OutOfStockButton(props);
            getProductDetailsStub.and.returnValue({ then: () => {} });

            // Act
            component.emailMeButtonHandler(e);

            // Assert
            expect(getProductDetailsStub).toHaveBeenCalledTimes(1);
            expect(getProductDetailsStub).toHaveBeenCalledWith(props.sku.productId, props.sku.skuId, false, userProfile.user.profileId);
        });

        it('should dispatch showEmailMeWhenInStockModal action with correct args', done => {
            const analyticsContextStub = 'analyticsContext';
            const isComingSoonStub = false;
            fakePromise = {
                then: function (resolve) {
                    resolve(dataStub);
                    expect(dispatchStub).toHaveBeenCalledTimes(1);
                    expect(dispatchStub).toHaveBeenCalledWith('showEmailMeWhenInStockModal');
                    expect(showEmailMeWhenInStockModalStub).toHaveBeenCalledWith({
                        isOpen: true,
                        product: Object.assign({}, productData, dataStub),
                        currentSku: dataStub.currentSku,
                        isQuickLook: false,
                        updateEmailButtonCTA: updateEmailMeTextStub,
                        isComingSoon: isComingSoonStub,
                        analyticsContext: analyticsContextStub
                    });
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            props = {
                product: productData,
                sku: skuData,
                analyticsContext: analyticsContextStub
            };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            updateEmailMeTextStub = spyOn(component, 'updateEmailMeText');
            getProductDetailsStub.and.returnValue(fakePromise);
            component.emailMeButtonHandler(e, isComingSoonStub);
        });

        it('should execute analytics processEvent.process with correct args', () => {
            // Arrange
            spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({
                pageName: 'eventPageName',
                previousPage: 'eventPreviousPage'
            });
            const pPageOos = 'top-right-out-of-stock-button';
            props = {
                product: productData,
                sku: skuData
            };
            component = new OutOfStockButton(props);
            getProductDetailsStub.and.returnValue({ then: () => {} });

            // Act
            component.emailMeButtonHandler(e);

            // Assert
            expect(processStub).toHaveBeenCalledTimes(2);
            expect(processStub).toHaveBeenCalledWith(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: ['event71'],
                    sku: props.sku,
                    linkName: 'Email Me When Available',
                    internalCampaign: [pPageOos, props.product.productDetails.productId, 'email-me-when-available'],
                    actionInfo: 'Email Me When Available',
                    pageName: 'eventPageName',
                    previousPage: 'eventPreviousPage'
                }
            });
        });
    });

    describe('updateEmailMeText', () => {
        const INACTIVE_EMAIL_ME_TEXT = 'Manage Notifications';
        const ACTIVE_STANDARD_EMAIL_ME_TEXT = 'Manage Notifications';

        let skuUtils;
        let getProductTypeStub;
        let setStateStub;

        beforeEach(function () {
            skuUtils = require('utils/Sku').default;
            getProductTypeStub = spyOn(skuUtils, 'getProductType');

            props = { sku: 'skuData' };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should call setState once', () => {
            component.updateEmailMeText();
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should update emailText to inactive', () => {
            component.state = { emailMeText: ACTIVE_STANDARD_EMAIL_ME_TEXT };
            component.updateEmailMeText();

            expect(setStateStub).toHaveBeenCalledWith({ emailMeText: 'Notify Me When Available' });
        });

        it('should update emailText to active', () => {
            component.state = { emailMeText: INACTIVE_EMAIL_ME_TEXT };
            getProductTypeStub.and.returnValue(skuUtils.skuTypes.STANDARD);
            component.updateEmailMeText();

            expect(setStateStub).toHaveBeenCalledWith({ emailMeText: 'Notify Me When Available' });
        });
    });

    describe('componentDidUpdate', () => {
        let setStateStub;
        let skuUtils;
        let getEmailMeTextStub;

        beforeEach(function () {
            skuUtils = require('utils/Sku').default;
            getEmailMeTextStub = spyOn(skuUtils, 'getEmailMeText');
        });

        it('should call setState once', () => {
            props = {
                sku: {
                    actionFlags: { backInStockReminderStatus: 'inactive' },
                    isWithBackInStockTreatment: true
                }
            };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            component.state = { emailMeText: null };
            setStateStub = spyOn(component, 'setState');
            getEmailMeTextStub.and.returnValue('newEmailMeText');
            component.componentDidUpdate(props, component.state);
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call getEmailMeText with props.sku', () => {
            props = {
                sku: {
                    actionFlags: { backInStockReminderStatus: 'inactive' },
                    isWithBackInStockTreatment: true
                }
            };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            component.state = { emailMeText: null };
            setStateStub = spyOn(component, 'setState');
            getEmailMeTextStub.and.returnValue('newEmailMeText');
            component.componentDidUpdate(props, component.state);
            expect(getEmailMeTextStub).toHaveBeenCalledWith(props.sku);
        });

        xit('should call setState with correct args', () => {
            props = {
                sku: {
                    actionFlags: { backInStockReminderStatus: 'inactive' },
                    isWithBackInStockTreatment: true
                }
            };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            getEmailMeTextStub.and.returnValue('activeEmailMeText');
            component.componentDidUpdate();
            expect(setStateStub).toHaveBeenCalledWith({ emailMeText: 'activeEmailMeText' });
        });

        it('should call setState when state.emailMeText is already set with the value from skuUtils.getEmailMeText', () => {
            props = {
                sku: {
                    actionFlags: { backInStockReminderStatus: 'inactive' },
                    isWithBackInStockTreatment: true
                }
            };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            component.state = { emailMeText: 'emailMeText' };
            getEmailMeTextStub.and.returnValue('emailMeText');
            setStateStub = spyOn(component, 'setState');
            // Please always maintain a LC hooks interface
            component.componentDidUpdate(props, component.state);
            expect(setStateStub).toHaveBeenCalled();
        });

        it('should call setState to update label if isWithBackInStockTreatment and actionFlag', () => {
            props = {
                sku: {
                    actionFlags: {},
                    isWithBackInStockTreatment: true
                }
            };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            component.state = { emailMeText: null };
            setStateStub = spyOn(component, 'setState');
            getEmailMeTextStub.and.returnValue('newEmailMeText');
            component.componentDidUpdate(props, component.state);
            expect(setStateStub).toHaveBeenCalled();
        });

        it('should call setState to update label if isWithBackInStockTreatment is set to true', () => {
            props = { sku: { isWithBackInStockTreatment: true } };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            component.state = { emailMeText: null };
            setStateStub = spyOn(component, 'setState');
            getEmailMeTextStub.and.returnValue('newEmailMeText');
            component.componentDidUpdate(props, component.state);
            expect(setStateStub).toHaveBeenCalled();
        });

        it('should call setState to update label with default label if isWithBackInStockTreatment is set to false', () => {
            props = { sku: { isWithBackInStockTreatment: false } };
            wrapper = shallow(<OutOfStockButton {...props} />);
            component = wrapper.instance();
            component.state = { emailMeText: null };
            setStateStub = spyOn(component, 'setState');
            getEmailMeTextStub.and.returnValue('newEmailMeText');
            component.componentDidUpdate(props, component.state);
            expect(setStateStub).toHaveBeenCalled();
        });
    });
});
