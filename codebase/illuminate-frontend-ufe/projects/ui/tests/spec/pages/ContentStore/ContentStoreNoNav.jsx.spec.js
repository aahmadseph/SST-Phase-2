describe('<ContentStoreNoNav /> page', () => {
    let React;
    let ContentStoreNoNav;
    let mountComponent;

    // const contentStoreNoNavProps = {
    //     content: [
    //         {
    //             componentName: 'Sephora Unified Sku Grid Component',
    //             componentType: 57,
    //             contentType: 'Html',
    //             text: '',
    //             name: 'markdown'
    //         },
    //         {
    //             componentName: 'Sephora Unified Sku Grid Component',
    //             componentType: 67,
    //             skus: [],
    //             name: 'skugrid'
    //         }
    //     ]
    // };

    beforeEach(() => {
        React = require('react');
        ContentStoreNoNav = require('pages/ContentStore/ContentStoreNoNav').default;
    });

    it('should render the <ContentStoreNoNav /> component', () => {
        mountComponent = enzyme.shallow(<ContentStoreNoNav />);
        // expect(mountComponent.find('ContentStoreNoNav').length).toEqual(1);
        expect(mountComponent.exists()).toBe(true);
    });

    // describe('with region prop populated', () => {
    //     beforeEach(() => {
    //         mountComponent = enzyme.mount(<ContentStoreNoNav regions={contentStoreNoNavProps} />);
    //     });

    //     it('should render a BCCComponentList component', () => {
    //         expect(mountComponent.find('BccComponentList').length).toEqual(1);
    //     });

    //     it('BCCComponentList should has content_store analytic context', () => {
    //         const bccComponentListComponent = mountComponent.find('BccComponentList');
    //         expect(bccComponentListComponent.prop('analyticsContext')).toEqual('content_store');
    //     });

    //     it('should render a BccSkuGrid component', () => {
    //         expect(mountComponent.find('BccSkuGrid').length).toEqual(1);
    //     });

    //     it('should render a BccMarkdown component', () => {
    //         expect(mountComponent.find('BccMarkdown').length).toEqual(1);
    //     });
    // });
});
