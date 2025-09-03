/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow, render } = require('enzyme');
const { objectContaining } = jasmine;

describe('PointsForDiscount component', () => {
    let analyticsUtils;
    let urlUtils;
    let PointsForDiscount;
    let wrapper;
    let triggerPointsForDiscountModalStub;
    let component;
    let promoUtils;
    const props = {
        biPercentageOffAvailabilityMessage: 'Points for Discount Event: Apply **1,000 points** for upto **10% off**',
        availablePFDPromotions: [
            {
                point: 1000,
                value: '10%'
            },
            {
                point: 500,
                value: '5%'
            },
            {
                point: 250,
                value: '3%'
            }
        ],
        biPercentageOffHeading: '**Event Details**',
        eligiblePoint: 1000,
        eligibleValue: '10%',
        pfdPromoEndDate: 'Thursday, December 31'
    };

    beforeEach(() => {
        analyticsUtils = require('analytics/utils').default;
        urlUtils = require('utils/Url').default;
        promoUtils = require('utils/Promos').default;
        PointsForDiscount = require('components/RichProfile/BeautyInsider/PointsForDiscount/PointsForDiscount').default;
        triggerPointsForDiscountModalStub = spyOn(PointsForDiscount, 'triggerPointsForDiscountModal');
        wrapper = shallow(<PointsForDiscount {...props} />);
    });

    it('should render end date', () => {
        const date = PointsForDiscount.renderDate(props);
        const str = date.props.children.props.children;
        expect(str).toEqual(`Ends ${props.pfdPromoEndDate}`);
    });

    xit('should render content', () => {
        const content = PointsForDiscount.renderContent(props);
        const rendered = render(content);
        expect(rendered.text()).toEqual('Eligible for up to10%off(1000 points)');
    });

    it('should have data-at property for pfd content label', () => {
        expect(wrapper.find('[data-at="pfd_eligible_for_label"]').exists()).toBe(true);
    });

    xit('should render details', () => {
        const details = PointsForDiscount.renderDetails(props);
        const rendered = render(details);
        expect(rendered.text()).toEqual('Event Details\n' + '10% off: 1000 points5% off: 500 points3% off: 250 points');
    });

    it('should call showMediaModal method', () => {
        const detailsLink = wrapper.find('[data-at="pfd_details_link"]');
        detailsLink.simulate('click');
        expect(triggerPointsForDiscountModalStub).toHaveBeenCalled();
    });

    it('should call handleApplyClick method', () => {
        // AArrange
        const handleApplyClick = spyOn(PointsForDiscount, 'handleApplyClick');

        // Act
        wrapper.findWhere(n => n.name() === 'Button' && n.prop('name') === 'applyBtn').simulate('click');

        // Assert
        expect(handleApplyClick).toHaveBeenCalled();
    });

    it('handleApplyClick method should set next page data', () => {
        // Arrange
        const setNextPageData = spyOn(analyticsUtils, 'setNextPageData');
        spyOn(urlUtils, 'redirectTo');
        const pageData = {
            linkData: 'bi:points for discount:apply in basket'
        };

        // Act
        PointsForDiscount.handleApplyClick();

        // Assert
        expect(setNextPageData).toHaveBeenCalledWith(objectContaining(pageData));
    });

    it('handleApplyClick method should redirect to basket page', () => {
        // Arrange
        const redirectTo = spyOn(urlUtils, 'redirectTo');
        const pageNameWhereToRedirect = '/basket';

        // Act
        PointsForDiscount.handleApplyClick();

        // Assert
        expect(redirectTo).toHaveBeenCalledWith(pageNameWhereToRedirect);
    });

    it('should render correct text and button if promo hasn\'t been applied', () => {
        component = wrapper.instance();
        const button = component.renderCallToAction();
        expect(button.props.children).toContain('Apply in Basket');
    });

    it('should render correct text and button if promo has been applied', () => {
        component = wrapper.instance();
        component.state.pointsApplied = true;
        const button = shallow(component.renderCallToAction());
        const text = button.find('Text').children(0).text();
        expect(text).toContain('Applied');
    });

    it('should render remove link if promo has been applied', () => {
        component = wrapper.instance();
        component.state.pointsApplied = true;
        const button = shallow(component.renderCallToAction());
        const text = button.find('Link').children(0).text();
        expect(text).toContain('Remove');
    });

    it('should have data-at property for Event Details label', () => {
        const dataAt = wrapper.findWhere(n => n.name() === 'Box' && n.prop('data-at') === `${Sephora.debug.dataAt('pfd_event_details_label')}`);
        expect(dataAt.length).toEqual(1);
    });

    it('should have data-at property for Event Details section', () => {
        expect(wrapper.find(`[data-at="${Sephora.debug.dataAt('pfd_event_details_section')}"]`).exists()).toEqual(true);
    });
});
