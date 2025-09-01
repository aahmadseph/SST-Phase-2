const React = require('react');

describe('<BeautyWinPromo /> page', () => {
    let BeautyWinPromo;
    let mountComponent;
    let Props;

    beforeEach(() => {
        Props = {
            content: [
                {
                    componentName: 'Sephora Unified Link Component',
                    componentType: 58,
                    displayTitle: 'Beauty Offers',
                    name: 'bd_BeautyOffers_link'
                }
            ]
        };
        BeautyWinPromo = require('pages/ContentStore/BeautyWinPromo').default;
    });

    it('should render the <BeautyWinPromo /> component', () => {
        mountComponent = enzyme.shallow(<BeautyWinPromo />);
        expect(mountComponent.exists()).toBe(true);
    });

    describe('with region prop populated', () => {
        it('should not render <ContentStoreLeftNav /> on mobile', () => {
            // Arrange
            spyOn(Sephora, 'isMobile').and.returnValues(true);

            // Act
            mountComponent = enzyme.shallow(<BeautyWinPromo />);

            // Assert
            const ContentStoreLeftNav = mountComponent.find('ContentStoreLeftNav');
            expect(ContentStoreLeftNav.exists()).toEqual(false);
        });

        it('should render sign link in text with data at attribute', () => {
            // Arrange/Act
            mountComponent = enzyme.shallow(<BeautyWinPromo regions={Props} />);

            // Assert
            const dataAt = mountComponent.findWhere(n => n.prop('data-at') === 'tlp_promo_container');
            expect(dataAt.exists()).toEqual(true);
        });

        /*
        it('should  render <ContentStoreLeftNav /> on desktop', () => {
            const isDesktop = spyOn(Sephora, 'isDesktop').and.returnValues(true);
            mountComponent = enzyme.mount(<BeautyWinPromo />);
            expect(mountComponent.find('ContentStoreLeftNav').exists()).toEqual(true);
        });

        it('should render the <BeautyWinPromoBody /> component', () => {
            mountComponent = enzyme.mount(<BeautyWinPromo />);
            expect(mountComponent.find('BeautyWinPromoBody').length).toEqual(1);
        });
        */
    });
});
