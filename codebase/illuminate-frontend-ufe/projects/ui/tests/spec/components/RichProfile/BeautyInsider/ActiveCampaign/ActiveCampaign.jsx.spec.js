const React = require('react');
const { shallow } = require('enzyme');

describe('ActiveCampaign component', () => {
    let ActiveCampaign;
    let shallowComponent;
    let dateUtils;

    beforeEach(() => {
        dateUtils = require('utils/Date').default;
        spyOn(dateUtils, 'getDateInWeekdayMonthDayFormat');
        const campaign = {
            referralLink: 'link',
            socialMedia1: 'bcc text',
            socialMedia2: 'more bcc text',
            promoHeadLine: 'Share 10% Off and Earn 10 Points',
            campaignEndDate: '2022-04-04T23:59:59-07:00',
            howToQualify1: '',
            howToQualify2: '',
            summaryNoPointsText: '',
            pointsEarned: '',
            campaignTitle: '',
            campaignImage: 'refer',
            infoSectionTitle: '',
            infoSectionText: '',
            seeMoreMediaId: ''
        };
        ActiveCampaign = require('components/RichProfile/BeautyInsider/ActiveCampaign/ActiveCampaign').default;
        shallowComponent = shallow(<ActiveCampaign activeCampaign={campaign} />, { disableLifecycleMethods: true });
    });

    it('should display EmailShare component', () => {
        expect(shallowComponent.find('EmailShare').length).toEqual(1);
    });
    it('should render EmailShare with correct props', () => {
        expect(shallowComponent.find('EmailShare').props()).toEqual({
            body: 'more bcc text link',
            subject: 'bcc text'
        });
    });
    // LOYLS-474 temporarly hides FB icon untill FB App got restored
    // it('should display FacebookShare component', () => {
    //     expect(shallowComponent.find('FacebookShare').length).toEqual(1);
    // });
    // it('should render FacebookShare with correct props', () => {
    //     expect(shallowComponent.find('FacebookShare').props()).toEqual({ link: 'link' });
    // });
    it('should display TwitterShare component', () => {
        expect(shallowComponent.find('TwitterShare').length).toEqual(1);
    });
    it('should render TwitterShare with correct props', () => {
        expect(shallowComponent.find('TwitterShare').props()).toEqual({
            link: 'link',
            text: 'bcc text'
        });
    });
    it('should display campaign image', () => {
        const imageSrc = shallowComponent.find('Image').prop('src');
        expect(imageSrc).toEqual('/img/ufe/icons/refer.svg');
    });
    it('should display correct local text for ends at campaign end date', () => {
        const flag = shallowComponent.find('Flag');
        const text = flag.props().children;
        expect(text).toContain('Ends');
    });
    // Test should not open/show any UI elements such as dialogs.
    // it('should set isCopied state to false after 2000mil secs of referralLink copied', () => {
    //     const copyToClipBoard = shallowComponent.find('CopyToClipboard').dive();
    //     copyToClipBoard.props().onClick();
    //     expect(shallowComponent.state('isCopied')).toBeTrue();
    // });
});
