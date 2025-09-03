const React = require('react');
const { shallow } = require('enzyme');

describe('InlineBasket component', () => {
    let InlineBasket;
    let subscribeStub;
    let store;
    let wrapper;
    let component;
    let Location;
    let ReactDOM;

    beforeEach(() => {
        store = require('store/Store').default;
        InlineBasket = require('components/InlineBasket/InlineBasket').default;
        Location = require('utils/Location').default;
        subscribeStub = spyOn(store, 'subscribe');
        ReactDOM = require('react-dom');
        spyOn(ReactDOM, 'findDOMNode').and.returnValue({
            getBoundingClientRect: () => {
                return { bottom: 0 };
            }
        });
        wrapper = shallow(<InlineBasket />);
        component = wrapper.instance();
    });

    describe('controller initialization', () => {
        it('should subscribe to the store basket', () => {
            expect(subscribeStub).toHaveBeenCalled();
        });

        it('should initialize the componet', () => {
            expect(component.state.isOpen).toBe(false);
            expect(component.state.fixed).toBe(false);
        });
    });

    describe('For large view', () => {
        beforeEach(() => {
            component.isLargeView = true;
        });

        describe('on basket page', () => {
            it('should not toggle', () => {
                spyOn(Location, 'isBasketPage').and.returnValue(true);
                wrapper = shallow(<InlineBasket />);
                component = wrapper.instance();
                component.toggleOpen(true);
                expect(component.state.isOpen).toEqual(false);
            });
        });

        describe('not on basket page', () => {
            describe('toggleOpen function', () => {
                it('should toggle', () => {
                    spyOn(Location, 'isBasketPage').and.returnValue(false);
                    const currentState = component.state.isOpen;
                    component.toggleOpen(true);
                    expect(component.state.isOpen).toEqual(!currentState);
                });
            });
        });
    });

    describe('For small view', () => {
        beforeEach(() => {
            component.isLargeView = false;
        });

        describe('on basket page', () => {
            it('should not toggle', () => {
                spyOn(Location, 'isBasketPage').and.returnValue(true);
                wrapper = shallow(<InlineBasket />);
                component = wrapper.instance();
                component.toggleOpen(true);
                expect(component.state.isOpen).toEqual(false);
            });
        });

        describe('not on basket page', () => {
            it('should toggle', () => {
                const currentState = component.state.isOpen;
                component.state.justAddedProducts = 1;
                component.toggleOpen(true);
                expect(component.state.isOpen).toEqual(!currentState);
            });
        });
    });
});
