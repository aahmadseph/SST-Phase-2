const React = require('react');
const StoresDrop = require('components/Header/StoresDrop/StoresDrop').default;

describe('<StoresDrop> component', () => {
    let shallowComponent;
    let props;
    const firstItemName = 'Store Events';

    beforeEach(() => {
        props = {
            items: [
                {
                    altText: 'Exciting launches, parties, & more!',
                    componentName: 'Sephora RWD Link Component',
                    componentType: 92,
                    enableTesting: false,
                    imageHeight: '40',
                    imageSource: '/contentimages/meganav/icons/happening_events_2.jpg',
                    imageWidth: '40',
                    name: firstItemName,
                    targetUrl: '/happening/home?type=events',
                    targetWindow: 0,
                    titleText: firstItemName
                },
                {
                    altText: 'Explore',
                    componentName: 'Sephora RWD Link Component',
                    componentType: 92,
                    enableTesting: false,
                    imageHeight: '40',
                    imageSource: '/contentimages/meganav/icons/happening_new.jpg',
                    imageWidth: '40',
                    name: 'New in Store',
                    targetUrl: '/happening/home?type=announcements',
                    targetWindow: 0,
                    titleText: 'New in Store'
                }
            ],
            dropWidth: 343
        };
        shallowComponent = enzyme.shallow(<StoresDrop {...props} />);
    });

    it('should render the <Dropdown /> component', () => {
        expect(shallowComponent.find('Dropdown').length).toEqual(1);
    });

    it('should render the DropdownTrigger', () => {
        expect(shallowComponent.find('DropdownTrigger').length).toEqual(1);
    });

    it('should render the DropdownMenu', () => {
        expect(shallowComponent.find('DropdownMenu').length).toEqual(1);
    });
});
