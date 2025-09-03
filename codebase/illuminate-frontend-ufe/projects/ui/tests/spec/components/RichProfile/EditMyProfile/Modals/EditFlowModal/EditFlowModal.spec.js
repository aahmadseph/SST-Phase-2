const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('EditFlowModal component', () => {
    let EditFlowModal;
    let component;

    beforeEach(() => {
        EditFlowModal = require('components/RichProfile/EditMyProfile/Modals/EditFlowModal/EditFlowModal').default;
    });

    describe('componentDidMount', () => {
        let props;
        let setStateSpy;
        let subscribeSpy;
        let store;
        let getStateSpy;

        beforeEach(() => {
            props = { title: 'Color IQ' };
            const wrapper = shallow(<EditFlowModal {...props} />);
            component = wrapper.instance();
            setStateSpy = spyOn(component, 'setState');
            store = require('store/Store').default;
            subscribeSpy = spyOn(store, 'subscribe');
            getStateSpy = spyOn(store, 'getState');
        });

        it('should subscribe once, and update state wheen user bi account updates occur', () => {
            component.componentDidMount();
            expect(subscribeSpy).toHaveBeenCalledTimes(1);
            expect(subscribeSpy).toHaveBeenCalledWith(any(Function), component);

            getStateSpy.and.returnValue({ user: { beautyInsiderAccount: 'newBIInfo' } });

            subscribeSpy.calls.first().args[0]();

            expect(setStateSpy).toHaveBeenCalledTimes(2);
            expect(setStateSpy).toHaveBeenCalledWith({ biAccount: 'newBIInfo' });
        });
    });

    describe('save', () => {
        let props;
        let store;
        let dispatchStub;
        let profileActions;
        let showEditFlowModalStub;
        let fireAnalyticsStub;

        beforeEach(() => {
            props = { saveProfileCallback: createSpy('saveProfileCallback') };
            const wrapper = shallow(<EditFlowModal {...props} />);
            component = wrapper.instance();
            component.tabContent = {};
            fireAnalyticsStub = spyOn(component, 'fireAnalytics');

            store = require('store/Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            profileActions = require('actions/ProfileActions').default;
            showEditFlowModalStub = spyOn(profileActions, 'showEditFlowModal').and.returnValue('showEditFlowModal');
        });

        it('should dispatch an action to close modal without saving', () => {
            component.requestClose();
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(dispatchStub).toHaveBeenCalledWith('showEditFlowModal');
            expect(showEditFlowModalStub).toHaveBeenCalledWith(false);
        });

        it('should dispatch an action to close modal in saveProfileCallback', () => {
            component.tabContent = {
                getData: () => {
                    return 'tabContentData';
                }
            };

            component.save();
            expect(component.props.saveProfileCallback).toHaveBeenCalledTimes(1);
            expect(component.props.saveProfileCallback).toHaveBeenCalledWith('tabContentData', any(Function), false, false);

            component.props.saveProfileCallback.calls.first().args[1]();

            expect(fireAnalyticsStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('fireAnalytics', () => {
        let processEvent;
        let processStub;
        let anaConsts;

        beforeEach(() => {
            anaConsts = require('analytics/constants').default;
            processEvent = require('analytics/processEvent').default;
            processStub = spyOn(processEvent, 'process');

            const wrapper = shallow(<EditFlowModal />);
            component = wrapper.instance();
            component.avatarFile = null;
        });

        it('should process analytics for when user elects to make their profile private', () => {
            const dataToSave = { biPrivate: { biPrivate: true } };

            component.fireAnalytics(dataToSave);

            expect(processStub).toHaveBeenCalledTimes(2);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    linkName: 'D=c55',
                    actionInfo: 'cmnty:my profile:updated:bp privacy settings',
                    pageName: 'cmnty profile:my-profile:bp privacy settings:*',
                    text: 'just me',
                    world: 'bp privacy settings'
                }
            });
        });
    });
});
