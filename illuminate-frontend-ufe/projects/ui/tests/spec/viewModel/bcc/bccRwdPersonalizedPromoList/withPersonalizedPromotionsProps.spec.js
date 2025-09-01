const { mount } = require('enzyme');
const React = require('react');
const Store = require('Store').default;
const wrappedComponent = () => <div />;
const withPersonalizedPromotionsProps = require('viewModel/bcc/bccRwdPersonalizedPromoList/withPersonalizedPromotionsProps').default;
const withReduxProvider = require('utils/framework/wrapWithReduxProvider').default;

const HocComponent = withReduxProvider(withPersonalizedPromotionsProps(wrappedComponent));

xdescribe('withPersonalizedPromotionsProps', () => {
    const titleText = 'For You,';
    const signedInUser = {
        profileStatus: 4,
        isInitialized: true,
        profileId: '1',
        firstName: 'Lindsay'
    };
    let storeState;

    beforeEach(() => {
        storeState = {
            user: { isInitialized: false },
            personalizedPromotions: { items: [] },
            page: { templateInformation: {} }
        };
    });

    describe('render()', () => {
        it('should provide skeleton prop to wrappedComponent for anonymous user', () => {
            spyOn(Store, 'getState').and.returnValue(storeState);

            const wrapper = mount(<HocComponent titleText={titleText} />);

            const element = wrapper.findWhere(x => x.name() === 'wrappedComponent' && x.prop('showSkeleton') === true);

            expect(element.exists()).toBeTruthy();
        });

        it('should provide skeleton prop to wrappedComponent for signedIn user untill personalizedPromotions for appropriate profileId received', () => {
            storeState.user = signedInUser;
            spyOn(Store, 'getState').and.returnValue(storeState);

            const wrapper = mount(<HocComponent titleText={titleText} />);

            const element = wrapper.findWhere(x => x.name() === 'wrappedComponent' && x.prop('showSkeleton') === true);

            expect(element.exists()).toBeTruthy();
        });

        it('should not provide skeleton prop to wrappedComponent once loaded for signedIn user', () => {
            storeState.user = signedInUser;
            storeState.personalizedPromotions.profileId = signedInUser.profileId;
            spyOn(Store, 'getState').and.returnValue(storeState);

            const wrapper = mount(<HocComponent titleText={titleText} />);

            const element = wrapper.findWhere(x => x.name() === 'wrappedComponent' && x.prop('showSkeleton') !== true);

            expect(element.exists()).toBeTruthy();
        });

        it('should provide appropriate offerCategoryTitle to wrappedComponent once loaded for signed in user', () => {
            storeState.user = signedInUser;
            storeState.personalizedPromotions.profileId = signedInUser.profileId;
            spyOn(Store, 'getState').and.returnValue(storeState);

            const wrapper = mount(<HocComponent titleText={titleText} />);

            const element = wrapper.findWhere(
                x => x.name() === 'wrappedComponent' && x.prop('offerCategoryTitle') === `${titleText} ${signedInUser.firstName} ❤️`
            );

            expect(element.exists()).toBeTruthy();
        });

        it('should provide appropriate offerCategoryTitle to wrappedComponent once loaded for signed in user', () => {
            storeState.user = signedInUser;
            storeState.personalizedPromotions.profileId = signedInUser.profileId;
            storeState.personalizedPromotions.items = [{ promoId: 1 }, { promoId: 2 }];
            spyOn(Store, 'getState').and.returnValue(storeState);

            const wrapper = mount(<HocComponent titleText={titleText} />);

            const element = wrapper.findWhere(
                x => x.name() === 'wrappedComponent' && x.prop('componentList') === storeState.personalizedPromotions.items
            );

            expect(element.exists()).toBeTruthy();
        });
    });
});
