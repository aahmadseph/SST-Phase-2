const React = require('react');
const { shallow } = require('enzyme');

describe('RecentPointsActivity', () => {
    let wrapper;
    let getText;
    let RecentPointsActivity;
    let resourceWrapper;
    let store;
    let setAndWatchStub;
    let dispatchStub;

    beforeEach(() => {
        store = require('store/Store').default;
        RecentPointsActivity = require('components/RichProfile/BeautyInsider/RecentPointsActivity/RecentPointsActivity').default;
        resourceWrapper = require('utils/framework/resourceWrapper').default;
        const { getLocaleResourceFile } = require('utils/LanguageLocale').default;

        getText = resourceWrapper(getLocaleResourceFile('components/RichProfile/BeautyInsider/RecentPointsActivity/locales', 'RecentPointsActivity'));
        setAndWatchStub = spyOn(store, 'setAndWatch');
        dispatchStub = spyOn(store, 'dispatch');
    });

    describe('controller initialization', () => {
        let component;
        let user;

        beforeEach(() => {
            user = { profileId: '123' };
            wrapper = shallow(<RecentPointsActivity user={user} />);
            component = wrapper.instance();
        });

        it('should dispatch when user profileId is set', () => {
            expect(dispatchStub).toHaveBeenCalled();
        });

        it('should set and watch \'profile.accountHistorySlice\'', () => {
            expect(setAndWatchStub.calls.first().args[0]).toEqual('profile.accountHistorySlice');
        });

        it('should not set activities if get data from store', () => {
            const setAndWatchStubCallback = setAndWatchStub.calls.first().args[2];
            setAndWatchStubCallback({});
            expect(component.state.activities).toEqual([]);
        });

        it('should set activities if get data from store', () => {
            const setAndWatchStubCallback = setAndWatchStub.calls.first().args[2];
            setAndWatchStubCallback({ accountHistorySlice: { activities: [{}, {}, {}] } });
            expect(component.state.activities).toEqual([{}, {}, {}]);
        });
    });

    describe('User has no points', () => {
        let user;

        beforeEach(() => {
            user = { profileId: '123' };
            wrapper = shallow(<RecentPointsActivity user={user} />);
            wrapper.setState({ hasPoints: false });
        });

        it('should render no points image when user has no points', () => {
            const Image = wrapper.find('Image');
            expect(Image.prop('src')).toBe('/img/ufe/no-points.svg');
        });
    });

    describe('User has points', () => {
        let user;
        let mockedActivities;

        beforeEach(() => {
            user = { profileId: '123' };
            mockedActivities = [
                {
                    orderID: '007',
                    activityDate: '2018-06-27T09:26:54.713-0700',
                    location: 'Return/Cancel',
                    activityType: 'Beauty Insider point update',
                    description: '',
                    spendUpdate: 0,
                    ytdSpend: 100,
                    pointsUpdate: 0,
                    pointsBalance: 100
                },
                {
                    orderID: '008',
                    activityDate: '2018-07-27T09:26:54.713-0700',
                    location: 'Return/Cancel',
                    activityType: 'Cancelled redemption',
                    description: '',
                    spendUpdate: 15,
                    ytdSpend: 150,
                    pointsUpdate: 15,
                    pointsBalance: 150
                },
                {
                    orderID: '009',
                    activityDate: '2018-07-27T09:26:54.713-0700',
                    location: 'Return/Cancel',
                    activityType: 'Cancelled redemption',
                    description: '',
                    spendUpdate: -5,
                    ytdSpend: 0,
                    pointsUpdate: -5,
                    pointsBalance: 0
                }
            ];
            wrapper = shallow(<RecentPointsActivity user={user} />);
            wrapper.setState({
                activities: mockedActivities,
                hasPoints: true,
                hasMore: true
            });
        });

        it('should render viewall when hasMore is true', () => {
            const viewAll = wrapper.findWhere(n => n.name() === 'Link' && n.contains(getText('viewAll')));
            expect(viewAll.length).toEqual(1);
        });

        it('should not render viewall when hasMore is false', () => {
            wrapper.setState({ hasMore: false });
            const viewAll = wrapper.findWhere(n => n.name() === 'Link' && n.contains(getText('viewAll')));
            expect(viewAll.length).toEqual(0);
        });

        it('should displays tab', () => {
            expect(wrapper.find('BankActivityTabs').length).toEqual(1);
        });

        it('should has earned tab active', () => {
            const earnedTab = wrapper.find('BankActivityTabs > Box').at(0);
            expect(earnedTab.prop('disabled')).toBeTruthy(); // Can't be clicked
        });

        it('should has spend tab disabled', () => {
            const spendTab = wrapper.find('BankActivityTabs > Box').at(1);
            expect(spendTab.prop('disabled')).toBeFalsy();
        });

        it('should displays a points grid', () => {
            expect(wrapper.find('PointsNSpendGrid').length).toEqual(1);
        });

        it('should render a disclaimer', () => {
            const disclaimer = wrapper.findWhere(
                n => n.name() === 'Text' && n.prop('children') === 'Don’t see your points yet? Your activity will update within 24 hours.'
            );
            expect(disclaimer.length).toEqual(1);
        });

        describe('can switch tabs', () => {
            it('should changes to spend tab', () => {
                const spendTab = wrapper.find('BankActivityTabs > Box').at(1);

                spendTab.simulate('click');
                wrapper.update();
                expect(wrapper.find('BankActivityTabs > Box').at(1).prop('disabled')).toBeTruthy();
            });

            it('should changes to earned tab', () => {
                const earnedTab = wrapper.find('BankActivityTabs > Box').at(0);

                earnedTab.simulate('click');
                wrapper.update();
                expect(wrapper.find('BankActivityTabs > Box').at(0).prop('disabled')).toBeTruthy();
            });
        });
    });
});
