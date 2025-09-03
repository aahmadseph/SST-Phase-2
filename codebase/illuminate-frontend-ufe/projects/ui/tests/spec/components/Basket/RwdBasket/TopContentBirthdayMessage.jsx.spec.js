const React = require('react');
const { shallow } = require('enzyme');

const birthdayMessagePersonalizedMock = {
    type: 'Banner',
    sid: 'Basket-Birthday-Personalized-Banner',
    mediaPlacement: 'left',
    variant: 'Icon',
    media: {
        sid: 'giftbox-icon-lgui',
        src: 'https://images.ctfassets.net/37lvxp3wt7oq/1EEHxtfuj9CUjNsKajaS6y/db0d7289ecb4c95fa6db90db9467376a/Visual_Design.svg',
        width: 20,
        height: 20
    },
    text: {
        json: {
            data: {},
            content: [
                {
                    data: {},
                    content: [
                        {
                            data: {},
                            marks: [],
                            value: 'Happy Birthday, {0}! Choose your birthday gift! ▸',
                            nodeType: 'text'
                        }
                    ],
                    nodeType: 'paragraph'
                }
            ],
            nodeType: 'document'
        }
    }
};

describe('<TopContentBirthdayMessage /> component', () => {
    let TopContentBirthdayMessage;
    let processEvent;
    let props;
    let event;
    let anaConsts;

    beforeEach(() => {
        TopContentBirthdayMessage =
            require('components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentBirthdayMessage/TopContentBirthdayMessage').default;
        processEvent = require('analytics/processEvent').default;
        anaConsts = require('analytics/constants').default;

        Sephora.configurationSettings.isBasketPersonalizationEnabled = true;

        props = {
            isBirthdayGiftEligible: true,
            personalizedComponent: {
                variationData: birthdayMessagePersonalizedMock
            },
            showSkeleton: false,
            openRewardsBazaarModal: () => {}
        };

        event = {
            preventDefault: () => {},
            stopPropagation: () => {}
        };
    });

    it('should render the banner', () => {
        // Act
        const wrapper = shallow(<TopContentBirthdayMessage {...props} />);

        // Assert
        expect(wrapper.find('TopPageCMSBannerMessage').exists()).toBeTruthy();
    });

    it('should not render if KS `isBasketPersonalizationEnabled` is set to false', () => {
        // Arrange
        Sephora.configurationSettings.isBasketPersonalizationEnabled = false;

        // Act
        const wrapper = shallow(<TopContentBirthdayMessage {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it('should not render if user is not birthday gift eligible', () => {
        // Arrange
        props.isBirthdayGiftEligible = false;

        // Act
        const wrapper = shallow(<TopContentBirthdayMessage {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it('should not render if variationData is empty', () => {
        // Arrange
        props.personalizedComponent.variationData = null;

        // Act
        const wrapper = shallow(<TopContentBirthdayMessage {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it('should trigger `openRewardsBazaarModal` on banner click', () => {
        // Arrange
        const openBazaarModalStub = spyOn(props, 'openRewardsBazaarModal');

        // Act
        const wrapper = shallow(<TopContentBirthdayMessage {...props} />);
        wrapper.find('TopPageCMSBannerMessage').simulate('click', event);

        // Assert
        expect(openBazaarModalStub).toHaveBeenCalled();
    });

    it('should trigger analytics on banner click', () => {
        const processStub = spyOn(processEvent, 'process');
        // Act
        const wrapper = shallow(<TopContentBirthdayMessage {...props} />);
        wrapper.find('TopPageCMSBannerMessage').simulate('click', event);

        // Assert
        expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: anaConsts.PAGE_NAMES.BAZAAR_BASKET,
                pageType: anaConsts.PAGE_TYPES.BASKET,
                pageDetail: anaConsts.PAGE_DETAIL.REWARDS_BAZAAR,
                internalCampaign: birthdayMessagePersonalizedMock.sid
            }
        });
    });

    it('should render message', () => {
        // Act
        const wrapper = shallow(<TopContentBirthdayMessage {...props} />);
        const bannerText = wrapper.dive().find('Connect(RichText)');

        // Assert
        expect(bannerText.length).toBe(1);
    });
});
