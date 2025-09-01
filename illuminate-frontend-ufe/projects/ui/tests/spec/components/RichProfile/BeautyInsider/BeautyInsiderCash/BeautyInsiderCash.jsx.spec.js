// /* eslint-disable object-curly-newline */
// const { mount, shallow } = require('enzyme');
// const { objectContaining } = jasmine;
// const AnalyticsUtils = require('analytics/utils').default;
// const BeautyInsiderCash = require('components/RichProfile/BeautyInsider/BeautyInsiderCash/BeautyInsiderCash').default;
// const LocaleUtils = require('utils/LanguageLocale').default;
// const React = require('react');
// const Store = require('store/Store').default;
// const TermsAndConditionsActions = require('actions/TermsAndConditionsActions').default;

// describe('BeautyInsiderCash component', () => {
//     let biCashOptions;

//     const buildComponent = (fullRender = false) => (fullRender ? mount : shallow)(<BeautyInsiderCash biCashOptions={biCashOptions} />);
//     const getButton = c => c.find('Button');
//     const getTable = c => c.findWhere(n => n.key() === 'BICashDenominationsList');

//     beforeEach(() => {
//         biCashOptions = {
//             eligiblePoint: 250,
//             eligibleValue: '$3',
//             eligibleCBRCount: 1,
//             missingPoints: 76,
//             thresholdValue: 75,
//             availablePromotions: [
//                 {
//                     point: 250,
//                     value: '$3'
//                 }
//             ]
//         };
//     });

//     describe('single CBR', () => {
//         it('should not render denominations table', () => {
//             expect(getTable(buildComponent()).exists()).toEqual(false);
//         });

//         it('should render the title', () => {
//             expect(buildComponent().find('[data-at="bi_cash_title"] Text').at(0).text()).toEqual('Beauty Insider Cash');
//         });

//         it('should render the InfoButton', () => {
//             expect(buildComponent().find('InfoButton').exists()).toBe(true);
//         });

//         it('should render dispatch modal on InfoButton click', () => {
//             const dispatchSpy = spyOn(Store, 'dispatch');
//             spyOn(TermsAndConditionsActions, 'showModal').and.returnValue('action777');
//             buildComponent().find('InfoButton').at(0).simulate('click');
//             expect(dispatchSpy).toHaveBeenCalledWith('action777');
//         });

//         describe('user has enough points to use a CBR', () => {
//             it('should render apply button with correct label', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('children')).toEqual('Apply in Basket');
//             });

//             it('should render apply button with correct link', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('href')).toEqual('/basket');
//             });

//             it('should render apply button with correct dataAt', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('data-at')).toEqual('bi_cash_apply_btn');
//             });

//             it('should render correct messages', () => {
//                 const wrapper = shallow(<BeautyInsiderCash biCashOptions={biCashOptions} />);
//                 const button = wrapper.find('Box[data-at="bi_cash_message"]');
//                 expect(button.exists()).toBe(true);
//             });

//             it('should render correct price for ca-fr', () => {
//                 spyOn(LocaleUtils, 'isFrench').and.returnValue(true);
//                 expect(buildComponent().find('Box[data-at="bi_cash_message"]').exists()).toBe(true);
//             });
//         });

//         describe('user is less than thresholdValue points away', () => {
//             beforeEach(() => {
//                 biCashOptions.eligibleCBRCount = 0;
//                 biCashOptions.missingPoints = 12;
//             });

//             it('should render apply button with correct label', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('children')).toEqual('Shop to Earn Points');
//             });

//             it('should render apply button with correct link', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('href')).toEqual('/');
//             });

//             it('should render apply button with correct dataAt', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('data-at')).toEqual('bi_cash_shop_btn');
//             });

//             it('should render correct messages', () => {
//                 expect(buildComponent().find('Box[data-at="bi_cash_message"]').exists()).toBe(true);
//             });
//         });

//         describe('user is more than thresholdValue points away', () => {
//             beforeEach(() => {
//                 biCashOptions.eligibleCBRCount = 0;
//                 biCashOptions.missingPoints = 77;
//             });

//             it('should render apply button with correct label', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('children')).toEqual('Shop to Earn Points');
//             });

//             it('should render apply button with correct link', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('href')).toEqual('/');
//             });

