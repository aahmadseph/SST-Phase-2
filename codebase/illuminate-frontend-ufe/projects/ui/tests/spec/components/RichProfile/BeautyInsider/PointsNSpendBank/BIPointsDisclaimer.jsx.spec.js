// describe('<BIPointsDisclaimer /> component', () => {
//     let React;
//     let BIPointsDisclaimer;
//     let shallowComponent;

//     let resourceWrapper;
//     let languageLocale;
//     let getText;

//     beforeEach(() => {
//         React = require('react');
//         BIPointsDisclaimer = require('components/RichProfile/BeautyInsider/PointsNSpendBank/BIPointsDisclaimer').default;
//         shallowComponent = enzyme.shallow(<BIPointsDisclaimer />);

//         resourceWrapper = require('utils/framework/resourceWrapper').default;
//         languageLocale = require('utils/LanguageLocale').default;

//         getText = resourceWrapper(
//             languageLocale.getLocaleResourceFile('components/RichProfile/BeautyInsider/PointsNSpendBank/locales', 'BIPointsDisclaimer')
//         );
//     });

//     it('should renders disclaimer texts', () => {
//         expect(shallowComponent.find('Box > Text').length).toEqual(3);
//     });

//     it('should render the correct text in the first paragraph', () => {
//         const firstParagraph = shallowComponent.find('Box > Text').at(0);
//         expect(enzyme.getText(firstParagraph)).toEqual(getText('firstDisclaimer'));
//     });

//     describe('second paragraph', () => {
//         let secondParagraph;

//         beforeEach(() => {
//             secondParagraph = shallowComponent.find('Box > Text').at(1);
//         });

//         it('should contain the correct text', () => {
//             expect(enzyme.getText(secondParagraph).indexOf(getText('secondDisclaimer'))).toBeTruthy();
//         });
//     });

//     it('should render the correct text in the third paragraph', () => {
//         const thirdParagraph = shallowComponent.find('Box > Text').at(2);
//         expect(enzyme.getText(thirdParagraph)).toEqual(getText('thirdDisclaimer'));
//     });
// });
