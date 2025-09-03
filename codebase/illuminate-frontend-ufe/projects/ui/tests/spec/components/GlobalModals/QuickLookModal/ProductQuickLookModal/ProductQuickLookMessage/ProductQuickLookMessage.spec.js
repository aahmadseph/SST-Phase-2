const localeUtils = require('utils/LanguageLocale').default;

describe('ProductQuickLookMessage component', () => {
    let React;
    // eslint-disable-next-line no-undef
    const shallow = enzyme.shallow;
    let Actions;
    let store;
    let auth;
    let userUtils;
    let getText;
    let ProductQuickLookMessage;
    let props;

    beforeEach(() => {
        React = require('react');
        Actions = require('Actions').default;
        store = require('Store').default;
        auth = require('utils/Authentication').default;
        userUtils = require('utils/User').default;
        getText = localeUtils.getLocaleResourceFile(
            'components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage/locales',
            'ProductQuickLookMessage'
        );
        ProductQuickLookMessage =
            require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage/ProductQuickLookMessage').default;
        props = {
            product: {},
            currentSku: {},
            analyticsContext: {}
        };
    });

    it('Sign In Handler should show sign in modal', () => {
        // Arrange
        const requireAuthenticationStub = spyOn(auth, 'requireAuthentication').and.returnValue({ catch: () => {} });
        const wrapper = shallow(<ProductQuickLookMessage {...props} />);

        // Act
        wrapper.instance().signInHandler();

        // Assert
        expect(requireAuthenticationStub).toHaveBeenCalledTimes(1);
    });

    it('Bi Register Handler should dispatch action to show Bi Register modal', () => {
        // Arrange
        const context = 'quicklook';
        const nextPageContext = 'quicklook';
        const wrapper = shallow(<ProductQuickLookMessage {...props} />);
        const dispatch = spyOn(store, 'dispatch');
        const {
            TYPES: { SHOW_BI_REGISTER_MODAL }
        } = Actions;
        const action = {
            type: SHOW_BI_REGISTER_MODAL,
            isOpen: true,
            callback: undefined,
            cancellationCallback: undefined,
            isCommunity: undefined,
            isCreditCardApply: undefined,
            analyticsData: {
                context,
                nextPageContext
            },
            extraParams: undefined
        };

        // Act
        wrapper.instance().biRegisterHandler();

        // Assert
        expect(dispatch).toHaveBeenCalledWith(action);
    });

    it('shold render you must be BI text if not BiLevelQualifiedFor SKU and isBiExclusive and is not BiQualify', () => {
        spyOn(userUtils, 'isBiLevelQualifiedFor').and.returnValue(false);
        props.currentSku = {
            biExclusiveLevel: 'BI'
        };
        const wrapper = shallow(<ProductQuickLookMessage {...props} />);

        const youMustbeBIMessage = wrapper.findWhere(
            x =>
                x.name() === 'Text' &&
                x.prop('children').indexOf(getText('youMust')) > -1 &&
                x.prop('children').indexOf(getText('beautyInsider')) > -1
        );

        expect(youMustbeBIMessage.exists()).toBeTruthy();
    });

    it('shold render you must be Rouge text if not BiLevelQualifiedFor SKU and isBiExclusive and is not BiQualify', () => {
        spyOn(userUtils, 'isBiLevelQualifiedFor').and.returnValue(false);
        props.currentSku = {
            biExclusiveLevel: 'Rouge'
        };
        const wrapper = shallow(<ProductQuickLookMessage {...props} />);

        const youMustbeRougeMessage = wrapper.findWhere(
            x => x.name() === 'Text' && x.prop('children').indexOf(getText('youMust')) > -1 && x.prop('children').indexOf(getText('rouge')) > -1
        );

        expect(youMustbeRougeMessage.exists()).toBeTruthy();
    });

    it('shold render you must be VIB text if not BiLevelQualifiedFor SKU and isBiExclusive and is not BiQualify', () => {
        spyOn(userUtils, 'isBiLevelQualifiedFor').and.returnValue(false);
        props.currentSku = {
            biExclusiveLevel: 'VIB'
        };
        const wrapper = shallow(<ProductQuickLookMessage {...props} />);

        const youMustbeVIBMessage = wrapper.findWhere(
            x => x.name() === 'Text' && x.prop('children').indexOf(getText('youMust')) > -1 && x.prop('children').indexOf(getText('vib')) > -1
        );

        expect(youMustbeVIBMessage.exists()).toBeTruthy();
    });
});
