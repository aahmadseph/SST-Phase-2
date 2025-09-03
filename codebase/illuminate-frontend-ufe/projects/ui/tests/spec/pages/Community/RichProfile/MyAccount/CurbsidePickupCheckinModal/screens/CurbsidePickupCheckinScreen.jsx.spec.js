const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const CurbsidePickupCheckinModal =
    require('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsidePickupCheckinScreen.es6.jsx').default;

describe('Trigger Analytics', () => {
    let state;
    let wrapper;
    let component;
    let event;
    let processEventStub;
    let props;
    let deepExtend;
    let originalDigitalData;

    beforeEach(() => {
        deepExtend = require('utils/deepExtend');
        originalDigitalData = deepExtend({}, window.digitalData);
        event = { preventDefault: createSpy('preventDefault') };
        props = {
            notifyStore: function () {
                return new Promise(() => {});
            }
        };
        processEventStub = spyOn(processEvent, 'process');
        wrapper = shallow(<CurbsidePickupCheckinModal {...props} />).setState(state);
        component = wrapper.instance();
    });

    it('Trigger analytics when landing on success page', () => {
        window.digitalData.page.category.pageType = 'curbside';
        window.digitalData.page.pageInfo.pageName = 'curbside-success';
        window.digitalData.page.attributes.world = window.digitalData.page.attributes.world || 'n/a';

        const data = {
            pageName: 'curbside:curbside-success:n/a:*',
            pageType: 'curbside',
            pageTypeDetail: 'curbside-success'
        };

        component.handleSubmit(event);

        expect(processEventStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data });
    });

    afterEach(() => {
        window.digitalData = originalDigitalData;
    });
});
