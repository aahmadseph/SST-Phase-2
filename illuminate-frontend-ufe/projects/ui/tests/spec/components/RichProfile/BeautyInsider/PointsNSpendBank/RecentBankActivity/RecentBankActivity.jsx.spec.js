describe('<RecentBankActivity /> component', () => {
    let React;
    let RecentBankActivity;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        RecentBankActivity = require('components/RichProfile/BeautyInsider/PointsNSpendBank/RecentBankActivity/RecentBankActivity').default;
    });

    describe('whitout activities', () => {
        beforeEach(() => {
            shallowComponent = enzyme.shallow(<RecentBankActivity user={{ profileId: 0 }} />);
        });

        it('should not displays tabs', () => {
            expect(shallowComponent.find('BankActivityTabs').length).toEqual(0);
        });

        it('should displays no points warning', () => {
            expect(shallowComponent.find('BIPointsWarnings').length).toEqual(1);
        });

        it('should displays no points disclaimer', () => {
            expect(shallowComponent.find('BIPointsDisclaimer').length).toEqual(1);
        });
    });

    describe('with activities', () => {
        const mockedActivities = [
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
                orderID: '008',
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

        beforeEach(() => {
            shallowComponent = enzyme.shallow(<RecentBankActivity user={{ profileId: 0 }} />).setState({ activities: mockedActivities });
        });

        it('should displays tab', () => {
            expect(shallowComponent.find('BankActivityTabs').length).toEqual(1);
        });

        it('should have earned tab active', () => {
            const earnedTab = shallowComponent.find('BankActivityTabs > Box').at(0);
            expect(earnedTab.prop('disabled')).toBeTruthy(); // Can't be clicked
        });

        it('should have spend tab disabled', () => {
            const spendTab = shallowComponent.find('BankActivityTabs > Box').at(1);
            expect(spendTab.prop('disabled')).toBeFalsy();
        });

        it('should displays a points grid', () => {
            expect(shallowComponent.find('PointsNSpendGrid').length).toEqual(1);
        });

        it('should displays no points disclaimer', () => {
            expect(shallowComponent.find('BIPointsDisclaimer').length).toEqual(1);
        });

        describe('can switch tabs', () => {
            it('should changes to spend tab', () => {
                const spendTab = shallowComponent.find('BankActivityTabs > Box').at(1);

                spendTab.simulate('click');
                shallowComponent.update();
                expect(shallowComponent.find('BankActivityTabs > Box').at(1).prop('disabled')).toBeTruthy();
            });

            it('should changes to earned tab', () => {
                const earnedTab = shallowComponent.find('BankActivityTabs > Box').at(0);

                earnedTab.simulate('click');
                shallowComponent.update();
                expect(shallowComponent.find('BankActivityTabs > Box').at(0).prop('disabled')).toBeTruthy();
            });
        });
    });
});
