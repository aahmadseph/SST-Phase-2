const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const ScanRewardButton = require('components/CreditCard/Rewards/ScanRewards/ScanRewardButton').default;

describe('ScanRewardButton component', () => {
    let propsStub;
    let wrapper;

    beforeEach(() => {
        propsStub = {
            activeId: '1',
            showBarCode: createSpy('showBarCode')
        };
        wrapper = shallow(<ScanRewardButton {...propsStub} />);
    });

    describe('Button onclick', () => {
        it('should call showBarCode once', () => {
            wrapper.find('Button').simulate('click');
            expect(propsStub.showBarCode).toHaveBeenCalledTimes(1);
        });
    });

    describe('isActiveId returns true', () => {
        beforeEach(() => {
            propsStub.id = '1';
            wrapper = shallow(<ScanRewardButton {...propsStub} />);
        });

        it('should not display the Button', () => {
            expect(wrapper.find('Button').prop('style')).toEqual({ display: 'none' });
        });
    });

    describe('isActiveId returns false', () => {
        beforeEach(() => {
            propsStub.id = '2';
            wrapper = shallow(<ScanRewardButton {...propsStub} />);
        });

        it('should display the Button', () => {
            expect(wrapper.find('Button').prop('style')).not.toEqual({ display: 'none' });
        });
    });
});
