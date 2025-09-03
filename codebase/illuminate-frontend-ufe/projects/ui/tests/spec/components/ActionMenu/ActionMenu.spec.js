const React = require('react');
const { createSpy } = jasmine;
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;
const ActionMenu = require('components/ActionMenu/ActionMenu').default;

describe('ActionMenu component', () => {
    let component;
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            id: 'sort_menu',
            children: 'Sort by',
            align: 'right',
            options: [
                {
                    children: 'Bestselling',
                    code: 'code',
                    onClick: () => {},
                    isActive: true
                }
            ],
            triggerDataAt: 'sort_by_button',
            preventClickOnMouseDown: false
        };
        wrapper = shallow(<ActionMenu {...props} />);
        component = wrapper.instance();
    });

    describe('handleKeyDown method', () => {
        let e;
        let index;
        let lastAction;

        beforeEach(() => {
            e = {
                preventDefault: () => {},
                target: {
                    parentNode: {
                        childNodes: [{ focus: createSpy() }, { focus: createSpy() }, { focus: createSpy() }]
                    }
                }
            };
            lastAction = e.target.parentNode.childNodes.length - 1;
        });

        it('should focus the last node when End key is pressed', () => {
            e.key = 'End';
            component.handleKeyDown(e);
            expect(e.target.parentNode.childNodes[lastAction].focus).toHaveBeenCalled();
        });

        it('should focus the first node when Home key is pressed', () => {
            e.key = 'Home';
            component.handleKeyDown(e);
            expect(e.target.parentNode.childNodes[0].focus).toHaveBeenCalled();
        });

        it('should focus the previous node when ArrowUp key is pressed and index is not 0', () => {
            e.key = 'ArrowUp';
            index = 1;
            component.handleKeyDown(e, index);
            expect(e.target.parentNode.childNodes[index - 1].focus).toHaveBeenCalled();
        });

        it('should focus the last node when ArrowUp key is pressed and index is 0', () => {
            e.key = 'ArrowUp';
            index = 0;
            component.handleKeyDown(e, index);
            expect(e.target.parentNode.childNodes[lastAction].focus).toHaveBeenCalled();
        });

        it('should focus the next node when ArrowDown key is pressed and index is not lastAction', () => {
            e.key = 'ArrowDown';
            index = 0;
            component.handleKeyDown(e, index);
            expect(e.target.parentNode.childNodes[index + 1].focus).toHaveBeenCalled();
        });

        it('should focus the first node when ArrowDown key is pressed and index is lastAction', () => {
            e.key = 'ArrowDown';
            index = lastAction;
            component.handleKeyDown(e, index);
            expect(e.target.parentNode.childNodes[0].focus).toHaveBeenCalled();
        });

        it('should focus the next node when Tab key is pressed and index is not lastAction', () => {
            e.key = 'Tab';
            index = 0;
            component.handleKeyDown(e, index);
            expect(e.target.parentNode.childNodes[index + 1].focus).toHaveBeenCalled();
        });

        it('should focus the first node when Tab key is pressed and index is lastAction', () => {
            e.key = 'Tab';
            index = lastAction;
            component.handleKeyDown(e, index);
            expect(e.target.parentNode.childNodes[0].focus).toHaveBeenCalled();
        });
    });
});
