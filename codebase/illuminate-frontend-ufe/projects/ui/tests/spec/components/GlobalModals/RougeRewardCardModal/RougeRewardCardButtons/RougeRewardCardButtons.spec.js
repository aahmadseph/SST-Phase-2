const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('RougeRewardCardButtons component', () => {
    const { any } = jasmine;
    let RougeRewardCardButton;
    let store;
    let dispatchStub;
    let component;
    let props;
    let actions;
    let showRougeRewardCardModalStub;
    let showQuickLookModalStub;
    let rrcUtils;
    let skuHelpers;
    let utilStub;
    let setAndWatchSpy;
    let e;

    beforeEach(() => {
        store = require('Store').default;
        dispatchStub = spyOn(store, 'dispatch');
        actions = require('actions/Actions').default;
        showRougeRewardCardModalStub = spyOn(actions, 'showRougeRewardCardModal');
        showQuickLookModalStub = spyOn(actions, 'showQuickLookModal');
        skuHelpers = require('utils/skuHelpers').default;

        props = { currentSku: { actionFlags: { isAddToBasket: true } } };

        RougeRewardCardButton = require('components/GlobalModals/RougeRewardCardModal/RougeRewardCardButtons/RougeRewardCardButtons').default;
        const wrapper = shallow(<RougeRewardCardButton {...props} />);
        component = wrapper.instance();
    });

    describe('RougeRewardCardButtons.prototype.handleTermsClick', () => {
        beforeEach(() => {
            e = { preventDefault: () => {} };
        });

        it('should dispatch showRougeRewardCardModal', () => {
            component.handleTermsClick(e);
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(showRougeRewardCardModalStub).toHaveBeenCalled();
        });
    });

    describe('RougeRewardCardButtons.prototype.acceptTerms', () => {
        beforeEach(() => {
            component.acceptTerms();
        });

        it('should dispatch showRougeRewardCardModal action', () => {
            expect(showRougeRewardCardModalStub).toHaveBeenCalledWith({
                isOpen: false,
                sku: null
            });
        });

        it('should dispatch showQuickLookModal action', () => {
            expect(showQuickLookModalStub).toHaveBeenCalledWith({ isOpen: false });
        });
    });

    describe('RougeRewardCardButtons.prototype.handleAcceptTerms', () => {
        beforeEach(() => {
            rrcUtils = require('utils/RrcTermsAndConditions').default;
            e = { target: { checked: false } };
            utilStub = spyOn(rrcUtils, 'persistAcceptanceCheck');

            component.handleAcceptTerms(e);
        });

        it('should call persistAcceptanceCheck', () => {
            expect(utilStub).toHaveBeenCalledWith(e.target.checked);
        });
    });

    describe('RougeRewardCardButtons componentDidMount', () => {
        let updateTermsValuesSpy;

        beforeEach(() => {
            setAndWatchSpy = spyOn(store, 'setAndWatch');

            updateTermsValuesSpy = spyOn(component, 'updateTermsValues');

            component.componentDidMount();
        });

        it('should call the updateTermsValues function', () => {
            expect(updateTermsValuesSpy).toHaveBeenCalled();
        });

        it('should call setAndWatchSpy', () => {
            expect(setAndWatchSpy).toHaveBeenCalledWith('termsConditions', component, any(Function));
        });
    });

    describe('updateTermsValues', () => {
        let areRRCTermsConditionsAcceptedStub;
        let areRRCTermsConditionsCheckedStub;
        let isInBasketStub;

        beforeEach(() => {
            rrcUtils = require('utils/RrcTermsAndConditions').default;
            areRRCTermsConditionsAcceptedStub = spyOn(rrcUtils, 'areRRCTermsConditionsAccepted');
            areRRCTermsConditionsCheckedStub = spyOn(rrcUtils, 'areRRCTermsConditionsChecked');
            isInBasketStub = spyOn(skuHelpers, 'isInBasket');
        });

        it('should set the correct state if terms are checked and accepted', () => {
            areRRCTermsConditionsAcceptedStub.and.returnValue(true);
            areRRCTermsConditionsCheckedStub.and.returnValue(true);
            isInBasketStub.and.returnValue(false);

            component.updateTermsValues();

            expect(component.state).toEqual({
                acceptTerms: true,
                checkedTerms: true,
                showError: false,
                isRRCInBasket: false
            });
        });

        it('should set the correct state if terms are not checked and accepted', () => {
            areRRCTermsConditionsAcceptedStub.and.returnValue(false);
            areRRCTermsConditionsCheckedStub.and.returnValue(false);
            isInBasketStub.and.returnValue(false);

            component.updateTermsValues();

            expect(component.state).toEqual({
                acceptTerms: false,
                checkedTerms: false,
                showError: true,
                isRRCInBasket: false
            });
        });

        it('should set the correct state if terms are not checked but they are accepted', () => {
            areRRCTermsConditionsAcceptedStub.and.returnValue(true);
            areRRCTermsConditionsCheckedStub.and.returnValue(false);
            isInBasketStub.and.returnValue(false);

            component.updateTermsValues();

            expect(component.state).toEqual({
                acceptTerms: true,
                checkedTerms: false,
                showError: true,
                isRRCInBasket: false
            });
        });

        it('should set the correct state if terms are checked but they are not accepted', () => {
            areRRCTermsConditionsAcceptedStub.and.returnValue(false);
            areRRCTermsConditionsCheckedStub.and.returnValue(true);
            isInBasketStub.and.returnValue(false);

            component.updateTermsValues();

            expect(component.state).toEqual({
                acceptTerms: false,
                checkedTerms: true,
                showError: false,
                isRRCInBasket: false
            });
        });

        it('should set the correct state if RRC is on basket', () => {
            areRRCTermsConditionsAcceptedStub.and.returnValue(false);
            areRRCTermsConditionsCheckedStub.and.returnValue(false);
            isInBasketStub.and.returnValue(true);

            component.updateTermsValues();

            expect(component.state).toEqual({
                acceptTerms: false,
                checkedTerms: false,
                showError: true,
                isRRCInBasket: true
            });
        });

        it('should set the correct state if RRC is not on basket', () => {
            areRRCTermsConditionsAcceptedStub.and.returnValue(false);
            areRRCTermsConditionsCheckedStub.and.returnValue(false);
            isInBasketStub.and.returnValue(false);

            component.updateTermsValues();

            expect(component.state).toEqual({
                acceptTerms: false,
                checkedTerms: false,
                showError: true,
                isRRCInBasket: false
            });
        });
    });
});
