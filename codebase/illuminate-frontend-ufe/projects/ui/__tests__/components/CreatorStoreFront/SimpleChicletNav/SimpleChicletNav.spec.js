import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import SimpleChicletNav from 'components/CreatorStoreFront/SimpleChicletNav';
import * as csfNavigation from 'components/CreatorStoreFront/helpers/csfNavigation';

// Mock window.matchMedia in beforeAll to avoid using window at module scope
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false, // Default to desktop view
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        }))
    });
});

// Mock the intersection observer
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: jest.fn()
}));

// Mock the navigation helpers
jest.mock('components/CreatorStoreFront/helpers/csfNavigation', () => ({
    useNavigateTo: jest.fn()
}));

// Mock Media component to control what renders in tests
jest.mock('utils/Media', () => {
    const originalModule = jest.requireActual('utils/Media');

    return {
        ...originalModule,
        Media: ({ children, greaterThanOrEqual }) => {
            // Only render the desktop version
            if (greaterThanOrEqual === 'md') {
                return children;
            }

            // Don't render mobile version
            return null;
        }
    };
});

// Mock Chiclet component
jest.mock('components/Chiclet', () => {
    return function MockChiclet(props) {
        return (
            <button
                data-testid='chiclet'
                data-active={props.isActive}
                onClick={props.onClick}
            >
                {props.children}
            </button>
        );
    };
});

describe('SimpleChicletNav component', () => {
    const mockMenuItems = [
        { title: 'Featured', link: '/', isActive: true },
        { title: 'Posts', link: '/posts', isActive: false },
        { title: 'Collections', link: '/collections', isActive: false },
        { title: 'Products', link: '/products', isActive: false }
    ];

    const handle = 'testhandle';

    const mockNavigateTo = jest.fn();

    beforeEach(() => {
        csfNavigation.useNavigateTo.mockReturnValue({
            navigateTo: mockNavigateTo
        });
    });

    test('should render chiclets for menu items', () => {
        render(<SimpleChicletNav menuItems={mockMenuItems} />, {
            redux: { creatorStoreFront: {} }
        });

        const chiclets = screen.getAllByTestId('chiclet');
        expect(chiclets).toHaveLength(4);

        // Check chiclet content
        expect(chiclets[0]).toHaveTextContent('Featured');
        expect(chiclets[1]).toHaveTextContent('Posts');
        expect(chiclets[2]).toHaveTextContent('Collections');
        expect(chiclets[3]).toHaveTextContent('Products');

        // Check active state
        expect(chiclets[0]).toHaveAttribute('data-active', 'true');
    });

    test('should navigate when chiclet is clicked', () => {
        render(
            <SimpleChicletNav
                menuItems={mockMenuItems}
                handle={handle}
            />,
            {
                redux: { creatorStoreFront: {} }
            }
        );

        const postsChiclet = screen.getAllByTestId('chiclet')[1];
        fireEvent.click(postsChiclet);

        // Should navigate to the correct URL
        expect(mockNavigateTo).toHaveBeenCalledWith('/creators/testhandle/posts', false, true);
    });

    test('should setup IntersectionObserver', () => {
        render(<SimpleChicletNav menuItems={mockMenuItems} />, {
            redux: { creatorStoreFront: {} }
        });

        // Should create an intersection observer and observe the sentinel element
        expect(global.IntersectionObserver).toHaveBeenCalled();
        expect(mockObserve).toHaveBeenCalled();
    });

    test('should handle empty menu items gracefully', () => {
        const { queryAllByTestId } = render(<SimpleChicletNav menuItems={null} />, {
            redux: { creatorStoreFront: {} }
        });

        // Should not render any chiclet elements
        const chiclets = queryAllByTestId('chiclet');
        expect(chiclets).toHaveLength(0);
    });
});
