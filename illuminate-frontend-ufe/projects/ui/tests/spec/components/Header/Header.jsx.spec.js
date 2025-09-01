const React = require('react');
const { shallow } = require('enzyme');
const withReduxProvider = require('utils/framework/wrapWithReduxProvider').default;
const Header = withReduxProvider(require('components/Header/Header').default);
const AccountMenu = require('components/Header/AccountMenu').default;
const Loves = require('components/Loves').default;

const getWrapperFor = (Component, shallowWrapper) => {
    let result = shallowWrapper.dive().dive().dive().dive();
    result = result.dive();

    return result;
};

describe('Header JSX File', () => {
    const props = {
        headerFooterContent: {
            rwdNavigationMenu: [
                {
                    titleText: 'Some Title',
                    targetUrl: 'Some Target URL'
                },
                {
                    titleText: 'Some Title 1',
                    targetUrl: 'Some Target URL 1'
                }
            ],
            isDownloadAppBannerEnabled: true,
            rwdPersistentBanner1: [{ enableTesting: false }],
            rwdPersistentBanner2: [{}]
        },
        hideBanners: true,
        showChat: true,
        isCompact: false
    };
    let wrapper;

    describe('Banner components', () => {
        it('should render AndroidAppBanner component', () => {
            // Arrange/Act
            wrapper = getWrapperFor(Header, shallow(<Header {...props} />));

            // Assert
            expect(wrapper.find('AndroidAppBanner').length).toEqual(1);
        });
    });

    describe('TestTarget component for persistent banner at the top of the Header', () => {
        it('should not be output when hidden by the hideBanners property', () => {
            // Arrange
            // EXAMPLE: Mutate of global state - do not do like this
            props.hideBanners = true;

            // Act
            wrapper = getWrapperFor(Header, shallow(<Header {...props} />));

            // Assert
            expect(wrapper.find('TestTarget').length).toEqual(0);
        });

        it('should output persistent banner when hideBanners is false', () => {
            // Arrange
            // EXAMPLE: Mutate of global state - do not do like this
            props.hideBanners = false;

            // Act
            wrapper = getWrapperFor(Header, shallow(<Header {...props} />));

            // Assert
            expect(wrapper.find('TestTarget').length).toEqual(0);
        });
    });

    describe('Main Links', () => {
        // let setLocation;
        beforeEach(() => {
            wrapper = getWrapperFor(Header, shallow(<Header {...props} />));
        });

        describe('Container components', () => {
            it('should load header component', () => {
                expect(wrapper.find('header').length).toEqual(1);
            });

            it('should render Container component', () => {
                expect(wrapper.find('Container').length).toEqual(1);
            });

            it('should show data-at for logo image "sephora_logo_ref"', () => {
                const dataAtElement = wrapper.findWhere(node => node.prop('data-at') === 'sephora_logo_ref');
                // Assert
                expect(dataAtElement.length).toEqual(1);
            });

            it('should render site search component', () => {
                expect(wrapper.find('SiteSearch').length).toEqual(1);
            });

            it('should render StoresDrop component', () => {
                expect(wrapper.find('StoresDrop').length).toEqual(1);
            });

            it('should render CommunityDrop component', () => {
                expect(wrapper.find('CommunityDrop').length).toEqual(1);
            });

            it('should render AccountMenu component', () => {
                expect(wrapper.find(AccountMenu).length).toEqual(1);
            });

            it('should render Loves component', () => {
                expect(wrapper.find(Loves).length).toEqual(1);
            });

            it('should render InlineBasket component', () => {
                expect(wrapper.find('InlineBasket').length).toEqual(1);
            });

            it('should render TopNav if Media greaterThan sm', () => {
                const mediaGreaterThanSM = wrapper.findWhere(node => node.name() === 'Media' && node.prop('greaterThan') === 'sm');
                const elemTopNav = mediaGreaterThanSM.find('TopNav');
                // Assert
                expect(elemTopNav.length).toEqual(1);
            });

            xit('should render BottomNav if Media lessThan md', () => {
                const mediaLessThanMD = wrapper.findWhere(node => node.name() === 'Media' && node.prop('lessThan') === 'md');
                const elemBottomNav = mediaLessThanMD.find('BottomNav');
                // Assert
                expect(elemBottomNav.length).toEqual(0);
            });
        });
    });
});
