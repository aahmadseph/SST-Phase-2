const React = require('react');
const { COMPONENT_TYPES } = require('constants/content').default;
const { shallow } = require('enzyme');

describe('ComponentList component', () => {
    let ComponentList;
    let defaultProps;
    let shallowComponent;

    beforeEach(() => {
        defaultProps = {
            enablePageRenderTracking: true,
            trackingCount: 1,
            context: 'Container',
            page: 'home'
        };
        ComponentList = require('components/Content/ComponentList/ComponentList').default;
    });

    describe('divider', () => {
        let props;
        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.DIVIDER, sid: 'divider' }],
                ...defaultProps
            };
            shallowComponent = shallow(<ComponentList {...props} />);
        });
        it('should render', () => {
            const component = shallowComponent.find(COMPONENT_TYPES.DIVIDER);
            expect(component.length).toBe(1);
        });
    });

    describe('BannerList', () => {
        let props;

        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.BANNER_LIST, sid: 'test_id', width: 315, items: [{ test: 1 }] }],
                ...defaultProps
            };
            shallowComponent = shallow(<ComponentList {...props} />);
        });

        it('should render', () => {
            const component = shallowComponent.find('ErrorBoundary(Connect(BannerList))');
            expect(component.exists()).toBe(true);
        });

        it('should get the correct props ', () => {
            const component = shallowComponent.find('ErrorBoundary(Connect(BannerList))');
            expect(component.prop('items').length).toBe(1);
            expect(component.prop('width')).toBe(315);
        });
    });

    describe('Anchor', () => {
        let props;
        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.ANCHOR, sid: 'test_id' }],
                ...defaultProps
            };
            shallowComponent = shallow(<ComponentList {...props} />);
        });
        it('should render', () => {
            const component = shallowComponent.find(COMPONENT_TYPES.ANCHOR);
            expect(component.length).toBe(1);
        });
        it('should render with correct props', () => {
            const component = shallowComponent.find(COMPONENT_TYPES.ANCHOR).get(0);
            expect(component.props.sid).toEqual('test_id');
        });
    });

    describe('Copy Component', () => {
        let props;
        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.COPY, sid: 'test_id' }]
            };
            shallowComponent = shallow(<ComponentList {...props} />);
        });
        it('should render', () => {
            const component = shallowComponent.find(COMPONENT_TYPES.COPY);
            expect(component.length).toBe(1);
        });
        it('should render with correct props', () => {
            const component = shallowComponent.find(COMPONENT_TYPES.COPY).get(0);
            expect(component.props.sid).toBe('test_id');
        });
    });

    describe('SoftLinks component', () => {
        let props, SoftLinks;

        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.SOFT_LINKS, sid: 'test_id', title: 'softLinks' }],
                ...defaultProps
            };
            shallowComponent = shallow(<ComponentList {...props} />);
            SoftLinks = shallowComponent.find('Connect(SoftLinks)');
        });

        it('should Render', () => {
            expect(SoftLinks.exists()).toBe(true);
        });

        it('should render with correct props', () => {
            expect(SoftLinks.prop('title')).toBe('softLinks');
        });
    });

    describe('ProductList component', () => {
        let props, ProductList;
        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.PRODUCT_LIST, sid: 'home', title: 'choosen for you' }],
                ...defaultProps
            };
            ProductList = shallow(<ComponentList {...props} />)
                .find('Fragment')
                .children()
                .get(0);
        });
        it('should render', () => {
            expect(ProductList.props.title).toBe('choosen for you');
        });
    });

    describe('PromotionList component', () => {
        let props, PromotionList;
        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.PROMOTION_LIST, items: [], sid: 'test_promotion', title: 'beauty offers' }],
                ...defaultProps
            };
            PromotionList = shallow(<ComponentList {...props} />)
                .find('Fragment')
                .children()
                .get(0);
        });
        it('should render', () => {
            expect(PromotionList.props.sid).toBe('test_promotion');
            expect(PromotionList.props.title).toBe('beauty offers');
        });
    });

    describe('Recap component', () => {
        let props, Recap;
        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.RECAP, items: [{ title: 'item1' }], sid: 'test_Recap', title: 'pick where you left' }],
                ...defaultProps
            };
            Recap = shallow(<ComponentList {...props} />)
                .find('Fragment')
                .children()
                .get(0);
        });
        it('should render', () => {
            expect(Recap.props.sid).toBe('test_Recap');
            expect(Recap.props.title).toBe('pick where you left');
            expect(Recap.props.items.length).toBe(1);
        });
    });

    describe('RewardList component', () => {
        let props, RewardList;
        beforeEach(() => {
            props = {
                items: [{ type: COMPONENT_TYPES.REWARD_LIST, biRewards: [{ title: 'item1' }, { title: 'item2' }], sid: 'test_Reward' }],
                ...defaultProps
            };
            RewardList = shallow(<ComponentList {...props} />)
                .find('Fragment')
                .children()
                .get(0);
        });
        it('should render', () => {
            expect(RewardList.props.sid).toBe('test_Reward');
            expect(RewardList.props.biRewards.length).toBe(2);
        });
    });
});
