const React = require('react');
const { shallow } = require('enzyme');
const TaxClaim = require('components/RichProfile/MyAccount/TaxClaim/TaxClaim').default;

describe('TaxClaim component', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            initTaxFlow: jasmine.createSpy('initTaxFlow').and.returnValue(Promise.resolve(true)),
            title: 'Test Title',
            subTitle: 'Test SubTitle',
            content: 'Test Content',
            startAppText: 'Start Application',
            userIsLoggedIn: true
        };

        wrapper = shallow(<TaxClaim {...props} />);
    });

    it('should render without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });
});
