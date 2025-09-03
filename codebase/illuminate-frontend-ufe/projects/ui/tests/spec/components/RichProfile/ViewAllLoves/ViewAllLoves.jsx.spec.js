const React = require('react');
const { shallow } = require('enzyme');

describe('ViewAllLoves component', () => {
    let ViewAllLoves;
    let shallowComponent;
    let props;

    beforeEach(() => {
        props = { onlyAFewLeftInLovesList: [{}] };
        ViewAllLoves = require('components/RichProfile/ViewAllLoves').default;
        shallowComponent = shallow(<ViewAllLoves {...props} />);
    });

    describe('with rootContainerName', () => {
        beforeEach(() => {
            shallowComponent.setState({
                lovesDisplayed: [
                    {
                        skuId: '2094217',
                        skuImages: {
                            image135: '/productimages/sku/s2094217-main-grid.jpg',
                            image162: '/productimages/sku/s2094217-162.jpg',
                            image250: '/productimages/sku/s2094217-main-hero.jpg',
                            image450: '/productimages/sku/s2094217-main-Lhero.jpg',
                            image62: '/productimages/sku/s2094217-main-Lthumb.jpg'
                        }
                    }
                ],
                isPublicLovesList: true
            });
        });

        it('should pass the rootContainerName to ProductListItem', () => {
            const listItemComponent = shallowComponent.find('ProductListItem').at(0);
            expect(listItemComponent.prop('rootContainerName')).toEqual('loves list');
        });
    });

    describe('only a few left a/b test', () => {
        beforeEach(() => {
            shallowComponent.setState({
                lovesDisplayed: [
                    {
                        skuId: '2094217'
                    }
                ],
                shouldDisplayOAFLProducts: true,
                totalOnlyAFewLeftLoves: 1,
                isPublicLovesList: false,
                totalNotifications: 1
            });
        });

        it('should render header text', () => {
            const headerText = 'Get These Before They’re Gone';
            const header = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children.at(0) === headerText);
            expect(header.exists()).toBe(true);
        });

        it('should render number of only few left products if any', () => {
            const numberOfOAFLitems = shallowComponent.find('CountCircle');
            expect(numberOfOAFLitems.exists()).toBe(true);
        });
    });
});
