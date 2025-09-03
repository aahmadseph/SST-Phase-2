// const React = require('react');
// const { createSpy } = jasmine;
// const { shallow } = require('enzyme');
// const ProductSwatchItem = require('components/Product/ProductSwatchItem/ProductSwatchItem').default;
// const keyConsts = require('utils/KeyConstants').default;

// describe('ProductSwatchItem component', () => {
//     let component;
//     let preventDefaultStub;
//     let firstElementFocusStub;
//     let secondElementFocusStub;
//     let lastElementFocusStub;
//     let event;

//     beforeEach(() => {
//         const wrapper = shallow(<ProductSwatchItem />);
//         component = wrapper.instance();
//         preventDefaultStub = createSpy('preventDefaultStub');
//         firstElementFocusStub = createSpy('firstElementFocusStub');
//         secondElementFocusStub = createSpy('secondElementFocusStub');
//         lastElementFocusStub = createSpy('lastElementFocusStub');
//         event = {
//             target: {
//                 parentNode: {
//                     parentNode: {
//                         childNodes: [
//                             { firstChild: { focus: firstElementFocusStub } },
//                             { firstChild: { focus: secondElementFocusStub } },
//                             { firstChild: { focus: lastElementFocusStub } }
//                         ]
//                     }
//                 }
//             },
//             preventDefault: preventDefaultStub
//         };
//     });

//     describe('handleKeyDown', () => {
//         describe('end key', () => {
//             beforeEach(() => {
//                 event.key = keyConsts.END;
//             });

//             it('should call preventDefault', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(preventDefaultStub).toHaveBeenCalled();
//             });

//             it('should call focus for last element', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(lastElementFocusStub).toHaveBeenCalled();
//             });
//         });

//         describe('home key', () => {
//             beforeEach(() => {
//                 event.key = keyConsts.HOME;
//             });

//             it('should call preventDefault', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(preventDefaultStub).toHaveBeenCalled();
//             });

//             it('should call focus for first element', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(firstElementFocusStub).toHaveBeenCalled();
//             });
//         });

//         describe('right key', () => {
//             beforeEach(() => {
//                 event.key = keyConsts.RIGHT;
//             });

//             it('should call preventDefault', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(preventDefaultStub).toHaveBeenCalled();
//             });

//             it('should call focus for first element if index points to last element', () => {
//                 component.handleKeyDown(event, 2);
//                 expect(firstElementFocusStub).toHaveBeenCalled();
//             });

//             it('should call focus for selected element', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(secondElementFocusStub).toHaveBeenCalled();
//             });
//         });

//         describe('down key', () => {
//             beforeEach(() => {
//                 event.key = keyConsts.DOWN;
//             });

//             it('should call preventDefault', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(preventDefaultStub).toHaveBeenCalled();
//             });

//             it('should call focus for first element if index points to last element', () => {
//                 component.handleKeyDown(event, 2);
//                 expect(firstElementFocusStub).toHaveBeenCalled();
//             });

//             it('should call focus for selected element', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(secondElementFocusStub).toHaveBeenCalled();
//             });
//         });

//         describe('left key', () => {
//             beforeEach(() => {
//                 event.key = keyConsts.LEFT;
//             });

//             it('should call preventDefault', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(preventDefaultStub).toHaveBeenCalled();
//             });

//             it('should call focus for last element if index points to zero', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(lastElementFocusStub).toHaveBeenCalled();
//             });

//             it('should call focus for selected element', () => {
//                 component.handleKeyDown(event, 1);
//                 expect(firstElementFocusStub).toHaveBeenCalled();
//             });
//         });

//         describe('up key', () => {
//             beforeEach(() => {
//                 event.key = keyConsts.UP;
//             });

//             it('should call preventDefault', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(preventDefaultStub).toHaveBeenCalled();
//             });

//             it('should call focus for last element if index points to zero', () => {
//                 component.handleKeyDown(event, 0);
//                 expect(lastElementFocusStub).toHaveBeenCalled();
//             });

//             it('should call focus for selected element', () => {
//                 component.handleKeyDown(event, 1);
//                 expect(firstElementFocusStub).toHaveBeenCalled();
//             });
//         });
//     });
// });
