const React = require('react');
const { shallow } = require('enzyme');

describe('<RewardsCarousel /> component', () => {
    let RewardsCarousel;
    let shallowComponent;

    beforeEach(() => {
        RewardsCarousel = require('components/RichProfile/BeautyInsider/RewardsCarousel/RewardsCarousel').default;
        shallowComponent = shallow(
            <RewardsCarousel
                items={[{}, {}]}
                title={'LegacyCarousel'}
                subtitle={'Rewards'}
                hasViewAll={true}
            />
        );
    });

    it('should render title', () => {
        const carouselTitle = shallowComponent.find('Text').at(1);
        expect(carouselTitle.prop('children')).toEqual('LegacyCarousel');
    });

    it('should render subtitle', () => {
        const carouselTitle = shallowComponent.find('Text').at(0);
        expect(carouselTitle.prop('children')).toEqual('Rewards');
    });

    it('should render a Carousel component', () => {
        expect(shallowComponent.find('LegacyCarousel').length).toEqual(1);
    });

    it('should render a Link component', () => {
        expect(shallowComponent.find('Link').length).toEqual(1);
    });

    it('should render sent items inside Carousel component', () => {
        expect(shallowComponent.find('RewardItem').length).toEqual(2);
    });

    it('should use proper image size for desktop', () => {
        const carouselComponent = shallowComponent.find('LegacyCarousel');
        expect(carouselComponent.prop('controlHeight')).toEqual(135);
    });

    it('should use proper image size for mobile', () => {
        spyOn(Sephora, 'isMobile').and.returnValue(true);
        shallowComponent = shallow(<RewardsCarousel items={[{}, {}]} />);
        const carouselComponent = shallowComponent.find('LegacyCarousel');
        expect(carouselComponent.prop('controlHeight')).toEqual(162);
    });

    it('should set display items based on desktop', () => {
        spyOn(Sephora, 'isDesktop').and.returnValue(true);
        shallowComponent = shallow(<RewardsCarousel items={[{}, {}]} />);
        const carouselComponent = shallowComponent.find('LegacyCarousel');
        expect(carouselComponent.prop('displayCount')).toEqual(4);
    });

    it('should set display items based on mobile', () => {
        spyOn(Sephora, 'isMobile').and.returnValue(true);
        shallowComponent = shallow(<RewardsCarousel items={[{}, {}]} />);
        const carouselComponent = shallowComponent.find('LegacyCarousel');
        expect(carouselComponent.prop('displayCount')).toEqual(2);
    });

    it('should send proper title to RewardItems', () => {
        const rewardItemComponent = shallowComponent.find('RewardItem').at(0);
        expect(rewardItemComponent.prop('rootContainerName')).toEqual('LegacyCarousel');
    });

    it('should have a callback function for Carousel next arrow click event', () => {
        const carouselComponent = shallowComponent.find('LegacyCarousel');
        expect(carouselComponent.prop('rightArrowCallback')).toBeDefined();
    });

    it('should have a callback function for Carousel previous arrow click event', () => {
        const carouselComponent = shallowComponent.find('LegacyCarousel');
        expect(carouselComponent.prop('leftArrowCallback')).toBeDefined();
    });
});
