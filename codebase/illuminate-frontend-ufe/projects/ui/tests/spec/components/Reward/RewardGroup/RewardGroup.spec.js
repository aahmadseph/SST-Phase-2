describe('RewardGroup', () => {
    let React;
    let shallow;
    let shallowComponent;

    const RewardGroup = require('components/Reward/RewardGroup/RewardGroup').default;

    beforeEach(() => {
        React = require('react');
        shallow = enzyme.shallow;

        const children = [<React.Fragment>uno</React.Fragment>, <React.Fragment>dos</React.Fragment>];
        shallowComponent = shallow(<RewardGroup children={children} />);
    });

    it('should render all childern', () => {
        expect(shallowComponent.children().length).toBe(2);
    });

    xit('should set onExpand props to the children', () => {
        const props = shallowComponent.childAt(0).props();
        expect(typeof props.onExpand).toBe('function');
    });

    xit('should set null forceCollapse props to the children', () => {
        const props = shallowComponent.childAt(0).props();
        expect(props.forceCollapse).toBeNull();
    });

    xdescribe('with activated item', () => {
        beforeEach(() => {
            // emulate second item activation
            shallowComponent.setState({ activeItem: 1 });
        });

        it('should set forceCollapse prop to corresponding child', () => {
            const props = shallowComponent.childAt(0).props();
            expect(props.forceCollapse).toBe(true);
        });

        it('should set false forceCollapse prop to the rest of the children', () => {
            const props = shallowComponent.childAt(1).props();
            expect(props.forceCollapse).toBe(false);
        });
    });

    describe('onChildExpand', () => {
        let setStateFunc;

        beforeEach(() => {
            setStateFunc = spyOn(shallowComponent.instance(), 'setState');
            shallowComponent.instance().onChildExpand(7);
        });

        it('should call setState', () => {
            expect(setStateFunc).toHaveBeenCalledWith({ activeItem: 7 });
        });
    });

    xdescribe('child onExpand', () => {
        let onChildExpandFunc;

        beforeEach(() => {
            onChildExpandFunc = spyOn(shallowComponent.instance(), 'onChildExpand');
            shallowComponent.childAt(1).props().onExpand();
        });

        it('should call onChildExpand with correct key', () => {
            expect(onChildExpandFunc).toHaveBeenCalledWith(1);
        });
    });
});
