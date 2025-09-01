/* eslint-disable object-curly-newline */
const React = require('react');
const { createSpy } = jasmine;
const { mount, shallow } = require('enzyme');

describe('BiCardRewards component', () => {
    let userUtils;
    let BiCardRewards;
    let displayBiStatus;
    let propsStub;
    let component;
    let shallowComponent;

    beforeEach(() => {
        BiCardRewards = require('components/CreditCard/Rewards/ScanRewards/BiCardRewards').default;
        userUtils = require('utils/User').default;

        propsStub = { isActiveId: createSpy('isActiveId') };
        displayBiStatus = 'insider';
    });

    describe('BI status', () => {
        beforeEach(() => {
            spyOn(userUtils, 'displayBiStatus').and.returnValue(displayBiStatus);
            component = mount(<BiCardRewards {...propsStub} />);
        });

        xit('should display the image corresponding to the BI status', () => {
            expect(
                component.find('img').filterWhere(item => {
                    return item.prop('src') === `/img/ufe/bi/logo-${displayBiStatus}.svg`;
                }).length
            ).toBe(1);
        });
    });

    describe('isActiveId returns false', () => {
        beforeEach(() => {
            propsStub.isActiveId.and.returnValue(false);
            shallowComponent = shallow(<BiCardRewards {...propsStub} />);
        });

        it('should not display the BiCardReward', () => {
            expect(shallowComponent.find('BiBarcode').parent().prop('style')).toEqual({ display: 'none' });
        });
    });

    describe('isActiveId returns true', () => {
        beforeEach(() => {
            propsStub.isActiveId.and.returnValue(true);
            shallowComponent = shallow(<BiCardRewards {...propsStub} />);
        });

        it('should display the BiCardReward', () => {
            expect(shallowComponent.find('BiBarcode').parent().prop('style')).not.toEqual({ display: 'none' });
        });

        it('should render BiCardReward with profileId prop', () => {
            expect(shallowComponent.find('BiBarcode').prop('profileId')).toEqual(propsStub.profileId);
        });

        it('should render the ScanRewardButton with an id prop equal to profileId', () => {
            expect(shallowComponent.find('ScanRewardButton').prop('id')).toEqual(propsStub.profileId);
        });
    });
});
