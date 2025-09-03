const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;

describe('Carousel component', () => {
    let Carousel;
    let props;
    let wrapper;
    let component;
    let anaConsts;
    let processStub;
    let processEvent;

    beforeEach(() => {
        Carousel = require('components/Carousel/Carousel').default;
        anaConsts = require('analytics/constants').default;
        processEvent = require('analytics/processEvent').default;
        processStub = spyOn(processEvent, 'process');
    });

    describe('Next/Previous arrow click', () => {
        describe('on a regular Carousel', () => {
            it('should call processEvent with the correct values', () => {
                props = {
                    items: [{}, {}, {}],
                    itemCount: 3,
                    title: 'Use It With'
                };
                wrapper = shallow(<Carousel {...props} />);
                component = wrapper.instance();

                component.rootRef = { current: { scrollTo: createSpy() } };
                component.listRef = { current: { scrollBy: createSpy() } };

                component.scroll('next');

                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        actionInfo: 'Carousel :: Navigation',
                        linkName: 'Carousel :: Navigation',
                        internalCampaign: `product:${props.title.toLowerCase()}:slide:click next`,
                        eventStrings: [anaConsts.Event.EVENT_71],
                        imageIndex: NaN,
                        sku: undefined
                    }
                });
            });
        });
    });
});