//             it('should render correct messages', () => {
//                 expect(buildComponent().find('Box[data-at="bi_cash_message"]').exists()).toBe(true);
//             });
//         });
//     });

//     describe('multi CBR', () => {
//         beforeEach(() => {
//             biCashOptions.availablePromotions.push({
//                 point: 500,
//                 value: '$10'
//             });
//         });

//         it('should render the title', () => {
//             expect(buildComponent().find('[data-at="bi_cash_title"] Text').at(0).text()).toEqual('Beauty Insider Cash');
//         });

//         it('should render the InfoButton', () => {
//             expect(buildComponent().find('InfoButton').exists()).toBe(true);
//         });

//         it('should render dispatch modal on InfoButton click', () => {
//             const dispatchSpy = spyOn(Store, 'dispatch');
//             spyOn(TermsAndConditionsActions, 'showModal').and.returnValue('action777');
//             buildComponent().find('InfoButton').at(0).simulate('click');
//             expect(dispatchSpy).toHaveBeenCalledWith('action777');
//         });

//         describe('table', () => {
//             it('should contain header row', () => {
//                 expect(getTable(buildComponent()).find('Text').first().text()).toEqual('Beauty Insider Cash Options');
//             });

//             it('should render all the options', () => {
//                 const table = getTable(buildComponent());
//                 const promos = biCashOptions.availablePromotions;

//                 for (let i = 0; i < promos.length; i++) {
//                     expect(table.find('div').at(i).text()).toEqual(`${promos[i]['value']} off: ${promos[i]['point']} points`);
//                 }
//             });
//         });

//         describe('user has enough points to use one CBR', () => {
//             it('should render apply button with correct label', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('children')).toEqual('Apply in Basket');
//             });

//             it('should render apply button with correct link', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('href')).toEqual('/basket');
//             });

//             it('should render correct messages', () => {
//                 expect(buildComponent().find('Box[data-at="bi_cash_message"]').exists()).toBe(true);
//             });
//         });

//         describe('user has enough points to use multiple CBR', () => {
//             beforeEach(() => {
//                 biCashOptions.eligibleCBRCount = 2;
//             });

//             it('should render apply button with correct label', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('children')).toEqual('Apply in Basket');
//             });

//             it('should render apply button with correct link', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('href')).toEqual('/basket');
//             });

//             it('should render correct messages', () => {
//                 expect(buildComponent().find('Box[data-at="bi_cash_message"]').exists()).toBe(true);
//             });
//         });

//         describe('user is less than thresholdValue points away', () => {
//             beforeEach(() => {
//                 biCashOptions.eligibleCBRCount = 0;
//                 biCashOptions.missingPoints = 12;
//             });

//             it('should render apply button with correct label', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('children')).toEqual('Shop to Earn Points');
//             });

//             it('should render apply button with correct link', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('href')).toEqual('/');
//             });

//             it('should render correct messages', () => {
//                 expect(buildComponent().find('Box[data-at="bi_cash_message"]').exists()).toBe(true);
//             });
//         });

//         describe('user is more than thresholdValue points away', () => {
//             beforeEach(() => {
//                 biCashOptions.eligibleCBRCount = 0;
//                 biCashOptions.missingPoints = 77;
//             });

//             it('should render apply button with correct label', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('children')).toEqual('Shop to Earn Points');
//             });

//             it('should render apply button with correct link', () => {
//                 const button = getButton(buildComponent());
//                 expect(button.prop('href')).toEqual('/');
//             });

//             it('should render correct messages', () => {
//                 expect(buildComponent().find('Box[data-at="bi_cash_message"]').exists()).toBe(true);
//             });
//         });
//     });

//     it('should update cookie "anaNextPageData" value when a user clicks on "apply in basket" button', () => {
//         // Arrange
//         const prop55 = 'bi:beauty insider cash:apply in basket';
//         const wrapper = mount(<BeautyInsiderCash biCashOptions={biCashOptions} />);
//         const button = wrapper.find('Button');

//         // Act
//         button.simulate('click');

//         // Assert
//         const anaNextPageData = AnalyticsUtils.getPreviousPageData(true);
//         expect(anaNextPageData).toEqual(objectContaining({ linkData: prop55 }));
//     });
// });
