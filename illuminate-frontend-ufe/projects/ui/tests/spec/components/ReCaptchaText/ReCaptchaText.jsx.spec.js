const React = require('react');
const { shallow } = require('enzyme');

describe('<ReCaptchaText JSX file>', () => {
    let wrapper;
    let ReCaptchaText;

    beforeEach(() => {
        ReCaptchaText = require('components/ReCaptchaText/ReCaptchaText').default;
        wrapper = shallow(<ReCaptchaText />);
    });

    it('should render data-at attribute for privacy policy link', () => {
        expect(wrapper.find('[data-at="privacy_policy_link"]').length).toBe(1);
    });

    it('should render data-at attribute for terms link', () => {
        expect(wrapper.find('[data-at="terms_link"]').length).toBe(1);
    });
});
