const React = require('react');
const { shallow } = require('enzyme');
const RougeRewardButton = require('components/ProductPage/Type/RewardProduct/RougeRewardButton/RougeRewardButton').default;
const userUtils = require('utils/User').default;
const rrcUtils = require('utils/RrcTermsAndConditions').default;
const actions = require('actions/Actions').default;
const store = require('Store').default;

describe('<RougeRewardButton />', () => {
    let props;

    beforeEach(() => {
        props = { product: { currentSku: {} } };
    });

    describe('Render', () => {
        it('should render AddToBasketButton', () => {
            // Arrange
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });

            // Act
            const addToBasketButton = component.find('ErrorBoundary(Connect(AddToBasketButton))');

            // Assert
            expect(addToBasketButton.exists()).toBeTruthy();
        });

        it('should render Checkbox if user is eligible for a reward and is not in basket and terms is not accepted', () => {
            // Arrange
            spyOn(userUtils, 'isRouge').and.returnValue(true);
            spyOn(userUtils, 'isBiPointsBiQualifiedFor').and.returnValue(true);
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });

            // Act
            const checkbox = component.find('Checkbox');

            // Assert
            expect(checkbox.exists()).toBeTruthy();
        });

        it('should render BI Exclusive Message Text if user is not eligible for a reward and biExclusiveMsg is present', () => {
            // Arrange
            props.biExclusiveMsg = 'SomeBiExclusiveMsg';
            spyOn(userUtils, 'isRouge').and.returnValue(false);
            spyOn(userUtils, 'isBiPointsBiQualifiedFor').and.returnValue(true);
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });

            // Act
            const rtext = component.find('Text');

            // Assert
            expect(rtext.exists()).toBeTruthy();
        });
    });

    describe('componentDidMount', () => {
        it('should call updateTermsValues', () => {
            // Arrange
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });
            const instance = component.instance();
            const updateTermsValuesSpy = spyOn(instance, 'updateTermsValues');

            // Act
            instance.componentDidMount();

            // Assert
            expect(updateTermsValuesSpy).toHaveBeenCalled();
        });

        it('should call setAndWatch on termsConditions', () => {
            // Arrange
            const setAndWatchSpy = spyOn(store, 'setAndWatch');
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });
            const instance = component.instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(setAndWatchSpy).toHaveBeenCalledWith('termsConditions', instance, instance.updateTermsValues);
        });

        it('should call setAndWatch on basket', () => {
            // Arrange
            const setAndWatchSpy = spyOn(store, 'setAndWatch');
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });
            const instance = component.instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(setAndWatchSpy).toHaveBeenCalledWith('basket', instance, instance.updateTermsValues);
        });
    });

    describe('Checkbox click', () => {
        it('should call persistAcceptanceCheck with a valid args', () => {
            // Arrange
            const event = { target: { checked: true } };
            const persistAcceptanceCheckSpy = spyOn(rrcUtils, 'persistAcceptanceCheck');
            spyOn(userUtils, 'isRouge').and.returnValue(true);
            spyOn(userUtils, 'isBiPointsBiQualifiedFor').and.returnValue(true);
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });

            // Act
            const checkbox = component.find('Checkbox');
            checkbox.simulate('click', event);

            // Assert
            expect(persistAcceptanceCheckSpy).toHaveBeenCalledWith(event.target.checked);
        });
    });

    describe('Checkbox Link click', () => {
        it('should dispatch showRougeRewardCardModal action to store with a valid args', () => {
            // Arrange
            const expectedAction = { type: 'ExpectedAction' };
            const dispatchSpy = spyOn(store, 'dispatch');
            const showRougeRewardCardModalSpy = spyOn(actions, 'showRougeRewardCardModal').and.returnValue(expectedAction);
            spyOn(userUtils, 'isRouge').and.returnValue(true);
            spyOn(userUtils, 'isBiPointsBiQualifiedFor').and.returnValue(true);
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });

            // Act
            const rlink = component.find('Link');
            rlink.simulate('click', { preventDefault: () => {} });

            // Assert
            expect(showRougeRewardCardModalSpy).toHaveBeenCalledWith({
                isOpen: true,
                sku: props.product.currentSku
            });
            expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
        });
    });

    describe('handleAcceptTerms', () => {
        it('should call persistAcceptance with a valid args', () => {
            // Arrange
            const persistAcceptanceSpy = spyOn(rrcUtils, 'persistAcceptance');
            const component = shallow(<RougeRewardButton {...props} />, { disableLifecycleMethods: true });

            // Act
            component.instance().handleAcceptTerms();

            // Assert
            expect(persistAcceptanceSpy).toHaveBeenCalledWith(false);
        });
    });
});
