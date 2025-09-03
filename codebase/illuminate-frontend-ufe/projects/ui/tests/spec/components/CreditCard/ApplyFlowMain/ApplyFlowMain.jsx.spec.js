const React = require('react');
const { shallow } = require('enzyme');

describe('ApplyFlowMain component', () => {
    let ApplyFlowMain;
    let shallowComponent;

    beforeEach(() => {
        ApplyFlowMain = require('components/CreditCard/ApplyFlow/ApplyFlowMain').default;

        const urlUtils = require('utils/Url').default;
        spyOn(urlUtils, 'redirectTo');
    });

    describe('ApplyFlowMain component when showResponsePage is false', () => {
        beforeEach(() => {
            shallowComponent = shallow(<ApplyFlowMain />);
            shallowComponent.setState({
                isUserReady: true,
                showResponsePage: false
            });
        });

        it('should render the ContentInformationRules component once', () => {
            expect(shallowComponent.find('ContentInformationRules').exists()).toEqual(true);
        });

        it('should render the PersonalInformation component once', () => {
            expect(shallowComponent.find('PersonalInformation').exists()).toEqual(true);
        });

        it('should render the SecureInformation component once', () => {
            expect(shallowComponent.find('SecureInformation').exists()).toEqual(true);
        });

        it('should render the OpeningAccount component once', () => {
            expect(shallowComponent.find('OpeningAccount').exists()).toEqual(true);
        });

        it('should render the ElectronicConsent component once', () => {
            expect(shallowComponent.find('ElectronicConsent').exists()).toEqual(true);
        });

        it('should render the submit Button once', () => {
            expect(shallowComponent.find('Button').exists()).toEqual(true);
        });

        it('should render the CompactFooter component once', () => {
            expect(shallowComponent.find('CompactFooter').exists()).toEqual(true);
        });

        describe('for Desktop display', () => {
            beforeEach(() => {
                spyOn(Sephora, 'isDesktop').and.returnValue(true);
            });

            describe('preapprovedBannerContent & nonPreApprovedContent are not populated', () => {
                it('should not render the BccComponentList component', () => {
                    expect(shallowComponent.find('BccComponentList').exists()).toEqual(false);
                });
            });

            describe('preapprovedBannerContent is populated', () => {
                beforeEach(() => {
                    shallowComponent.setState({ preapprovedBannerContent: {} });
                });

                it('should render the BccComponentList component once', () => {
                    expect(shallowComponent.find('BccComponentList').exists()).toEqual(true);
                });
            });

            describe('preapprovedBannerContent is not populated, but nonPreApprovedContent is', () => {
                beforeEach(() => {
                    const obj = {};
                    shallowComponent = shallow(<ApplyFlowMain nonPreApprovedContent={obj} />);
                    shallowComponent.setState({
                        isUserReady: true,
                        showResponsePage: false,
                        isPrivateLabel: false,
                        isCoBranded: false,
                        preapprovedBannerContent: null
                    });
                });

                it('should render the BccComponentList component once', () => {
                    expect(shallowComponent.find('BccComponentList').exists()).toEqual(true);
                });
            });
        });
    });

    describe('when showResponsePage is true', () => {
        beforeEach(() => {
            shallowComponent = shallow(<ApplyFlowMain />);
            shallowComponent.setState({
                isUserReady: true,
                showResponsePage: true,
                applicationStatus: {},
                welcomeBCCData: {}
            });
        });

        it('should render the ApplyFlowResponse component once', () => {
            expect(shallowComponent.find('ApplyFlowResponse').exists()).toEqual(true);
        });

        it('should render the CompactFooter component once', () => {
            expect(shallowComponent.find('CompactFooter').exists()).toEqual(true);
        });
    });
});
