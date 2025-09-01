const { shallow } = require('enzyme');
const React = require('react');

describe('RewardItem component', () => {
    let RewardItem;
    let auth;
    let props;

    describe('When user is not signed in', () => {
        let requireAuthenticationStub;
        beforeEach(() => {
            RewardItem = require('components/Reward/RewardItem/RewardItem').default;
            auth = require('utils/Authentication').default;
            requireAuthenticationStub = spyOn(auth, 'requireAuthentication').and.returnValue({ catch: () => {} });
            props = { currentSku: {} };
        });

        describe('Sign In Handler', () => {
            it('should show sign in modal', () => {
                const e = { preventDefault: () => {} };
                spyOn(e, 'preventDefault');
                const wrapper = shallow(<RewardItem {...props} />);
                const component = wrapper.instance();
                component.signInHandler(e);
                expect(requireAuthenticationStub).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('For RewardItem\'s CTA', () => {
        let shallowComponent;
        beforeEach(() => {
            RewardItem = require('components/Reward/RewardItem/RewardItem').default;
            require('utils/User');
        });

        describe('if !useAddToBasket && !isUseWriteReview', () => {
            let AddToBasketButtonList;
            let ButtonSecondary;
            let ButtonPrimary;

            beforeEach(() => {
                props = {
                    useAddToBasket: false,
                    isUseWriteReview: false,
                    biType: 'test'
                };
                shallowComponent = shallow(<RewardItem {...props} />);
                AddToBasketButtonList = shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))');
                ButtonSecondary = shallowComponent.findWhere(n => n.name() === 'Button' && n.prop('variant') === 'secondary');
                ButtonPrimary = shallowComponent.findWhere(n => n.name() === 'Button' && n.prop('variant') === 'primary');
            });

            it('it should not be shown', () => {
                expect(AddToBasketButtonList.length + ButtonSecondary.length + ButtonPrimary.length).toBe(0);
            });
        });

        describe('if useAddToBasket and !isAnonymous', () => {
            let AddToBasketButtonList;
            beforeEach(() => {
                props = {
                    useAddToBasket: true,
                    isUseWriteReview: false,
                    biType: 'test',
                    isAnonymous: false
                };
                shallowComponent = shallow(<RewardItem {...props} />);
                AddToBasketButtonList = shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))');
            });

            it('it should be AddToBasketButton ', () => {
                expect(AddToBasketButtonList.at(0).props().text).not.toBe('');
            });
        });

        describe('if useAddToBasket and isAnonymous', () => {
            let Button;
            beforeEach(() => {
                props = {
                    useAddToBasket: true,
                    isUseWriteReview: false,
                    biType: 'test',
                    isAnonymous: true
                };
                shallowComponent = shallow(<RewardItem {...props} />);
                Button = shallowComponent.find('Button');
            });

            it('copy should be `Sign in to access`', () => {
                expect(Button.at(0).props().children).toBe('Sign in to access');
            });
        });

        describe('if !useAddToBasket && isUseWriteReview ', () => {
            let Button;
            beforeEach(() => {
                props = {
                    useAddToBasket: false,
                    isUseWriteReview: true,
                    biType: 'test',
                    isAnonymous: false
                };
                shallowComponent = shallow(<RewardItem {...props} />);
                Button = shallowComponent.find('Button');
                expect(Button.at(0).props().children).toBe('Write A Review');
            });

            it('copy should be `Write A Review` ', () => {
                expect(Button.length).toBe(1);
            });
        });
    });

    describe('When user is already signed in and', () => {
        let component;

        beforeEach(() => {
            RewardItem = require('components/Reward/RewardItem/RewardItem').default;
            auth = require('utils/Authentication').default;
            props = { currentSku: {} };
            spyOn(auth, 'requireAuthentication').and.returnValue(new Promise(resolve => resolve()));
            component = null;
        });

        it('isInBasket=true, isShowAddFullSize=true getCtaText should have an specific answer', () => {
            props.isInBasket = true;
            props.isShowAddFullSize = true;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Add Full Size');
        });

        it('isInBasket=true, isShowAddFullSize=false getCtaText should have an specific answer', () => {
            props.isInBasket = true;
            props.isShowAddFullSize = false;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Remove');
        });

        it('isInBasket=false, isShowAddFullSize=true getCtaText should have an specific answer', () => {
            props.isInBasket = false;
            props.isShowAddFullSize = true;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Add Full Size');
        });

        it('isInBasket=false, isShowAddFullSize=false getCtaText should have an specific answer', () => {
            props.isInBasket = false;
            props.isShowAddFullSize = false;
            props.isShortButton = false;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Add to Basket');
        });

        it('isInBasket=true, isShowAddFullSize=true getCtaText should have an specific answer', () => {
            props.isInBasket = true;
            props.isShowAddFullSize = true;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Add Full Size');
        });

        it('isInBasket=true, isShowAddFullSize=false getCtaText should have an specific answer', () => {
            props.isInBasket = true;
            props.isShowAddFullSize = false;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Remove');
        });

        it('isInBasket=false, isShowAddFullSize=true getCtaText should have an specific answer', () => {
            props.isInBasket = false;
            props.isShowAddFullSize = true;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Add Full Size');
        });

        it('isShortButton=true, isInBasket=false, isShowAddFullSize=false getCtaText should have an specific answer', () => {
            props.isInBasket = false;
            props.isShortButton = true;
            props.isShowAddFullSize = false;
            const wrapper = shallow(<RewardItem {...props} />);
            component = wrapper.instance();
            expect(component.getCtaText()).toBe('Add');
        });
    });
});
