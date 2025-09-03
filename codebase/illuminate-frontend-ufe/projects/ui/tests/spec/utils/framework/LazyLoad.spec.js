const { createSpy } = jasmine;

describe('LazyLoad', () => {
    let LazyLoad;
    let UI;
    const Events = require('utils/framework/Events').default;

    beforeEach(() => {
        LazyLoad = require('utils/framework/LazyLoad').default.LazyLoaderInstance;
        UI = require('utils/UI').default;
        window.requestAnimationFrame = null;
    });

    describe('initialization', () => {
        it('should initialize the targets array', () => {
            expect(LazyLoad.targets).toBeDefined();
        });

        it('should initialize the observer prop', () => {
            expect(LazyLoad.observer).toBeDefined();
        });
    });

    describe('registerItem method', () => {
        const target = {
            x: 'a',
            getBoundingClientRect: function () {
                return {
                    top: 50,
                    bottom: 250
                };
            }
        };

        beforeEach(() => {
            LazyLoad.observer = { observe: jasmine.createSpy() };
        });

        it('should add all the instances to existing targets array', () => {
            LazyLoad._registerItem(target);
            LazyLoad._registerItem(target);
            LazyLoad._registerItem(target);

            expect(LazyLoad.targets[0].items.length).toBe(3);
        });

        describe('target loadItems method', () => {
            let callback;
            beforeEach(() => {
                callback = jasmine.createSpy();
            });

            it('should set loaded property to true', () => {
                LazyLoad._registerItem(target, 'component', callback);
                LazyLoad.targets[0].items = [callback];
                LazyLoad.targets[0].loadItems();

                expect(LazyLoad.targets[0].loaded).toBe(true);
            });
        });
    });

    describe('scrollCallback method', () => {
        let entries;
        let requestFrameSpy;

        beforeEach(() => {
            entries = [
                {
                    isIntersecting: false,
                    target: {}
                },
                {
                    isIntersecting: false,
                    target: {}
                }
            ];
            LazyLoad.targets = [
                {
                    container: entries[0].target,
                    loaded: false,
                    loadItems: function () {
                        this.loaded = true;
                    }
                },
                {
                    container: entries[1].target,
                    loaded: false,
                    loadItems: function () {
                        this.loaded = true;
                    }
                }
            ];
            requestFrameSpy = spyOn(UI, 'requestFrame').and.callFake(key => key());
        });

        it('should not request UI frame if not targets to process', () => {
            LazyLoad._scrollCallback(entries);
            expect(requestFrameSpy).not.toHaveBeenCalled();
        });

        it('should request UI frame if at least 1 item started to intersect with viewport', () => {
            entries[0].isIntersecting = true;
            LazyLoad._scrollCallback(entries);
            expect(requestFrameSpy).toHaveBeenCalled();
        });

        it('should remove intersected item from targets once processed', () => {
            entries[0].isIntersecting = true;
            LazyLoad._scrollCallback(entries);
            expect(LazyLoad.targets.length).toEqual(1);
        });
    });

    describe('triggerLoadComplete method', () => {
        let dispatchStub;
        beforeEach(async () => {
            dispatchStub = spyOn(window, 'dispatchEvent');
            await LazyLoad._triggerLoadComplete();
        });

        it('should set isLazyLoadEnabled to false', () => {
            expect(Sephora.isLazyLoadEnabled).toBe(false);
        });

        it('should set lazyLoadComplete event to true', () => {
            expect(Sephora.Util.InflatorComps.services.loadEvents[Events.LazyLoadComplete]).toBe(true);
        });

        it('should have dispatched a window event', () => {
            expect(dispatchStub).toHaveBeenCalled();
        });
    });

    describe('addLazyComponent method', () => {
        let element;
        let registerItemStub;
        let findDOMNodeStub;
        let ReactDOM;
        let callback;

        beforeEach(() => {
            element = {};
            ReactDOM = require('react-dom');
            findDOMNodeStub = spyOn(ReactDOM, 'findDOMNode').and.returnValue(element);
            registerItemStub = spyOn(LazyLoad, '_registerItem');
            callback = jasmine.createSpy();
        });

        it('should call findDOMNode to get instance element', () => {
            // Arrange
            spyOn(LazyLoad, '_findParentByAttribute').and.rejectWith();
            const instance = {};
            const fallBackFunc = () => {};

            // Act
            LazyLoad.addLazyComponent(instance, fallBackFunc);

            // Assert
            expect(findDOMNodeStub).toHaveBeenCalledWith(instance);
        });

        it('should call findParentByAttribute method once to find parent element', () => {
            const instance = {};
            const findParentStub = spyOn(LazyLoad, '_findParentByAttribute').and.returnValue(new Promise(() => {}));
            LazyLoad.addLazyComponent(instance, callback);
            expect(findParentStub).toHaveBeenCalledWith(element, 'data-lload', 'comp');
        });

        it('should call registerItem method to register component if parent was found', () => {
            const instance = {};
            const parent = {};
            const fakePromise = {
                then: function (resolve) {
                    resolve(parent);
                    expect(registerItemStub).toHaveBeenCalled();
                }
            };

            spyOn(LazyLoad, '_findParentByAttribute').and.returnValue(fakePromise);
            LazyLoad.addLazyComponent(instance);
        });

        it('should call registerItem method to register image if parent was not found', () => {
            const instance = {};
            const fakePromise = {
                then: function (resolve) {
                    resolve(null);
                    expect(registerItemStub).toHaveBeenCalled();
                }
            };

            spyOn(LazyLoad, '_findParentByAttribute').and.returnValue(fakePromise);
            LazyLoad.addLazyComponent(instance);
        });
    });

    describe('start method', () => {
        it('should instantiate the Observer', () => {
            LazyLoad.start();
            expect(LazyLoad.observer instanceof IntersectionObserver).toBeTruthy();
        });
    });

    it('should add registerComponent function argument to internal cache when invoked', () => {
        // Assert
        const firstComponent = 'firstComponent';
        const secondComponent = 'secondComponent';
        const thirdComponent = 'thirdComponent';
        const cache = [firstComponent, thirdComponent, secondComponent];

        // Act
        LazyLoad.registerComponent(firstComponent);
        LazyLoad.registerComponent(thirdComponent);
        LazyLoad.registerComponent(secondComponent);

        // Assert
        expect(LazyLoad.components).toEqual(cache);
    });

    it('should remove unregisterComponent function argument from internal cache when invoked', () => {
        // Assert
        const firstComponent = 'firstComponent';
        const secondComponent = 'secondComponent';
        const thirdComponent = 'thirdComponent';
        const cache = [thirdComponent, secondComponent];
        LazyLoad.registerComponent(firstComponent);
        LazyLoad.registerComponent(thirdComponent);
        LazyLoad.registerComponent(secondComponent);

        // Act
        LazyLoad.unregisterComponent(firstComponent);

        // Assert
        expect(LazyLoad.components).toEqual(cache);
    });

    it('should begin lazy load reset process for all components in cache when beginReset function is invoked', () => {
        // Assert
        const firstComponent = { beginReset: createSpy('beginReset') };
        const secondComponent = { beginReset: createSpy('beginReset') };
        const thirdComponent = { beginReset: createSpy('beginReset') };
        LazyLoad.registerComponent(firstComponent);
        LazyLoad.registerComponent(thirdComponent);
        LazyLoad.registerComponent(secondComponent);

        // Act
        LazyLoad.beginReset();

        // Assert
        expect(firstComponent.beginReset).toHaveBeenCalledTimes(1);
        expect(secondComponent.beginReset).toHaveBeenCalledTimes(1);
        expect(thirdComponent.beginReset).toHaveBeenCalledTimes(1);
    });

    it('should stops watching all of target elements for visibility changes when beginReset function is invoked', () => {
        // Assert
        const disconnect = spyOn(LazyLoad.observer, 'disconnect');

        // Act
        LazyLoad.beginReset();

        // Assert
        expect(disconnect).toHaveBeenCalledTimes(1);
    });

    it('should create new instance of IntersectionObserver when beginReset function is invoked', () => {
        // Assert
        const { observer } = LazyLoad;

        // Act
        LazyLoad.beginReset();

        // Assert
        expect(LazyLoad.observer !== observer).toBeTruthy();
    });

    it('should clear all targets when beginReset function is invoked', () => {
        // Assert
        LazyLoad.targets = [1, 2, 3];
        const targets = [];

        // Act
        LazyLoad.beginReset();

        // Assert
        expect(LazyLoad.targets).toEqual(targets);
    });

    it('should stop lazy load reset process for all components in cache when endReset function is invoked', () => {
        // Assert
        const firstComponent = { endReset: createSpy('endReset') };
        const secondComponent = { endReset: createSpy('endReset') };
        const thirdComponent = { endReset: createSpy('endReset') };
        LazyLoad.registerComponent(firstComponent);
        LazyLoad.registerComponent(thirdComponent);
        LazyLoad.registerComponent(secondComponent);

        // Act
        LazyLoad.endReset();

        // Assert
        expect(firstComponent.endReset).toHaveBeenCalledTimes(1);
        expect(secondComponent.endReset).toHaveBeenCalledTimes(1);
        expect(thirdComponent.endReset).toHaveBeenCalledTimes(1);
    });
});
