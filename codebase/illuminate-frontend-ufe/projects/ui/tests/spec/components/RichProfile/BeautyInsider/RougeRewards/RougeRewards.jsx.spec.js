import React from 'react';
import { shallow } from 'enzyme';
import RougeRewards from 'components/RichProfile/BeautyInsider/RougeRewards/RougeRewards';

describe('<RougeRewards />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<RougeRewards availableRrcCoupons={[{ denomination: 100, expirationDate: '2019-12-31', rrcCouponId: '1' }]} />);
    });

    it('should render without crashing', () => {
        expect(wrapper).not.toBeNull();
    });
});
