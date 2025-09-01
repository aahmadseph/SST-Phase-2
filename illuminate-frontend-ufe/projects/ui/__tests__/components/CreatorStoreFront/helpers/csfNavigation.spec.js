import { navigateTo, useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
// Remove renderHook import
import CreatorStoreFrontActions from 'actions/CreatorStoreFrontActions';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import getPageTypeFromPath from 'components/CreatorStoreFront/helpers/getPageTypeFromPath';
import UI from 'utils/UI';

// Mock dependencies
jest.mock('components/CreatorStoreFront/helpers/getPageTypeFromPath', () => ({
    __esModule: true,
    default: jest.fn()
}));

// Fix the CreatorStoreFrontActions mock to return a thunk
jest.mock('actions/CreatorStoreFrontActions', () => ({
    initializeCSFPageData: jest.fn().mockImplementation((pageType, path) => {
        return function thunk(_dispatch) {
            // This simulates the thunk pattern used in the actual code
            return Promise.resolve({ pageType, path });
        };
    })
}));

jest.mock('utils/UI', () => ({
    scrollTo: jest.fn()
}));

describe('csfNavigation', () => {
    let originalPushState;
    let originalDispatchEvent;
    const mockPath = '/creators/testuser/collections';
    const mockPageType = CSF_PAGE_TYPES.COLLECTIONS;
    const mockDispatch = jest.fn().mockImplementation(action => action);

    beforeEach(() => {
        // Save original methods and mock them
        originalPushState = window.history.pushState;
        originalDispatchEvent = window.dispatchEvent;

        // Mock history API
        window.history.pushState = jest.fn();
        window.dispatchEvent = jest.fn();

        // Set default implementation for getPageTypeFromPath
        getPageTypeFromPath.mockReturnValue(mockPageType);

        // Modify mock dispatch to simulate Redux dispatch function
        mockDispatch.mockImplementation(action => {
            // If action is a function (thunk), call it with dispatch
            if (typeof action === 'function') {
                return action(mockDispatch);
            }

            return action;
        });

        // Make toString return "dispatch" to pass the check in navigateTo
        mockDispatch.toString = () => 'dispatch';
    });

    afterEach(() => {
        // Restore original methods
        window.history.pushState = originalPushState;
        window.dispatchEvent = originalDispatchEvent;
    });

    describe('navigateTo function', () => {
        test('should push state to history and dispatch appropriate actions', async () => {
            await navigateTo(mockPath, mockDispatch);

            expect(window.history.pushState).toHaveBeenCalledWith({}, '', mockPath);
            expect(CreatorStoreFrontActions.initializeCSFPageData).toHaveBeenCalledWith(mockPageType, mockPath);
            expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
            expect(UI.scrollTo).toHaveBeenCalled();
        });

        test('should dispatch popstate event when dispatchPopState is true', async () => {
            await navigateTo(mockPath, mockDispatch, true);

            expect(window.history.pushState).toHaveBeenCalledWith({}, '', mockPath);
            expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(PopStateEvent));
            expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
        });

        test('should not scroll page to top when shouldScrollPageToTop is false', async () => {
            await navigateTo(mockPath, mockDispatch, false, false);

            expect(window.history.pushState).toHaveBeenCalledWith({}, '', mockPath);
            expect(UI.scrollTo).not.toHaveBeenCalled();
        });

        test('should handle non-standard dispatch callback', async () => {
            const customCallback = jest.fn();

            await navigateTo(mockPath, customCallback);

            expect(window.history.pushState).toHaveBeenCalledWith({}, '', mockPath);
            expect(customCallback).toHaveBeenCalledWith({
                pageType: mockPageType,
                path: mockPath
            });
            expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
        });

        test('should handle error during navigation', async () => {
            const consoleSpy = jest.spyOn(Sephora.logger, 'error');
            const error = new Error('Navigation error');
            mockDispatch.mockImplementationOnce(() => {
                throw error;
            });

            await navigateTo(mockPath, mockDispatch);

            expect(consoleSpy).toHaveBeenCalledWith('Error during navigation:', error);
            expect(UI.scrollTo).toHaveBeenCalled();
        });
    });

    describe('useNavigateTo hook', () => {
        test('should return a navigateTo function that uses the provided dispatch', () => {
            // Instead of using renderHook, we'll just call the hook directly
            const hookResult = useNavigateTo(mockDispatch);

            expect(typeof hookResult.navigateTo).toBe('function');

            // Call the returned navigateTo function
            hookResult.navigateTo(mockPath);

            // Since we mocked history.pushState, we can verify it was called
            expect(window.history.pushState).toHaveBeenCalledWith({}, '', mockPath);

            // We should also verify the dispatch function was called
            expect(mockDispatch).toHaveBeenCalled();
        });
    });
});
