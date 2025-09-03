describe('<ListPageHeader /> component', () => {
    const React = require('react');
    const ListPageHeader = require('components/RichProfile/ListPageHeader/ListPageHeader').default;

    let shallowedComponent;

    beforeEach(() => {
        shallowedComponent = enzyme.shallow(<ListPageHeader children={'Children Text'} />);
    });

    it('should display correct link if there is no previous page link text', () => {
        const previousLink = shallowedComponent.find('Link');
        expect(previousLink.prop('href')).toBe('/profile/Lists');
    });

    it('should display correct link if there is previous page link text', () => {
        shallowedComponent.setState({ previousPageLinkText: 'Back to Beauty Insider' });
        const previousLink = shallowedComponent.find('Link');
        expect(previousLink.prop('href')).toBe(undefined);
    });

    it('should display correct children text', () => {
        const childrenText = shallowedComponent.find('Text');
        expect(childrenText.prop('children')).toBe('Children Text');
    });
});
