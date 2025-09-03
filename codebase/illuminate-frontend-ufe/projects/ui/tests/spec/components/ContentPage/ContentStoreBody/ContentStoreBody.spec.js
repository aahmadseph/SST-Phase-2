/* eslint-disable no-unused-vars */
const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('ContentStoreBody', () => {
    let store;
    let events;
    let props;
    let ContentStoreBody;
    let component;
    let wrapper;
    let setStateStub;
    let dispatchStub;

    beforeEach(() => {
        store = require('Store').default;
        events = require('utils/framework/Events').default;
        ContentStoreBody = require('components/ContentPage/ContentStoreBody/ContentStoreBody').default;
        props = {
            items: [
                {
                    componentType: 67,
                    categoryid: ''
                }
            ],
            breadcrumbs: [{ name: 'customer service help' }, { name: 'finding products' }],
            ancestorHierarchy: [{ displayName: 'customer service help' }]
        };
        wrapper = shallow(<ContentStoreBody {...props} />);
        component = wrapper.instance();
        setStateStub = spyOn(component, 'setState');
        dispatchStub = spyOn(store, 'dispatch');
    });

    describe('setAnalytics method', () => {
        describe('when there is a child content store page', () => {
            let digitalDataPageInfo;

            beforeEach(() => {
                wrapper = shallow(<ContentStoreBody {...props} />);
                component = wrapper.instance();
                component.setAnalytics();
                digitalDataPageInfo = window.digitalData.page.pageInfo;
            });

            it('should set the top level with child page name', () => {
                const expectedPageName = `${props.breadcrumbs[0].name}-${props.breadcrumbs[1].name}`;
                expect(digitalDataPageInfo.pageName).toBe(expectedPageName);
            });
        });
    });
});
