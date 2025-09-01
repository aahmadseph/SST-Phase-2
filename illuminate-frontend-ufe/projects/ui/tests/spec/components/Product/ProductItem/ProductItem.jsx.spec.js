// /* eslint-disable object-curly-newline */
// const React = require('react');
// const { createSpy } = jasmine;
// const { mount, shallow } = require('enzyme');
// const skuUtils = require('utils/Sku').default;
// const localeUtils = require('utils/LanguageLocale').default;

// describe('ProductItem component', () => {
//     let ProductItem;
//     let ProductImage;
//     let ProductQuicklook;
//     let ProductLove;
//     let ProductBadges;
//     let ProductDisplayName;
//     let Button;
//     let AddToBasketButton;
//     let marketingFlagsUtil;

//     const marketingFlagsTestSelector = 'div[data-marketing-flags]';

//     beforeEach(() => {
//         ProductItem = require('components/Product/ProductItem/ProductItem').default;
//         ProductImage = require('components/Product/ProductImage/ProductImage').default;
//         ProductQuicklook = require('components/Product/ProductQuicklook/ProductQuicklook').default;
//         ProductLove = require('components/Product/ProductLove/ProductLove').default;
//         ProductBadges = require('components/Product/ProductBadges/ProductBadges').default;
//         ProductDisplayName = require('components/Product/ProductDisplayName/ProductDisplayName').default;
//         Button = require('components/Button/Button').default;
//         AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton').default;
//         marketingFlagsUtil = require('utils/MarketingFlags').default;
//         global.braze = { logCustomEvent: createSpy('logCustomEvent') };
//     });

//     it('should have initial hover state', () => {
//         const wrapper = shallow(<ProductItem />);
//         expect(wrapper.state().hover).toEqual(false);
//     });

//     it('contains <ProductImage /> component', () => {
//         const wrapper = mount(<ProductImage />);
//         expect(wrapper.find(ProductImage).length).toEqual(1);
//     });

//     it('contains <ProductQuicklook /> component', () => {
//         const wrapper = mount(<ProductQuicklook sku={{ type: skuUtils.skuTypes.STANDARD }} />);
//         expect(wrapper.find(ProductQuicklook).length).toEqual(1);
//     });

//     it('contains <ProductLove /> component', () => {
//         const wrapper = mount(
//             <ProductLove
//                 sku={{ skuid: '1234' }}
//                 children={[<div>child</div>]}
//             />
//         );
//         expect(wrapper.find(ProductLove).length).toEqual(1);
//     });

//     it('contains <ProductBadges /> component', () => {
//         const wrapper = mount(<ProductBadges sku='1626043' />);
//         expect(wrapper.find(ProductBadges).length).toEqual(1);
//     });

//     it('contains <ProductDisplayName /> component', () => {
//         const wrapper = mount(<ProductDisplayName />);
//         expect(wrapper.find(ProductDisplayName).length).toEqual(1);
//     });

//     describe('with review and rating enabled', () => {
//         let wrapper;
//         beforeEach(() => {
//             wrapper = shallow(
//                 <ProductItem
//                     showReviews={true}
//                     starRatings={5}
//                     productReviewCount={10}
//                 />
//             );
//         });

//         it('should contains <StarRating /> component', () => {
//             expect(wrapper.find('StarRating').length).toBe(1);
//         });

//         it('should pass star rating to <StarRating /> component properly', () => {
//             expect(wrapper.find('StarRating').prop('rating')).toBe(5);
//         });

//         it('should contains <ReviewCount /> component', () => {
//             expect(wrapper.find('ReviewCount').length).toBe(1);
//         });

//         it('should pass review count to <ReviewCount /> component properly', () => {
//             expect(wrapper.find('ReviewCount').prop('productReviewCount')).toBe(10);
//         });
//     });

//     it('contains <Button /> component', () => {
//         const wrapper = mount(<Button />);
//         expect(wrapper.find(Button).length).toEqual(1);
//     });

//     it('contains <AddToBasketButton /> component', () => {
//         const wrapper = mount(
//             <AddToBasketButton
//                 sku='1626043'
//                 type='OUTLINE'
//             />
//         );
//         expect(wrapper.find(AddToBasketButton).length).toEqual(1);
//     });

//     it('should NOT render marketing flags if showMarketingFlags is false', () => {
//         const wrapper = mount(<ProductItem />);
//         const props = {
//             showMarketingFlags: false,
//             // first marketing flag: true
//             [marketingFlagsUtil.MARKETING_FLAGS_ORDERED_MAP[0]['key']]: true
//         };
//         wrapper.setProps(props, () => {
//             expect(wrapper.find(marketingFlagsTestSelector).length).toEqual(0);
//         });
//     });

