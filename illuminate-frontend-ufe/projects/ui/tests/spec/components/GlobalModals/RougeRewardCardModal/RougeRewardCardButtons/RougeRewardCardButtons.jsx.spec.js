describe('<RougeRewardCardButton /> component', () => {
    let React;
    let RougeRewardCardButton;
    let shallowComponent;
    let rrcUtils;
    let userUtils;
    let skuHelpers;
    let rougeExclusiveUtils;

    beforeEach(() => {
        React = require('react');
        RougeRewardCardButton = require('components/GlobalModals/RougeRewardCardModal/RougeRewardCardButtons/RougeRewardCardButtons').default;
        rrcUtils = require('utils/RrcTermsAndConditions').default;
        userUtils = require('utils/User').default;
        skuHelpers = require('utils/skuHelpers').default;
        rougeExclusiveUtils = require('utils/rougeExclusive').default;
        spyOn(rrcUtils, 'areRRCTermsConditionsAccepted').and.returnValue(false);
        spyOn(rrcUtils, 'areRRCTermsConditionsChecked').and.returnValue(false);
        spyOn(userUtils, 'isRouge').and.returnValue(true);
        spyOn(userUtils, 'isBiPointsBiQualifiedFor').and.returnValue(true);
        spyOn(rougeExclusiveUtils, 'isRougeExclusive').and.returnValue(true);
        shallowComponent = enzyme.shallow(<RougeRewardCardButton currentSku={{ skuId: '1' }} />);
    });

    it('should display T&C checkbox', () => {
        expect(shallowComponent.find('Checkbox').length).toEqual(1);
    });

    it('should display ATB button disabled', () => {
        const atbButton = shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))');
        expect(atbButton.prop('disabled')).toEqual(true);
    });

    it('should display error message', () => {
        expect(shallowComponent.find('Text').length).toEqual(1);
    });

    describe('for T&C modal', () => {
        it('should display T&C checkbox', () => {
            shallowComponent = enzyme.shallow(
                <RougeRewardCardButton
                    currentSku={{ skuId: '1' }}
                    isModalCheckbox={true}
                />
            );
            expect(shallowComponent.find('Checkbox').length).toEqual(1);
        });

        it('should display a done button if RRC is alrady on basket', () => {
            spyOn(skuHelpers, 'isInBasket').and.returnValue(true);
            shallowComponent = enzyme.shallow(
                <RougeRewardCardButton
                    currentSku={{ skuId: '1' }}
                    isModalCheckbox={true}
                />
            );
            expect(shallowComponent.find('Button').length).toEqual(1);
        });
    });
});
