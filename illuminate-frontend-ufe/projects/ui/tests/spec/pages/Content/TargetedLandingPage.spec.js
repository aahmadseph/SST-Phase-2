const React = require('react');

describe('<TargetedLandingPage /> page', () => {
    let TargetedLandingPage, mountComponent;

    beforeEach(() => {
        TargetedLandingPage = require('pages/Content/TargetedLandingPage').default;
    });

    it('should render the <TargetedLandingPage /> component', () => {
        mountComponent = enzyme.shallow(<TargetedLandingPage />);
        expect(mountComponent.exists()).toBe(true);
    });

    it('should render <BeautyWinPromo /> component if isTlpContentfulEnabled is false', () => {
        Sephora.configurationSettings.isTlpContentfulEnabled = false;
        mountComponent = enzyme.shallow(<TargetedLandingPage />);
        const beautyWinPromo = mountComponent.find('BeautyWinPromo');
        expect(beautyWinPromo.exists()).toEqual(true);
    });
});
