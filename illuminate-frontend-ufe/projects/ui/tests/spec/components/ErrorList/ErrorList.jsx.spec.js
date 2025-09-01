describe('<ErrorList />', () => {
    let React;
    let ErrorList;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        ErrorList = require('components/ErrorList').default;
    });

    it('should not show messages if there are none.', () => {
        shallowComponent = enzyme.shallow(<ErrorList />);
        const ErrorMsgList = shallowComponent.find('ErrorMsg');
        expect(ErrorMsgList.length).toBe(0);
    });

    it('should display all errorMessages given', () => {
        shallowComponent = enzyme.mount(<ErrorList errorMessages={['Error message']} />);
        const ErrorMsgList = shallowComponent.find('ErrorMsg');
        expect(ErrorMsgList.length).toBe(1);
    });
});
