const React = require('react');
const { shallow } = require('enzyme');
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const storeUtils = require('utils/Store').default;
const CurbsidePickupCheckinModalRouter =
    require('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/CurbsidePickupCheckinModalRouter').default;

describe('Trigger Analytics', () => {
    let state;
    let wrapper;
    let component;
    let processEventStub;
    let deepExtend;
    let originalDigitalData;
    let isCurbsideAvailableNow;
    let storeDetails;

    beforeEach(() => {
        deepExtend = require('utils/deepExtend');
        originalDigitalData = deepExtend({}, window.digitalData);
        processEventStub = spyOn(processEvent, 'process');
        state = {
            activeScreenIndex: 0,
            loading: false
        };
        storeDetails = {
            curbsideHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-07:00PM',
                mondayHours: '11:00AM-07:00PM',
                saturdayHours: '11:00AM-07:00PM',
                sundayHours: '12:00PM-06:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-07:00PM',
                timeZone: 'PST8PDT',
                tuesdayHours: '11:00AM-07:00PM',
                wednesdayHours: '11:00AM-07:00PM'
            },
            storeHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-07:00PM',
                mondayHours: '11:00AM-07:00PM',
                saturdayHours: '11:00AM-07:00PM',
                sundayHours: '12:00PM-06:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-07:00PM',
                timeZone: 'PST8PDT',
                tuesdayHours: '11:00AM-07:00PM',
                wednesdayHours: '11:00AM-07:00PM'
            }
        };
        isCurbsideAvailableNow = spyOn(storeUtils, 'isCurbsideAvailable');
    });

    it('Trigger analytics when landing on checkin page', () => {
        // storeStatus: open
        // activeScreenIndex: 1
        window.digitalData.page.category.pageType = 'curbside';
        window.digitalData.page.pageInfo.pageName = 'curbside-details';
        window.digitalData.page.attributes.world = window.digitalData.page.attributes.world || 'n/a';
        const data = {
            pageName: 'curbside:curbside-details:n/a:*',
            pageType: 'curbside',
            pageDetail: 'curbside-details',
            pageTypeDetail: 'curbside-details'
        };
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                isCurbsideAvailable={true}
                storeDetails={storeDetails}
            />
        ).setState(state);
        component = wrapper.instance();
        isCurbsideAvailableNow.and.returnValue(true);
        component.goToNextScreen();

        expect(processEventStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data });
    });

    it('Trigger Analytics unavailable landing on not available curbsideHours', () => {
        // storeStatus: unavailable
        // activeScreenIndex: 0
        window.digitalData.page.category.pageType = 'curbside';
        window.digitalData.page.pageInfo.pageName = 'curbside-order status pickup not available';
        window.digitalData.page.attributes.world = window.digitalData.page.attributes.world || 'n/a';

        const pageType = window.digitalData.page.category.pageType;
        const pageName = window.digitalData.page.pageInfo.pageName;
        const world = window.digitalData.page.attributes.world;

        const data = {
            pageName: `${pageType}:${pageName}:${world}:*`,
            pageType: digitalData.page.category.pageType,
            pageDetail: digitalData.page.pageInfo.pageName
        };
        storeDetails = {
            ...storeDetails,
            curbsideHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '00:00AM-00:01AM',
                mondayHours: '00:00AM-00:01AM',
                saturdayHours: '00:00AM-00:01AM',
                sundayHours: '00:00AM-00:01AM',
                textColor: 'Black',
                thursdayHours: '00:00AM-00:01AM',
                timeZone: 'PST8PDT',
                tuesdayHours: '00:00AM-00:01AM',
                wednesdayHours: '00:00AM-00:01AM'
            }
        };
        isCurbsideAvailableNow.and.returnValue(true);
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                isCurbsideAvailable={false}
                storeDetails={storeDetails}
            />
        ).setState(state);
        component = wrapper.instance();
        expect(processEventStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data });
    });

    it('Should trigger analytics when hit "Im Here for Curbside" ', () => {
        // storeStatus: open
        // activeScreenIndex: 0
        const data = {
            linkData: 'curbside:here for curbside',
            pageTypeDetail: 'curbside-pickup verification',
            pageName: 'curbside:curbside-pickup:n/a:*',
            pageType: 'curbside',
            pageDetail: 'curbside-pickup'
        };
        isCurbsideAvailableNow.and.returnValue(true);
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                isCurbsideAvailable={true}
                storeDetails={storeDetails}
            />
        ).setState(state);

        component = wrapper.instance();

        expect(processEventStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data });
    });

    it('Trigger Analytics when landing on curbside closed', () => {
        // storeStatus: closed
        // activeScreenIndex: 0
        window.digitalData.page.category.pageType = 'curbside';
        window.digitalData.page.pageInfo.pageName = 'curbside-pickup hours closed';
        window.digitalData.page.attributes.world = window.digitalData.page.attributes.world || 'n/a';

        const pageType = window.digitalData.page.category.pageType;
        const pageName = window.digitalData.page.pageInfo.pageName;
        const world = window.digitalData.page.attributes.world;

        const data = {
            pageName: `${pageType}:${pageName}:${world}:*`,
            pageType: digitalData.page.category.pageType,
            pageDetail: digitalData.page.pageInfo.pageName
        };
        storeDetails = {
            ...storeDetails,
            curbsideHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '00:00AM-00:01AM',
                mondayHours: '00:00AM-00:01AM',
                saturdayHours: '00:00AM-00:01AM',
                sundayHours: '00:00AM-00:01AM',
                textColor: 'Black',
                thursdayHours: '00:00AM-00:01AM',
                timeZone: 'PST8PDT',
                tuesdayHours: '00:00AM-00:01AM',
                wednesdayHours: '00:00AM-00:01AM'
            }
        };
        isCurbsideAvailableNow.and.returnValue(false);
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                isCurbsideAvailable={true}
                storeDetails={storeDetails}
            />
        ).setState(state);
        component = wrapper.instance();

        expect(processEventStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data });
    });

    afterEach(() => {
        window.digitalData = originalDigitalData;
    });
});

