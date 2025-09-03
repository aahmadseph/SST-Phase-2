const React = require('react');
const { shallow } = require('enzyme');

describe('<CreditCardRewards /> component', () => {
    let CreditCardRewards;
    let propsStub;
    let shallowComponent;

    beforeEach(() => {
        CreditCardRewards = require('components/CreditCard/Rewards/ScanRewards/CreditCardRewards').default;
        propsStub = {
            activeId: '1',
            rewardCertificates: [
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW08810684184611',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 10,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '128',
                    certificateNumber: 'RW40840894322810',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 20,
                    startDate: '2018-06-01'
                }
            ]
        };
        shallowComponent = shallow(<CreditCardRewards {...propsStub} />);
    });

    describe('Barcode', () => {
        it('should render as many Barcode components as the length of rewardCertificates', () => {
            expect(shallowComponent.find('Barcode').length).toBe(propsStub.rewardCertificates.length);
        });

        it('should render the Barcode with an id prop equal to certificateNumber', () => {
            shallowComponent.find('Barcode').forEach((item, index) => {
                expect(item.prop('id')).toEqual(propsStub.rewardCertificates[index].certificateNumber);
            });
        });
    });

    describe('ScanRewardButton', () => {
        it('should render as many ScanRewardButton components as the length of rewardCertificates', () => {
            expect(shallowComponent.find('ScanRewardButton').length).toBe(propsStub.rewardCertificates.length);
        });

        it('should render the ScanRewardButton with an id prop equal to certificateNumber', () => {
            shallowComponent.find('ScanRewardButton').forEach((item, index) => {
                expect(item.prop('id')).toEqual(propsStub.rewardCertificates[index].certificateNumber);
            });
        });
    });

    describe('active id returns false', () => {
        beforeEach(() => {
            propsStub.activeId = '1';
            shallowComponent = shallow(<CreditCardRewards {...propsStub} />);
        });

        it('should not display the Barcode', () => {
            shallowComponent.find('Barcode').forEach(item => {
                expect(item.parent().prop('style')).toEqual({ display: 'none' });
            });
        });
    });

    describe('rewardAmount', () => {
        it('should display the bolded rewardAmount', () => {
            shallowComponent.find('b').forEach((item, index) => {
                expect(item.prop('children').trim()).toEqual(`$${propsStub.rewardCertificates[index].rewardAmount}`);
            });
        });
    });

    describe('expireDate', () => {
        it('should display the expiry date', () => {
            expect(shallowComponent.find('Text').get(2).props.children).toEqual(propsStub.rewardCertificates[0].expireDate);
        });
    });

    describe('certificateNumber', () => {
        it('should display the certificate number', () => {
            expect(shallowComponent.find('Text').get(3).props.children).toEqual(propsStub.rewardCertificates[0].certificateNumber);
        });
    });
});
