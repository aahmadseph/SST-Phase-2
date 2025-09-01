import { render, screen } from '../../../test-utils';
import PostDetailsFrame from 'components/CreatorStoreFront/PostDetailsFrame/PostDetailsFrame';

// Mock IntersectionObserver and MutationObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

// Mock global objects
beforeEach(() => {
    // Mock MutationObserver
    global.MutationObserver = jest.fn().mockImplementation(() => ({
        observe: mockObserve,
        disconnect: mockDisconnect
    }));

    // Clear timeouts on cleanup
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('PostDetailsFrame component', () => {
    const mockPostContent = {
        embedHtml: '<blockquote class="instagram-media">Instagram Post</blockquote>',
        media: {
            thumbnailUrl: '/test-thumbnail.jpg',
            thumbnailDimensions: {
                height: 1080,
                width: 1080
            }
        },
        taggedProductCount: 3,
        title: 'Test Post Title',
        socialMedia: 'instagram'
    };

    test('should render post content with embed HTML', () => {
        const { container } = render(<PostDetailsFrame postContent={mockPostContent} />);

        // Check if the embed HTML is rendered
        const embed = container.querySelector('.instagram-media');
        expect(embed).toBeInTheDocument();

        // Check if product count badge is rendered
        expect(screen.getByText('3')).toBeInTheDocument();

        // Check if social media icon is rendered
        const socialIcon = container.querySelector('img[alt="instagram icon"]');
        expect(socialIcon).toBeInTheDocument();
    });

    test('should not render product count badge when taggedProductCount is 0', () => {
        const noProductsContent = {
            ...mockPostContent,
            taggedProductCount: 0
        };

        render(<PostDetailsFrame postContent={noProductsContent} />);

        // Product count badge should not be rendered
        const productCountIcon = screen.queryByAltText('tag-product count icon');
        expect(productCountIcon).not.toBeInTheDocument();
    });

    test('should handle case when embedHtml is not provided', () => {
        const noEmbedContent = {
            ...mockPostContent,
            embedHtml: null
        };

        const { container } = render(<PostDetailsFrame postContent={noEmbedContent} />);

        // Shouldn't try to render embed container
        const embedContainer = container.querySelector('[dangerouslySetInnerHTML]');
        expect(embedContainer).not.toBeInTheDocument();

        // Should still show other elements like social icon
        const socialIcon = container.querySelector('img[alt="instagram icon"]');
        expect(socialIcon).toBeInTheDocument();
    });
});
