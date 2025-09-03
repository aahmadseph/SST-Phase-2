const React = require('react');
const { clock } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const actions = require('actions/Actions').default;
const CreditReportDetailsModal = require('components/GlobalModals/CreditReportDetailsModal/CreditReportDetailsModal').default;

describe('CreditReportDetailsModal component', () => {
    let wrapper;

    describe('when rendering', () => {
        beforeEach(() => {
            clock().install();
            clock().mockDate(new Date(Date.UTC(1985, 3, 9, 0, 0, 0)));

            const props = {
                isOpen: true,
                bureauAddress: ['Equifax', 'PO Box 740241', 'Atlanta, CA 30374', '(800) 685-1111'],
                bureauCreditScore: 873,
                bureauRejectReasons: ['Reject Reason One', 'Reject Reason Two', 'Reject Reason Three', 'Reject Reason Four', 'Reject Reason Five']
            };
            wrapper = shallow(<CreditReportDetailsModal {...props} />);
        });

        afterEach(() => {
            clock().uninstall();
        });

        it('should pass isOpen to Modal', () => {
            const modal = wrapper.find('Modal').get(0);
            expect(modal.props.isOpen).toEqual(true);
        });

        it('should render bureauAddress', () => {
            const div = wrapper.findWhere(n => n.name() === 'div' && n.key('is') === 'address-line-3');
            expect(div.text()).toEqual('(800) 685-1111');
        });

        it('should render bureauCreditScore and currentDate', () => {
            const combineChildren = node => node.children().reduce((memo, curr) => memo + curr.text(), '');

            const text = wrapper.findWhere(n => n.name() === 'h3' && combineChildren(n) === 'Your credit score as of April 09, 1985: 873');
            expect(text.length).toEqual(1);
        });

        it('should render bureauRejectReasons', () => {
            const li = wrapper.findWhere(n => n.name() === 'li' && n.key('is') === 'reject-reason-4');
            expect(li.text()).toEqual('Reject Reason Five');
        });
    });

    it('when closing modal should dispatch showCreditReportDetailsModal with the value as false', () => {
        // Arrange
        const dispatch = spyOn(store, 'dispatch');
        const showCreditReportDetailsModal = spyOn(actions, 'showCreditReportDetailsModal');

        // Act
        shallow(<CreditReportDetailsModal />)
            .instance()
            .requestClose();

        // Assert
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(showCreditReportDetailsModal).toHaveBeenCalledWith(false);
    });
});
