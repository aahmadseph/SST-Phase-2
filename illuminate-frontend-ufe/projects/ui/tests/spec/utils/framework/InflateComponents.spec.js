// /* eslint-disable no-unused-vars */
// /* eslint-disable object-curly-newline */
// /* eslint-disable no-shadow */
// require('jasmine-ajax');

// describe('InflateComponents', () => {
//     const { objectContaining, Ajax } = jasmine;
//     let React, ReactDOM;
//     let createElementStub, renderStub;

//     beforeEach(() => {
//         Ajax.install();
//         Sephora.rwdPersistentBanner1 = [{ componentType: 93 }, { componentType: 95 }];
//         require('components/Head/main.headScript.js');
//     });

//     afterEach(() => {
//         Ajax.uninstall();
//     });

//     describe('render', () => {
//         let componentClass, hydrateStub;
//         beforeEach(() => {
//             Sephora.Util.InflatorComps.Comps = {};

//             const Header = require('components/Header/Header').default;
//             componentClass = Header;

//             require('utils/framework/InflateComponents');
//             React = require('react');
//             ReactDOM = require('react-dom');

//             createElementStub = spyOn(React, 'createElement');
//             renderStub = spyOn(ReactDOM, 'render');
//             hydrateStub = spyOn(ReactDOM, 'hydrate');
//         });

//         describe('element creation', () => {
//             describe('InflatorComps.render', () => {
//                 it('should call ReactDOM.hydrate whenever the hydrate flag is turned true ', () => {
//                     Sephora.Util.InflatorComps.render(componentClass, {}, {});
//                     expect(hydrateStub).toHaveBeenCalled();
//                 });

//                 it('should call ReactDOM.hydrate whenever the hydrate flag is not given', () => {
//                     Sephora.Util.InflatorComps.render(componentClass, {}, {});
//                     expect(hydrateStub).toHaveBeenCalled();
//                 });

//                 it('should call ReactDOM.render whenever the hydrate flag is turned false', () => {
//                     Sephora.Util.InflatorComps.render(componentClass, {}, {}, false);
//                     expect(renderStub).toHaveBeenCalled();
//                 });

//                 it('should render componentClass when componentClass param is an object', () => {
//                     Sephora.Util.InflatorComps.render(componentClass, {}, {}, false);

//                     expect(createElementStub).toHaveBeenCalledWith(componentClass, {});
//                 });
//             });

//             it('should render component with props', () => {
//                 var props = { x: 1 };

//                 Sephora.Util.InflatorComps.render(componentClass, props, {}, false);

//                 expect(createElementStub).toHaveBeenCalledWith(componentClass, props);
//             });
//         });

//         it('should parse component props if they are passed as string', () => {
//             const props = JSON.stringify({ a: 2 });
//             const parseStub = spyOn(JSON, 'parse');

//             Sephora.Util.InflatorComps.render(componentClass, props, {}, false);
//             expect(parseStub).toHaveBeenCalledWith(props);
//         });

//         it('should return null if props parse throws', () => {
//             const props = JSON.stringify({ a: 2 });
//             spyOn(JSON, 'parse').and.callFake(arg => {
//                 if (arg === props) {
//                     throw new Error();
//                 }
//             });
//             expect(Sephora.Util.InflatorComps.render(componentClass, props, {}, false)).toBe(null);
//         });

//         it('should render component with the created element', () => {
//             var element = { x: 1 };

//             createElementStub.and.returnValue(element);

//             Sephora.Util.InflatorComps.render(componentClass, {}, 'element', false);

//             expect(renderStub).toHaveBeenCalledWith(element, 'element');
//         });

//         it('should call ReactDOM.render on the element node', () => {
//             var element = { x: 1 };

//             createElementStub.and.returnValue(element);

//             var elementNode = { x: 2 };

//             Sephora.Util.InflatorComps.render(componentClass, {}, elementNode, false);

//             expect(renderStub).toHaveBeenCalledWith(objectContaining({}), elementNode);
//         });
//     });
// });
