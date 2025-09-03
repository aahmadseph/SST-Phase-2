const React = require('react');
const { shallow } = require('enzyme');

describe('<AllBankActivity /> ', () => {
    let shallowComponent;

    const AllBankActivity = require('components/RichProfile/BeautyInsider/PointsNSpendBank/AllBankActivity/AllBankActivity').default;
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

    describe('without activities', () => {
        beforeEach(() => {
            shallowComponent = shallow(<AllBankActivity user={{ profileId: 0 }} />);
        });

        it('should displays title', () => {
            expect(shallowComponent.find('Text').prop('children')).toEqual('Points Activity');
        });

        it('should displays points warning', () => {
            expect(shallowComponent.find('BIPointsWarnings').length).toEqual(1);
        });
    });

    describe('with activities', () => {
        beforeEach(() => {
            shallowComponent = shallow(<AllBankActivity user={{ profileId: 0 }} />).setState({ activities: mockedActivities });
        });

        it('should displays tab', () => {
            expect(shallowComponent.find('BankActivityTabs').length).toEqual(1);
        });

        it('should has earned tab active', () => {
            const earnedTab = shallowComponent.find('BankActivityTabs > Box').at(0);
            expect(earnedTab.prop('disabled')).toBeTruthy(); // Can't be clicked
        });

        it('should has spend tab disabled', () => {
            const spendTab = shallowComponent.find('BankActivityTabs > Box').at(1);
            expect(spendTab.prop('disabled')).toBeFalsy();
        });

        it('should displays a points grid', () => {
            expect(shallowComponent.find('PointsNSpendGrid').length).toEqual(1);
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

    describe('when reaches max activities', () => {
        const activitiesMaker = activitiesCnt => {
            const activities = [];

            for (let i = 0; i < activitiesCnt; i++) {
                const activityMocked = {
                    orderID: '00' + i,
                    activityDate: '2018-07-27T09:26:54.713-0700',
                    location: 'Return/Cancel',
                    activityType: 'Cancelled redemption',
                    description: '',
                    spendUpdate: 15,
                    ytdSpend: 150,
                    pointsUpdate: 15,
                    pointsBalance: 150
                };
                activities.push(activityMocked);
            }

            return activities;
        };

        it('should displays Max Activities message', () => {
            shallowComponent = shallow(<AllBankActivity user={{ profileId: 0 }} />).setState({ activities: activitiesMaker(150) });

            const maxActivitiesMessage = shallowComponent.find('Text').at(1);
            expect(maxActivitiesMessage.prop('children')).toEqual('Only your most recent 150 records are available to display.');
        });
    });

    /*
    describe('when should shows more activities', () => {
        beforeEach(() => {
            shallowComponent = shallow(<AllBankActivity user={{ profileId: 0 }}/>)
                .setState({
                    shouldShowMore: true
                });
        });

        it('should displays Show More Activities link', () => {
            expect(shallowComponent.find('Link').prop('children'))
                .toEqual('View more transactions');
        });

        it('should calls showMoreActivities when clicks on Show More Activities Link link', () => {
            const component = shallowComponent.instance();
            const showMoreActivitiesSpy = spyOn(component, 'showMoreActivities');

            shallowComponent.find('Link').at(0).simulate('click');

            expect(showMoreActivitiesSpy).toHaveBeenCalled();
        });
    });
    */
});
