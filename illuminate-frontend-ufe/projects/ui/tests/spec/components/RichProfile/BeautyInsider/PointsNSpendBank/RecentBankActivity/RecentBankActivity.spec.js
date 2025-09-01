const React = require('react');
const { shallow } = require('enzyme');

describe('RecentBankActivity', () => {
    let store;
    let RecentBankActivity;
    let setAndWatchSpy;
    let dispatchSpy;
    let component;
    let props;

    beforeEach(() => {
        store = require('store/Store').default;
        RecentBankActivity = require('components/RichProfile/BeautyInsider/PointsNSpendBank/RecentBankActivity/RecentBankActivity').default;
        setAndWatchSpy = spyOn(store, 'setAndWatch');
        dispatchSpy = spyOn(store, 'dispatch');
        props = { user: { profileId: '0' } };
    });

    it('should not call dispatch if user is not set on props', () => {
        const wrapper = shallow(<RecentBankActivity user={{}} />);
        component = wrapper.instance();
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    describe('whit user set on props', () => {
        beforeEach(() => {
            const wrapper = shallow(<RecentBankActivity {...props} />);
            component = wrapper.instance();
        });

        it('should call dispatch if user is not set on props', () => {
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
    });
});
