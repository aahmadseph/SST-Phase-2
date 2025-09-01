describe('ContactUs page', () => {
    let React;
    let ContactUs;
    let mountComponent;

    beforeEach(() => {
        React = require('react');
        ContactUs = require('pages/ContentStore/ContactUs').default;
    });

    it('should render the <ContactUs /> component', () => {
        mountComponent = enzyme.shallow(<ContactUs />);
        expect(mountComponent.exists()).toBe(true);
    });

    /*

    it('should render <ContentStoreLeftNav /> on desktop', () => {
        const isDesktop = spyOn(Sephora, 'isDesktop').and.returnValue(true);
        mountComponent = enzyme.mount(<ContactUs />);
        expect(mountComponent.find('ContentStoreLeftNav').exists()).toEqual(true);
    });

    it('should render <BccBreadCrumbs /> on desktop', () => {
        const isDesktop = spyOn(Sephora, 'isDesktop').and.returnValue(true);
        mountComponent = enzyme.mount(<ContactUs />);
        expect(mountComponent.find('BccBreadCrumbs').exists()).toEqual(true);
    });

    it('should not render <BccBreadCrumbs /> on mobile', () => {
        const isMobile = spyOn(Sephora, 'isMobile').and.returnValue(true);
        mountComponent = enzyme.mount(<ContactUs />);
        expect(mountComponent.find('BccBreadCrumbs').exists()).toEqual(false);
    });

    it('should not render <ContentStoreLeftNav /> on mobile', () => {
        const isMobile = spyOn(Sephora, 'isMobile').and.returnValue(true);
        mountComponent = enzyme.mount(<ContactUs />);
        expect(mountComponent.find('ContentStoreLeftNav').exists()).toEqual(false);
    });

    it('should render the <BccComponentList /> component', () => {
        mountComponent = enzyme.mount(<ContactUs />);
        expect(mountComponent.find('BccComponentList').length).toEqual(2);
    });

    it('should render the <EmailUs /> component', () => {
        mountComponent = enzyme.mount(<ContactUs />);
        expect(mountComponent.find('EmailUs').length).toEqual(1);
    });
    */
});
