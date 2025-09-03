const React = require('react');
const { shallow } = require('enzyme');

describe('SinglePointView component', () => {
    let store;
    let Actions;
    let SinglePointView;
    let localeUtils;
    let getText;
    let commonProps;
    let CASH_BACK_REWARDS_MODAL_CONTENT;

    beforeEach(() => {
        store = require('store/Store').default;
        Actions = require('Actions').default;
        SinglePointView = require('components/Reward/LoyaltyPromo/SinglePointView').default;
        CASH_BACK_REWARDS_MODAL_CONTENT = require('utils/BCC').default.MEDIA_IDS.CASH_BACK_REWARDS_MODAL_CONTENT;
        localeUtils = require('utils/LanguageLocale').default;

        getText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');
        commonProps = {
            getText: arg => arg,
            createEligibilityInfoElement: () => '',
            applyToBasket: () => {},
            removeFromBasket: () => {},
            cbr: {
                promotions: [
                    {
                        couponCode: 'couponCode',
                        points: 10,
                        promotionType: 'CBR'
                    }
                ],
                availableRewardsTotal: 0,
                promoMessage: []
            },
            pfd: {
                promotions: [],
                availableRewardsTotal: 0,
                promoMessage: []
            },
            pfdOnInfoClick: () => {},
            cbrOnInfoClick: () => {},
            cmsInfoModals: {}
        };
    });

    it('should render using default props', () => {
        // Arrange/Act
        const wrapper = shallow(<SinglePointView {...commonProps} />)
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.isEmptyRender()).toEqual(false);
    });

    it('should render "HeadTitle" component', () => {
        // Arrange/Act
        const wrapper = shallow(<SinglePointView {...commonProps} />)
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.find('HeadTitle').exists()).toEqual(true);
    });

    it('should render "HeadImage" component with custom image', () => {
        // Arrange
        const customImage = '/img/ufe/icons/points-cash.svg';

        // Act
        const wrapper = shallow(<SinglePointView {...commonProps} />)
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.find(`HeadImage[src="${customImage}"]`).exists()).toEqual(true);
    });

    it('should render with eligibility info', () => {
        // Arrange
        const option = {
            ...commonProps.cbr.promotions[0],
            localizedDiscountAmount: 123
        };
        const eligibilityInfo = getText('singleCbrNoPfdPoints', [option.localizedDiscountAmount, option.points]); // `*${option.localizedDiscountAmount}% off* (${option.points} points)`;
        const props = {
            ...commonProps,
            cbr: {
                ...commonProps.cbr,
                promotions: [option]
            }
        };

        // Act
        const wrapper = shallow(<SinglePointView {...props} />)
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.find('Markdown').prop('content')).toEqual(eligibilityInfo);
    });

    it('should render with question mark after eligibility info', () => {
        // Arrange/Act
        const wrapper = shallow(<SinglePointView {...commonProps} />)
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.find('Markdown + InfoButton').exists()).toEqual(true);
    });

    it('should render eligibility info on new line for Basket page', () => {
        // Arrange/Act
        const wrapper = shallow(<SinglePointView {...commonProps} />)
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.find('LegacyGridCell').at(1).find('Text').at(1).prop('is')).toEqual('div');
    });

    it('should render eligibility info on new line for Checkout page', () => {
        // Arrange
        const props = {
            ...commonProps,
            isCheckout: true
        };

        // Act
        const wrapper = shallow(<SinglePointView {...props} />)
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.find('LegacyGridCell').at(1).find('Text').at(1).prop('is')).toEqual('div');
    });

    it('should create "termsAndConditionsShowModalAction" action when user clicks on question mark icon', () => {
        // Arrange
        const showModal = spyOn(Actions, 'showMediaModal');
        spyOn(store, 'dispatch');

        // Act
        const wrapper = shallow(<SinglePointView {...commonProps} />)
            .find('SinglePointView')
            .shallow();
        wrapper.find('Markdown + InfoButton').simulate('click');

        // Assert
        expect(showModal).toHaveBeenCalled();
    });

    it('should dispatch "termsAndConditionsShowModalAction" action when user clicks on question mark icon', () => {
        // Arrange
        const dispatch = spyOn(store, 'dispatch');
        const action = {
            type: Actions.TYPES.SHOW_MEDIA_MODAL,
            isOpen: true,
            titleDataAt: 'cbr_modal_title',
            mediaId: CASH_BACK_REWARDS_MODAL_CONTENT,
            title: 'Beauty Insider Cash',
            modalBodyDataAt: 'cbr_modal_info',
            dismissButtonText: 'Got It',
            dismissButtonDataAt: 'cbr_modal_got_it_btn',
            modalDataAt: 'cbr_modal',
            modalCloseDataAt: 'cbr_modal_close_btn',
            modalClose: undefined,
            width: undefined,
            showMediaTitle: undefined
        };

        // Act
        const wrapper = shallow(<SinglePointView {...commonProps} />)
            .find('SinglePointView')
            .shallow();
        wrapper.find('Markdown + InfoButton').simulate('click');

        // Assert
        expect(dispatch).toHaveBeenCalledWith(action);
    });

    it('should render disclaimer when points applied', () => {
        // Arrange
        const resourseString = getText('singleCbrPointsNonRefundable');
        const props = {
            ...commonProps,
            cbr: {
                ...commonProps.cbr,
                promotions: [
                    {
                        ...commonProps.cbr.promotions[0],
                        isApplied: true
                    }
                ]
            }
        };

        // Act
        const wrapper = shallow(<SinglePointView {...props} />, { disableLifecycleMethods: true })
            .find('SinglePointView')
            .shallow();

        // Assert
        expect(wrapper.find('Text[data-at="points_nonrefundable_label"]').prop('children')).toEqual(resourseString);
    });
});
