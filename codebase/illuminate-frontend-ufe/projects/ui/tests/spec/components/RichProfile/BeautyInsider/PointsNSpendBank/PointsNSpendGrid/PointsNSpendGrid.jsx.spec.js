// describe('<PointsNSpendGrid /> component', () => {
//     let React;
//     let PointsNSpendGrid;
//     let shallowComponent;
//     const mockedEarnedActivities = [
//         {
//             orderID: '007',
//             activityDate: '2018-06-27T09:26:54.713-0700',
//             location: 'Return/Cancel',
//             activityType: 'Beauty Insider point update',
//             description: '',
//             pointsUpdate: 0,
//             pointsBalance: 100
//         },
//         {
//             orderID: '008',
//             activityDate: '2018-07-27T09:26:54.714-0700',
//             location: 'Return/Cancel',
//             activityType: 'Cancelled redemption',
//             description: '',
//             pointsUpdate: 15,
//             pointsBalance: 150
//         },
//         {
//             orderID: '008',
//             activityDate: '2018-07-27T09:26:54.715-0700',
//             activityType: 'Cancelled redemption',
//             description: '',
//             pointsUpdate: -5,
//             pointsBalance: 0
//         }
//     ];

//     const mockedSpendActivities = [
//         {
//             orderID: '007',
//             activityDate: '2018-06-27T09:26:54.713-0700',
//             location: 'Return/Cancel',
//             activityType: 'Beauty Insider point update',
//             description: '',
//             spendUpdate: 0,
//             ytdSpend: 100
//         },
//         {
//             orderID: '008',
//             activityDate: '2018-07-27T09:26:54.713-0700',
//             location: 'Return/Cancel',
//             activityType: 'Cancelled redemption',
//             description: '',
//             spendUpdate: 15,
//             ytdSpend: 150
//         },
//         {
//             orderID: '008',
//             activityDate: '2018-07-27T09:26:54.713-0700',
//             location: 'Return/Cancel',
//             activityType: 'Cancelled redemption',
//             description: '',
//             spendUpdate: -5,
//             ytdSpend: 0
//         }
//     ];

//     describe('on points activities', () => {
//         beforeEach(() => {
//             React = require('react');
//             PointsNSpendGrid = require('components/RichProfile/BeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid').default;
//             shallowComponent = enzyme.shallow(
//                 <PointsNSpendGrid
//                     activities={mockedEarnedActivities}
//                     type='earned'
//                     typeLabel={'Earned Points'}
//                 />
//             );
//         });

//         it('should render properly', () => {
//             expect(shallowComponent.find('table').exists()).toBeTruthy();
//         });

//         it('should display correct table title', () => {
//             const tableTitleList = shallowComponent.find('th');
//             expect(tableTitleList.at(1).text()).toEqual('Earned Points');
//         });

//         it('should display correct number of activities', () => {
//             expect(shallowComponent.find('tbody tr').length).toEqual(3);
//         });

//         describe('displays correct points earned', () => {
//             it('for 0 points earned', () => {
//                 const firstActivity = shallowComponent.find('tbody tr').at(0);

//                 expect(firstActivity.find('td').at(1).text()).toEqual('—');
//             });

//             it('for 0 > point earned', () => {
//                 const secondActivity = shallowComponent.find('tbody tr').at(1);

//                 expect(secondActivity.find('td').at(1).text()).toEqual('+15');
//             });

//             it('for 0 < point earned', () => {
//                 const thirdActivity = shallowComponent.find('tbody tr').at(2);

//                 expect(thirdActivity.find('td').at(1).text()).toEqual('-5');
//             });
//         });

//         describe('displays correct total', () => {
//             it('for update > 0', () => {
//                 const firstActivity = shallowComponent.find('tbody tr').at(0);

//                 expect(firstActivity.find('td').at(2).text()).toEqual('—');
//             });

//             it('for update 0', () => {
//                 const thirdActivity = shallowComponent.find('tbody tr').at(1);

//                 expect(thirdActivity.find('td').at(2).text()).toEqual('150');
//             });
//         });
//     });

//     describe('on spend activities', () => {
//         beforeEach(() => {
//             React = require('react');
//             PointsNSpendGrid = require('components/RichProfile/BeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid').default;
//             shallowComponent = enzyme.shallow(
//                 <PointsNSpendGrid
//                     activities={mockedSpendActivities}
//                     type='spent'
//                     typeLabel={'Spend'}
//                 />
//             );
//         });

//         it('should render properly', () => {
//             expect(shallowComponent.find('table').exists()).toBeTruthy();
//         });

//         it('should display correct table title', () => {
//             const tableTitleList = shallowComponent.find('th');
//             expect(tableTitleList.at(1).text()).toEqual('Spend');
//         });

//         it('should display correct number of activities', () => {
//             expect(shallowComponent.find('tbody tr').length).toEqual(3);
//         });

//         describe('displays correct points earned', () => {
//             it('for 0 points earned', () => {
//                 const firstActivity = shallowComponent.find('tbody tr').at(0);

//                 expect(firstActivity.find('td').at(1).text()).toEqual('—');
//             });

//             it('for more than 0 point earned', () => {
//                 const secondActivity = shallowComponent.find('tbody tr').at(1);

//                 expect(secondActivity.find('td').at(1).text()).toEqual('$15');
//             });

//             it('for less than point earned', () => {
//                 const thirdActivity = shallowComponent.find('tbody tr').at(2);

//                 expect(thirdActivity.find('td').at(1).text()).toEqual('-$5');
//             });
//         });

//         describe('displays correct total', () => {
//             let thirdActivity;

//             beforeEach(() => {
//                 // Locate the third activity once
//                 thirdActivity = shallowComponent.find('tbody tr').at(1);
//             });

//             it('for update < 0', () => {
//                 const firstActivity = shallowComponent.find('tbody tr').at(0);

//                 expect(firstActivity.find('td').at(2).text()).toEqual('—');
//             });

//             it('for update > 0', () => {
//                 expect(thirdActivity.find('td').at(2).text()).toEqual('$150');
//             });
//         });
//     });
// });
