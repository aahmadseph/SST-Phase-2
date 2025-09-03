// /* eslint-disable no-unused-vars */
// /* eslint func-name-matching: 0, no-shadow: 0 */
// const wrapComponentRender = require('utils/framework/wrapComponentRender').default;

// // NOTE these tests cannot run alone, not sure why yet
// // TODO fix these?
// describe('wrapComponentRender', () => {
//     const Constants = require('utils/framework/Constants');
//     const { Ajax } = jasmine;

//     beforeEach(() => {
//         if (typeof global === 'undefined') {
//             window.global = window;
//         }

//         Sephora.rwdPersistentBanner1 = [{ componentType: 93 }, { componentType: 95 }];
//     });

//     describe('test data props', function () {
//         let wrapComponentRender, buildDataComp, buildDataUid;

//         beforeEach(() => {
//             global.process = {
//                 env: {
//                     NODE: Constants.NODE_ENV_PRODUCTION,
//                     UFE_ENV: Constants.UFE_ENV_QA
//                 }
//             };

//             Sephora.debug.displayAutomationAttr = true;

//             wrapComponentRender = require('utils/framework/wrapComponentRender').default;
//             buildDataUid = wrapComponentRender().buildDataUid;
//             buildDataComp = wrapComponentRender().buildDataComp;
//         });

//         it('buildDataUid generates 2 data-uid for QuickLookModal', function () {
//             let virtualDomElementProps = {};
//             const comp = {
//                 class: 'QuickLookModal',
//                 props: {
//                     product: { productId: 'productId' },
//                     currentSku: { skuId: 'skuId' }
//                 }
//             };
//             virtualDomElementProps = buildDataUid(comp, virtualDomElementProps);
//             expect(virtualDomElementProps['data-uid']).toContain('productId');
//             expect(virtualDomElementProps['data-uid']).toContain('skuId');
//         });

//         it('buildDataUid generates 1 data-uid for QuickLookModal if there is 1 to pass', function () {
//             let virtualDomElementProps = {};
//             const comp = {
//                 class: 'QuickLookModal',
//                 props: { product: { productId: 'productId' } }
//             };
//             virtualDomElementProps = buildDataUid(comp, virtualDomElementProps);
//             expect(virtualDomElementProps['data-uid']).toContain('productId');
//         });

//         it('buildDataUid generates data-uid for ProductItem', function () {
//             let virtualDomElementProps = {};
//             const comp = {
//                 class: 'ProductItem',
//                 props: {
//                     productId: 'productId',
//                     skuId: 'skuId'
//                 }
//             };
//             virtualDomElementProps = buildDataUid(comp, virtualDomElementProps);
//             expect(virtualDomElementProps['data-uid']).toContain('skuId');
//         });

//         it('buildDataUid generates data-uid for BccImage', function () {
//             let virtualDomElementProps = {};
//             const comp = {
//                 class: 'BccImage',
//                 props: { useMap: 'useMap' }
//             };
//             virtualDomElementProps = buildDataUid(comp, virtualDomElementProps);
//             expect(virtualDomElementProps['data-uid']).toContain('useMap');
//         });

//         it('buildDataComp should concat compsStore comps\'s class names', function () {
//             let props = {};
//             const comps = [{ class: 'Box' }, { class: 'Flex' }, { class: 'ProductItem' }];

//             props = buildDataComp(props, comps);
//             expect(props['data-comp']).toContain('Box');
//             expect(props['data-comp']).toContain('Flex');
//             expect(props['data-comp']).toContain('ProductItem');
//         });
//     });

//     describe('test wrapComponentRender() method', () => {
//         let wrapComponentRender, ComponentClass, InflateComponents, React, ReactDOM, createElementStub, renderStub;

//         beforeEach(() => {
//             Ajax.install();
//             global.process = {
//                 env: {
//                     NODE: Constants.NODE_ENV_PRODUCTION,
//                     UFE_ENV: Constants.UFE_ENV_QA
//                 }
//             };

//             React = require('react');
//             ReactDOM = require('react-dom');

//             createElementStub = spyOn(React, 'createElement');
//             renderStub = spyOn(ReactDOM, 'render');

//             require('components/Head/main.headScript.js');
//             wrapComponentRender = require('utils/framework/wrapComponentRender').default;

//             ComponentClass = function () {};
//             ComponentClass.prototype.class = 'ComponentClass';
//             ComponentClass.prototype.originClass = {};
//             ComponentClass.prototype.render = function () {
//                 return React.createElement('div', null, 'Hello world');
//             };

//             Sephora.Util.InflatorComps.Comps = {};

//             Sephora.Util.InflatorComps.Comps['ComponentClass'] = {
//                 getReactClass: function ComponentClass() {
//                     return ComponentClass;
//                 }
//             };

//             Sephora.Util.InflatorComps.Comps['ComponentClass'].class = ComponentClass;

//             ComponentClass.prototype.path = 'ComponentClass';
//             ComponentClass.prototype.displayName = 'ComponentClass';
//             ComponentClass.prototype.render = wrapComponentRender().wrapComponentRender(ComponentClass);

//             InflateComponents = require('utils/framework/InflateComponents').default;
//         });

//         afterEach(() => {
//             Ajax.uninstall();
//         });

//         it('wrapComponentRender component without controller', () => {
//             Sephora.Util.InflatorComps.render(ComponentClass, {}, {}, false);

//             expect(ComponentClass.prototype.componentDidMount).not.toBe(undefined);
//         });

//         it('wrapComponentRender component with fake controller', () => {
//             // fake controller
//             ComponentClass.prototype.ctrlr = function () {};

//             Sephora.Util.InflatorComps.render(ComponentClass, {}, {}, false);

//             expect(ComponentClass.prototype.componentDidMount).not.toBe(undefined);
//         });

//         it('wrapComponentRender component with controller and asyncRender', () => {
//             // fake controller
//             ComponentClass.prototype.ctrlr = function () {};
//             ComponentClass.prototype.hasCtrlr = 'true';
//             ComponentClass.prototype.asyncRender = 'UserInfo';

//             Sephora.Util.InflatorComps.render(ComponentClass, {}, {}, false);

//             expect(ComponentClass.prototype.componentDidMount).not.toBe(undefined);
//         });
//     });

//     describe('shouldPreventRender', () => {
//         describe('w/o shouldUpdatePropsOn', () => {
//             const baseProps = {
//                 a: 'b',
//                 d: { e: 'z' },
//                 x: new Date(),
//                 g: 4,
//                 u: true,
//                 k: null,
//                 c: () => false,
//                 b: function () {
//                     return 0;
//                 },
//                 n: function named() {
//                     return 0;
//                 }
//             };

//             it('should return true if no props changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, { ...baseProps });

//                 expect(result).toBeTrue();
//             });

//             it('should return false if a string has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     a: 'z'
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if an object has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     d: { k: 'e' }
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if a date has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     x: new Date(2000, 8, 12)
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if a number has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     g: 5
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if a boolean has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     u: false
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if a null has been changed to anything else', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     k: false
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if an anonymous func has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     c: () => true
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if a func has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     b: function () {
//                         return 1;
//                     }
//                 });

//                 expect(result).toBeFalse();
//             });

//             it('should return false if a named func has been changed', () => {
//                 const result = wrapComponentRender().shouldPreventRender(baseProps, {
//                     ...baseProps,
//                     n: function named() {
//                         return 1;
//                     }
//                 });

//                 expect(result).toBeFalse();
//             });
//         });
//     });
// });