describe('Curbside Pickup Store Closed', () => {
    let state;
    let wrapper;
    let isCurbsideAvailableStub;
    let storeDetails;

    beforeEach(() => {
        state = {
            activeScreenIndex: 0,
            loading: false
        };
        storeDetails = {
            curbsideHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-07:00PM',
                mondayHours: '11:00AM-07:00PM',
                saturdayHours: '11:00AM-07:00PM',
                sundayHours: '12:00PM-06:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-07:00PM',
                timeZone: 'PST8PDT',
                tuesdayHours: '11:00AM-07:00PM',
                wednesdayHours: '11:00AM-07:00PM'
            },
            storeHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-07:00PM',
                mondayHours: '11:00AM-07:00PM',
                saturdayHours: '11:00AM-07:00PM',
                sundayHours: '12:00PM-06:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-07:00PM',
                timeZone: 'PST8PDT',
                tuesdayHours: '11:00AM-07:00PM',
                wednesdayHours: '11:00AM-07:00PM'
            }
        };
        isCurbsideAvailableStub = spyOn(storeUtils, 'isCurbsideAvailable');
    });

    it('Should render CurbsidePickupStoreClosedScreen if Store is Closed for curbside pickup', () => {
        isCurbsideAvailableStub.and.returnValue(false);
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                storeDetails={storeDetails}
                isCurbsideAvailable={true}
            />
        ).setState(state);

        expect(wrapper.find('CurbsidePickupStoreClosedScreen').exists()).toBeTruthy();
    });

    it('Should not render CurbsidePickupStoreClosedScreen if Store is Open for curbside pickup', () => {
        isCurbsideAvailableStub.and.returnValue(true);
        wrapper = shallow(<CurbsidePickupCheckinModalRouter storeDetails={storeDetails} />).setState(state);

        expect(wrapper.find('CurbsidePickupStoreClosedScreen').exists()).toBeFalsy();
    });
});

describe('Order Not Available for Curbside Pickup Error State', () => {
    let state;
    let wrapper;
    let storeDetails;
    let isCurbsideAvailableStub;

    beforeEach(() => {
        state = {
            activeScreenIndex: 0,
            loading: false
        };
        storeDetails = {
            curbsideHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-07:00PM',
                mondayHours: '11:00AM-07:00PM',
                saturdayHours: '11:00AM-07:00PM',
                sundayHours: '12:00PM-06:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-07:00PM',
                timeZone: 'PST8PDT',
                tuesdayHours: '11:00AM-07:00PM',
                wednesdayHours: '11:00AM-07:00PM'
            },
            storeHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-07:00PM',
                mondayHours: '11:00AM-07:00PM',
                saturdayHours: '11:00AM-07:00PM',
                sundayHours: '12:00PM-06:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-07:00PM',
                timeZone: 'PST8PDT',
                tuesdayHours: '11:00AM-07:00PM',
                wednesdayHours: '11:00AM-07:00PM'
            }
        };
        isCurbsideAvailableStub = spyOn(storeUtils, 'isCurbsideAvailable');
    });

    it('Should render CurbsideNotAvailableScreen', () => {
        isCurbsideAvailableStub.and.returnValue(true);
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                storeDetails={storeDetails}
                isCurbsideAvailable={false}
            />
        ).setState(state);
        expect(wrapper.find('CurbsideNotAvailableScreen').exists()).toBeTruthy();
    });

    it('Should not render CurbsideNotAvailableScreen', () => {
        isCurbsideAvailableStub.and.returnValue(true);
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                storeDetails={storeDetails}
                isCurbsideAvailable={true}
            />
        ).setState(state);
        expect(wrapper.find('CurbsideNotAvailableScreen').exists()).toBeFalsy();
    });

    it('Should render CurbsideNotAvailableScreen', () => {
        wrapper = shallow(
            <CurbsidePickupCheckinModalRouter
                storeDetails={storeDetails}
                isCurbsideAvailable={false}
            />
        ).setState(state);
        expect(wrapper.find('CurbsideNotAvailableScreen').exists()).toBeTruthy();
    });
});
