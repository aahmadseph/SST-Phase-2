// eslint-disable-next-line no-unused-vars
import { fireEvent, render, screen } from 'test-utils';
import React from 'react';
import ActionMenu from 'components/ActionMenu/ActionMenu';

describe('ActionMenu', () => {
    test('should render menu', () => {
        // Arrange
        const initialContent = 'Menu Trigger';

        // Act
        const { getByText } = render(
            <ActionMenu
                id='test-menu'
                options={[]}
            >
                {initialContent}
            </ActionMenu>
        );

        // Assert
        expect(getByText(initialContent)).toBeInTheDocument();
    });

    test('should render menu options', () => {
        // Arrange
        const initialContent = 'Menu Trigger';
        const options = [
            { children: 'Option 1', onClick: jest.fn() },
            { children: 'Option 2', onClick: jest.fn() }
        ];

        // Act
        const { getByText } = render(
            <ActionMenu
                id='test-menu'
                options={options}
            >
                {initialContent}
            </ActionMenu>
        );
        // getByText(childrenContent).click(); - is a lower-level DOM operation that may not fully test React-specific logic.
        fireEvent.click(getByText(initialContent));
        // screen.debug();

        // Assert
        expect(getByText(options[1].children)).toBeInTheDocument();
    });

    test('should call onClick for menu options', () => {
        // Arrange
        const initialContent = 'Menu Trigger';
        const options = [
            { children: 'Option 1', onClick: jest.fn() },
            { children: 'Option 2', onClick: jest.fn() }
        ];

        // Act
        const { getByText } = render(
            <ActionMenu
                id='test-menu'
                options={options}
            >
                {initialContent}
            </ActionMenu>
        );
        fireEvent.click(getByText(initialContent));
        fireEvent.click(getByText(options[1].children));

        // Assert
        expect(options[1].onClick).toHaveBeenCalledTimes(1);
    });

    test('should handle keydown events', () => {
        // Arrange
        const initialContent = 'Menu Trigger';
        const options = [
            { children: 'Option 1', onClick: jest.fn() },
            { children: 'Option 2', onClick: jest.fn() }
        ];

        // Act
        const { getByText } = render(
            <ActionMenu
                id='test-menu'
                options={options}
            >
                {initialContent}
            </ActionMenu>
        );
        fireEvent.click(getByText(initialContent));
        const firstOption = getByText(options[0].children);
        firstOption.focus();
        fireEvent.keyDown(firstOption, { key: 'ArrowDown' });

        // Assert
        const secondOption = getByText(options[1].children);
        expect(secondOption).toHaveFocus();
    });
});
