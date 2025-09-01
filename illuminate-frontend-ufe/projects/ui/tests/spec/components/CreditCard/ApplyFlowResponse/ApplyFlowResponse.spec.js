/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');

describe('ApplyFlowResponse component', () => {
    let ApplyFlowResponse;
    let store;
    let component;
    let props;

    beforeEach(() => {
        ApplyFlowResponse = require('components/CreditCard/ApplyFlow/ApplyFlowResponse/ApplyFlowResponse.es6').default;
        store = require('Store').default;
        props = {
            status: {}
        };
    });

    describe('viewDetails', () => {
        let Events;
        let Actions;
        let dispatchStub;
        let actionStub;

        beforeEach(() => {
            Actions = require('Actions').default;
            Events = Sephora.Util;
            spyOn(Events, 'onLastLoadEvent');
            dispatchStub = spyOn(store, 'dispatch');
            actionStub = spyOn(Actions, 'showCreditReportDetailsModal');

            props = {
                status: {
                    bureauAddress: ['Equifax', 'PO Box 740241', 'Atlanta, CA 30374', '(800) 685-1111'],
                    bureauCreditScore: 873,
                    bureauRejectReasons: ['Reject Reason One', 'Reject Reason Two', 'Reject Reason Three', 'Reject Reason Four', 'Reject Reason Five']
                }
            };
            const wrapper = shallow(<ApplyFlowResponse {...props} />);
            component = wrapper.instance();
            component.viewDetails();
        });

        it('should dispatch an action', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call the action showCreditReportDetailsModal', () => {
            expect(actionStub).toHaveBeenCalledWith(true, props.status);
        });
    });
});
