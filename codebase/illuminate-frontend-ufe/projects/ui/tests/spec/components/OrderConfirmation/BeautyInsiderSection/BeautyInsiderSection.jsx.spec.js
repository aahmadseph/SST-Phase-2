describe('Order Confirmation Beauty Insider Section Render', function () {
    const React = require('react');
    const { shallow } = require('enzyme');

    let props;
    let BeautyInsiderSection;
    let wrapper;

    beforeEach(() => {
        BeautyInsiderSection = require('components/OrderConfirmation/BeautyInsiderSection/BeautyInsiderSection').default;
    });

    describe('when the earned/redeemed points are available', () => {
        beforeEach(() => {
            props = { showBirthdayForAutoEnrolled: true };
            wrapper = shallow(<BeautyInsiderSection {...props} />);
        });

        it('should have data-at property for join_beauty_insider', () => {
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'join_beauty_insider');
            expect(dataAt.length).toEqual(1);
        });
    });
});
