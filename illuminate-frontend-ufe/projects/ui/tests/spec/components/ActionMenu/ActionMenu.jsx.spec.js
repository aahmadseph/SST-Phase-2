const ActionMenu = require('components/ActionMenu/ActionMenu').default;
const React = require('react');
describe('<ActionMenu /> component', () => {
    let shallowComponent;
    let props;

    beforeEach(() => {
        props = {
            id: 'sort_menu',
            children: 'button',
            options: [
                {
                    children: 'name',
                    code: 'code',
                    onClick: () => {},
                    isActive: true
                }
            ]
        };
        shallowComponent = enzyme.shallow(<ActionMenu {...props} />);
    });

    it('should render properly', () => {
        expect(shallowComponent.exists('Dropdown')).toBeTruthy();
    });
});