//     it('should NOT show marketing flags if not passed or false', () => {
//         const wrapper = mount(<ProductItem />);
//         const props = {
//             showMarketingFlags: true,
//             // first marketing flag: false
//             [marketingFlagsUtil.MARKETING_FLAGS_ORDERED_MAP[0]['key']]: false
//         };
//         wrapper.setProps(props, () => {
//             expect(wrapper.find(marketingFlagsTestSelector).text().trim().length).toEqual(0);
//         });
//     });

//     it('should show a single marketing flag according to the priority', () => {
//         const wrapper = mount(<ProductItem />);
//         const getText = localeUtils.getLocaleResourceFile('utils/locales', 'MarketingFlags');
//         const props = {
//             showMarketingFlags: true
//         };
//         // init, all flags are on in props
//         marketingFlagsUtil.MARKETING_FLAGS_ORDERED_MAP.forEach(flag => {
//             props[flag.key] = true;
//         });

//         // set flags to false one-by-one and test the output
//         marketingFlagsUtil.MARKETING_FLAGS_ORDERED_MAP.forEach(flag => {
//             wrapper.setProps(Object.assign(props), () => {
//                 const textShouldBeShown = getText(flag.text);
//                 const textActualyShown = wrapper.find(marketingFlagsTestSelector).text().trim();
//                 expect(textShouldBeShown).toEqual(textActualyShown);
//             });
//             props[flag.key] = false;
//         });
//     });

//     describe('"View similar products" link', () => {
//         const props = { viewSimilarProductsText: 'View similar products' };
//         it('should be rendered when isDesktop and parent category is New (12800020)', () => {
//             const wrapper = shallow(<ProductItem {...props} />);
//             spyOn(window.Sephora, 'isDesktop').and.returnValue(true);
//             wrapper.setProps({ firstParentCategoryId: '12800020' });
//             expect(wrapper.find('Link').at(0).prop('children')).toEqual('View similar products');
//         });

//         it('data-at should be rendered when isDesktop and parent category is New (12800020)', () => {
//             const wrapper = shallow(<ProductItem />);
//             spyOn(window.Sephora, 'isDesktop').and.returnValue(true);
//             wrapper.setProps({ firstParentCategoryId: '12800020' });
//             expect(wrapper.find('Link').at(0).prop('data-at')).toBe('view_similar_products_link');
//         });

//         it('should be rendered when isDesktop and parent category is Bestsellers (14300062)', () => {
//             const wrapper = shallow(<ProductItem {...props} />);
//             spyOn(window.Sephora, 'isDesktop').and.returnValue(true);
//             wrapper.setProps({ firstParentCategoryId: '14300062' });
//             expect(wrapper.find('Link').at(0).prop('children')).toEqual('View similar products');
//         });

//         it('data-at should be rendered when isDesktop and parent category is Bestsellers (14300062)', () => {
//             const wrapper = shallow(<ProductItem />);
//             spyOn(window.Sephora, 'isDesktop').and.returnValue(true);
//             wrapper.setProps({ firstParentCategoryId: '14300062' });
//             expect(wrapper.find('Link').at(0).prop('data-at')).toBe('view_similar_products_link');
//         });

//         it('should not be rendered when isDesktop and parent category neither New or Bestsellers', () => {
//             const wrapper = shallow(<ProductItem />);
//             spyOn(window.Sephora, 'isDesktop').and.returnValue(true);
//             expect(wrapper.find('Link').length).toBe(0);
//         });

//         it('should not be rendered when parent category is New (12800020), but is not Desktop', () => {
//             const wrapper = shallow(<ProductItem />);
//             spyOn(window.Sephora, 'isDesktop').and.returnValue(false);
//             wrapper.setProps({ firstParentCategoryId: '12800020' });
//             expect(wrapper.find('Link').length).toBe(0);
//         });
//     });

//     describe('add matchedSkuId to URL when displaying in multi-shade finder results page', () => {
//         it('should add the matchedSkuId parameter to the ur', () => {
//             const props = {
//                 isCountryRestricted: false,
//                 targetUrl: 'product/kvd-vegan-beauty-good-apple-skin-perfecting-foundation-balm-P469488?skuId=2420040&amp;icid2=skugrid:p469488',
//                 isShadeFinderResults: true,
//                 skuId: '123456'
//             };
//             const wrapper = shallow(<ProductItem {...props} />);
//             const productItemLink = wrapper.find('a');

//             expect(productItemLink.prop('href')).toContain('matchedSkuId');
//         });
//     });
// });
