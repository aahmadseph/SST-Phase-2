/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const Highlights = require('components/ProductPage/Highlights/Highlights').default;
const processEvent = require('analytics/processEvent').default;
const { ASYNC_PAGE_LOAD } = require('analytics/constants').default;

describe('<Highlights />', () => {
    let wrapper;
    let component;
    let setStateStub;
    let trackModalShowStub;
    let processStub;
    const props = {
        items: [
            {
                id: 'firstItem',
                name: 'someName',
                imageUrl: 'someImageUrl',
                description: 'someDescription',
                altText: 'someAltText'
            }
        ]
    };

    beforeEach(() => {
        wrapper = shallow(<Highlights {...props} />);
    });

    describe('render', () => {
        it('should render Divider component', () => {
            const element = wrapper.findWhere(x => x.name() === 'Divider');
            expect(element.exists()).toBeTruthy();
        });

        it('should render Text component', () => {
            const element = wrapper.findWhere(x => x.name() === 'Text' && x.prop('children') === 'Highlights');
            expect(element.exists()).toBeTruthy();
        });

        // it('should render span component', () => {
        //     const element = wrapper.findWhere(x => x.name() === 'span');
        //     expect(element.length).toBe(3);
        // });
    });

    describe('closeModal method', () => {
        beforeEach(() => {
            component = wrapper.instance();
            component.state = {
                showModel: true,
                activeItem: props.items[0]
            };
            setStateStub = spyOn(component, 'setState');
        });

        it('should close the modal', () => {
            component.closeModal();
            expect(setStateStub).toHaveBeenCalled();
        });
    });

    describe('showModal method', () => {
        beforeEach(() => {
            component = wrapper.instance();
            component.state = {
                showModel: false,
                activeItem: null
            };
            trackModalShowStub = spyOn(component, 'trackModalShow');
            setStateStub = spyOn(component, 'setState');
        });

        it('should show the modal', () => {
            component.showModal(props.items[0]);
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('trackModalShow method', () => {
        let world;
        let pageName;
        beforeEach(() => {
            component = wrapper.instance();
            processStub = spyOn(processEvent, 'process');
            world = digitalData.page.attributes.world;
            pageName = digitalData.page.attributes.sephoraPageInfo.pageName;
            digitalData.page.attributes.world = 'someWorld';
            digitalData.page.attributes.sephoraPageInfo.pageName = 'somePageName';
        });

        afterEach(() => {
            digitalData.page.attributes.sephoraPageInfo.pageName = pageName;
            digitalData.page.attributes.world = world;
        });

        it('should fire analytics', () => {
            component.trackModalShow(props.items[0]);
            expect(processStub).toHaveBeenCalledTimes(1);
            expect(processStub).toHaveBeenCalledTimes(1);
        });

        it('should fire analytics with correct values', () => {
            component.trackModalShow(props.items[0]);
            const data = {
                pageName: 'product:product highlight:someWorld:*somename',
                pageDetail: 'product highlight',
                pageType: 'product',
                world: 'someWorld',
                linkData: 'product highlight:somename',
                previousPageName: 'somePageName'
            };
            expect(processStub).toHaveBeenCalledWith(ASYNC_PAGE_LOAD, { data });
        });
    });
});
