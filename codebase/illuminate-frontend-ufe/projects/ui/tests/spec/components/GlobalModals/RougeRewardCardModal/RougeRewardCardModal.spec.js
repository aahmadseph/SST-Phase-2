/* eslint-disable no-unused-vars */
describe('RougeRewardCardModal component', () => {
    let React;
    let RougeRewardCardModal;
    let rrcUtils;
    let shallowComponent;
    let UtilActions;
    let store;
    let regions;

    beforeEach(() => {
        React = require('react');
        store = require('Store').default;
        RougeRewardCardModal = require('components/GlobalModals/RougeRewardCardModal/RougeRewardCardModal').default;
        rrcUtils = require('utils/RrcTermsAndConditions').default;
        UtilActions = require('utils/redux/Actions').default;
        regions = {
            content: [
                {
                    componentName: 'Sephora Unified Markdown Component',
                    componentType: 57,
                    contentType: 'PlainText',
                    text: 'h2. BEAUTY INSIDER TERMS & CONDITIONS'
                },
                {
                    componentName: 'Sephora Unified Markdown Component',
                    componentType: 57,
                    contentType: 'PlainText',
                    text: 'h3. 1. Membership & Eligibility'
                }
            ]
        };
    });

    describe('componentDidMount', () => {
        let dispatchStub;
        let setAndWatchStub;

        beforeEach(() => {
            dispatchStub = spyOn(store, 'dispatch');
            setAndWatchStub = spyOn(store, 'setAndWatch');
            spyOn(rrcUtils, 'areRRCTermsConditionsAccepted').and.returnValue(true);
            shallowComponent = enzyme.shallow(<RougeRewardCardModal />);
        });

        it('should call dispatch if RRC Terms and Conditions are accepted', () => {
            shallowComponent.instance().componentDidMount();
            expect(dispatchStub).toHaveBeenCalled();
        });

        it('should call setAndWatch for basket.items', () => {
            shallowComponent.instance().componentDidMount();
            expect(setAndWatchStub).toHaveBeenCalled();
        });
    });

    describe('getContent', () => {
        it('should call dispatch if RRC Terms and Conditions are accepted', () => {
            shallowComponent = enzyme.shallow(<RougeRewardCardModal />);
            shallowComponent.instance().state.regions = regions;
            const content = shallowComponent.instance().getContent();
            expect(content.props.items).toEqual(regions.content);
        });
    });

    describe('requestClose', () => {
        it('should call dispatch if RRC Terms and Conditions are accepted', () => {
            const dispatchStub = spyOn(store, 'dispatch');
            const setAndWatchStub = spyOn(store, 'setAndWatch');
            spyOn(rrcUtils, 'areRRCTermsConditionsAccepted').and.returnValue(true);
            shallowComponent = enzyme.shallow(<RougeRewardCardModal />);
            shallowComponent.instance().requestClose();
            expect(dispatchStub).toHaveBeenCalled();
        });
    });
});
