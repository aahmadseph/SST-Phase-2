import React from 'react';
import { render, screen } from '../../../test-utils';
import Posts from 'components/CreatorStoreFront/views/Posts';

// Mock CSFCommonGrid component
jest.mock('components/CreatorStoreFront/CSFCommonGrid/CSFCommonGrid', () => {
    return function MockCSFCommonGrid(props) {
        return (
            <div data-testid='csf-common-grid'>
                <div data-testid='grid-handle'>{props.handle}</div>
                <div data-testid='grid-type'>{props.type}</div>
                <div data-testid='grid-items'>{props.items?.length || 0} posts</div>
                <div data-testid='grid-total'>{props.totalItems} total</div>
            </div>
        );
    };
});

describe('Posts component', () => {
    const mockPosts = [
        { postId: 'post1', title: 'Post 1' },
        { postId: 'post2', title: 'Post 2' }
    ];

    const defaultProps = {
        handle: 'testhandle',
        pageType: 'posts',
        posts: mockPosts,
        totalPosts: 5
    };

    test('should render posts grid with correct props', () => {
        render(<Posts {...defaultProps} />);

        expect(screen.getByTestId('csf-common-grid')).toBeInTheDocument();
        expect(screen.getByTestId('grid-handle').textContent).toBe('testhandle');
        expect(screen.getByTestId('grid-type').textContent).toBe('posts');
        expect(screen.getByText('2 posts')).toBeInTheDocument();
        expect(screen.getByText('5 total')).toBeInTheDocument();
    });

    test('should handle empty posts array', () => {
        render(
            <Posts
                {...defaultProps}
                posts={[]}
                totalPosts={0}
            />
        );

        expect(screen.getByTestId('csf-common-grid')).toBeInTheDocument();
        expect(screen.getByText('0 posts')).toBeInTheDocument();
        expect(screen.getByText('0 total')).toBeInTheDocument();
    });
});
