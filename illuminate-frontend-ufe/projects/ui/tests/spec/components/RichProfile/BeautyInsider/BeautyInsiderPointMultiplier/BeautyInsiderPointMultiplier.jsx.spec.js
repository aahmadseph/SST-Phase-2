/* eslint-disable object-curly-newline */
const React = require('react');
const { objectContaining } = jasmine;
const { shallow, render } = require('enzyme');
const {
    LINK_TRACKING_EVENT,
    Event: { EVENT_71 }
} = require('analytics/constants').default;

describe('BeautyInsiderPointMultiplier component', () => {
    let BeautyInsiderPointMultiplier;
    let wrapper;
    let triggerPointMultiplierModalStub;
    let component;
    let promoUtils;
    let resolvedApiCall;
    let setStateSpy;
    const props = {
        pointMultiplierContentMsg: 'Use code **morepoints** as many times as you\'d like',
        pointMultiplierHeading: '**Event Details**',
        promoApplied: false,
        promoCode: 'morepoints',
        promoEndDate: 'Friday, April 30',
        userLevelPointMultiplier: [
            {
                multiplier: '2X',
                userType: 'Insider'
            },
            {
                multiplier: '3X',
                userType: 'VIB'
            },
            {
                multiplier: '4X',
                userType: 'Rouge'
            }
        ],
        userMultiplier: {
            multiplier: '4X',
            userType: 'Rouge'
        }
    };

    beforeEach(() => {
        promoUtils = require('utils/Promos').default;
        BeautyInsiderPointMultiplier =
            require('components/RichProfile/BeautyInsider/BeautyInsiderPointMultiplier/BeautyInsiderPointMultiplier').default;

        triggerPointMultiplierModalStub = spyOn(BeautyInsiderPointMultiplier, 'triggerPointMultiplierModal');
        wrapper = shallow(<BeautyInsiderPointMultiplier {...props} />);
    });

    it('should render end date', () => {
        const date = BeautyInsiderPointMultiplier.renderDate(props);
        const str = date.props.children.props.children;
        expect(str).toEqual(`Ends ${props.promoEndDate}`);
    });

    xit('should render content message', () => {
        const content = BeautyInsiderPointMultiplier.renderContent(props);
        const rendered = render(content);
        const text = rendered.find('p').html();
        expect(text).toEqual('Use code <strong>morepoints</strong> as many times as you&apos;d like');
    });

    // it('should render correct image according to user tier', () => {
    //     const content = BeautyInsiderPointMultiplier.renderContent(props);
    //     const src = render(content).first().attr('src');
    //     expect(src).toContain('logo-rouge.svg');
    // });

    it('should call showMediaModal method', () => {
        const detailsLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('data-at') === `${Sephora.debug.dataAt('pm_details_btn')}`);
        detailsLink.simulate('click');
        expect(triggerPointMultiplierModalStub).toHaveBeenCalled();
    });

    it('should render correct text un button if promo hasn\'t been applied', () => {
        component = wrapper.instance();
        const button = component.renderCallToAction();
        expect(button.props.children).toContain('Apply Promo');
    });

    // it('should render correct text un button if promo has been applied', () => {
    //     component = wrapper.instance();
    //     component.state.promoApplied = true;
    //     const button = shallow(component.renderCallToAction());
    //     const text = button.find('Text').children(0).text();
    //     expect(text).toContain('Applied');
    // });

    it('should have data-at property for Event Details label', () => {
        const dataAt = wrapper.findWhere(n => n.name() === 'Markdown' && n.prop('data-at') === `${Sephora.debug.dataAt('pm_event_details_label')}`);
        expect(dataAt.length).toEqual(1);
    });

    it('should have data-at property for Event Details section', () => {
        expect(wrapper.find(`[data-at="${Sephora.debug.dataAt('pm_event_details_section')}"]`).exists()).toEqual(true);
    });

    xdescribe('applyPromo method', () => {
        let processEvent;
        let basketApi;

        beforeEach(() => {
            processEvent = require('analytics/processEvent').default;
            basketApi = require('services/api/basket').default;
        });

        it('should set promoApplied state to true if no errors from backend', done => {
            // Arrange
            resolvedApiCall = Promise.resolve({ data: {} });
            spyOn(promoUtils, 'applyPromo').and.returnValue(resolvedApiCall);
            wrapper = shallow(<BeautyInsiderPointMultiplier {...props} />);

            // Act
            wrapper.instance().applyPromo();

            // Assert
            resolvedApiCall.then(() => {
                expect(wrapper.state()).toEqual(objectContaining({ promoApplied: true }));
                done();
            });
        });

        it('should fire s.tl call', done => {
            // Arrange
            const applyPromotion = Promise.resolve({ appliedPromotions: [{ couponCode: 'morepoints' }] });
            spyOn(basketApi, 'applyPromotion').and.returnValue(applyPromotion);
            spyOn(processEvent, 'process');
            const eventData = {
                data: objectContaining({
                    eventStrings: [EVENT_71],
                    actionInfo: 'bi:points multiplier:apply promo',
                    userInput: 'enter promo:morepoints'
                })
            };
            wrapper = shallow(<BeautyInsiderPointMultiplier {...props} />);

            // Act
            wrapper.instance().applyPromo();

            // Assert
            applyPromotion.then(() => {
                it('should make call to LINK_TRACKING_EVENT with data', () => {
                    expect(processEvent.process).toHaveBeenCalledWith(LINK_TRACKING_EVENT, eventData);
                });

                it('should have data-at property for Apply label when PME promo is applied', () => {
                    const dataAt = wrapper.findWhere(n => n.name() === 'Text' && n.prop('data-at') === `${Sephora.debug.dataAt('pm_applied_label')}`);
                    expect(dataAt.length).toEqual(1);
                });

                it('should have data-at property for Remove label when PME promo is applied', () => {
                    const dataAt = wrapper.findWhere(n => n.name() === 'Link' && n.prop('data-at') === `${Sephora.debug.dataAt('pm_remove_label')}`);
                    expect(dataAt.length).toEqual(1);
                });

                done();
            });
        });
    });

    xdescribe('removePromo method', () => {
        let removePromoSpy;

        beforeEach(() => {
            removePromoSpy = spyOn(promoUtils, 'removePromo');
            component = wrapper.instance();
            setStateSpy = spyOn(component, 'setState');
        });

        it('should set promoApplied state to false', () => {
            resolvedApiCall = Promise.resolve({});
            removePromoSpy.and.returnValue(resolvedApiCall);
            resolvedApiCall.then().then(() => {
                expect(setStateSpy).toHaveBeenCalledWith({ promoApplied: false });
            });
            component.removePromo();
        });
    });

    describe('componentDidMount', () => {
        let store;
        let setAndWatchSpy;
        beforeEach(() => {
            store = require('store/Store').default;
            setAndWatchSpy = spyOn(store, 'setAndWatch');
            component = wrapper.instance();
        });
        it('should set up a basket watcher', () => {
            component.componentDidMount();
            expect(setAndWatchSpy).toHaveBeenCalled();
        });
    });
});
