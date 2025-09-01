const UI = require('utils/UI').default;
const { createSpy } = jasmine;

describe('UI Utils', () => {
    describe('requestFrame method', () => {
        it('should call requestAnimationFrame with passed callback if requestAnimationFrameSupported is true', () => {
            window.requestAnimationFrame = createSpy('requestAnimationFrame');
            const callback = createSpy('callback');
            UI.requestFrame(callback);

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(callback);
        });

        it('should call passed callback if requestAnimationFrame is not supported', () => {
            const requestAnimationFrameReference = window.requestAnimationFrame;
            window.requestAnimationFrame = null;
            const callback = createSpy('callback');
            UI.requestFrame(callback);
            expect(callback).toHaveBeenCalled();

            // Resetting in case the global leaks into another test suite
            window.requestAnimationFrame = requestAnimationFrameReference;
        });
    });

    // describe('scrollTo', () => {
    //     it('should scroll to correct element where there is a ref', () => {
    //         // Arrange
    //         const ref = { current: { getBoundingClientRect: () => ({ top: 100 }) } };
    //         const scrollSpy = spyOn(window, 'scroll');

    //         // Act
    //         UI.scrollTo({ ref });

    //         // Assert
    //         expect(scrollSpy).toHaveBeenCalledWith({
    //             top: 100,
    //             behavior: 'smooth'
    //         });
    //     });

    //     it('should scroll to correct element where there is an elementId', () => {
    //         // Arrange
    //         spyOn(document, 'getElementById').and.returnValue({ getBoundingClientRect: () => ({ top: 100 }) });
    //         const scrollSpy = spyOn(window, 'scroll');

    //         // Act
    //         UI.scrollTo({ elementId: 'id' });

    //         // Assert
    //         expect(scrollSpy).toHaveBeenCalledWith({
    //             top: 100,
    //             behavior: 'smooth'
    //         });
    //     });
    // });
});
