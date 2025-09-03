// const React = require('react');
// const { shallow } = enzyme;

// const createPage = blurb => ({
//     slug: 'slug 1',
//     title: 'page title 1',
//     pageId: 'page 1',
//     sampleProduct: {
//         sku: 'sku 1',
//         url: 'url 1',
//         name: 'name 1',
//         blurb,
//         imageUrl: 'image url 1'
//     }
// });

// const createSkus = () => ({
//     1: { skuId: 1 }
// });

// const createContentSections = (introContent = []) => ({ contentSections: [introContent, [{ data: [{ sku: 1 }] }]] });

// const rawBuyPageInfo = {
//     slug: 'bright-lipstick',
//     title: 'bright lipstick',
//     translations: {
//         fr: {
//             title: 'rouge à lèvres brillant',
//             metaDescription:
//                 'Trouvez le rouge à lèvres brillant parfait pour votre look. Découvrez la collection Sephora de teintes de rouge à lèvres vives, y compris des couleurs fluo et vives.'
//         }
//     }
// };

// const text = {
//     relatedOnText: 'Related on Sephora.com:',
//     prefferedProducts: 'Sephora customers often prefer the following products when searching for',
//     productsRelated: 'Products related to'
// };

// describe('BuyPage component', () => {
//     let BuyPage;

//     beforeEach(() => {
//         BuyPage = require('components/BuyPage/RwdBuy/BuyPage').default;
//     });

//     it('digitalData Page Load Analytics set on Mount', () => {
//         const wrapper = shallow(
//             <BuyPage
//                 text={text}
//                 buyData={{ rawBuyPageInfo }}
//             />
//         );
//         const component = wrapper.instance();
//         component.componentDidMount();

//         expect(digitalData.page.category.pageType).toBe('seop');
//         expect(digitalData.page.pageInfo.pageName).toBe(rawBuyPageInfo.slug);
//         expect(digitalData.page.attributes.world).toBe('n/a');
//         expect(digitalData.page.attributes.additionalPageInfo).toBe('');
//         expect(digitalData.page.attributes.sephoraPageInfo.pageName).toBe(`seop:${rawBuyPageInfo.slug}:n/a:*`);
//     });

//     describe('should render', () => {
//         describe('related pages', () => {
//             it('with only ProductImage', () => {
//                 const wrapper = shallow(
//                     <BuyPage
//                         text={text}
//                         buyData={{
//                             rawBuyPageInfo: {
//                                 ...rawBuyPageInfo,
//                                 relatedPages: [createPage('blurb 1'), createPage('blurb 2')],
//                                 ...createContentSections()
//                             },
//                             skus: createSkus()
//                         }}
//                     />
//                 );
//                 expect(wrapper.find('ProductImage').length).toBe(2);
//                 expect(wrapper.find('Link').length).toBe(0);
//             });

//             it('with only Link', () => {
//                 const wrapper = shallow(
//                     <BuyPage
//                         text={text}
//                         buyData={{
//                             rawBuyPageInfo: {
//                                 ...rawBuyPageInfo,
//                                 relatedPages: [createPage(''), createPage('')],
//                                 ...createContentSections()
//                             },
//                             skus: createSkus()
//                         }}
//                     />
//                 );
//                 expect(wrapper.find('ProductImage').length).toBe(0);
//                 expect(wrapper.find('Link').length).toBe(2);
//             });

//             it('with no ProductImage or Link', () => {
//                 const wrapper = shallow(
//                     <BuyPage
//                         text={text}
//                         buyData={{
//                             rawBuyPageInfo: {
//                                 ...rawBuyPageInfo,
//                                 relatedPages: []
//                             },
//                             skus: createSkus()
//                         }}
//                     />
//                 );
//                 expect(wrapper.find('ProductImage').length).toBe(0);
//                 expect(wrapper.find('Link').length).toBe(0);
//             });

//             it('with both ProductImage and Link', () => {
//                 const wrapper = shallow(
//                     <BuyPage
//                         text={text}
//                         buyData={{
//                             rawBuyPageInfo: {
//                                 ...rawBuyPageInfo,
//                                 relatedPages: [createPage('blurb 1'), createPage('')],
//                                 ...createContentSections()
//                             },
//                             skus: createSkus()
//                         }}
//                     />
//                 );
//                 expect(wrapper.find('ProductImage').length).toBe(1);
//                 expect(wrapper.find('Link').length).toBe(1);
//             });
//         });

//         describe('skus', () => {
//             it('with BuyItem', () => {
//                 const wrapper = shallow(
//                     <BuyPage
//                         text={text}
//                         buyData={{
//                             rawBuyPageInfo: {
//                                 ...rawBuyPageInfo,
//                                 contentSections: [
//                                     [],
//                                     [
//                                         {
//                                             data: [{ sku: 1 }]
//                                         }
//                                     ]
//                                 ]
//                             },
//                             skus: createSkus()
//                         }}
//                     />
//                 );
//                 expect(wrapper.children(0).at(3).length).toBe(1);
//             });

//             it('with no BuyItem', () => {
//                 const wrapper = shallow(
//                     <BuyPage
//                         text={text}
//                         buyData={{
//                             rawBuyPageInfo,
//                             skus: []
//                         }}
//                     />
//                 );
//                 expect(wrapper.find('BuyItem').length).toBe(0);
//             });
//         });
//     });

//     describe('should pass content section', () => {
//         it('intro content to Text children prop ', () => {
//             const wrapper = shallow(
//                 <BuyPage
//                     text={text}
//                     buyData={{
//                         rawBuyPageInfo: {
//                             ...rawBuyPageInfo,
//                             ...createContentSections([
//                                 {
//                                     contentText: 'contentText'
//                                 }
//                             ]),
//                             skus: createSkus()
//                         }
//                     }}
//                 />
//             );
//             expect(wrapper.find('Text').at(2).props().children).toBe('contentText');
//         });

//         it('product content to BuyItem content prop', () => {
//             const wrapper = shallow(
//                 <BuyPage
//                     text={text}
//                     buyData={{
//                         rawBuyPageInfo: {
//                             ...rawBuyPageInfo,
//                             ...createContentSections()
//                         },
//                         skus: createSkus()
//                     }}
//                 />
//             );

//             expect(wrapper.children(0).at(3).prop('content')).toEqual({ sku: 1 });
//         });
//     });
// });
