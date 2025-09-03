describe('<ListsHeader/> component', () => {
    const React = require('react');
    const ListsHeader = require('components/RichProfile/Lists/ListsHeader').default;
    let shallowedComponent;

    beforeEach(() => {
        shallowedComponent = enzyme.shallow(<ListsHeader children={'Children'} />);
    });

    it('should render a Box element', () => {
        expect(shallowedComponent.find('Box > Box').length).toBe(1);
    });

    it('should render children inside the Box element', () => {
        expect(shallowedComponent.find('Box > Box').prop('children')).toBe('Children');
    });

    it('should not render a Link element if prop was not sent', () => {
        expect(shallowedComponent.find('Link').length).toBe(0);
    });

    // it('should render a Link element if prop was sent', () => {
    //     shallowedComponent = enzyme.shallow(<ListsHeader children={'Children'} link={'/link/to/children'}/>);
    //     expect(shallowedComponent.find('Link').prop('children')).toEqual('View all');
    // });
});
