const React = require('react');
const { shallow } = require('enzyme');

describe('AllBankActivity component', () => {
    let store;
    let AllBankActivity;
    let setAndWatchSpy;
    let dispatchSpy;
    let component;
    let props;

    beforeEach(() => {
        store = require('store/Store').default;
        AllBankActivity = require('components/RichProfile/BeautyInsider/PointsNSpendBank/AllBankActivity/AllBankActivity').default;
        setAndWatchSpy = spyOn(store, 'setAndWatch');
        dispatchSpy = spyOn(store, 'dispatch');
        props = { user: { profileId: '0' } };
    });

    describe('controller initialization', () => {
        describe('without user set', function () {
            beforeEach(() => {
                const wrapper = shallow(<AllBankActivity user={{}} />);
                component = wrapper.instance();
            });

            it('should not dispatch if there is no profileId', () => {
                expect(dispatchSpy).not.toHaveBeenCalled();
            });
        });

        describe('with user set', () => {
            beforeEach(() => {
                const wrapper = shallow(<AllBankActivity {...props} />);
                component = wrapper.instance();
            });

            it('should dispatch when user profileId is set', () => {
                expect(dispatchSpy).toHaveBeenCalled();
            });

            it('should set and watch \'profile.accountHistorySlice\'', () => {
                expect(setAndWatchSpy.calls.first().args[0]).toEqual('profile.accountHistorySlice');
            });

            it('should not set activities if get data from store', () => {
                const setAndWatchSpyCallback = setAndWatchSpy.calls.first().args[2];

                setAndWatchSpyCallback({});

                expect(component.state.activities).toEqual([]);
            });

            it('should set activities if get data from store', () => {
                const setAndWatchSpyCallback = setAndWatchSpy.calls.first().args[2];

                setAndWatchSpyCallback({ accountHistorySlice: { activities: [{}, {}, {}] } });

                expect(component.state.activities).toEqual([{}, {}, {}]);
            });

            it('should set shouldShowMore if get more that 10 activities', () => {
                const setAndWatchSpyCallback = setAndWatchSpy.calls.first().args[2];

                setAndWatchSpyCallback({ accountHistorySlice: { activities: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}] } });

                expect(component.state.shouldShowMore).toBeTruthy();
            });

            describe('and requests see more activities', () => {
                const event = {
                    type: 'click',
                    preventDefault: function () {}
                };

                it('should set offset', () => {
                    component.showMoreActivities(event);
                    expect(component.state.offset).toEqual(10);
                });

                it('should call getAccountHistorySlice function', () => {
                    const getAccountHistorySliceStub = spyOn(component, 'getAccountHistorySlice');

                    component.showMoreActivities(event);

                    expect(getAccountHistorySliceStub).toHaveBeenCalled();
                });
            });
        });
    });
});
